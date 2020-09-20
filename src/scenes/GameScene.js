import Phaser from "phaser";
import Hero from "../sprites/Hero";
import scoreJson from "../sheets/beat";
import scoreJson2 from "../sheets/sixh-test";

import level1_1 from "../sheets/levels/level1-1";
import level1_2 from "../sheets/levels/level1-2";
import level1_3 from "../sheets/levels/level1-3";
import level1_4 from "../sheets/levels/level1-4";
import level1_5 from "../sheets/levels/level1-5";
import level1_6 from "../sheets/levels/level1-6";

import createScore from "../lib/createScore";
import createLevelScoreMap from "../lib/createLevelScoreMap";
import createTimingList from "../lib/createTimingList";

import * as ScoreManager from "bandpad-vexflow";
import { BUS_EVENTS } from "bandpad-vexflow";

// ------------------ CONSTANTS ---------------- //

const BLOCKS_HEIGHTS = {
  1: -34,
  2: -50,
  4: -75,
};
const BLOCKS_IMAGES = {
  1: "smallBlockImage",
  2: "mediumBlockImage",
  4: "largeBlockImage",
};

const NOTES_SIZES = {
  1: 4, // 1 = quarter note
  2: 8, // 2 = 8th note
  4: 16, // 4 = 16th note
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
const ACCEPTABLE_DELAY = 300;
const DEFAULT_GAME_START_DELAY = 2000;

const NOTES = {
  REST_NOTE: "noPlace",
  PLAYED_NOTE: "playedNote",
  COUNT_NOTE: "countDown",
};

const INTERVAL_PREDECESSOR = {
  2: 4,
  4: 8,
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

    this.gameMode = GAME_MODES.STARTED;
    this.sheetJson = [scoreJson, level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
    // start each level after 2 seconds
    this.time.addEvent({
      delay: DEFAULT_GAME_START_DELAY,
      callback: () => {
        this.playLevel(this.sheetJson[1]);
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

  playLevel(levelJson) {
    // create music score for the level
    createScore(levelJson, function (event, value) {});

    // calculate division in milliseconds
    this.tempo = 80;

    // array of block sprites. will be filled with sprites during the intervals
    this.blocksArray = [];

    //level divisions. 1 = quarters, 2 = eights, 4 = 16th
    this.divisions = levelJson.divisions;

    // actual size of the division. quarters = 4 etc
    this.divSize = NOTES_SIZES[this.divisions];

    // total amount of measures in this level (excluding count-in)
    this.amountOfBars = Object.keys(levelJson.partElements[0].scoreMap).length;

    // this calculates the smallest division in the game in milliseconds:
    this.divisionDuration = ((60 / this.tempo) * 1000) / this.divisions;
    this.levelMode = LEVEL_MODES.levelOnMotion;

    /*
    variables needed for intervals:
    */
    let intervalType = INTERVAL_TYPES.COUNTIN_INTERVAL; // define the starting interval type as a count-in interval
    let noteIndex = 0; // index that tracks the notes of our scoreMap (so excluding the count-in notes)
    let intervalNumber = 0; // tracks the number of overall interval we're in
    const coundownIntervals = 2 * this.divSize; // 2 bars, each has divSize number of intervals
    const totalIntervals = coundownIntervals + this.divSize * this.amountOfBars; // total amount of intervals

    // data structures processing - each one explained in its' function description
    this.scoreMap = createLevelScoreMap(levelJson, this.amountOfBars);
    this.timingList = createTimingList(this.divisionDuration, this.scoreMap, coundownIntervals);

    // start level
    this.myHero.walk(); // there goes my hero...

    // the function that happens each interval
    ScoreManager.setEventFunction((event, value) => {
      if (event === BUS_EVENTS.UPDATE) {
        if (0 < intervalNumber && intervalNumber < totalIntervals) {
          this.curNotes = {
            // the 3 notes timings of the current interval and the next one. Needed for calculations for user's jump.
            prevNote: this.timingList[intervalNumber - 1],
            curNote: this.timingList[intervalNumber],
            nextNote: this.timingList[intervalNumber + 1],
          };
          if (
            this.curNotes.prevNote.noteType === NOTES.PLAYED_NOTE &&
            this.curNotes.prevNote.visited === false
          ) {
            this.levelMode = LEVEL_MODES.levelLost;
            console.log("lost!");
          }
        }

        if (
          (value >= coundownIntervals - INTERVAL_PREDECESSOR[this.divisions] &&
            intervalType === INTERVAL_TYPES.COUNTIN_INTERVAL) || // if we're less than 4 intervals before the end of count in
          (value < this.scoreMap.length - INTERVAL_PREDECESSOR[this.divisions] &&
            intervalType === INTERVAL_TYPES.NOTES_INTERVAL) // if we're more than 4 intervals before the end of notes
        ) {
          if (this.scoreMap[noteIndex][1] !== NOTES.REST_NOTE) {
            // if current note is not a rest note
            this.addBlock(noteIndex);
          }
          noteIndex++;
        }
        intervalNumber++;
        if (intervalNumber === coundownIntervals) {
          // if countdown is done
          intervalType = INTERVAL_TYPES.NOTES_INTERVAL; // switch to note interval type
        }
        this.levelStatusCheck(intervalNumber, totalIntervals); // check if there is a need to end the level
      }
    });

    // start vexflow, plays the score along with executing the intervals
    ScoreManager.scoreGetEvent(BUS_EVENTS.PLAY, {
      smoothNotePointer: true,
    });
  }

  addBlock(noteIndex) {
    let block = this.physics.add.sprite(
      this.sys.game.config.width,
      this.ground.y + this.getRelevantBlockHeight(noteIndex),
      this.getRelevantBlockName(noteIndex)
    );
    block.setImmovable();
    block.setVelocityX(this.getVelocityForTempo());
    this.blocksArray.push(block);
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
  levelStatusCheck(intervalNumber, totalIntervals) {
    if (this.levelMode === LEVEL_MODES.levelLost) {
      this.removeBlocks();
      this.failSound.play();
      this.myHero.heroSprite.play("hurtAnimation");
      this.myHero.heroSprite.anims.chain("standingAnimation");
      ScoreManager.scoreGetEvent(BUS_EVENTS.STOP);
    } else if (intervalNumber === totalIntervals) {
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
    let curNoteIndex = this.timingList.findIndex(
      (element) => element === closestNote
    ); /*
    for (let i = 0; i < curNoteIndex; i++) {
      if (
        this.timingList[i].visited === false &&
        this.timingList[i].noteType === NOTES.PLAYED_NOTE
      ) {
        return true;
      }
    }*/
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
      if (missedANote) {
        console.log("SKIPPED A NOTE!");
      }
      if (closestNote.noteType === NOTES.REST_NOTE) {
        console.log("JUMPED ON REST!");
      } else {
        console.log("NOT JUMPED ON TIME!");
      }
      this.levelMode = LEVEL_MODES.levelLost;
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
