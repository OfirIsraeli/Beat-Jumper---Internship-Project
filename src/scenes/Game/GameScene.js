import Phaser from "phaser";
import Hero from "../../sprites/Hero";
// text utillities, positioning and styling
import { initText } from "./textUtils";
// ---imports of various needed data structures---
// a function that creates a data structure used to track note placements in a level
import createLevelScoreMap from "../../lib/createLevelScoreMap";
// a function that creates a data structure used to track note data regarding user's behavior in a level.
import createTimingList from "../../lib/createTimingList";
// --- BandPad utillites ---
// creates the music sheet element and processes the given musicJsons
import createScore from "../../lib/createScore";
// handles score intervals and general sheet music execution
import * as ScoreManager from "bandpad-vexflow";
// handles specific events during the intervals
import { BUS_EVENTS } from "bandpad-vexflow";
// -------

// ------------------ CONSTANTS ---------------- //

/**
 * points each note division (1 as smallest note, 4 as biggest) to the relevant
 * adjustment in height (in game) that is needed for a boulder of the same size
 * so they would appear on ground
 */
const BOULDER_HEIGHTS = {
  1: -34,
  2: -50,
  4: -75,
};

/**
 * points each note division (1 as smallest note, 4 as biggest) to the relevant
 * image string for image loading
 */
const BOULDER_IMAGES = {
  1: "smallBlockImage",
  2: "mediumBlockImage",
  4: "largeBlockImage",
};

/**
 * points a size of a boulder to the relevant
 * image string for image loading
 */
