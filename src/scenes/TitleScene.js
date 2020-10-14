const DEFAULT_GAME_TEMPO = 70;
const DEFAULT_GAME_VOLUME = 1.0;
/**
 * scene for main menu
 */
class TitleScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "TitleScene",
    });
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
    // set background
    this.background = this.add.image(0, 0, "menuBackgroundImage").setOrigin(0, 0);

    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "90px",
    };
    let TitleText = this.add
      .text(this.sys.game.config.width / 2, 100, "Beat Jumper", style)
      .setOrigin(0.5, 0.5);
  }
  create() {
    // fetch tempo for game. if no tempo is set yet, set default of 70
    let gameTempo = JSON.parse(localStorage.getItem("GameTempo"));
    if (gameTempo === null) {
      gameTempo = DEFAULT_GAME_TEMPO;
      localStorage.setItem("GameTempo", JSON.stringify(gameTempo));
    }

    // create menu buttons:
    this.createNewMenuButton("Play", "LevelMenuScene", 0);
    // todo: create scenes for each of these:
    this.createNewMenuButton("Tutorial", "TutorialScene", 1);
    this.createNewMenuButton("Options", "OptionsScene", 2);
    this.createNewMenuButton("Highscores", "HighScoreMenuScene", 3);
    this.createNewMenuButton("Credits", "CreditsScene", 4);
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
      this.scene.start(sceneName);
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
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "30px",
    };
    this.add.text(newButton.x, newButton.y, buttonText, style).setOrigin(0.5, 0.5); // centerize text to image
  }

  update(time, delta) {}
}

export default TitleScene;
