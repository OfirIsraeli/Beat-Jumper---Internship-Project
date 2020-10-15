// imports of all scoreJsons as levels
import level1_1 from "../sheets/levels/level1/level1-1";
import level1_2 from "../sheets/levels/level1/level1-2";
import level1_3 from "../sheets/levels/level1/level1-3";
import level1_4 from "../sheets/levels/level1/level1-4";
import level1_5 from "../sheets/levels/level1/level1-5";
import level1_6 from "../sheets/levels/level1/level1-6";

import level2_1 from "../sheets/levels/level2/level2-1";
import level2_2 from "../sheets/levels/level2/level2-2";
import level2_3 from "../sheets/levels/level2/level2-3";
import level2_4 from "../sheets/levels/level2/level2-4";
import level2_5 from "../sheets/levels/level2/level2-5";
import level2_6 from "../sheets/levels/level2/level2-6";

import level3_1 from "../sheets/levels/level3/level3-1";
import level3_2 from "../sheets/levels/level3/level3-2";
import level3_3 from "../sheets/levels/level3/level3-3";
import level3_4 from "../sheets/levels/level3/level3-4";
import level3_5 from "../sheets/levels/level3/level3-5";
import level3_6 from "../sheets/levels/level3/level3-6";

import level4_1 from "../sheets/levels/level4/level4-1";
import level4_2 from "../sheets/levels/level4/level4-2";
import level4_3 from "../sheets/levels/level4/level4-3";
import level4_4 from "../sheets/levels/level4/level4-4";
import level4_5 from "../sheets/levels/level4/level4-5";
import level4_6 from "../sheets/levels/level4/level4-6";

import level5_1 from "../sheets/levels/level5/level5-1";
import level5_2 from "../sheets/levels/level5/level5-2";
import level5_3 from "../sheets/levels/level5/level5-3";
import level5_4 from "../sheets/levels/level5/level5-4";
import level5_5 from "../sheets/levels/level5/level5-5";
import level5_6 from "../sheets/levels/level5/level5-6";

import level6_1 from "../sheets/levels/level6/level6-1";
import level6_2 from "../sheets/levels/level6/level6-2";
import level6_3 from "../sheets/levels/level6/level6-3";
import level6_4 from "../sheets/levels/level6/level6-4";
import level6_5 from "../sheets/levels/level6/level6-5";
import level6_6 from "../sheets/levels/level6/level6-6";

import { createMenuBackground } from "../lib/createMenuBackground";

const NUMBER_OF_STAGES = 6;
const NUMBER_OF_LEVELS = 6;
const NO_HP_SUBTRACTED = 0;
const INIT_CLOUD_POSITIONS = [
  { x: 250, y: 150 },
  { x: 1190, y: 690 },
  { x: 210, y: 290 },
  { x: 450, y: 450 },
  { x: 150, y: 470 },
  { x: 350, y: 600 },
  { x: 950, y: 40 },
  { x: 850, y: 600 },
  { x: 1100, y: 240 },
  { x: 1000, y: 380 },
  { x: 700, y: 460 },
];

class LevelMenuScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "LevelMenuScene",
    });
  }
  init(data) {
    if (data.cloudLocations) {
      this.cloudLocations = data.cloudLocations;
    } else {
      this.cloudLocations = INIT_CLOUD_POSITIONS;
    }
  }
  preload() {
    // set button select sound
    this.buttonSelectSound = this.sound.add("buttonSelect", { volume: gameVolume });
    // remove the score DIV element that can be left out from game scene
    let scoreDIVElement = document.getElementById("score-id");
    scoreDIVElement.style.display = "none";
    // set background
    createMenuBackground(this, this.cloudLocations);

    // title text - select a level
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "60px",
    };
    this.add
      .text(this.sys.game.config.width / 2, 60, myLanguage.selectLevel, style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2);

    // button so player can go back to main menu
    let backToMenuButton = this.add
      .sprite(100, 60, "unlockedStageImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true }); // so we can press it
    // pressing the sprite causing the next arrow function to execute:

    // when a button is pressed, go back to main menu
    backToMenuButton.on("pointerdown", () => {
      this.buttonSelectSound.play();
      this.scene.start("TitleScene", { cloudLocations: this.getCloudLocations() });
    });
    // if cursor is over the button, change the tint to green
    backToMenuButton.on("pointerover", () => {
      backToMenuButton.setTint(0x26ff00);
    });

    // remove tint after cursor leaves this button
    backToMenuButton.on("pointerout", () => {
      backToMenuButton.clearTint();
    });

    // add a new text for this button
    style.fontSize = "30px";
    this.add
      .text(backToMenuButton.x, backToMenuButton.y, myLanguage.mainMenu, style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2); // centerize text to image
  }

  create() {
    // fetch previous best scores from localStorage
    this.userHighScores = JSON.parse(localStorage.getItem("userHighScores"));
    // if user did not play before, define a new matrix (of 6 stages with 6 levels each) that contains best user score for each level.
    // with a default value of 0
    if (this.userHighScores === null) {
      this.userHighScores = [];
      // first for loop is for stages, inner for loop is for levels per stage
      for (let stageIndex = 0; stageIndex < NUMBER_OF_STAGES; stageIndex++) {
        this.userHighScores[stageIndex] = []; // define new sub-array to hold this stage's levels
        // add 6 level best scores to this stage, with default value of 0
        for (let levelIndex = 0; levelIndex < NUMBER_OF_LEVELS; levelIndex++) {
          this.userHighScores[stageIndex][levelIndex] = 0;
        }
      }
    }

    //localStorage.clear(); // here for debugging...

    // fetch the last level the user has won from localStorage
    this.LastLevelUnlocked = JSON.parse(localStorage.getItem("LastLevelUnlocked"));
    // if user did not play before, define stage and level as 0
    if (this.LastLevelUnlocked === null) {
      this.LastLevelUnlocked = { stage: 0, level: 0 };
    }

    // fetch hitpoints subracted from latest try of last level
    this.hitPointsSubtracted = JSON.parse(localStorage.getItem("hitPointsSubtracted"));
    if (this.hitPointsSubtracted === null) {
      this.hitPointsSubtracted = NO_HP_SUBTRACTED;
    }

    //define each stage as an array of levels

    // todo: load levels in a loop
    /*
    for (let stageIndex = 1; stageIndex <= NUMBER_OF_STAGES; stageIndex++) {
      this.stages[stageIndex] = []; // define new sub-array to hold this stage's levels
      // add 6 levels to this stage
      for (let levelIndex = 1; levelIndex <= NUMBER_OF_LEVELS; levelIndex++) {
        this.stages[stageIndex][levelIndex] = // WHAT DO?
      }
    }
    */

    const stageOne = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
    const stageTwo = [level2_1, level2_2, level2_3, level2_4, level2_5, level2_6];
    const stageThree = [level3_1, level3_2, level3_3, level3_4, level3_5, level3_6];
    const stageFour = [level4_1, level4_2, level4_3, level4_4, level4_5, level4_6];
    const stageFive = [level5_1, level5_2, level5_3, level5_4, level5_5, level5_6];
    const stageSix = [level6_1, level6_2, level6_3, level6_4, level6_5, level6_6];
    //define all stages as an array of stages (so it's a matrix of levels)
    this.stages = [stageOne, stageTwo, stageThree, stageFour, stageFive, stageSix];
    // define an array that will contain the following:
    // each index is a stage number, and each item is an array containing all of the levels of that stage
    //and if the have been unlocked or not (locked by default expect for the levels localStorage have that user has passed)
    this.levelButtons = [];
    // an array that hold the image objects of each stage
    this.stageImages = [];

    // create the level-menu matrix that directs each new level button to its' stage and level.
    // first for loop is for stages, inner for loop is for levels per stage
    for (let stageIndex = 0; stageIndex < NUMBER_OF_STAGES; stageIndex++) {
      this.createNewStageImage(stageIndex); // add a new image & text for this stage
      this.levelButtons[stageIndex] = []; // define new sub-array to hold this stage's levels
      // add 6 level buttons to this stage, with default locked image
      for (let levelIndex = 0; levelIndex < NUMBER_OF_LEVELS; levelIndex++) {
        this.createNewLevelButton(stageIndex, levelIndex);
      }
    }

    // unlock needed levels according to localStorage
    for (let stageIndex = 0; stageIndex <= this.LastLevelUnlocked.stage; stageIndex++) {
      // for each stage iteration we unlock the image object of that stage
      this.stageImages[stageIndex].setTexture("unlockedStageImage");
      // if we're in the last iteration
      if (stageIndex === this.LastLevelUnlocked.stage) {
        // unlock only levels up to the last level won by user of his last stage
        for (let levelIndex = 0; levelIndex <= this.LastLevelUnlocked.level; levelIndex++) {
          // if we're in the final iteration, put on the last unlocked level image
          if (levelIndex === this.LastLevelUnlocked.level) {
            // todo: change to last unlocked level image
            this.levelButtons[stageIndex][levelIndex].button.setTexture("unlockedLevelImage");
            this.levelButtons[stageIndex][levelIndex].locked = false;
            break;
          }
          // change image to unlocked
          this.levelButtons[stageIndex][levelIndex].button.setTexture("unlockedLevelImage");
          // change level to unlocked
          this.levelButtons[stageIndex][levelIndex].locked = false;
        }
      }
      // else, user has unlocked all levels of current stage iteration, so unlock all of its' levels
      else {
        for (let levelIndex = 0; levelIndex < NUMBER_OF_LEVELS; levelIndex++) {
          // change image to unlocked
          this.levelButtons[stageIndex][levelIndex].button.setTexture("unlockedLevelImage");
          // change level to unlocked
          this.levelButtons[stageIndex][levelIndex].locked = false;
        }
      }
    }
  }

  /**
   * this function creates a new image for a stage
   * @param {*} stageIndex - the number of stage
   */
  createNewStageImage(stageIndex) {
    // add a new image of a locked stage to the scene
    let newStageImage = this.add.sprite(330, 150 + stageIndex * 90, "lockedStageImage");

    // add a new text with the needed stage number in the same location
    const text = myLanguage.stage + " " + (stageIndex + 1);
    this.add
      .text(newStageImage.x, newStageImage.y, text, {
        fontFamily: "Chewy",
        fill: "#ffffff",
        fontSize: "30px",
      })
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2); // centerize text to image
    this.stageImages[stageIndex] = newStageImage; // add the image object to our array
  }

  /**
   * when a locked level is pressed, we shake the button sprite
   * @param {*} button - a Phaser sprite we want to apply the tween on
   */
  applyShakingTween(button) {
    const tween = this.tweens.add({
      targets: button,
      x: button.x + (-Math.random() * 2 + 1) * 5,
      y: button.y,
      ease: "Power1",
      duration: 50,
      yoyo: true,
      loop: 5,
    });
  }

  /**
   * creating a new button for a specific level, defining all of its' utillities
   * @param {*} stageIndex - number of stage
   * @param {*} levelIndex - number of level
   */
  createNewLevelButton(stageIndex, levelIndex) {
    // add a new sprite of a locked level to the scene.
    let newButton = this.add
      .sprite(500 + levelIndex * 90, 150 + stageIndex * 90, "lockedLevelImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true }); // so we can press it
    // pressing the sprite causing the next arrow function to execute:

    newButton.on("pointerdown", () => {
      this.buttonSelectSound.play();
      // when a unlocked level is pressed, start GameScene with current stage and level
      if (!this.levelButtons[stageIndex][levelIndex].locked) {
        this.scene.start("GameScene", {
          stageJson: this.stages[stageIndex],
          stage: stageIndex,
          level: levelIndex,
          userHighScores: this.userHighScores,
          lastLevelUnlocked: this.LastLevelUnlocked,
          hitPointsSubtracted: this.hitPointsSubtracted,
        });
      }
      // when a locked level is pressed, we shake the button sprite
      else {
        this.applyShakingTween(this.levelButtons[stageIndex][levelIndex].button);
      }
    });

    // if cursor is over the button, change the tint accordingly. red if level is locked, green otherwise
    newButton.on("pointerover", () => {
      if (this.levelButtons[stageIndex][levelIndex].locked) {
        newButton.setTint(0xff0000);
      } else {
        newButton.setTint(0x26ff00);
      }
    });

    // remove tint after cursor leaves this button
    newButton.on("pointerout", () => {
      newButton.clearTint();
    });

    // add a new text with the needed level number in the same location
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      wordWrap: true,
      wordWrapWidth: newButton.width,
      align: "center",
      fontSize: "30px",
    };
    this.add
      .text(newButton.x, newButton.y, levelIndex + 1, style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2); // centerize text to image

    // add this button and its' locked state (true by default) to the level buttons array
    this.levelButtons[stageIndex][levelIndex] = { button: newButton, locked: true };
  }

  update(time, delta) {}
}

export default LevelMenuScene;
