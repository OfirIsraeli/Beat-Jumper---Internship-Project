// imports of all scoreJsons as levels
import scoreJson from "../sheets/beat";
import scoreJson2 from "../sheets/sixh-test";
import level1_1 from "../sheets/levels/level1-1";
import level1_2 from "../sheets/levels/level1-2";
import level1_3 from "../sheets/levels/level1-3";
import level1_4 from "../sheets/levels/level1-4";
import level1_5 from "../sheets/levels/level1-5";
import level1_6 from "../sheets/levels/level1-6";

const NUMBER_OF_STAGES = 6;
const NUMBER_OF_LEVELS = 6;
const NO_HP_SUBTRACTED = 0;

class LevelMenuScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "LevelMenuScene",
    });
  }
  preload() {
    // remove the score DIV element that can be left out from game scene
    let scoreDIVElement = document.getElementById("score-id");
    scoreDIVElement.style.display = "none";
    // set background
    this.background = this.add
      .tileSprite(0, 0, this.width, this.height, "menuBackgroundImage")
      .setOrigin(0, 0);

    // title text - select a level
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "60px",
    };
    this.add.text(this.sys.game.config.width / 2, 60, "Select a Level", style).setOrigin(0.5, 0.5);

    // button so player can go back to main menu
    let backToMenuButton = this.add
      .sprite(100, 60, "unlockedStageImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true }); // so we can press it
    // pressing the sprite causing the next arrow function to execute:

    backToMenuButton.on("pointerdown", () => {
      // when a button is pressed, go back to main menu
      this.scene.start("TitleScene");
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
    style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      wordWrap: true,
      wordWrapWidth: backToMenuButton.width,
      align: "center",
      fontSize: "30px",
    };
    let buttonText = this.add
      .text(backToMenuButton.x, backToMenuButton.y, "Main Menu", style)
      .setOrigin(0.5, 0.5); // centerize text to image
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
    const stageOne = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
    const stageTwo = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
    const stageThree = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
    const stageFour = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
    const stageFive = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
    const stageSix = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
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

  createNewStageImage(stageIndex) {
    // add a new image of a locked stage to the scene
    let newStageImage = this.add.sprite(330, 150 + stageIndex * 90, "lockedStageImage");

    // add a new text with the needed stage number in the same location
    const text = "Stage " + (stageIndex + 1);
    this.add
      .text(newStageImage.x, newStageImage.y, text, {
        fontFamily: "Chewy",
        fill: "#ffffff",
        wordWrap: true,
        wordWrapWidth: newStageImage.width,
        align: "center",
        fontSize: "30px",
      })
      .setOrigin(0.5, 0.5); // centerize text to image
    this.stageImages[stageIndex] = newStageImage; // add the image object to our array
  }

  // when a locked level is pressed, we shake the button sprite
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

  // creating a new button for a specific level, defining all of its' utillities
  createNewLevelButton(stageIndex, levelIndex) {
    // add a new sprite of a locked level to the scene.
    let newButton = this.add
      .sprite(500 + levelIndex * 90, 150 + stageIndex * 90, "lockedLevelImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true }); // so we can press it
    // pressing the sprite causing the next arrow function to execute:

    newButton.on("pointerdown", () => {
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
    let buttonText = this.add
      .text(newButton.x, newButton.y, levelIndex + 1, style)
      .setOrigin(0.5, 0.5); // centerize text to image

    // add this button and its' locked state (true by default) to the level buttons array
    this.levelButtons[stageIndex][levelIndex] = { button: newButton, locked: true };
  }

  update(time, delta) {}
}

export default LevelMenuScene;
