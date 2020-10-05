class CreditsScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "CreditsScene",
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

    // set style for texts in scene
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "90px",
    };

    // set title text
    this.add.text(this.sys.game.config.width / 2, 120, "Credits", style).setOrigin(0.5, 0.5);

    // set button so player can go back to main menu
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
    this.add.text(backToMenuButton.x, backToMenuButton.y, "Main Menu", style).setOrigin(0.5, 0.5); // centerize text to image
  }

  create() {
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "30px",
      align: "center",
    };

    const creditsText =
      "Beat-Jumper is a rhythm based online game,\n based on Phaser 3 Game Framework open-source.\n It was developed by Ofir Israeli,\n " +
      "as part of BandPad.co company (being an intern in the company),\nusing several of BandPad's utillities, and particularly\nBandPad Vexflow and " +
      "BandPad ScoreManager,\n in an enviroment of JavaScript ES6 along with Node.js and Webpack.";

    this.add.text(680, 400, creditsText, style).setOrigin(0.5, 0.5);
  }

  update(time, delta) {}
}

export default CreditsScene;
