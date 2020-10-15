import { createMenuBackground } from "../lib/createMenuBackground";

/**
 * scene to display game credits
 */
class CreditsScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "CreditsScene",
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

    // set style for texts in scene
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "90px",
    };

    // set title text
    this.add
      .text(this.sys.game.config.width / 2, 120, myLanguage.credits, style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2);

    // set button so player can go back to main menu
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
    style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "30px",
    };
    this.add
      .text(backToMenuButton.x, backToMenuButton.y, myLanguage.mainMenu, style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2); // centerize text to image
  }

  create() {
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "30px",
    };

    const creditsText =
      "Beat-Jumper is an online rhythm based game,\n based on Phaser 3 Game Framework open-source.\n It was developed by Ofir Israeli,\n " +
      "as an intern in BandPad.co company.\nIt was developed using several of BandPad's \nutillities, and particularly BandPad Vexflow and " +
      "\nBandPad ScoreManager, in an enviroment of \nJavaScript ES6 along with Node.js and Webpack.\nOfir's Email: ofirisr40@gmail.com";

    this.add
      .text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, creditsText, style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 2);
  }

  update(time, delta) {}
}

export default CreditsScene;
