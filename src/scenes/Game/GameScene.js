import Phaser from "phaser";
import Hero from "../../sprites/Hero";
import Boulder from "../../sprites/Boulder";

// text utillities, positioning and styling
import { initText } from "./textUtils";
// --- BandPad utillites ---
// handles score intervals and general sheet music execution
import * as ScoreManager from "bandpad-vexflow";
// handles specific events during the intervals
import { BUS_EVENTS } from "bandpad-vexflow";
// handles specific events during the intervals
import { playLevel } from "./PlayLevel";
// -------

// ------------------ CONSTANTS ---------------- //

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
  // passed the visibile blocks part of a level
  PASSED_PART1: 1,
  // level win
  WON: 2,
};

/**
 * types of notes that could be found in the program
 */
const NOTES = {
  REST_NOTE: "noPlace", // noPlace is the string value that occurs in the given ScoreJsons as an identifier for a rest note
  PLAYED_NOTE: "playedNote",
  COUNT_NOTE: "countDown",
};

const LEVEL_PARTS = {
  PART1: 1,
  PART2: 2,
};

// default ground height adjustment
const GROUND_HEIGHT = 0.747;

/**
 * the acceptable delay (in milliseconds, before or after a note)
 * player can be in his jump. beyond that delay, it will be considered as a bad jump
 */
const ACCEPTABLE_DELAY = 275;

// rest time in milliseconds each level will have before next one starts
const DEFAULT_GAME_START_DELAY = 3500;

const DEFAULT_TILE_SPEED = 6;

// different messages for user
const EARLY_JUMP_MSG = "You jumped too early!";
const LATE_JUMP_MSG = "You jumped too late!";
const WRONG_JUMP_MSG = "You jumped at the wrong time!";
const NO_BOULDERS_MSG = "\nNow without boulders!";

// font style and color for a text in the scene
export const FONT_STYLE = {
  fontFamily: "Chewy",
  fill: "#14141f",
  align: "center",
};

// and now for the scene itself...
class GameScene extends Phaser.Scene {
  // inherits Phaser Scenes. constructor uses "super" of ES6
  constructor(test) {
    super({
      key: "GameScene",
    });
  }

  /**
   * scene initialization, with given data. Only scene we run GameScene with is the LevelMenuScene.
   * @param {*} data - data from the previous scene that started this one
   */
  init(data) {
    // first we receive the given stage and level user wishes to play. GameScene is defined to run an entire stage at a time.
    this.stageIndex = data.stage;
    this.levelIndex = data.level;
    // each level is being played 2 times (2 parts), part 1 with boulders approaching and part 2 with invisible boulders
    this.levelPart = LEVEL_PARTS.PART1;
    this.invisibleLevel = false;
    // all of the stages' musicJsons(Json data structure of BandPad that represent sheet music).
    this.sheetJson = data.stageJson;
    // user's current highscore.
    this.userHighScores = data.userHighScores;
    // user's last level unlocked (so last level not won). comes with stage and level numbers.
    this.lastLevelUnlocked = data.lastLevelUnlocked;
    // amount of hitpoints subtracted from hero (so number of failed attempts) in his last attempt playing the last unlocked stage.
    this.hitPointsSubtracted = data.hitPointsSubtracted;
  }

  /**
   * Loading images, sounds etc...
   */
  preload() {
    // set game keys
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // set game sounds
    this.hitSound = this.sound.add("hit");
    this.failSound = this.sound.add("failure");
    this.measureBeat = this.sound.add("measureBeat");
    this.quarterBeat = this.sound.add("quarterBeat");

    this.levelWinSound = this.sound.add("levelWin");
    this.stageWinSound = this.sound.add("stageWin");
    this.levelLostSound = this.sound.add("levelFail");
    this.stageLostSound = this.sound.add("stageFail");

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

    // REMOVED TEMPORARY IN BETA VERSION
    /*
    // if we're in the last unlocked stage by user
    if (this.stageIndex === this.lastLevelUnlocked.stage) {
      // subtract the needed amount of HP from hero, so he will have the same HP as he did in his last attempt of this stage
      for (let i = 0; i < this.hitPointsSubtracted; i++) {
        this.hitPointsArray[3 - this.myHero.hitPoints].setTexture("emptyHitPoint"); // change texture to subtracted HP
        this.myHero.hitPoints--; // subtract HP from hero
      }
    }*/
  }

