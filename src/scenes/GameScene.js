import Phaser from "phaser";
import Hero from "../sprites/Hero";
import scoreJson from "../sheets/beat";
import createScore from "../lib/createScore";
import createLevelScoreMap from "../lib/createLevelScoreMap";
import createTimingList from "../lib/createTimingList";

import * as ScoreManager from "bandpad-vexflow";
import { BUS_EVENTS } from "bandpad-vexflow";

// ------------------ CONSTANTS ---------------- //

const BLOCKS_HEIGHTS = {
  1: -34,
  2: -50,
  3: -75,
  4: -100,
};
const BLOCKS_IMAGES = {
  1: "smallBlockImage",
  2: "mediumBlockImage",
  3: "largeBlockImage",
  4: "biggestBlockImage",
};

const NOTES_SIZES = {
  quarters: 1,
  eights: 2,
  sixteens: 4,
};

const GAME_MODES = {
  NOT_STARTED: 1,
  STARTED: 2,
  ENDED: 3,
  LOST: 4,
};

const JUMP_STATES = {
  failedJump: 0,
  goodJump: 1,
};

const LEVEL_MODES = {
  // the animation is moving
  levelOnMotion: -1,

  // player lost
  levelLost: 0,

  // player win
  levelWon: 1,
};

const INTERVAL_TYPES = {
  COUNTIN_INTERVAL: 1,
  NOTES_INTERVAL: 2,
};

const GROUND_HEIGHT = 0.747;
const COUNTIN_BEATS = 16;
const EXTRA_BEATS_INDEX = COUNTIN_BEATS;
const ACCEPTABLE_DELAY = 100;
const DEFAULT_GAME_START_DELAY = 2000;

