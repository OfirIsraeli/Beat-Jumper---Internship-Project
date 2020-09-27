import Phaser from "phaser";
import Hero from "../sprites/Hero";
import createScore from "../lib/createScore";
import createLevelScoreMap from "../lib/createLevelScoreMap";
import createTimingList from "../lib/createTimingList";
import * as ScoreManager from "bandpad-vexflow";
import { BUS_EVENTS } from "bandpad-vexflow";

// imports of all scoreJsons as levels
import scoreJson from "../sheets/beat";
import scoreJson2 from "../sheets/sixh-test";
import level1_1 from "../sheets/levels/level1-1";
import level1_2 from "../sheets/levels/level1-2";
import level1_3 from "../sheets/levels/level1-3";
import level1_4 from "../sheets/levels/level1-4";
import level1_5 from "../sheets/levels/level1-5";
import level1_6 from "../sheets/levels/level1-6";

// ------------------ CONSTANTS ---------------- //

/**
 * points each note division (1 as smallest note, 4 as biggest) to the relevant
 * adjustment in height (in game) that is needed for a block of the same size
 * so they would appear on ground
 */
const BLOCKS_HEIGHTS = {
  1: -34,
  2: -50,
  4: -75,
};
/**
 * points each note division (1 as smallest note, 4 as biggest) to the relevant
 * image string for image loading
 */
const BLOCKS_IMAGES = {
  1: "smallBlockImage",
  2: "mediumBlockImage",
  4: "largeBlockImage",
};

/**
 * points each note division (1 as smallest note, 4 as biggest) to the relevant
 * note size
 */
const NOTES_SIZES = {
  1: 4, // 1 = quarter note
  2: 8, // 2 = 8th note
  4: 16, // 4 = 16th note
};

/**
 * various states that the game could be in
 */
const GAME_STATES = {
  // there is no level being played right now
  ON_HOLD: -1,
  // a level is being plyed
  ON_MOTION: 0,
  // game did not start yet
  NOT_STARTED: 1,
  // game lost
  LOST: 2,
  //game won
  WON: 3,
};

/**
 * various states that each level could be in
 */
const LEVEL_STATES = {
  // level is on motion
  ON_MOTION: -1,

  // level lost
  LOST: 0,

  // level win
  WON: 1,
};

/**
 * in our main interval function, we distinguish between two different interval types:
 * intervals that are part of the count-in, and intervals that are part of the sheet music itself
 */
const INTERVAL_TYPES = {
  COUNTIN_INTERVAL: 1,
  NOTES_INTERVAL: 2,
};

/**
 * types of notes that could be found in the program
 */
const NOTES = {
  REST_NOTE: "noPlace", // noPlace is the string value that occurs in the given ScoreJsons as an identifier for a rest note
  PLAYED_NOTE: "playedNote",
  COUNT_NOTE: "countDown",
};

