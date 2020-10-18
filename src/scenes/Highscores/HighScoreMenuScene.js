import { createMenuBackground } from "../../lib/createMenuBackground";

/**
 * a scene for the highscore menu. directs into each stages' different highscores
 */
class HighScoreMenuScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "HighScoreMenuScene",
    });
  }
  init(data) {
    this.cloudLocations = data.cloudLocations;
  }
  preload() {
    // set button select sound
    this.buttonSelectSound = this.sound.add("buttonSelect", { volume: gameVolume });
    // set background
    createMenuBackground(this, this.cloudLocations);

    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "90px",
    };
    this.add
      .text(this.sys.game.config.width / 2, 120, myLanguage.highscores, style)
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
    for (let stageNumber = 1; stageNumber <= 6; stageNumber++) {
      this.createNewMenuButton(
        myLanguage.stage + " " + stageNumber,
        "StageHighScoreScene",
        stageNumber - 1
      );
    }
  }

  /**
   * this function creates a button that directs into a different scene.
   * @param {*} buttonText - text that will be diplayed on the button
   * @param {*} sceneName - the scene we wish this button would direct to
   * @param {*} buttonNumber - the index of the button, so we will know where to place it in relation to other buttons
   */
  createNewMenuButton(buttonText, sceneName, buttonNumber) {
    // add a new sprite of a locked level to the scene.
    let newButton = this.add
      .sprite(this.sys.game.config.width / 2, 250 + buttonNumber * 80, "unlockedStageImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true }); // so we can press it
    // pressing the sprite causing the next arrow function to execute:

    // when a unlocked level is pressed, start GameScene with current stage and level
    newButton.on("pointerdown", () => {
      this.buttonSelectSound.play();
      this.scene.start(sceneName, {
        stage: buttonNumber,
        cloudLocations: this.getCloudLocations(),
      });
    });
    // if cursor is over the button, change the tint accordingly.
    newButton.on("pointerover", () => {
      newButton.setTint(0x26ff00);
    });

    // remove tint after cursor leaves this button
    newButton.on("pointerout", () => {
      newButton.clearTint();
    });

    // add a new text with the needed level number in the same location
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "30px",
    };
    this.add
      .text(newButton.x, newButton.y, buttonText, style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2); // centerize text to image
  }

  update(time, delta) {}
}

export default HighScoreMenuScene;