const NOTES = {
  REST_NOTE: "noPlace",
  PLAYED_NOTE: "playedNote",
  COUNT_NOTE: "countDown",
};

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "GameScene",
    });
  }

  preload() {}

  create() {
    // set game buttons
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // set game sounds
    this.beatSound = this.sound.add("tick");
    this.hitSound = this.sound.add("hit");
    this.failSound = this.sound.add("failure");

    // set game background
    this.background = this.add
      .tileSprite(0, 0, this.width, this.height, "backgroundImage")
      .setOrigin(0, 0);
    this.background.setScrollFactor(0);

    // set game ground
    this.ground = this.physics.add.sprite(
      this.sys.game.config.width / 2,
      this.sys.game.config.height * GROUND_HEIGHT,
      "groundImage"
    );
    this.ground.setVisible(false);
    this.ground.setImmovable();

    // set hero
    this.myHero = new Hero({ scene: this.scene });

    //set colliders
    this.physics.add.collider(this.myHero.heroSprite, this.ground);

    // set game mode
    this.gameMode = GAME_MODES.NOT_STARTED;

    this.sheetJson = [scoreJson];

    // start game after 2 seconds
    this.time.addEvent({
      delay: DEFAULT_GAME_START_DELAY,
      callback: () => {
        this.gameMode = GAME_MODES.STARTED;
        this.playLevel(this.sheetJson[0]);
      },
    });
    /*
    this.time.addEvent({
      delay: 2 * DEFAULT_GAME_START_DELAY + 16000,
      callback: () => {
        this.playLevel(this.sheetJson[0]);
      },
      //loop: true,
    });*/
  }

  // ------------------ METHODS FOR INTERVALS ---------------- //

  playLevel(levelJson) {
    createScore(levelJson, function (event, value) {});
    ScoreManager.scoreGetEvent(BUS_EVENTS.PLAY, {
      smoothNotePointer: true,
    });

    // calculate division in milliseconds
    this.tempo = 80;

    // array of block sprites
    this.blocksArray = [];

    //level divisions. 1 = quarters, 2 = eights, 4 = 16th
    this.divisions = 2;

    // this calculates the smallest division in the game in milliseconds:
    this.divisionDuration = ((60 / this.tempo) * 1000) / this.divisions;

    this.scoreMap = createLevelScoreMap(levelJson);
    this.timingList = createTimingList(this.divisionDuration, this.scoreMap);
    this.levelMode = LEVEL_MODES.levelOnMotion;

    // start game
    this.myHero.walk();
    /*

    let index = 0;
    let noteIndex = index - (EXTRA_BEATS_INDEX - 4); // the exact time we need so the block spawn will reach the hero in time is 4 intervals


    this.blockInterval = setInterval(() => {
      // metronome:
      if (index % this.divisions === 0) {
        // play every quarter note
        this.beatSound.play();
      }
      this.curNotes = {
        // the 2 notes timings of the current interval and the next one. Needed for calculations for user's jump
        curNote: this.timingList[index],
        nextNote: this.timingList[index + 1],
      };
      // set blocks after countdown:
      if (noteIndex < this.scoreMap.length - 1 && noteIndex >= 0) {
        if (this.scoreMap[noteIndex][1] !== NOTES.REST_NOTE) {
          let block = this.physics.add.sprite(
            this.sys.game.config.width,
            this.ground.y + this.getRelevantBlockHeight(noteIndex),
            this.getRelevantBlockName(noteIndex)
          );
          block.setImmovable();
          block.setVelocityX(this.getVelocityForTempo());
          this.blocksArray.push(block);
        }
      }
      this.levelStatusCheck(noteIndex);
      index++;
      noteIndex++;
    }, this.divisionDuration);*/

    let totalIntervals = 0;

    ScoreManager.setEventFunction((event, value) => {
      /*
      if (event === BUS_EVENTS.UPDATE) {

      }*/
      totalIntervals++;
      console.log(event, value);
    });
    /*
    let intervalType = INTERVAL_TYPES.COUNTIN_INTERVAL;
    let noteIndex = 0;
    let intervalNumber = 0;
    ScoreManager.setEventFunction((event, value) => {
      if (event === BUS_EVENTS.UPDATE) {
        console.log(value, intervalNumber);
        if (value === 0 && intervalType === INTERVAL_TYPES.COUNTIN_INTERVAL) {
          intervalType++;
        }
        this.curNotes = {
          // the 2 notes timings of the current interval and the next one. Needed for calculations for user's jump
          curNote: this.timingList[intervalNumber],
          nextNote: this.timingList[intervalNumber + 1],
        };
        if (
          (value >= 12 && intervalType === INTERVAL_TYPES.COUNTIN_INTERVAL) ||
          (value < 16 - 4 && intervalType === INTERVAL_TYPES.NOTES_INTERVAL)
        ) {
          if (this.scoreMap[noteIndex][1] !== NOTES.REST_NOTE) {
            let block = this.physics.add.sprite(
              this.sys.game.config.width,
              this.ground.y + this.getRelevantBlockHeight(noteIndex),
              this.getRelevantBlockName(noteIndex)
            );
            block.setImmovable();
            block.setVelocityX(this.getVelocityForTempo());
            this.blocksArray.push(block);
          }
          noteIndex++;
        }
        intervalNumber++;
        this.levelStatusCheck(value, intervalType);
      }
    });*/
  }

  // function that gets the needed height for the current block to spawn, by the current note length
  getRelevantBlockName(index) {
    return BLOCKS_IMAGES[this.scoreMap[index][0]];
  }

  // function that gets the needed height for the current block to spawn, by the current note length
  getRelevantBlockHeight(index) {
    return BLOCKS_HEIGHTS[this.scoreMap[index][0]];
  }

  // function that remove all block sprite objects from the game. Used in case of losing a level.
  removeBlocks() {
    for (let i = 0; i < this.blocksArray.length; i++) {
      this.blocksArray[i].destroy();
    }
  }

  // function that check for each interval if there is a need to end the level for any reason (jump failure or level won)
  levelStatusCheck(value, intervalType) {
    if (this.levelMode === LEVEL_MODES.levelLost) {
      this.removeBlocks();
      //ScoreManager.scoreGetEvent(BUS_EVENTS.STOP); // NOT WORKING
    } else if (value === 15 && intervalType === INTERVAL_TYPES.NOTES_INTERVAL) {
      clearInterval(this.blockInterval);
      console.log("won level!");
      this.levelMode = LEVEL_MODES.levelWon;
      this.myHero.heroSprite.play("winAnimation");
      this.myHero.heroSprite.anims.chain("standingAnimation");
    } else {
      return;
    }
  }

  // function that check for each interval if there is a need to end the level for any reason (jump failure or level won)
  levelStatusCheck1(noteIndex) {
    if (this.levelMode === LEVEL_MODES.levelLost) {
      this.removeBlocks();
      //ScoreManager.scoreGetEvent(BUS_EVENTS.STOP); // NOT WORKING
      clearInterval(this.blockInterval);
      this.levelMode = LEVEL_MODES.levelLost;
    } else if (noteIndex >= this.scoreMap.length - 1 + 4) {
      clearInterval(this.blockInterval);
      console.log("won level!");
      this.levelMode = LEVEL_MODES.levelWon;
      this.myHero.heroSprite.play("winAnimation");
      this.myHero.heroSprite.anims.chain("standingAnimation");
    } else {
      return;
    }
  }

  // function that calculates the needed block velocity to match the given tempo
  getVelocityForTempo() {
    return -8 * this.tempo - 40;
  }

  // ------------------ UPDATE METHODS ---------------- //

  // function that gets the note that is closest to the user's jump.
  getClosestNoteToKeyPress(timePassedSinceJump) {
    const curNoteDistance = Math.abs(this.curNotes.curNote.division - timePassedSinceJump);
    const nextNoteDistance = Math.abs(this.curNotes.nextNote.division - timePassedSinceJump);
    const notesDistance = {};
    notesDistance[curNoteDistance] = this.curNotes.curNote;
    notesDistance[nextNoteDistance] = this.curNotes.nextNote;
    const res = notesDistance[Math.min(curNoteDistance, nextNoteDistance)];
    return res;
  }

  /**
   * this functions checks if the user has not visited (jumped) a note he should have visited.
   * @param {*} closestNote - closest note to the user's jump
   */
  missCheck(closestNote) {
    let curNoteIndex = this.timingList.findIndex((element) => element === closestNote);
    for (let i = 0; i < curNoteIndex; i++) {
      if (
        this.timingList[i].visited === false &&
        this.timingList[i].noteType === NOTES.PLAYED_NOTE
      ) {
        return true;
      }
    }
    this.timingList[curNoteIndex].visited = true;
    return false;
  }

  // general function to check and register the user's current jump.
  jumpTimingCheck() {
    this.myHero.jumpState = JUMP_STATES.goodJump;
    const jumpTime = Date.now();
    const timePassedSinceJump = jumpTime - this.myHero.walkStartTime;
    const delay = timePassedSinceJump % this.divisionDuration;
    const preDelay = this.divisionDuration - (timePassedSinceJump % this.divisionDuration);
    const closestNote = this.getClosestNoteToKeyPress(timePassedSinceJump);
    if (closestNote.noteType === NOTES.COUNT_NOTE) {
      return;
    }
    const missedANote = this.missCheck(closestNote);
    if (delay === 0 && closestNote.noteType === NOTES.PLAYED_NOTE && !missedANote) {
      console.log("just in time!");
    } else if (
      delay < ACCEPTABLE_DELAY &&
      closestNote.noteType === NOTES.PLAYED_NOTE &&
      !missedANote
    ) {
      console.log("jump time is ", delay, "milliseconds late");
    } else if (
      preDelay < ACCEPTABLE_DELAY &&
      closestNote.noteType === NOTES.PLAYED_NOTE &&
      !missedANote
    ) {
      console.log("jump time is ", preDelay, "milliseconds early");
    } else {
      console.log("BAD JUMP!!!");
      this.myHero.jumpState = JUMP_STATES.failedJump;
      this.levelMode = LEVEL_MODES.levelLost;
      this.failSound.play();
    }
  }

  update(time, delta) {
    if (this.levelMode === LEVEL_MODES.levelOnMotion) {
      this.background.tilePositionX += 6;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.spaceBar) &&
      this.myHero.heroSprite.body.touching.down &&
      this.levelMode === LEVEL_MODES.levelOnMotion
    ) {
      this.hitSound.play();
      this.jumpTimingCheck();
      this.myHero.smallJump();
    }
  }
}

export default GameScene;