const BOULDER_SIZES = {
  SMALL: "smallBlockImage",
  MEDIUM: "mediumBlockImage",
  LARGE: "largeBlockImage",
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
 * various states that each stage could be in
 */
const STAGE_STATES = {
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
  // not started yet
  NOT_STARTED: -2,
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
  COUNT_IN_INTERVAL: 1,
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
  we push a boulder to the game only if the interval is 4 or 8 intervals before the end of count in 
  and 4 or 8 intervals before the end of the played notes. reason for that is so boulders will reach the player in time,
  so we want to push a boulder exactly 4 or 8 intervals before the time we want it to reach the player.
  4 or 8 intervals is dependent on the given smallest division (16th notes will be 8 intervals, else we want to spawn
  boulders 4 intervals before)
*/
const INTERVAL_PREDECESSOR = {
  2: 4,
  4: 8,
};

// default ground height adjustment
const GROUND_HEIGHT = 0.747;

// the acceptable delay (in milliseconds, before or after a note)
// player can be in his jump. beyond that delay, it will be considered as a bad jump
const ACCEPTABLE_DELAY = 140;

// rest time in milliseconds each level will have before next one starts
const DEFAULT_GAME_START_DELAY = 3500;

const SIXTEENTH_DIVISIONS = 4;

//  font style and color for a text in the scene
export const FONT_STYLE = {
  fontFamily: "Chewy",
  fill: "#14141f",
};

// and now for the scene itself...
class GameScene extends Phaser.Scene {
  // inherits Phaser Scenes. constructor uses "super" of ES6
  constructor(test) {
    super({
      key: "GameScene",
    });
  }

  // scene initialization, with given data. Only scene we run GameScene with is the LevelMenuScene.
  init(data) {
    // first we receive the given stage and level user wishes to play. GameScene is defined to run an entire stage at a time.
    this.stageIndex = data.stage;
    this.levelIndex = data.level;
    // all of the stages' musicJsons(Json data structure of BandPad that represent sheet music).
    this.sheetJson = data.stageJson;
    // user's current highscore.
    this.userHighScores = data.userHighScores;
    // the user's last level unlocked (so last level not won). comes with stage and level numbers.
    this.lastLevelUnlocked = data.lastLevelUnlocked;
    //
    this.hitPointsSubtracted = data.hitPointsSubtracted;
  }

  // Loading images, sounds etc...
  preload() {
    // set game keys
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // set game sounds
    this.hitSound = this.sound.add("hit");
    this.failSound = this.sound.add("failure");

    // set game background
    this.background = this.add
      .tileSprite(0, 0, this.width, this.height, "backgroundImage") // tileSprite so we can "roll" it as a level is playing
      .setOrigin(0, 0); // so while we roll it, background will stay in position
    this.background.setScrollFactor(0);
    this.setStageTintForBackground(); // each stage gets a little different tint
    // set game ground
    this.ground = this.physics.add.sprite(
      // sprite so other game objects can interact with it
      this.sys.game.config.width / 2,
      this.sys.game.config.height * GROUND_HEIGHT,
      "groundImage"
    );
    this.ground.setVisible(false); // invisible ground
    this.ground.setImmovable(); // ground stays in the same place no matter what

    // set hero.
    this.myHero = new Hero({ scene: this.scene });

    //set collider between hero and ground
    this.physics.add.collider(this.myHero.heroSprite, this.ground);

    // init text
    initText(this);

    // define hit points sprites. by default we have 3 hitpoints per stage (so 3 chances)
    this.hitPointsArray = [
      this.add.sprite(1060, 60, "fullHitPoint"),
      this.add.sprite(1140, 60, "fullHitPoint"),
      this.add.sprite(1220, 60, "fullHitPoint"),
    ];
    console.log();
    if (this.stageIndex === this.lastLevelUnlocked.stage) {
      for (let i = 0; i < this.hitPointsSubtracted; i++) {
        this.hitPointsArray[3 - this.myHero.hitPoints].setTexture("emptyHitPoint");
        this.myHero.hitPoints--;
      }
    }
  }

  // setting properties regarding this scene's run (so properties regarding stage and not properties regarding just a level)
  create() {
    // set stage and level states. at this points, nothing has started yet so default values of NOT_STARTED
    this.stageState = STAGE_STATES.NOT_STARTED;
    this.levelState = LEVEL_STATES.NOT_STARTED;

    // ------ data regarding the points system :

    // an array  that will keep track of the points in the CURRENT level.
    // size will be the amount of times user is required to jump.
    this.levelPointsArray = [];
  }

  // main function that runs a level with a given musicJson
  playLevel(levelJson) {
    // show the score DIV element.
    let scoreDIVElement = document.getElementById("score-id");
    scoreDIVElement.style.display = "block";

    // check if level we're about to play is the last level unlocked by user.
    this.levelIsLastUnlocked = this.checkIfLastLevelUnlocked();

    // inform player what the high score of this level is
    this.highScoreLowerText.text = this.userHighScores[this.stageIndex][this.levelIndex];
    // until this level is complete so we can calculate the score (points), we set default value of 0
    this.pointsLowerText.text = 0;
    // at a start of each level, infoText is empty so screen would be clear
    this.infoText.text = "";

    //level divisions. 1 = quarters, 2 = eights, 4 = 16th
    this.divisions = levelJson.divisions;

    // set tempo for this level
    this.tempo = 80;

    // if level is based on 16th notes, play in hald tempo (it's a game for children after all...)
    if (this.divisions === SIXTEENTH_DIVISIONS) {
      this.tempo = this.tempo / 2;
    }

    // create music score for the level
    createScore(levelJson, this.tempo, function (event, value) {});

    // array of boulder sprites. will be filled with sprites during the intervals
    this.bouldersArray = [];

    // actual size of the division. quarters = 4 etc
    this.divSize = NOTES_SIZES[this.divisions];

    // total amount of measures in this level (excluding count-in)
    this.amountOfBars = Object.keys(levelJson.partElements[0].scoreMap).length;

    //this calculates the smallest division in the game in milliseconds
    this.divisionDuration = ((60 / this.tempo) * 1000) / this.divisions;

    /*
    variables needed for intervals:
    */
    let intervalType = INTERVAL_TYPES.COUNT_IN_INTERVAL; // define the starting interval type as a count-in interval
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

    // the arrow function that happens each interval
    ScoreManager.setEventFunction((event, value) => {
      if (event === BUS_EVENTS.UPDATE) {
        if (intervalNumber < totalIntervals) {
          // the 3 notes items closest to the current interval. Needed for calculations for user's jump.
          this.curNotes = {
            prevNote: this.timingList[intervalNumber - 1],
            curNote: this.timingList[intervalNumber],
            nextNote: this.timingList[intervalNumber + 1],
          };
          // if we are not in count-in
          if (intervalType !== INTERVAL_TYPES.COUNT_IN_INTERVAL) {
            // check if user jumped (visited) the previous note, if it was a played note. level lost if not.
            if (
              this.curNotes.prevNote.noteType === NOTES.PLAYED_NOTE &&
              this.curNotes.prevNote.visited === false
            ) {
              this.levelState = LEVEL_STATES.LOST;
              this.infoMessage = "Skipped a Note";
            }
          }
        }

        // if we're in an interval of a quarter note in the second bar of the count-in.
        // happens 4 times overall regardless of divisions
        if (
          value >= countInIntervals / 2 && // second bar
          intervalType === INTERVAL_TYPES.COUNT_IN_INTERVAL && // of the count-in
          value <= countInIntervals &&
          value % this.divisions === 0 // we're in a quarter note interval
        ) {
          this.countInText.text = countInIndex; // change countInText to the number of quarter note in the bar we're in
          countInIndex++;
        }
        // after we're done with count-in, show no text from countInText
        if (value === 0 && intervalType === INTERVAL_TYPES.NOTES_INTERVAL) {
          //this.countInText.text = "";
        }
        /*
         add a boulder to the game if needed.
         we push a boulder to the game only if the interval is 4 or 8 intervals before the end of count in 
         and 4 or 8 intervals before the end of the playrd notes. reason for that is so boulders will reach the player in time,
         so we want to push a boulder exactly 4 or 8 intervals before the time we want it to reach the player.
         4 or 8 intervals is dependent on the given smallest division (16th notes will be 8 intervals, else we want to spawn
          boulders 4 intervals before)
        */
        if (
          (value >= countInIntervals - INTERVAL_PREDECESSOR[this.divisions] &&
            intervalType === INTERVAL_TYPES.COUNT_IN_INTERVAL) || // if we're less than 4 intervals before the end of count in
          (value < this.scoreMap.length - INTERVAL_PREDECESSOR[this.divisions] &&
            intervalType === INTERVAL_TYPES.NOTES_INTERVAL) // if we're more than 4 intervals before the end of notes
        ) {
          if (this.scoreMap[noteIndex][1] !== NOTES.REST_NOTE) {
            // if current note is not a rest note
            this.addBoulder(noteIndex); // add a boulder to the game
          }
          noteIndex++;
        }

        intervalNumber++;
        // if countdown is done
        if (intervalNumber === countInIntervals) {
          intervalType = INTERVAL_TYPES.NOTES_INTERVAL; // switch to note interval type
          this.countInText.text = ""; // after we're done with count-in, show no text from countInText
        }
        this.levelStatusCheck(intervalNumber, totalIntervals); // check if there is a need to end the level.
      }
    });

    // start vexflow, plays the score along with executing the intervals
    ScoreManager.scoreGetEvent(BUS_EVENTS.PLAY, {
      smoothNotePointer: true,
    });
  }

  // each stage gets a little different tint
  setStageTintForBackground() {
    if (this.stageIndex === 1) {
      // sunset vibes
      this.background.setTint(0xcfe2f3);
    }
    if (this.stageIndex === 2) {
      // air polllution vibes...
      this.background.setTint(0xfff2cc);
    }
    if (this.stageIndex === 3) {
      // late sunset, early night
      this.background.setTint(0xa57bc1);
    }

    if (this.stageIndex === 4) {
      this.background.setTint(0xf4cccc);
    }
    if (this.stageIndex === 5) {
      this.background.setTint(0xcfe2f3);
    }
  }

  // function that defines a boulder sprite and it's needed attributes for the level
  addBoulder(noteIndex) {
    // name of the needed boulder. Needed to load the relevant image
    const boulderName = this.getRelevantBoulderName(noteIndex);
    let newBoulder = this.physics.add.sprite(
      // define a new sprite
      this.sys.game.config.width,
      this.ground.y + this.getRelevantBoulderHeight(noteIndex),
      boulderName
    );
    newBoulder.setImmovable(); // boulders are heavy...
    newBoulder.setVelocityX(this.getVelocityForTempo()); // and fast...

    // add the dust cloud sprite for this boulder
    let newBoulderDust = this.physics.add.sprite(
      this.sys.game.config.width + 30,
      this.ground.y - 20,
      "dustCloudImage"
    );
    // appreantly dust clouds are as heavy and fast as the boulders...
    newBoulderDust.setImmovable();
    newBoulderDust.setVelocityX(this.getVelocityForTempo());

    // update the boudler array with the new items
    this.bouldersArray.push({
      sprite: newBoulder,
      size: boulderName,
      dustSprite: newBoulderDust,
    });
  }

  // function that gets the needed height for the current boulder to spawn, by the current note length
  getRelevantBoulderName(index) {
    return BOULDER_IMAGES[this.scoreMap[index][0]];
  }

  // function that gets the needed height for the current boulder to spawn, by the current note length
  getRelevantBoulderHeight(index) {
    return BOULDER_HEIGHTS[this.scoreMap[index][0]];
  }

  // function that remove all boulder sprite objects from the game. Used in case of losing a level.
  removeBoulders() {
    for (let i = 0; i < this.bouldersArray.length; i++) {
      this.bouldersArray[i].sprite.destroy();
      this.bouldersArray[i].dustSprite.destroy();
    }
  }

  // when player has lost a level, we subtract one hitpoint, and update the relevant hitpoint image to look that way
  subtractHitPoints() {
    this.hitPointsArray[3 - this.myHero.hitPoints].setTexture("emptyHitPoint");
    this.myHero.hitPoints--;
    let newHitPointsForLevel = JSON.parse(localStorage.getItem("hitPointsSubtracted")) + 1;
    localStorage.setItem("hitPointsSubtracted", JSON.stringify(newHitPointsForLevel));
  }

  // we calculate the average jump rating (from 0 to 100 per jump) of user in this level, and multiply that by 5,
  // so overall level will get jump points between 0 and 500.
  calculateLevelPoints() {
    // define a mini arrow function that will calculate an average of the items in an array
    let average = (array) => array.reduce((a, b) => a + b) / array.length;

    // calculate the average of our level points array using that function, multiply by 5 to get a points range of 0-500.
    // floor it down so it will be an integer
    const levelPoints = Math.floor(average(this.levelPointsArray) * 5);
    this.pointsLowerText.text = levelPoints;
    console.log("final level score is: ", levelPoints); // log it to console
    // if user passed his previous highscore
    if (this.userHighScores[this.stageIndex][this.levelIndex] < levelPoints) {
      console.log("passed your highscore!"); // log it to console
      this.highScoreLowerText.text = levelPoints; // update the highscore text
      this.userHighScores[this.stageIndex][this.levelIndex] = levelPoints; // update the highscore in the highscore matrix
      localStorage.setItem("userHighScores", JSON.stringify(this.userHighScores)); // update the highscore matrix in localStorage
    }
  }

  // function to check and execute stuff related to the current stage
  stageStatusCheck() {
    // if hit points reaches zero, player need to restart this stage
    if (this.myHero.hitPoints === 0) {
      this.stageState = STAGE_STATES.LOST;

      // change localStorage data to restart stage (so same stage with first level), if it is the last unlocked level
      if (this.levelIsLastUnlocked) {
        console.log("starting stage from start...");
        localStorage.setItem(
          "LastLevelUnlocked",
          JSON.stringify({ stage: this.stageIndex, level: 0 })
        );
      }
      // reset hitPointsSubtracted. new chance...
      localStorage.removeItem("hitPointsSubtracted");

      return;
    }

    // if player won this level, update indexes accordingli
    if (this.levelState === LEVEL_STATES.WON) {
      // if this is not the last level of this stage
      if (this.levelIndex < 5) {
        this.levelIndex++; // advance to next level in this stage
        // if it's the last level unlocked, also update this.LastLevelUnlocked to be the newly unlocked level
        if (this.levelIsLastUnlocked) {
          this.lastLevelUnlocked.level++;
        }
        // if we finished a level without ending a stage, we are on hold until we start the next level
        this.stageState = STAGE_STATES.ON_HOLD;
      }

      // if this is the last level of this stage, advance to new stage
      else {
        this.levelIndex = 0;
        this.stageIndex++;
        this.stageState = STAGE_STATES.WON;
        localStorage.removeItem("hitPointsSubtracted");
        // if it's the last level unlocked, also update this.LastLevelUnlocked to be the newly unlocked level
        if (this.levelIsLastUnlocked) {
          this.lastLevelUnlocked.stage++;
          this.lastLevelUnlocked.level = 0; // first level in the new stage...
        }
      }

      // change localStorage data to the new next level, after we updated the indexes accordingly
      localStorage.setItem(
        "LastLevelUnlocked",
        JSON.stringify({ stage: this.stageIndex, level: this.levelIndex })
      );
      // inform player on the next level
      this.levelInfoText.text =
        "Stage " + (this.stageIndex + 1) + ", Level " + (this.levelIndex + 1);
    }
    // if just lost a level but not the whole stage, just redo the level. put stageStage on hold until we restart
    else if (this.levelState === LEVEL_STATES.LOST) {
      this.stageState = STAGE_STATES.ON_HOLD;
    }
  }

  // checks if current level is the last one player unlocked. return true if it does, false otherwise
  checkIfLastLevelUnlocked() {
    if (
      this.stageIndex === this.lastLevelUnlocked.stage &&
      this.levelIndex === this.lastLevelUnlocked.level
    ) {
      return true;
    }
    return false;
  }

  // function that check for each interval if there is a need to end the level for any reason (jump failure or level won)
  // if so, update everything regarding level, stage, hero and user accordingly
  levelStatusCheck(intervalNumber, totalIntervals) {
    // if player has lost the level for any reason
    if (this.levelState === LEVEL_STATES.LOST) {
      this.removeBoulders(); // remove all boulders from game
      //this.failSound.play(); // play a failure sound
      this.myHero.heroSprite.play("hurtAnimation"); // play failure animation
      ScoreManager.scoreGetEvent(BUS_EVENTS.STOP); // stop the intervals
      this.subtractHitPoints(); // subtract hitpoints after level failure
    }
    // if player passed all intervals correctly
    else if (intervalNumber === totalIntervals) {
      console.log("won level!");
      this.levelState = LEVEL_STATES.WON; // player has won the level
      this.calculateLevelPoints(); // calculate points for that level, add to total points
      this.myHero.heroSprite.play("winAnimation"); // play winning animation
    }
    // if level should not end for any reason, return and continue the intervals
    else {
      return;
    }
    // in any case of a level ending, do these:
    this.myHero.heroSprite.anims.chain("standingAnimation"); // stand after level is finished
    this.stageStatusCheck(); // check and update data regarding the stage and the new level
    // if level was not lost, set infoMessage to display the next level user is going to face
    // if level lost, we inform the player details regarding failure in the jumpTimingCheck function
    if (this.levelState !== LEVEL_STATES.LOST) {
      this.infoMessage = "Level " + (this.levelIndex + 1);
    }
  }

  // function that calculates the needed boulder velocity to match the given tempo
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

  registerScore(JumpDelay) {
    // jumpScore is calculated by how big of a delay the jump is in relation
    // to the maximum delay of a valid jump (which is the ACCEPTABLE_DELAY constant),
    // normalized to max points of 100
    let jumpScore = 100 - (JumpDelay / ACCEPTABLE_DELAY) * 100;
    this.levelPointsArray.push(jumpScore);
    console.log("jump score is: ", jumpScore);
  }

  // general function to check, register and execute user's jump.
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

    let successfulJump = true; // jump is okay until proven else...

    // if we're on count-in, any jump is valid, so we jump and return
    if (closestNote.noteType === NOTES.COUNT_NOTE) {
      this.myHero.smallJump(successfulJump);
      return;
    }
    // register the jump in our timing list
    this.registerJump(closestNote);

    //if jump is good, in the next if statement we log to the console details regarding the jump, and register the score in our score array.
    if (delay === 0 && closestNote.noteType === NOTES.PLAYED_NOTE) {
      this.registerScore(delay);
      console.log("just in time!");
    } else if (delay < ACCEPTABLE_DELAY && closestNote.noteType === NOTES.PLAYED_NOTE) {
      this.registerScore(delay);
      console.log("jump time is ", delay, "milliseconds late");
    } else if (preDelay < ACCEPTABLE_DELAY && closestNote.noteType === NOTES.PLAYED_NOTE) {
      this.registerScore(preDelay);
      console.log("jump time is ", preDelay, "milliseconds early");
    }
    // if jump was not good, we inform to the user the details regarding the jump, and update level status to lost
    else {
      successfulJump = false;
      if (closestNote.noteType === NOTES.REST_NOTE) {
        this.infoMessage = "Jumped on a Rest Note";
      } else {
        this.infoMessage = "Not Jumped on Time";
      }
      this.levelState = LEVEL_STATES.LOST;
    }
    // in any case, jump
    // needed animation and jump height are calculated in the hero class according to successfulJump and noteSize)
    this.myHero.jump(successfulJump, closestNote.noteSize);
  }

  // each boulder of each size will get a different roation speed
  rotateBoulderAccordingToSize(boulderIndex) {
    if (this.bouldersArray[boulderIndex].size === BOULDER_SIZES.SMALL) {
      this.bouldersArray[boulderIndex].sprite.angle -= 15;
    } else if (this.bouldersArray[boulderIndex].size === BOULDER_SIZES.MEDIUM) {
      this.bouldersArray[boulderIndex].sprite.angle -= 10;
    } else {
      this.bouldersArray[boulderIndex].sprite.angle -= 5;
    }
  }

  // when called upon, go back to level menu with the given time
  goBackToMenu(delay = DEFAULT_GAME_START_DELAY) {
    this.time.addEvent({
      delay: delay,
      callback: () => {
        this.scene.start("LevelMenuScene");
      },
    });
  }

  update(time, delta) {
    // if user presses ESC button, leave scene
    if (Phaser.Input.Keyboard.JustDown(this.escButton)) {
      // if level was rolling, stop the intervals
      if (this.levelState === LEVEL_STATES.ON_MOTION) {
        ScoreManager.scoreGetEvent(BUS_EVENTS.STOP); // stop the intervals
      }
      this.removeBoulders();
      this.countInText.text = ""; // making sure there is no text overload if we're in count-in
      this.infoText.text = "Exiting"; // and informing the player of his\her choice
      this.goBackToMenu(1000); // and aborting mission...
    }

    // if level is on motion, move the background image and rotate all boulders
    if (this.levelState === LEVEL_STATES.ON_MOTION) {
      this.background.tilePositionX += 6;
      for (let i = 0; i < this.bouldersArray.length; i++) {
        this.rotateBoulderAccordingToSize(i);
      }
    }

    // if player has pressed space-bar while hero was touching the ground and level is played, start jump calculations and excecutions
    if (
      Phaser.Input.Keyboard.JustDown(this.spaceBar) &&
      this.myHero.heroSprite.body.touching.down &&
      this.levelState === LEVEL_STATES.ON_MOTION
    ) {
      // play a sound for that jump
      this.hitSound.play();
      // check if jump is valid according to game rules, and act according to the user's input
      this.jumpTimingCheck();
    }

    // if the game is not on motion and we did not finish all of the musicJsons
    if (this.stageState !== STAGE_STATES.ON_MOTION && this.levelIndex < this.sheetJson.length) {
      // if player has failed 3 times, tell him that and don't start a new level (by doing return)
      if (this.stageState === STAGE_STATES.LOST) {
        this.infoText.text = "You Lost";
        this.goBackToMenu();
        return;
      }
      // if player has won, tell him that and don't start a new level (by doing return)
      if (this.stageState === STAGE_STATES.WON) {
        this.infoText.text = "You Won!";
        ScoreManager.scoreGetEvent(BUS_EVENTS.STOP); // remove the sheet from screen
        this.goBackToMenu();
        return;
      }
      // change the game to on motion
      this.stageState = STAGE_STATES.ON_MOTION;

      // inform the player about current level -
      // if player lost last level, inform him why, if he won inform about next level
      this.infoText.text = this.infoMessage;

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
