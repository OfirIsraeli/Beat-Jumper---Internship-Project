import Phaser from "phaser";
import Hero from "../sprites/Hero";
//import Stave from "../classes/Stave"
import { scoreJson } from "../classes/scoreMapCopy";

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
  notStarted: 1,
  started: 2,
  ended: 3,
  lost: 4,
};

const JUMP_STATES = {
  failedJump: 0,
  goodJump: 1,
};

const LEVEL_MODES = {
  levelOnMotion: -1,
  levelLost: 0,
  levelWon: 1,
};

const GROUND_HEIGHT = 0.747;
const EXTRA_BEATS = 16;
const EXTRA_BEATS_INDEX = EXTRA_BEATS;
const ACCEPTABLE_DELAY = 100;
const DEFAULT_GAME_START_DELAY = 2000;
const REST_NOTE = "noPlace";

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "GameScene",
    });
  }

  preload() {}

  create() {
    console.log(test);
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
    this.gameMode = GAME_MODES["notStarted"];

    // set score map of 1 long bar

    //this.

    // start game after 2 seconds
    this.time.addEvent({
      delay: DEFAULT_GAME_START_DELAY,
      callback: () => {
        this.gameMode = GAME_MODES["started"];
        this.playLevel();
      },
      //loop: true,
    });

    /*
    this.time.addEvent({
      delay: 2 * DEFAULT_GAME_START_DELAY + (60 / this.tempo) * 1000 * 8 * this.amountOfBars,
      callback: () => {
        this.gameBegin();
      },
      loop: true,
    });*/
  }

  // ------------------ METHODS FOR INTERVALS ---------------- //

  playLevel() {
    // calculate division in milliseconds
    // ..todo: fetch from sheet source
    this.tempo = 80;
    let divisions = "eights";
    //
    this.noteSize = NOTES_SIZES[divisions];
    // this calculates the smallest division in the game in milliseconds:
    this.divisionLength = ((60 / this.tempo) * 1000) / this.noteSize;
    this.scoreMap = [];
    this.createOneBarScoreMap();
    this.createTimingList();

    this.levelMode = LEVEL_MODES["levelOnMotion"];
    this.myHero.walk();
    this.blocksArray = [];
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
    }
    if (noteIndex >= this.scoreMap.length - 1 + 4) {
      clearInterval(this.blockInterval);
      console.log("won level!");
      this.levelMode = LEVEL_MODES["levelWon"];
      this.myHero.heroSprite.play("winAnimation");
      this.myHero.heroSprite.anims.chain("standingAnimation");
    }
  }

  // function that calculates the needed block velocity to match the given tempo
  getVelocityForTempo() {
    return -8 * this.tempo - 40;
  }

  // ------------------ SETTER METHODS ---------------- //

  // taking a given note in a given bar, inserting it into our score map as the number of times the smallest note division occurs in that note.
  // for example, 1 quarter note equals to 4 16th notes that we will insert to our score map.
  deconstructNote(bar, note) {
    if (scoreJson[bar][note]["rest"] === REST_NOTE) {
      for (let k = 0; k < scoreJson[bar][note]["division"]; k++) {
        this.scoreMap.push([1, scoreJson[bar][note]["rest"]]);
      }
    } else {
      this.scoreMap.push([
        scoreJson[bar][note]["division"],
        scoreJson[bar][note]["rest"],
      ]);
      for (let k = 1; k < scoreJson[bar][note]["division"]; k++) {
        this.scoreMap.push([1, REST_NOTE]);
      }
    }
  }

  createOneBarScoreMap() {
    // ..todo: fetch number of bars from library
    this.amountOfBars = 2;
    //
    // todo: fetch object from
    for (let bar = 1; bar <= this.amountOfBars; bar++) {
      for (let note = 0; note < scoreJson[bar].length; note++) {
        this.deconstructNote(bar, note);
      }
    }
  }

  // ------------------ UPDATE METHODS ---------------- //

  createTimingList() {
    this.timingList = [];

    for (let i = 0; i < EXTRA_BEATS; i++) {
      this.timingList.push([(i + 1) * this.divisionLength, "countDown"]);
    }
    let i = this.timingList.length;
    for (let j = 0; j < this.scoreMap.length; j++) {
      this.timingList.push([
        (j + i + 1) * this.divisionLength,
        this.scoreMap[j][1],
      ]);
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

  jumpTimingCheck() {
    this.myHero.jumpState = JUMP_STATES["goodJump"];

    let jumpTime = Date.now();
    let timePassedSinceJump = jumpTime - this.myHero.walkStartTime;
    let delay = timePassedSinceJump % this.divisionLength;
    let preDelay =
      this.divisionLength - (timePassedSinceJump % this.divisionLength);
    const closestNote = this.getClosestNoteToKeyPress(timePassedSinceJump);
    if (delay === 0 && closestNote[1] !== REST_NOTE) {
      console.log("just in time!");
    } else if (delay < ACCEPTABLE_DELAY && closestNote[1] !== REST_NOTE) {
      console.log("jump time is ", delay, "milliseconds late");
    } else if (preDelay < ACCEPTABLE_DELAY && closestNote[1] !== REST_NOTE) {
      console.log("jump time is ", preDelay, "milliseconds early");
    } else {
      console.log("BAD JUMP!!!");
      //this.stopBlocks(this.timingList.length);
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
