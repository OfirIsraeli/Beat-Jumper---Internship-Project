import Phaser from "phaser";
import Hero from "../sprites/Hero";
//import Stave from "../classes/Stave"
import { scoreMap } from "../classes/scoreMapCopy";

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
};
const GROUND_HEIGHT = 0.747;
const EXTRA_BEATS = 16;
const EXTRA_BEATS_INDEX = EXTRA_BEATS;
const ACCEPTABLE_DELAY = 50;
const DEFAULT_GAME_START_DELAY = 2000;

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
    /* colliders for blocks:
    this.physics.add.collider(this.myHero.heroSprite, this.mediumBlock);
    this.physics.add.collider(this.myHero.heroSprite, this.largeBlock);
    */

    // calculate division in milliseconds
    // ..todo: fetch from sheet source
    this.tempo = 80;
    let divisions = "eights";
    //
    this.noteSize = NOTES_SIZES[divisions];
    // this calculates the smallest division in the game in milliseconds:
    this.divisionLength = ((60 / this.tempo) * 1000) / this.noteSize;
    // set game mode
    this.gameMode = GAME_MODES["notStarted"];
    // set score map of 1 long bar
    this.scoreMap = [];
    this.createOneBarScoreMap();

    // start game after 2 seconds
    this.time.addEvent({
      delay: DEFAULT_GAME_START_DELAY,
      callback: () => {
        this.gameBegin();
      },
      //loop: true,
    });

    this.time.addEvent({
      delay: 2 * DEFAULT_GAME_START_DELAY + (60 / this.tempo) * 1000 * 8 * this.amountOfBars,
      callback: () => {
        this.gameBegin();
      },
      loop: true,
    });
  }

  // ------------------ METHODS FOR INTERVALS ---------------- //
  getRelevantBlockName(index) {
    return BLOCKS_IMAGES[this.scoreMap[index][0]];
  }
  getRelevantBlockHeight(index) {
    return BLOCKS_HEIGHTS[this.scoreMap[index][0]];
  }

  stopBlocks(blockInterval, noteIndex) {
    if (noteIndex < this.scoreMap.length - 1 + 4) {
      return;
    } else {
      clearInterval(blockInterval);
      this.gameMode = GAME_MODES["ended"];
      this.myHero.heroSprite.play("standingAnimation");
    }
  }

  // function that calculates the needed block velocity to match the given tempo
  getVelocityForTempo() {
    return -8 * this.tempo - 40;
  }

  gameBegin() {
    this.myHero.walk();
    this.gameMode = GAME_MODES["started"];
    let index = 0;
    let noteIndex = index - (EXTRA_BEATS_INDEX - 4);

    let blockInterval = setInterval(() => {
      // metronome:
      if (index % this.noteSize === 0) {
        // play every quarter
        this.beatSound.play();
      }

      // set blocks after countdown:
      if (noteIndex < this.scoreMap.length - 1 && noteIndex >= 0) {
        if (this.scoreMap[noteIndex][1] !== "noPlace") {
          let smallBlock = this.physics.add.sprite(
            this.sys.game.config.width,
            this.ground.y + this.getRelevantBlockHeight(noteIndex),
            this.getRelevantBlockName(noteIndex)
          );
          smallBlock.setImmovable();
          smallBlock.setVelocityX(this.getVelocityForTempo());
          //this.physics.add.collider(this.myHero.heroSprite, smallBlock);
        }
      } else if (noteIndex >= EXTRA_BEATS_INDEX) {
        this.stopBlocks(blockInterval, noteIndex);
      }
      index++;

      noteIndex++;
    }, this.divisionLength);
  }

  // ------------------ SETTER METHODS ---------------- //

  // taking a given note in a given bar, inserting it into our score map as the number of times the smallest note division occurs in that note.
  // for example, 1 quarter note equals to 4 16th notes that we will insert to our score map.
  deconstructNote(bar, note) {
    if (scoreMap[bar][note]["rest"] === "noPlace") {
      for (let k = 0; k < scoreMap[bar][note]["division"]; k++) {
        this.scoreMap.push([1, scoreMap[bar][note]["rest"]]);
      }
    } else {
      this.scoreMap.push([scoreMap[bar][note]["division"], scoreMap[bar][note]["rest"]]);
      for (let k = 1; k < scoreMap[bar][note]["division"]; k++) {
        this.scoreMap.push([1, "noPlace"]);
      }
    }
  }

  createOneBarScoreMap() {
    // ..todo: fetch number of bars from library
    this.amountOfBars = 2;
    //

    for (let bar = 1; bar <= this.amountOfBars; bar++) {
      for (let note = 0; note < scoreMap[bar].length; note++) {
        this.deconstructNote(bar, note);
      }
    }
  }

  // ------------------ UPDATE METHODS ---------------- //

  jumpTimingCheck() {
    let jumpTime = Date.now();
    let timePassedSinceJump = jumpTime - this.myHero.walkStartTime;
    let delay = timePassedSinceJump % this.divisionLength;
    let preDelay = this.divisionLength - (timePassedSinceJump % this.divisionLength);
    if (delay < ACCEPTABLE_DELAY) {
      console.log("jump time is ", delay, "milliseconds late");
    }
    if (preDelay < ACCEPTABLE_DELAY) {
      console.log("jump time is ", preDelay, "milliseconds early");
    }
  }

  update(time, delta) {
    if (this.gameMode === GAME_MODES["started"]) {
      this.background.tilePositionX += 6;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.spaceBar) &&
      this.myHero.heroSprite.body.touching.down
    ) {
      this.hitSound.play();
      this.jumpTimingCheck();
      this.myHero.smallJump();
    }
  }
}

export default GameScene;
