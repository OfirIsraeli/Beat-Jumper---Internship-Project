import Phaser from "phaser";
import Hero from "../sprites/Hero";
import sheetDS from "../lib/testScoreMap";
import scoreJson from "../sheets/beat";
import createScore from "../lib/createScore";
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

const GROUND_HEIGHT = 0.747;
const COUNTIN_BEATS = 16;
const EXTRA_BEATS_INDEX = COUNTIN_BEATS;
const ACCEPTABLE_DELAY = 100;
const DEFAULT_GAME_START_DELAY = 2000;
const NOTES = {
  REST: 1,
  PLAYED: 2,
  COUNTIN: 3,
};
const REST_NOTE = "noPlace";
const PLAYED_NOTE = "playedNote";
const COUNT_NOTE = "countDown";

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "GameScene",
    });
  }

  preload() {}

  create() {
    // set game buttons
    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

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
        this.gameMode = GAME_MODES["started"];
        this.playLevel(this.sheetJson[0]);
      },
      //loop: true,
    });

    this.time.addEvent({
      delay: 2 * DEFAULT_GAME_START_DELAY + 16000,
      callback: () => {
        this.playLevel(this.sheetJson[0]);
      },
      loop: true,
    });
  }

  // ------------------ METHODS FOR INTERVALS ---------------- //

  playLevel(levelJson) {
    createScore(levelJson, function (event, value) {
      console.log(event, value);
    });
    ScoreManager.scoreGetEvent(BUS_EVENTS.PLAY, {
      smoothNotePointer: true,
    });

    console.log(levelJson);

    // calculate division in milliseconds
    // ..todo: fetch from sheet source
    this.tempo = 80;

    // array of block sprites
    this.blocksArray = [];

    //sheetDS.divisions
    this.noteSize = 2;

    // this calculates the smallest division in the game in milliseconds:
    this.divisionLength = ((60 / this.tempo) * 1000) / this.noteSize;
    this.scoreMap = []; // = createRhythmData(levelJson);
    this.createOneBarScoreMap(levelJson);
    this.createTimingList();
    this.levelMode = LEVEL_MODES["levelOnMotion"];

    // start game
    this.myHero.walk();
    let index = 0;
    let noteIndex = index - (EXTRA_BEATS_INDEX - 4); // the exact time we need so the block spawn will reach the hero in time is 4 intervals
    this.blockInterval = setInterval(() => {
      // metronome:
      if (index % this.noteSize === 0) {
        // play every quarter
        this.beatSound.play();
      }
      this.curNotes = this.timingList.slice(index - 1, index + 2);
      // set blocks after countdown:
      if (noteIndex < this.scoreMap.length - 1 && noteIndex >= 0) {
        if (noteIndex > 0 && noteIndex <= this.scoreMap.length) {
        }
        if (this.scoreMap[noteIndex][1] !== REST_NOTE) {
          let block = this.physics.add.sprite(
            this.sys.game.config.width,
            this.ground.y + this.getRelevantBlockHeight(noteIndex),
            this.getRelevantBlockName(noteIndex)
          );
          block.setImmovable();
          block.setVelocityX(this.getVelocityForTempo());
          this.blocksArray.push(block);
          //this.physics.add.collider(this.myHero.heroSprite, smallBlock);
        }
      }
      this.stopBlocks(noteIndex);
      index++;
      noteIndex++;
    }, this.divisionLength);
    setEventFunction((event, value) => {
      if (event === BUS_EVENTS.UPDATE) {
        // vlaue = division
      }
    });
  }

  getRelevantBlockName(index) {
    return BLOCKS_IMAGES[this.scoreMap[index][0]];
  }
  getRelevantBlockHeight(index) {
    return BLOCKS_HEIGHTS[this.scoreMap[index][0]];
  }

  removeBlocks() {
    for (let i = 0; i < this.blocksArray.length; i++) {
      this.blocksArray[i].destroy();
    }
  }

  stopBlocks(noteIndex) {
    if (this.levelMode === LEVEL_MODES["levelLost"]) {
      this.removeBlocks();
      clearInterval(this.blockInterval);
      this.levelMode = LEVEL_MODES["levelLost"];
    } else if (noteIndex >= this.scoreMap.length - 1 + 4) {
      clearInterval(this.blockInterval);
      console.log("won level!");
      this.levelMode = LEVEL_MODES["levelWon"];
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

  // ------------------ SETTER METHODS ---------------- //

  // taking a given note in a given bar, inserting it into our score map as the number of times the smallest note division occurs in that note.
  // for example, 1 quarter note equals to 4 16th notes that we will insert to our score map.
  deconstructNote(levelJson, barIndex, noteIndex) {
    if (levelJson.partElements[0].scoreMap[barIndex][noteIndex]["rest"]) {
      for (
        let k = 0;
        k < levelJson.partElements[0].scoreMap[barIndex][noteIndex].divisions;
        k++
      ) {
        this.scoreMap.push([1, REST_NOTE]);
      }
    } else {
      this.scoreMap.push([
        levelJson.partElements[0].scoreMap[barIndex][noteIndex].divisions,
        PLAYED_NOTE,
      ]);
      for (
        let k = 1;
        k < levelJson.partElements[0].scoreMap[barIndex][noteIndex].divisions;
        k++
      ) {
        this.scoreMap.push([1, REST_NOTE]);
      }
    }
  }

  createOneBarScoreMap(levelJson) {
    this.amountOfBars = Object.keys(levelJson.partElements[0].scoreMap).length;
    for (let barIndex = 1; barIndex <= this.amountOfBars; barIndex++) {
      for (
        let noteIndex = 0;
        noteIndex < levelJson.partElements[0].scoreMap[barIndex].length;
        noteIndex++
      ) {
        this.deconstructNote(levelJson, barIndex, noteIndex);
      }
    }
  }

  // ------------------ UPDATE METHODS ---------------- //
  /**
   * timingList -
   * visitedNotes - array
   */

  createTimingList() {
    this.timingList = [];
    this.visitedNotes = [];

    for (let i = 0; i < COUNTIN_BEATS; i++) {
      /*
      this.timingList.push({
        division: (i + 1) * this.divisionLength,
        noteType: COUNT_NOTE,
        visited: false,
      });
     */
      this.timingList.push([(i + 1) * this.divisionLength, COUNT_NOTE]);
      this.visitedNotes.push([this.timingList[i], false]);
    }

    let countLength = this.timingList.length;
    let divLength;

    for (let j = 0; j < this.scoreMap.length; j++) {
      divLength = [
        (j + countLength + 1) * this.divisionLength,
        this.scoreMap[j][1],
      ];
      this.timingList.push(divLength);
      this.visitedNotes.push([divLength, false]);
    }
  }

  getClosestNoteToKeyPress(timePassedSinceJump) {
    const prevNoteDistance = Math.abs(
      this.curNotes[0][0] - timePassedSinceJump
    );
    const curNoteDistance = Math.abs(this.curNotes[1][0] - timePassedSinceJump);
    const nextNoteDistance = Math.abs(
      this.curNotes[2][0] - timePassedSinceJump
    );
    const notesDistance = {};
    notesDistance[prevNoteDistance] = this.curNotes[0];
    notesDistance[curNoteDistance] = this.curNotes[1];
    notesDistance[nextNoteDistance] = this.curNotes[2];
    const res =
      notesDistance[
        Math.min(prevNoteDistance, curNoteDistance, nextNoteDistance)
      ];
    return res;
  }

  missCheck(closestNote) {
    let curNoteIndex = this.timingList.findIndex(
      (element) => element === closestNote
    );
    for (let i = 0; i < curNoteIndex; i++) {
      if (
        this.visitedNotes[i][1] === false &&
        this.visitedNotes[i][0][1] === PLAYED_NOTE
      ) {
        return true;
      }
    }
    this.visitedNotes[curNoteIndex][1] = true;
    return false;
  }

  jumpTimingCheck() {
    this.myHero.jumpState = JUMP_STATES["goodJump"];
    const jumpTime = Date.now();
    const timePassedSinceJump = jumpTime - this.myHero.walkStartTime;
    const delay = timePassedSinceJump % this.divisionLength;
    const preDelay =
      this.divisionLength - (timePassedSinceJump % this.divisionLength);
    const closestNote = this.getClosestNoteToKeyPress(timePassedSinceJump);
    if (closestNote[1] === COUNT_NOTE) {
      return;
    }
    const missedANote = this.missCheck(closestNote);
    if (delay === 0 && closestNote[1] === PLAYED_NOTE && !missedANote) {
      console.log("just in time!");
    } else if (
      delay < ACCEPTABLE_DELAY &&
      closestNote[1] === PLAYED_NOTE &&
      !missedANote
    ) {
      console.log("jump time is ", delay, "milliseconds late");
    } else if (
      preDelay < ACCEPTABLE_DELAY &&
      closestNote[1] === PLAYED_NOTE &&
      !missedANote
    ) {
      console.log("jump time is ", preDelay, "milliseconds early");
    } else {
      console.log("BAD JUMP!!!");
      this.myHero.jumpState = JUMP_STATES["failedJump"];
      this.levelMode = LEVEL_MODES["levelLost"];
      this.failSound.play();
    }
  }

  update(time, delta) {
    if (this.levelMode === LEVEL_MODES["levelOnMotion"]) {
      this.background.tilePositionX += 6;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.spaceBar) &&
      this.myHero.heroSprite.body.touching.down &&
      this.levelMode === LEVEL_MODES["levelOnMotion"]
    ) {
      this.hitSound.play();
      this.jumpTimingCheck();
      this.myHero.smallJump();
    }
  }
}

export default GameScene;
