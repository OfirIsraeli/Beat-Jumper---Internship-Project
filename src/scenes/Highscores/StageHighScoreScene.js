import { createMenuBackground } from "../../lib/createMenuBackground";

const NUMBER_OF_LEVELS = 6;
/**
 * scene that presents the highscore of a given stage
 */
class StageHighScoreScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "StageHighScoreScene",
    });
  }
  init(data) {
    this.stageIndex = data.stage;
    this.cloudLocations = data.cloudLocations;
  }

  preload() {
    // set button select sound
    this.buttonSelectSound = this.sound.add("buttonSelect", { volume: gameVolume });
    // set background
    createMenuBackground(this, this.cloudLocations);

    // text style
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "90px",
    };
    // set the title text
    this.add
      .text(this.sys.game.config.width / 2, 120, myLanguage.highscores, style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2);
    // set the back buttons - one for main menu and one for highscore menu
    this.createBackButtons(myLanguage.mainMenu, "TitleScene", style, 0);
    this.createBackButtons(myLanguage.back, "HighScoreMenuScene", style, 1);

    // add the first line, the head of the table
    style.fontSize = "40px";
    this.add
      .text(635, 230, myLanguage.stage + " " + (this.stageIndex + 1), style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2);
    this.add
      .text(550, 280, myLanguage.level, style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2);
    this.add
      .text(720, 280, myLanguage.score, style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2);
    // add the left text of the highscore table, so just level names
    for (let levelNumber = 1; levelNumber <= NUMBER_OF_LEVELS; levelNumber++) {
      this.add
        .text(500, 250 + levelNumber * 60, myLanguage.level + " " + levelNumber, style)
        .setShadow(0, 0, "rgba(0,0,0,1)", 2);
    }
  }

  create() {
    // text style
    const style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "40px",
    };
    //let lastLevelUnlocked = JSON.parse(localStorage.getItem("LastLevelUnlocked")); // for future use
    let userHighScores = JSON.parse(localStorage.getItem("userHighScores"));

    // if user has no highscores yet, plant a text of 0 as the current highscore
    if (userHighScores === null) {
      console.log("no highscores yet!");
      for (let levelIndex = 0; levelIndex < NUMBER_OF_LEVELS; levelIndex++) {
        this.add
          .text(720, 330 + levelIndex * 60, 0, style)
          .setOrigin(0.5, 0.5)
          .setShadow(0, 0, "rgba(0,0,0,1)", 2);
      }
    }
    // if user has highscores, add highscores of each level as a text
    else {
      for (let levelIndex = 0; levelIndex < NUMBER_OF_LEVELS; levelIndex++) {
        this.add
          .text(720, 330 + levelIndex * 60, userHighScores[this.stageIndex][levelIndex], style)
          .setOrigin(0.5, 0.5)
          .setShadow(0, 0, "rgba(0,0,0,1)", 2);
      }
    }
  }

  /**
   * this function creates button to go back into other scenes. in this case, it can be either main menu or highscore menu
   * @param {*} text - text that will be diplayed on the button
   * @param {*} scene - the scene we wish this button would direct to
   * @param {*} style - style of the text
   * @param {*} buttonIndex - the index of the button, so we will know where to place it in relation to other buttons
   */
  createBackButtons(text, scene, style, buttonIndex) {
    // button so player can go back to menu
    let backToMenuButton = this.add
      .sprite(100, 60 + buttonIndex * 100, "unlockedStageImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true }); // so we can press it
    // pressing the sprite causing the next arrow function to execute:

    // when a button is pressed, go back to main menu
    backToMenuButton.on("pointerdown", () => {
      this.buttonSelectSound.play();
      this.scene.start(scene, { cloudLocations: this.getCloudLocations() });
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
      .text(backToMenuButton.x, backToMenuButton.y, text, style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2); // centerize text to image
  }

  update(time, delta) {}
}

export default StageHighScoreScene;