/*
  we push a block to the game only if the interval is 4 or 8 intervals before the end of count in 
  and 4 or 8 intervals before the end of the playrd notes. reason for that is so blocks will reach the player in time,
  so we want to push a block exactly 4 or 8 intervals before the time we want it to reach the player.
  4 or 8 intervals is dependent on the given smallest division (16th notes will be 8 intervals, else we want to spawn
  blocks 4 intervals before)
*/
const INTERVAL_PREDECESSOR = {
  2: 4,
  4: 8,
};
// default ground height adjustment
const GROUND_HEIGHT = 0.747;
// the acceptable delay (in milliseconds, before or after a note)
// player can be in his jump. beyond that delay, it will be considered as a bad jump
const ACCEPTABLE_DELAY = 100;
// rest time in milliseconds each level will have before next one starts
const DEFAULT_GAME_START_DELAY = 3500;

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "GameScene",
    });
  }

  preload() {
    // set game buttons
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

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

    // set count-in text that will appear on screen, countin quarter notes in the last count-in bar
    this.countInText = this.add.text(520, 250, "", {
      fill: "#7F7C7B",
      align: "center",
      fontSize: "250px",
    });

    // set information text. appears on screen whenever we want to inform the user about anything
    // todo: centerize the text
    this.infoText = this.add.text(400, 250, "", {
      fill: "#14141f",
      fontSize: "80px",
    });

    // define hitpoints sprites
    let hp1 = this.add.sprite(1100, 50, "fullHitPoint");
    let hp2 = this.add.sprite(1160, 50, "fullHitPoint");
    let hp3 = this.add.sprite(1220, 50, "fullHitPoint");
    // define hitpoints array
    this.hitPointsArray = [hp1, hp2, hp3];
  }

  create() {
    /*
    todo: create pause method
    this.paused = false;
    this.input.keyboard.on("keydown_ESC", function (event) {});*/

    // set game mode
    this.gameState = GAME_STATES.NOT_STARTED;

    // set the level index to the first level
    this.levelIndex = 0;

    // an array that contains all of the musicJsons of each level, by ascending difficulty
    //this.sheetJson = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6, scoreJson];
    this.sheetJson = [level1_1, scoreJson, scoreJson2];
  }

  playLevel(levelJson) {
    // at a start of each level, infoText is empty so screen would be clear
    this.infoText.text = "";

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

    //this calculates the smallest division in the game in milliseconds
    this.divisionDuration = ((60 / this.tempo) * 1000) / this.divisions;

    /*
    variables needed for intervals:
    */
    let intervalType = INTERVAL_TYPES.COUNTIN_INTERVAL; // define the starting interval type as a count-in interval
    let noteIndex = 0; // index that tracks the notes of our scoreMap (so excluding the count-in notes)
    let intervalNumber = 0; // tracks the number of overall interval we're in
    let countInIndex = 1; // index that will appear on screen on the final bar of count-in each quarter note
    const countInIntervals = 2 * this.divSize; // 2 bars, each has divSize number of intervals
    const totalIntervals = countInIntervals + this.divSize * this.amountOfBars; // total amount of intervals

    // data structures processing - each one explained in its' function description
    this.scoreMap = createLevelScoreMap(levelJson, this.amountOfBars);
    this.timingList = createTimingList(this.divisionDuration, this.scoreMap, countInIntervals);

    // start level
    this.levelState = LEVEL_STATES.ON_MOTION;
    this.myHero.walk(); // there goes my hero...

    // the function that happens each interval
    ScoreManager.setEventFunction((event, value) => {
      if (event === BUS_EVENTS.UPDATE) {
        if (0 < intervalNumber && intervalNumber < totalIntervals) {
          this.curNotes = {
            // the 3 notes items closest to the current interval. Needed for calculations for user's jump.
            prevNote: this.timingList[intervalNumber - 1],
            curNote: this.timingList[intervalNumber],
            nextNote: this.timingList[intervalNumber + 1],
          };
          // check if user jumped (visited) the previous note (if it was a played note). level lost if not.
          if (
            this.curNotes.prevNote.noteType === NOTES.PLAYED_NOTE &&
            this.curNotes.prevNote.visited === false
          ) {
            this.levelState = LEVEL_STATES.LOST;
            console.log("lost!");
          }
        }

        // if we're in an interval of a quarter note in the second bar of the count-in
        if (
          value >= countInIntervals / 2 &&
          intervalType === INTERVAL_TYPES.COUNTIN_INTERVAL &&
          value <= countInIntervals &&
          value % this.divisions === 0
        ) {
          this.countInText.text = countInIndex; // change countInText to the number of quarter note in the bar we're in
          countInIndex++;
        }

        if (value === 0 && intervalType === INTERVAL_TYPES.NOTES_INTERVAL) {
          this.countInText.text = "";
        }
        /*
         add a block to the game if needed.
         we push a block to the game only if the interval is 4 or 8 intervals before the end of count in 
         and 4 or 8 intervals before the end of the playrd notes. reason for that is so blocks will reach the player in time,
         so we want to push a block exactly 4 or 8 intervals before the time we want it to reach the player.
         4 or 8 intervals is dependent on the given smallest division (16th notes will be 8 intervals, else we want to spawn
          blocks 4 intervals before)
        */
        if (
          (value >= countInIntervals - INTERVAL_PREDECESSOR[this.divisions] &&
            intervalType === INTERVAL_TYPES.COUNTIN_INTERVAL) || // if we're less than 4 intervals before the end of count in
          (value < this.scoreMap.length - INTERVAL_PREDECESSOR[this.divisions] &&
            intervalType === INTERVAL_TYPES.NOTES_INTERVAL) // if we're more than 4 intervals before the end of notes
        ) {
          if (this.scoreMap[noteIndex][1] !== NOTES.REST_NOTE) {
            // if current note is not a rest note
            this.addBlock(noteIndex); // add a block to the game
          }
          noteIndex++;
        }
        intervalNumber++;
        if (intervalNumber === countInIntervals) {
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

  updateHitPoints() {
    this.hitPointsArray[3 - this.myHero.hitPoints].setTexture("emptyHitPoint");
    this.myHero.hitPoints--;
  }

  // function that check for each interval if there is a need to end the level for any reason (jump failure or level won)
  levelStatusCheck(intervalNumber, totalIntervals) {
    // if player has lost the level for any reason
    if (this.levelState === LEVEL_STATES.LOST) {
      this.removeBlocks(); // remove all blocks from game
      this.failSound.play(); // play a failure sound
      this.myHero.heroSprite.play("hurtAnimation"); // play failure animation
      ScoreManager.scoreGetEvent(BUS_EVENTS.STOP); // stop the intervals
      this.updateHitPoints();
    }
    // if player passed all intervals correctly
    else if (intervalNumber === totalIntervals) {
      console.log("won level!");
      this.levelState = LEVEL_STATES.WON;
      this.levelIndex++; // advance to next level
      this.myHero.heroSprite.play("winAnimation"); // play winning animation
    }
    // if level should not end for any reason, return and continue the intervals
    else {
      return;
    }
    this.gameState = GAME_STATES.ON_HOLD; // finished a level, so we are on hold until we start the next one
    if (this.myHero.hitPoints === 0) {
      this.gameState = GAME_STATES.LOST;
    }
    this.myHero.heroSprite.anims.chain("standingAnimation"); // stand after level is finished
  }

  // function that calculates the needed block velocity to match the given tempo
  getVelocityForTempo() {
    return -8 * this.tempo - 40;
  }

  // ------------------ UPDATE METHODS ---------------- //

  // function that gets the note that is closest to the user's jump.
  getClosestNoteToKeyPress(timePassedSinceJump) {
    // calculate the distance between curNote and timePassedSinceJump
    const curNoteDistance = Math.abs(this.curNotes.curNote.division - timePassedSinceJump);
    // calculate the distance between nextNote and timePassedSinceJump
    const nextNoteDistance = Math.abs(this.curNotes.nextNote.division - timePassedSinceJump);
    const notesDistance = {};
    notesDistance[curNoteDistance] = this.curNotes.curNote;
    notesDistance[nextNoteDistance] = this.curNotes.nextNote;
    const res = notesDistance[Math.min(curNoteDistance, nextNoteDistance)];
    return res;
  }

  /**
   * this function registers the user's current jump into the timing list's visited notes array.
   * @param {*} closestNote - closest note to the user's jump
   */
  registerJump(closestNote) {
    // find the index in the timing list in which the note (element) is our given closestNote
    let curNoteIndex = this.timingList.findIndex((element) => element === closestNote);
    // mark that note as visited
    this.timingList[curNoteIndex].visited = true;
  }

  // general function to check and register the user's current jump.
  jumpTimingCheck() {
    // current jump time
    const jumpTime = Date.now();

    // time passed since the start of the level until the jump
    const timePassedSinceJump = jumpTime - this.myHero.walkStartTime;

    // calculates the delay of the jump from the note timing (if the player is dragging)
    const delay = timePassedSinceJump % this.divisionDuration;

    // calculates the pre-delay of the jump from the note timing (if the player is rushing)
    const preDelay = this.divisionDuration - (timePassedSinceJump % this.divisionDuration);

    // get the note element that is closest to the jump
    const closestNote = this.getClosestNoteToKeyPress(timePassedSinceJump);

    let successfulJump = true;

    // if we're on count-in, any jump is valid, so we jump and return
    if (closestNote.noteType === NOTES.COUNT_NOTE) {
      this.myHero.smallJump(successfulJump);
      return;
    }
    // register the jump in our timing list
    this.registerJump(closestNote);

    //if jump is good, in the next if statement we log to the console details regarding the jump.
    if (delay === 0 && closestNote.noteType === NOTES.PLAYED_NOTE) {
      console.log("just in time!");
    } else if (delay < ACCEPTABLE_DELAY && closestNote.noteType === NOTES.PLAYED_NOTE) {
      console.log("jump time is ", delay, "milliseconds late");
    } else if (preDelay < ACCEPTABLE_DELAY && closestNote.noteType === NOTES.PLAYED_NOTE) {
      console.log("jump time is ", preDelay, "milliseconds early");
    }
    // if jump was not good, we log to the console details regarding the jump, and update level to lost
    else {
      successfulJump = false;
      console.log("BAD JUMP!!!");
      if (closestNote.noteType === NOTES.REST_NOTE) {
        console.log("JUMPED ON REST!");
      } else {
        console.log("NOT JUMPED ON TIME!");
      }
      this.levelState = LEVEL_STATES.LOST;
    }
    // in any case, jump
    // needed animation and jump height are calculated in the hero class according to successfulJump and noteSize)
    this.myHero.jump(successfulJump, closestNote.noteSize);
  }

  update(time, delta) {
    // if level is on motion, move the background image and rotate all blocks
    if (this.levelState === LEVEL_STATES.ON_MOTION) {
      this.background.tilePositionX += 6;
      for (let i = 0; i < this.blocksArray.length; i++) {
        this.blocksArray[i].angle -= 5;
      }
    }

    // if player has pressed space-bar while hero was touching the ground and level is played, start jump calculations and excecutions
    if (
      Phaser.Input.Keyboard.JustDown(this.spaceBar) &&
      this.myHero.heroSprite.body.touching.down &&
      this.levelState === LEVEL_STATES.ON_MOTION
    ) {
      this.hitSound.play();
      this.jumpTimingCheck();
    }

    // if the game is not on motion and we did not finish all of the musicJsons
    if (this.gameState !== GAME_STATES.ON_MOTION && this.levelIndex < this.sheetJson.length) {
      // if player has failed 3 times, tell him that and don't start a new level (by doing return)
      if (this.gameState === GAME_STATES.LOST) {
        this.infoText.text = "you lost";
        return;
      }
      // change the game to on motion
      this.gameState = GAME_STATES.ON_MOTION;

      // inform the player about current level
      if (this.levelState === LEVEL_STATES.LOST) {
        this.infoText.text = "starting again";
      } else {
        this.infoText.text = "level " + (this.levelIndex + 1);
      }

      // play a level with a slight delay
      this.time.addEvent({
        delay: DEFAULT_GAME_START_DELAY,
        callback: () => {
          this.playLevel(this.sheetJson[this.levelIndex]);
        },
      });
    }
  }
}

export default GameScene;
