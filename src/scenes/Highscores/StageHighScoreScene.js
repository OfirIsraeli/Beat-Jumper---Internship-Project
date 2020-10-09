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
  }

  preload() {
    // set background
    this.background = this.add.image(0, 0, "menuBackgroundImage").setOrigin(0, 0);

    // text style
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "90px",
    };
    // set the title text
    this.add.text(this.sys.game.config.width / 2, 120, "Highscores", style).setOrigin(0.5, 0.5);
    // set the back buttons - one for main menu and one for highscore menu
    this.createBackButtons("Main Menu", "TitleScene", style, 0);
    this.createBackButtons("Back", "HighScoreMenuScene", style, 1);

    // add the first line, the head of the table
    style.fontSize = "40px";
    const firstLine = "\t\t\t\t\t\tStage " + (this.stageIndex + 1) + "\nLevel\t\t\t\t\t\t\tScore";
    this.add.text(640, 250, firstLine, style).setOrigin(0.5, 0.5);

    // add the left text of the highscore table, so just level names
    for (let levelNumber = 1; levelNumber <= NUMBER_OF_LEVELS; levelNumber++) {
      this.add.text(500, 250 + levelNumber * 60, "Level " + levelNumber, style);
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
        this.add.text(720, 330 + levelIndex * 60, 0, style).setOrigin(0.5, 0.5);
      }
    }
    // if user has highscores, add highscores of each level as a text
    else {
      for (let levelIndex = 0; levelIndex < NUMBER_OF_LEVELS; levelIndex++) {
        this.add
          .text(720, 330 + levelIndex * 60, userHighScores[this.stageIndex][levelIndex], style)
          .setOrigin(0.5, 0.5);
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
      this.scene.start(scene);
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

    this.add.text(backToMenuButton.x, backToMenuButton.y, text, style).setOrigin(0.5, 0.5); // centerize text to image
  }

  update(time, delta) {}
}

export default StageHighScoreScene;
