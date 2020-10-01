import Phaser from "phaser";
import Hero from "../sprites/Hero";
import createScore from "../lib/createScore";
import createLevelScoreMap from "../lib/createLevelScoreMap";
import createTimingList from "../lib/createTimingList";
import * as ScoreManager from "bandpad-vexflow";
import { BUS_EVENTS } from "bandpad-vexflow";

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
 * various states that the game could be in
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
  we push a boulder to the game only if the interval is 4 or 8 intervals before the end of count in 
  and 4 or 8 intervals before the end of the playrd notes. reason for that is so boulders will reach the player in time,
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

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "GameScene",
    });
  }

  init(data) {
    // an array that contains all of the musicJsons of each level, by ascending difficulty
    if (!data.level) {
      this.levelIndex = 0;
    } else {
      this.levelIndex = data.level;
    }
    if (!data.stage) {
      this.stageIndex = 0;
    } else {
      this.stageIndex = data.stage;
    }
    this.sheetJson = data.stageJson;
    this.userHighScores = data.userHighScores;
    this.LastLevelUnlocked = data.lastLevelUnlocked;
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

    this.infoText = this.add
      .text(640, 350, "", {
        fill: "#14141f",
        fontSize: "80px",
      })
      .setOrigin(0.5, 0.5);
    // .setOrigin(0.5, 0.5);
    this.infoMessage = "level " + (this.levelIndex + 1);

    //
    this.pointsUpperText = this.add
      .text(130, 130, "Points:", {
        fill: "#14141f",
        fontSize: "40px",
      })
      .setOrigin(0.5, 0.5);
    this.totalPoints = 0;
    this.pointsLowerText = this.add
      .text(110, 180, this.totalPoints, {
        fill: "#14141f",
        fontSize: "80px",
      })
      .setOrigin(0.5, 0.5);

    this.highScoreUpperText = this.add
      .text(130, 25, "Highscore:", {
        fill: "#14141f",
        fontSize: "40px",
      })
      .setOrigin(0.5, 0.5);
    this.highScoreLowerText = this.add
      .text(110, 80, this.userHighScores[this.stageIndex][this.levelIndex], {
        fill: "#14141f",
        fontSize: "80px",
      })
      .setOrigin(0.5, 0.5);
    this.levelInfoText = this.add
      .text(1150, 40, "Stage " + (this.stageIndex + 1) + "\nLevel " + (this.levelIndex + 1), {
        fill: "#14141f",
        fontSize: "40px",
      })
      .setOrigin(0.5, 0.5);

    // define hitpoints sprites
    let hp1 = this.add.sprite(1060, 140, "fullHitPoint");
    let hp2 = this.add.sprite(1140, 140, "fullHitPoint");
    let hp3 = this.add.sprite(1220, 140, "fullHitPoint");
    // define hitpoints array
    this.hitPointsArray = [hp1, hp2, hp3];
  }

  create() {
    /*
    todo: create pause method
    this.paused = false;
    this.input.keyboard.on("keydown_ESC", function (event) {});*/

    // set game mode
    this.stageState = STAGE_STATES.NOT_STARTED;
    this.levelState = LEVEL_STATES.NOT_STARTED;

    // set the level index to the first level
    //this.levelIndex = 0;

    // ------ data regarding the points system :

    // an array in the same size of sheetJson (meaning the amount of levels) that will keep track
    // of the scoring system (game-points wise, not music scores..) of each level
    this.gamePointsArray = [];

    // an array  that will keep track of the points in the CURRENT level.
    // size will be the amount of times user is required to jump.
    this.levelPointsArray = [];
  }

  playLevel(levelJson) {
    // show the score DIV element
    let scoreDIVElement = document.getElementById("score-id");
    scoreDIVElement.style.display = "block";

    // check if level we're about to play is the last level unlocked by user.
    this.levelIsLastUnlocked = this.checkIfLastLevelUnlocked();

    // inform player what the high score of this level is
    this.highScoreLowerText.text = this.userHighScores[this.stageIndex][this.levelIndex];
    this.pointsLowerText.text = 0;
    // at a start of each level, infoText is empty so screen would be clear
    this.infoText.text = "";

    //level divisions. 1 = quarters, 2 = eights, 4 = 16th
    this.divisions = levelJson.divisions;

    // set tempo for this level
    this.tempo = 80;

    if (this.divisions === 4) {
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
        if (intervalNumber < totalIntervals) {
          this.curNotes = {
            // the 3 notes items closest to the current interval. Needed for calculations for user's jump.
            prevNote: this.timingList[intervalNumber - 1],
            curNote: this.timingList[intervalNumber],
            nextNote: this.timingList[intervalNumber + 1],
          };
          // if we are not in count-in
          if (intervalType !== INTERVAL_TYPES.COUNTIN_INTERVAL) {
            // check if user jumped (visited) the previous note, if it was a played note. level lost if not.
            if (
              this.curNotes.prevNote.noteType === NOTES.PLAYED_NOTE &&
              this.curNotes.prevNote.visited === false
            ) {
              this.levelState = LEVEL_STATES.LOST;
              this.infoMessage = "skipped a note";
            }
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
         add a boulder to the game if needed.
         we push a boulder to the game only if the interval is 4 or 8 intervals before the end of count in 
         and 4 or 8 intervals before the end of the playrd notes. reason for that is so boulders will reach the player in time,
         so we want to push a boulder exactly 4 or 8 intervals before the time we want it to reach the player.
         4 or 8 intervals is dependent on the given smallest division (16th notes will be 8 intervals, else we want to spawn
          boulders 4 intervals before)
        */
        if (
          (value >= countInIntervals - INTERVAL_PREDECESSOR[this.divisions] &&
            intervalType === INTERVAL_TYPES.COUNTIN_INTERVAL) || // if we're less than 4 intervals before the end of count in
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

  addBoulder(noteIndex) {
    const boulderName = this.getRelevantBoulderName(noteIndex);
    let newBoulder = this.physics.add.sprite(
      this.sys.game.config.width,
      this.ground.y + this.getRelevantBoulderHeight(noteIndex),
      boulderName
    );
    newBoulder.setImmovable();
    newBoulder.setVelocityX(this.getVelocityForTempo());

    let newBoulderDust = this.physics.add.sprite(
      this.sys.game.config.width + 30,
      this.ground.y - 20,
      "dustCloudImage"
    );
    newBoulderDust.setImmovable();
    newBoulderDust.setVelocityX(this.getVelocityForTempo());

    this.bouldersArray.push({ sprite: newBoulder, size: boulderName, dustSprite: newBoulderDust });
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

  updateHitPoints() {
    this.hitPointsArray[3 - this.myHero.hitPoints].setTexture("emptyHitPoint");
    this.myHero.hitPoints--;
  }

  // we calculate the average jump rating (from 0 to 100 per jump) of user in this level, and multiply that by 5,
  // so overall level will get jump points between 0 and 500.
  calculateLevelPoints() {
    // define a mini arrow function that will calculate an average of the items in an array
    let average = (array) => array.reduce((a, b) => a + b) / array.length;
    // calculate the average of our level points array using that function, multiply by 5 to get a points range of 0-500.
    // floor it down so it will be an integer
    const levelPoints = Math.floor(average(this.levelPointsArray) * 5);
    this.gamePointsArray.push(levelPoints);
    this.totalPoints = levelPoints;
    this.pointsLowerText.text = this.totalPoints;
    console.log("final level score is: ", this.gamePointsArray[this.levelIndex]);
    if (this.userHighScores[this.stageIndex][this.levelIndex] < levelPoints) {
      this.highScoreLowerText.text = levelPoints;
      console.log("passed your highscore!");
      this.userHighScores[this.stageIndex][this.levelIndex] = levelPoints;
      localStorage.setItem("userHighScores", JSON.stringify(this.userHighScores));
    }
  }

  // function to check and execute stuff related to the current stage
  stageStatusCheck() {
    // if hitpoints reaches zero, player need to restart this stage

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

      return;
    }

    // if player won this level, update indexes accordingli
    if (this.levelState === LEVEL_STATES.WON) {
      // first, check if we have just finished a stage, update indexes accordingly

      // if we finished a level without ending a stage, so we are on hold until we start the next level
      if (this.levelIndex < 5) {
        // if this is not the last level of this stage
        this.levelIndex++; // advance to next level in this stage
        // if it's the last level unlocked, also update this.LastLevelUnlocked to be the newly unlocked level
        if (this.levelIsLastUnlocked) {
          this.LastLevelUnlocked.level++;
        }
        this.stageState = STAGE_STATES.ON_HOLD;
      }
      // else advance to new stage
      else {
        this.levelIndex = 0;
        this.stageIndex++;
        this.stageState = STAGE_STATES.WON;
        // if it's the last level unlocked, also update this.LastLevelUnlocked to be the newly unlocked level
        if (this.levelIsLastUnlocked) {
          this.LastLevelUnlocked.stage++;
          this.LastLevelUnlocked.level = 0;
        }
      }

      // change localStorage data to the new next level
      localStorage.setItem(
        "LastLevelUnlocked",
        JSON.stringify({ stage: this.stageIndex, level: this.levelIndex })
      );
      // inform player on the next level
      this.levelInfoText.text =
        "Stage " + (this.stageIndex + 1) + "\nLevel " + (this.levelIndex + 1);
    }
    // if just lost a level but not the whole stage, just redo the level. put stageStage on hold until we restart
    else if (this.levelState === LEVEL_STATES.LOST) {
      this.stageState = STAGE_STATES.ON_HOLD;
    }
  }

  // checks if current level is the last one player unlocked. return true if it does, false otherwise
  checkIfLastLevelUnlocked() {
    if (
      this.stageIndex === this.LastLevelUnlocked.stage &&
      this.levelIndex === this.LastLevelUnlocked.level
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
      this.updateHitPoints(); // update hitpoints after level failure
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
      this.infoMessage = "level " + (this.levelIndex + 1);
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
      this.registerScore(delay);
      console.log("just in time!");
    } else if (delay < ACCEPTABLE_DELAY && closestNote.noteType === NOTES.PLAYED_NOTE) {
      this.registerScore(delay);
      console.log("jump time is ", delay, "milliseconds late");
    } else if (preDelay < ACCEPTABLE_DELAY && closestNote.noteType === NOTES.PLAYED_NOTE) {
      this.registerScore(preDelay);
      console.log("jump time is ", preDelay, "milliseconds early");
    }
    // if jump was not good, we inform to the user the details regarding the jump, and update level to lost
    else {
      successfulJump = false;
      if (closestNote.noteType === NOTES.REST_NOTE) {
        this.infoMessage = "jumped on rest";
      } else {
        this.infoMessage = "not jumped on time";
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

  goBackToMenu(delay = DEFAULT_GAME_START_DELAY) {
    this.time.addEvent({
      delay: delay,
      callback: () => {
        this.scene.start("TitleScene");
      },
    });
  }

  update(time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.escButton)) {
      ScoreManager.scoreGetEvent(BUS_EVENTS.STOP); // stop the intervals
      this.countInText.text = "";
      this.infoText.text = "exiting...";
      this.goBackToMenu(1000);
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
        this.infoText.text = "you lost";
        this.goBackToMenu();
        return;
      }
      // if player has won, tell him that and don't start a new level (by doing return)
      if (this.stageState === STAGE_STATES.WON) {
        this.infoText.text = "you won";
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
