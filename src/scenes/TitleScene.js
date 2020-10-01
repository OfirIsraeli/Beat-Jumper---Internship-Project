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

class TitleScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "TitleScene",
    });
  }
  preload() {
    // set background
    this.background = this.add
      .tileSprite(0, 0, this.width, this.height, "menuBackgroundImage")
      .setOrigin(0, 0);
  }
  create() {
    //define each stage as an array of levels
    const stageOne = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
    const stageTwo = [scoreJson, scoreJson, scoreJson, scoreJson, scoreJson, scoreJson];
    const stageThree = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
    const stageFour = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
    const stageFive = [scoreJson, scoreJson, scoreJson, scoreJson, scoreJson, scoreJson];
    const stageSix = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
    //define all stages as an array of stages (meaning it's a matrix of levels)
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

    //localStorage.clear(); // here for debugging
    // fetch the last level the user has won from localStorage
    this.LastLevelWon = JSON.parse(localStorage.getItem("LastLevelWon"));
    // if user did not play before, define stage and level as 0
    if (this.LastLevelWon === null) {
      this.LastLevelWon = { stage: 0, level: 0 };
    }
    // unlock needed levels according to localStorage
    for (let stageIndex = 0; stageIndex <= this.LastLevelWon.stage; stageIndex++) {
      // for each stage iteration we unlock the image object of that stage
      this.stageImages[stageIndex].setTexture("unlockedStageImage");
      // if we're in the last iteration
      if (stageIndex === this.LastLevelWon.stage) {
        // unlock only levels up to the last level won by user of his last stage
        for (let levelIndex = 0; levelIndex <= this.LastLevelWon.level; levelIndex++) {
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
    let newStageImage = this.add.image(330, 150 + stageIndex * 90, "lockedStageImage");
    const text = "Stage " + (stageIndex + 1);

    // add a new text with the needed stage number in the same location
    this.add
      .text(newStageImage.x, newStageImage.y, text, {
        fill: "#ffffff",
        wordWrap: true,
        wordWrapWidth: newStageImage.width,
        align: "center",
        fontSize: "30px",
      })
      .setOrigin(0.5, 0.5); // centerize text to image
    this.stageImages[stageIndex] = newStageImage; // add the image object to our array
  }
  createNewLevelButton(stageIndex, levelIndex) {
    // add a new sprite of a locked level to the scene.
    let newButton = this.add
      .sprite(500 + levelIndex * 90, 150 + stageIndex * 90, "lockedLevelImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true }); // so we can press it
    // pressing the sprite causing the next arrow function to execute:

    newButton.on("pointerdown", () => {
      // when pressed, start GameScene with current stage and level, only if that level is unlocked
      if (!this.levelButtons[stageIndex][levelIndex].locked) {
        this.scene.start("GameScene", {
          stageJson: this.stages[stageIndex],
          stage: stageIndex,
          level: levelIndex,
        });
      }
    });

    // add a new text with the needed level number in the same location
    let style = {
      fill: "#ffffff",
      wordWrap: true,
      wordWrapWidth: newButton.width,
      align: "center",
      fontSize: "30px",
    };
    let buttonText = this.add
      .text(newButton.x, newButton.y, levelIndex + 1, style)
      .setOrigin(0.5, 0.5); // centerize text to image

    // todo: change cursor over sprites
    /*
  newButton.on("pointerover", () => {
    console.log("hia");
  });*/
    // add the button sprite to our array
    this.levelButtons[stageIndex][levelIndex] = { button: newButton, locked: true };
  }

  update(time, delta) {}
}

export default TitleScene;