  /**
   * setting properties regarding this scene's run (so properties regarding stage and not properties regarding just a level)
   */
  create() {
    // show the score DIV element.
    let scoreDIVElement = document.getElementById("score-id");
    scoreDIVElement.style.display = "block";
    // set stage and level states. at this points, nothing has started yet so default values of NOT_STARTED
    this.stageState = STAGE_STATES.NOT_STARTED;
    this.levelState = LEVEL_STATES.NOT_STARTED;

    // ------ data regarding the points system :

    // an array  that will keep track of the points in the CURRENT level.
    // size will be the amount of times user is required to jump.
    //      this.myHero.onGround() && this.levelState === LEVEL_STATES.ON_MOTION
    this.levelPointsArray = [];

    // if player has touched the screen while hero was touching the ground and level is played, jump and start jump calculations
    this.input.on("pointerdown", () => {
      console.log("clicked");
      if (this.myHero.onGround() && this.levelState === LEVEL_STATES.ON_MOTION) {
        this.jumpTimingCheck();
      }
    });
  }

  /**
   * each stage gets a little different tint
   */
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

  /**
   * function that adds a boulder to the level and pushes it into our bouldersArray
   * @param {*} noteIndex - the index of the note out of the total amount of played notes
   */
  addBoulder(noteIndex) {
    let newBoulder = new Boulder({ scene: this.scene, noteIndex: noteIndex });
    this.bouldersArray.push(newBoulder);
  }

  /**
   *  function that remove all boulder sprite objects from the game. Used in case of losing a level.
   */
  removeBoulders() {
    this.bouldersArray.forEach((boulder) => {
      boulder.destroy();
    });
  }

  /**
   * when player has lost a level, we subtract one hitpoint, and update the relevant hitpoint image to look that way
   */
  subtractHitPoints() {
    this.hitPointsArray[3 - this.myHero.hitPoints].setTexture("emptyHitPoint");
    this.myHero.hitPoints--;
    // we add one more HP subtracted to the one we had before in localStore
    let newhitPointsSubtracted = JSON.parse(localStorage.getItem("hitPointsSubtracted")) + 1;
    localStorage.setItem("hitPointsSubtracted", JSON.stringify(newhitPointsSubtracted));
  }

  /**
   * we calculate the average jump rating (from 0 to 100 per jump) of user in this level, and multiply that by 5,
   * so overall level will get jump points between 0 and 500.
   */
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

  wonGameCheck() {
    if (this.stageIndex === 5 && this.levelIndex === 5) {
      return true;
    }
    return false;
  }

