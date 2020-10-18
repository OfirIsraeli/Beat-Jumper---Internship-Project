// ------------------ IMPORTS ---------------- //

import { createMenuBackground } from "../lib/createMenuBackground";

// ------------------ CONSTANTS ---------------- //

const DEFAULT_GAME_TEMPO = 70;

const DEFAULT_GAME_VOLUME = 1.0;

// default cloud positions, before they start moving around
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

/**
 * scene for main menu
 */
class TitleScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "TitleScene",
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
    // fetch volume for game. if no volume is set yet, set default of 100%
    window.gameVolume = JSON.parse(localStorage.getItem("gameVolume"));
    if (gameVolume === null) {
      gameVolume = DEFAULT_GAME_VOLUME;
      localStorage.setItem("gameVolume", JSON.stringify(gameVolume));
    }

    // set button select sound
    this.buttonSelectSound = this.sound.add("buttonSelect", { volume: gameVolume });

    // set menu background
    createMenuBackground(this, this.cloudLocations);

    // set needed text CSS - Phaser style
    const style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "90px",
    };
    // add title text
    this.add
      .text(this.sys.game.config.width / 2, 100, myLanguage.beatJumper, style)
      .setOrigin(0.5, 0.5)
      .setShadow(3, 3, "rgba(0,0,0,1)", 2);
  }
  create() {
    // fetch tempo for game. if no tempo is set yet, set default of 70
    let gameTempo = JSON.parse(localStorage.getItem("GameTempo"));
    if (gameTempo === null) {
      gameTempo = DEFAULT_GAME_TEMPO;
      localStorage.setItem("GameTempo", JSON.stringify(gameTempo));
    }

    // create menu buttons that directs into all of the sub-menu scenes:
    this.createNewMenuButton(myLanguage.play, "LevelMenuScene", 0);
    this.createNewMenuButton(myLanguage.tutorial, "TutorialScene", 1);
    this.createNewMenuButton(myLanguage.options, "OptionsScene", 2);
    this.createNewMenuButton(myLanguage.highscores, "HighScoreMenuScene", 3);
    this.createNewMenuButton(myLanguage.credits, "CreditsScene", 4);
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
      .sprite(this.sys.game.config.width / 2, 220 + buttonNumber * 120, "unlockedStageImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true }); // so we can press it
    // pressing the sprite causing the next arrow function to execute:

    newButton.on("pointerdown", () => {
      // when a unlocked level is pressed, start GameScene with current stage and level
      this.buttonSelectSound.play();
      this.scene.start(sceneName, { cloudLocations: this.getCloudLocations() });
    });
    // if cursor is over the button, change the tint accordingly. red if level is locked, green otherwise
    newButton.on("pointerover", () => {
      newButton.setTint(0x26ff00);
    });

    // remove tint after cursor leaves this button
    newButton.on("pointerout", () => {
      newButton.clearTint();
    });

    // add a new text with the needed level number in the same location
    const style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "30px",
    };
    this.add
      .text(newButton.x, newButton.y, buttonText, style)
      .setOrigin(0.5, 0.5)
      .setShadow(0, 0, "rgba(0,0,0,1)", 1);
  }

  update(time, delta) {}
}

export default TitleScene;
