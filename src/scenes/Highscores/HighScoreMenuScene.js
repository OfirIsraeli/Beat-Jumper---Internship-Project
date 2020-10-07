/**
 * a scene for the highscore menu. directs into each stages' different highscores
 */
class HighScoreMenuScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "HighScoreMenuScene",
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

    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "90px",
    };
    let TitleText = this.add
      .text(this.sys.game.config.width / 2, 120, "Highscores", style)
      .setOrigin(0.5, 0.5);

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
    for (let i = 1; i <= 6; i++) {
      this.createNewMenuButton("Stage " + i, "StageHighScoreScene", i - 1);
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

    newButton.on("pointerdown", () => {
      // when a unlocked level is pressed, start GameScene with current stage and level
      this.scene.start(sceneName, { stage: buttonNumber });
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
      wordWrap: true,
      wordWrapWidth: newButton.width,
      align: "center",
      fontSize: "30px",
    };
    this.add.text(newButton.x, newButton.y, buttonText, style).setOrigin(0.5, 0.5); // centerize text to image
  }

  update(time, delta) {}
}

export default HighScoreMenuScene;