  /**
   * function to check and execute stuff related to the current stage
   */
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
      this.stageLostSound.play(); // play stage lost sound
      localStorage.removeItem("hitPointsSubtracted"); // reset hitPointsSubtracted. new chance...
      return;
    }

    // if player passed the first part of this level, just update stage state to be on hold until we redo the level without boulders
    if (this.levelState === LEVEL_STATES.PASSED_PART1) {
      this.stageState = STAGE_STATES.ON_HOLD;
    }

    // if player won this level, update indexes accordingly
    else if (this.levelState === LEVEL_STATES.WON) {
      // if this is not the last level of this stage
      if (this.levelIndex < 5) {
        this.levelIndex++; // advance to next level in this stage
        // if it's the last level unlocked, also update this.LastLevelUnlocked to be the newly unlocked level
        if (this.levelIsLastUnlocked) {
          this.lastLevelUnlocked.level++;
        }
        // if we finished a level without ending a stage, we are on hold until we start the next level
        this.stageState = STAGE_STATES.ON_HOLD;
        this.levelWinSound.play(); // play win level sound
      } else if (this.wonGameCheck()) {
        this.stageState = STAGE_STATES.WON;
        localStorage.removeItem("hitPointsSubtracted"); // reset hitPointsSubtracted.
        this.stageWinSound.play(); // play stage win sound
      }
      // if this is the last level of this stage, advance to new stage
      else {
        this.levelIndex = 0;
        this.stageIndex++;
        this.stageState = STAGE_STATES.WON;
        localStorage.removeItem("hitPointsSubtracted"); // reset hitPointsSubtracted. new chance per new stage...
        // if it's the last level unlocked, also update this.LastLevelUnlocked to be the newly unlocked level
        if (this.levelIsLastUnlocked) {
          this.lastLevelUnlocked.stage++;
          this.lastLevelUnlocked.level = 0; // first level in the new stage...
        }
        this.stageWinSound.play(); // play stage win sound
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
      this.levelLostSound.play(); // play level lose sound
    }
  }

  /**
   * checks if current level is the last one player unlocked. return true if it does, false otherwise
   */
  checkIfLastLevelUnlocked() {
    if (
      this.stageIndex === this.lastLevelUnlocked.stage &&
      this.levelIndex === this.lastLevelUnlocked.level
    ) {
      return true;
    }
    return false;
  }

  /**
   *  check for each interval if there is a need to end the level for any reason (jump failure or level won)
      if so, update everything regarding level, stage, hero and user accordingly
   * @param intervalNumber - the number of interval we're in
   * @param totalIntervals - total amount of intervals that will run
   */
  levelStatusCheck(event, intervalNumber, totalIntervals) {
    // if player has lost the level for any reason
    if (this.levelState === LEVEL_STATES.LOST) {
      this.removeBoulders(); // remove all boulders from game
      //this.failSound.play(); // play a failure sound
      this.myHero.hurt(); // play failure animation
      ScoreManager.scoreGetEvent(BUS_EVENTS.STOP); // stop the intervals
      this.subtractHitPoints(); // subtract hitpoints after level failure
    }
    // if player passed all intervals correctly
    else if (intervalNumber === totalIntervals) {
      console.log("ended!!!");

      // if finished first part, redo the level without boudlers
      if (this.levelPart === LEVEL_PARTS.PART1) {
        this.levelState = LEVEL_STATES.PASSED_PART1; // player passed the first part of this level
        this.levelPart = LEVEL_PARTS.PART2; // and advanced to part 2 of level, without boulders
        this.invisibleLevel = true; // part 2 is an invisible level
      }
      // else, passed the whole level
      else {
        console.log("won level!");
        this.levelState = LEVEL_STATES.WON; // player has won the level
        this.levelPart = LEVEL_PARTS.PART1; // newly advanced level is started in part 1
        this.invisibleLevel = false; // and it is with visible boulders of course
      }
      this.calculateLevelPoints(); // calculate points for that level, add to total points
      this.myHero.cheer(); // play winning animation
    }
    // if level should not end for any reason, return and continue the intervals
    else {
      return;
    }
    // in any case of a level ending, do these:
    this.myHero.stand(); // stand after level is finished
    this.stageStatusCheck(); // check and update data regarding the stage and the new level

    // if level was not lost, set infoMessage to display the next level user is going to face
    // if level lost, we inform the player details regarding failure in the jumpTimingCheck function
    if (this.levelState !== LEVEL_STATES.LOST) {
      this.infoMessage = "Level " + (this.levelIndex + 1);
      if (this.levelState === LEVEL_STATES.PASSED_PART1) {
        this.infoMessage += NO_BOULDERS_MSG;
      }
    }
  }

  // ------------------ UPDATE METHODS ---------------- //

  /**
   * function that gets the note that is closest to the user's jump.
   * @param {*} jumpTime - jump time of the user relative to the level's start time
   */
  getClosestNoteToKeyPress(jumpTime) {
    // calculate the distance between curNote and jumpTime
    const curNoteDistance = Math.abs(this.curNotes.curNote.timing - jumpTime);

    // calculate the distance between nextNote and jumpTime
    const nextNoteDistance = Math.abs(this.curNotes.nextNote.timing - jumpTime);
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

  /**
   * this function calculates and registers the score for one user jump
   * @param {*} JumpDelay - the delay between the time user should have jump and the time he actually jumped for this jump
   */
  registerScore(JumpDelay) {
    // jumpScore is calculated by how big of a delay the jump is in relation
    // to the maximum delay of a valid jump (which is the ACCEPTABLE_DELAY constant),
    // normalized to max points of 100
    let jumpScore = 100 - (JumpDelay / ACCEPTABLE_DELAY) * 100;
    this.levelPointsArray.push(jumpScore);
    console.log("jump score is: ", jumpScore);
  }

  /**
   * general function to check, register and execute user's jump.
   */
  jumpTimingCheck() {
    // time passed since the start of the level until the jump
    this.jumpTime = Date.now() - this.myHero.walkStartTime;

    // get the note element that is closest to the jump
    this.closestNote = this.getClosestNoteToKeyPress(this.jumpTime);

    // calculates the delay of the jump from the note timing
    const jumpDelay = Math.abs(this.closestNote.timing - this.jumpTime);

    let successfulJump = true; // jump is okay until proven else...
    // if we're on count-in, any jump is valid, so we jump and return
    if (this.closestNote.noteType === NOTES.COUNT_NOTE) {
      this.hitSound.play(); // play a sound for that jump
      this.myHero.smallJump(successfulJump);
      return;
    }
    // register the jump in our timing list
    this.registerJump(this.closestNote);

    //if jump is good, in the next if statement we log to the console details regarding the jump, and register the score in our score array.
    if (jumpDelay < ACCEPTABLE_DELAY && this.closestNote.noteType === NOTES.PLAYED_NOTE) {
      this.registerScore(jumpDelay);
      if (this.closestNote.timing > this.jumpTime) {
        console.log("jump time is ", jumpDelay, "milliseconds early");
      } else if (this.closestNote.timing < this.jumpTime) {
        console.log("jump time is ", jumpDelay, "milliseconds late");
      } else {
        console.log("just in time!");
      }
    }

    // if jump was not good, we inform to the user the details regarding the jump, and update level status to lost
    else {
      successfulJump = false;
      if (this.closestNote.noteType === NOTES.REST_NOTE) {
        this.infoMessage = WRONG_JUMP_MSG;
      }
      // else, if the the jump failed because of delay, tell that to user
      else if (this.closestNote.timing < this.jumpTime) {
        this.infoMessage = LATE_JUMP_MSG;
      }
      // else, it failed because user jumped too early. tell that to user
      else {
        this.infoMessage = EARLY_JUMP_MSG;
      }
      this.levelState = LEVEL_STATES.LOST;
    }
    // in any case, jump
    this.hitSound.play(); // play a sound for that jump
    // needed animation and jump height are calculated in the hero class according to successfulJump and noteSize)
    this.myHero.jump(successfulJump, this.closestNote.noteSize);
  }

  /**
   * this function checks how long a jump took, and if it is long enough according to the current note being played
   */
  jumpDurationCheck() {
    // jump duration is the difference between the time user has pressed down the jump button (this.myHero.walkStartTime - this.jumpTime)
    // and pulled up from button press (Date.now)
    const jumpDuration = Date.now() - this.myHero.walkStartTime - this.jumpTime;
    // needed jump duration is the smallest division in miiliseconds (this.divisionDuration) times this notes' size
    const neededDuration = this.closestNote.noteSize * this.divisionDuration;
    console.log("jump length: ", jumpDuration);
    console.log("should be  ", neededDuration);
    if (jumpDuration < neededDuration / 2) {
      console.log("you jumped for too short a time");
    } else if (jumpDuration + ACCEPTABLE_DELAY > neededDuration) {
      console.log("you jumped for too long a time");
    }
  }

  /**
   * when called upon, go back to level menu with the given time
   * @param {*} delay  - after how many milliseconds we want to go back to menu
   */
  goBackToMenu(delay = DEFAULT_GAME_START_DELAY) {
    this.time.addEvent({
      delay: delay,
      callback: () => this.scene.start("LevelMenuScene"),
    });
  }

  /**
   * main update function that checks various actions that need to be checked constantly
   */
  update(time, delta) {
    // if user presses ESC button, leave scene
    if (Phaser.Input.Keyboard.JustDown(this.escButton)) {
      // if level was rolling, stop the intervals
      if (this.levelState === LEVEL_STATES.ON_MOTION) {
        this.removeBoulders();
        ScoreManager.scoreGetEvent(BUS_EVENTS.STOP); // stop the intervals
      }
      this.countInText.text = ""; // making sure there is no text overload if we're in count-in
      this.infoText.text = "Exiting"; // and informing the player of his\her choice
      this.goBackToMenu(600); // and aborting mission...
    }

    // if level is on motion, move the background image and rotate all boulders
    if (this.levelState === LEVEL_STATES.ON_MOTION) {
      this.background.tilePositionX += DEFAULT_TILE_SPEED;
      this.bouldersArray.forEach((boulder) => {
        boulder.roll();
      });
    }

    // if player has pressed space-bar while hero was touching the ground and level is played, start jump calculations and excecutions
    if (
      Phaser.Input.Keyboard.JustDown(this.spaceBar) &&
      this.myHero.onGround() &&
      this.levelState === LEVEL_STATES.ON_MOTION
    ) {
      // check if jump is valid according to game rules, and act according to the user's input
      this.jumpTimingCheck();
    }
    if (Phaser.Input.Keyboard.JustUp(this.spaceBar)) {
      this.jumpDurationCheck();
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
      // also, from level  (INVISIBLE_BOULDERS_LVL_THRESHOLD) onwards, we ask playLevel to make blocks invisible
      this.time.addEvent({
        delay: DEFAULT_GAME_START_DELAY,
        callback: () => playLevel(this, this.sheetJson[this.levelIndex]),
      });
    }
  }
}

export default GameScene;
