const DEFAULT_GAME_TEMPO = 70;

/**
 * scene to display game options
 */
class OptionsScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "OptionsScene",
    });
  }
  preload() {
    // set button select sound
    this.buttonSelectSound = this.sound.add("buttonSelect", { volume: gameVolume });
    // set background
    this.background = this.add.image(0, 0, "menuBackgroundImage").setOrigin(0, 0);

    // set style for texts in scene
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "90px",
    };

    // set title text
    this.add.text(this.sys.game.config.width / 2, 80, "Options", style).setOrigin(0.5, 0.5);

    // set button so player can go back to main menu
    let backToMenuButton = this.add
      .sprite(100, 80, "unlockedStageImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true });

    // pressing the sprite causing the next arrow function to execute:
    backToMenuButton.on("pointerdown", () => {
      // when button is pressed, go back to main menu
      this.buttonSelectSound.play();
      this.scene.start("TitleScene");
    });
    // set tints for hovering the button
    this.createTintButtonHover(backToMenuButton);

    // add a new text for this button
    style.fontSize = "30px";
    this.add.text(backToMenuButton.x, backToMenuButton.y, "Main Menu", style).setOrigin(0.5, 0.5); // centerize text to image
  }

  create() {
    // set text style
    let style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "45px",
      align: "center",
    };

    /**
     * set tempo options
     */
    // fetch tempo from localStorage
    let gameTempo = JSON.parse(localStorage.getItem("GameTempo"));
    let tempoText = this.add.text(440, 200, "Tempo: " + gameTempo, style).setOrigin(0.5, 0.5);
    style.fontSize = "30px";
    // set faster tempo button
    let fasterTempoButton = this.add
      .sprite(820, 200, "unlockedStageImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true })
      .setOrigin(0.5, 0.5);
    // pressing the sprite causing the next arrow function to execute:
    // when a button is pressed, make tempo faster by 5 BPM. Save it in our text and in localStorage
    fasterTempoButton.on("pointerdown", () => {
      this.buttonSelectSound.play();
      if (gameTempo < 80) {
        gameTempo += 5;
        tempoText.text = "Tempo: " + gameTempo;
        localStorage.setItem("GameTempo", JSON.stringify(gameTempo));
      } else {
        this.applyShakingTween(fasterTempoButton);
      }
    });
    // set tints for hovering the button
    this.createTintButtonHover(fasterTempoButton);
    // add a new text for this button
    this.add.text(fasterTempoButton.x, fasterTempoButton.y, "Faster", style).setOrigin(0.5, 0.5);

    // set slower tempo button
    let slowerTempoButton = this.add
      .sprite(660, 200, "unlockedStageImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true })
      .setOrigin(0.5, 0.5);
    // pressing the sprite causing the next arrow function to execute:
    // when a button is pressed, make tempo slower by 5 BPM. Save it in our text and in localStorage
    slowerTempoButton.on("pointerdown", () => {
      this.buttonSelectSound.play();
      if (gameTempo > 60) {
        gameTempo -= 5;
        tempoText.text = "Tempo: " + gameTempo;
        localStorage.setItem("GameTempo", JSON.stringify(gameTempo));
      } else {
        this.applyShakingTween(slowerTempoButton);
      }
    });
    // set tints for hovering the button
    this.createTintButtonHover(slowerTempoButton);
    // add a new text for this button
    this.add.text(slowerTempoButton.x, slowerTempoButton.y, "Slower", style).setOrigin(0.5, 0.5);

    //------------------------------------------
    /**
     * set volume options
     */
    style.fontSize = "45px";
    // fetch Volume from localStorage
    let volumeText = this.add
      .text(440, 400, "Volume: " + gameVolume * 100 + "%", style)
      .setOrigin(0.5, 0.5);
    // set faster Volume button
    let higherVolButton = this.add
      .sprite(720, 400, "unlockedLevelImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true })
      .setOrigin(0.5, 0.5);
    // pressing the sprite causing the next arrow function to execute:
    // when a button is pressed, make Volume faster by 10% Save it in our text and in localStorage
    higherVolButton.on("pointerdown", () => {
      this.buttonSelectSound.play();
      if (gameVolume < 1.0) {
        gameVolume = parseFloat((gameVolume + 0.1).toFixed(2));
        volumeText.text = "Volume: " + gameVolume * 100 + "%";
        localStorage.setItem("gameVolume", JSON.stringify(parseFloat(gameVolume)));
      } else {
        this.applyShakingTween(higherVolButton);
      }
    });
    // set tints for hovering the button
    this.createTintButtonHover(higherVolButton);
    // add a new text for this button
    this.add.text(higherVolButton.x, higherVolButton.y, "+", style).setOrigin(0.5, 0.65);

    // set slower Volume button
    let lowerVolButton = this.add
      .sprite(640, 400, "unlockedLevelImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true })
      .setOrigin(0.5, 0.5);
    // pressing the sprite causing the next arrow function to execute:
    // when a button is pressed, make Volume slower by 5 BPM. Save it in our text and in localStorage
    lowerVolButton.on("pointerdown", () => {
      this.buttonSelectSound.play();
      if (gameVolume > 0) {
        gameVolume = parseFloat((gameVolume - 0.1).toFixed(2));
        volumeText.text = "Volume: " + gameVolume * 100 + "%";
        localStorage.setItem("gameVolume", JSON.stringify(parseFloat(gameVolume)));
      } else {
        this.applyShakingTween(lowerVolButton);
      }
    });
    // set tints for hovering the button
    this.createTintButtonHover(lowerVolButton);
    // add a new text for this button
    this.add.text(lowerVolButton.x, lowerVolButton.y, "-", style).setOrigin(0.5, 0.65);
    //---------------------------------------------------------------------------------------

    /**
     * set reset options
     */
    // set the reset button
    style.fontSize = "30px";

    let resetDataButton = this.add
      .sprite(640, 640, "unlockedStageImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true })
      .setOrigin(0.5, 0.5);
    // pressing the sprite causing the next arrow function to execute:
    resetDataButton.on("pointerdown", () => {
      // set up the "Are you sure" buttons
      this.buttonSelectSound.play();
      this.setYesNoButtons(resetDataButton, ResetDataText);
    });
    // set tints for hovering the button
    this.createTintButtonHover(resetDataButton);

    // add a new text for this button
    let ResetDataText = this.add
      .text(resetDataButton.x, resetDataButton.y, "Reset Game", style)
      .setOrigin(0.5, 0.5);

    // set upper text for reset option
    style.fontSize = "45px";
    this.upperResetText = this.add
      .text(resetDataButton.x, resetDataButton.y - 70, "Reset the game", style)
      .setOrigin(0.5, 0.5);
  }

  setYesNoButtons(resetDataButton, ResetDataText) {
    // define text style
    const style = {
      fontFamily: "Chewy",
      fill: "#ffffff",
      fontSize: "30px",
    };
    // change the upper text to ask user if he is sure he wants to reset game
    this.upperResetText.y -= 30;
    this.upperResetText.text =
      "Are you sure?\nPressing yes will delete your progress and highscores";
    // destory the previous button
    resetDataButton.destroy();
    ResetDataText = "";

    // set the yes button
    let yesButton = this.add
      .sprite(resetDataButton.x, resetDataButton.y, "unlockedStageImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true })
      .setOrigin(1, 0.5);
    // pressing the sprite causing the next arrow function to execute:
    yesButton.on("pointerdown", () => {
      // restart storage with the default game tempo
      this.buttonSelectSound.play();

      localStorage.clear();
      localStorage.setItem("GameTempo", JSON.stringify(DEFAULT_GAME_TEMPO));
      // and restart the scene
      this.scene.restart();
    });
    // set tints for hovering the button
    this.createTintButtonHover(yesButton);
    // set text for yes button
    this.add.text(yesButton.x - 80, yesButton.y, "Yes", style).setOrigin(0.5, 0.5); // centerize text to image

    // set the no button
    let noButton = this.add
      .sprite(resetDataButton.x, resetDataButton.y, "unlockedStageImage")
      .setInteractive({ cursor: "pointer", useHandCursor: true })
      .setOrigin(0, 0.5);
    // pressing the sprite causing the next arrow function to execute:
    noButton.on("pointerdown", () => {
      // if pressed no, restart the scene.
      this.buttonSelectSound.play();
      this.scene.restart();
    });

    // set tints for hovering the button
    this.createTintButtonHover(noButton);
    // set text for no button
    this.add.text(noButton.x + 80, noButton.y, "No", style).setOrigin(0.5, 0.5); // centerize text to image
  }

  /**
   * sets up the tint funcionallity for a given button
   * @param {*} button - a button (Phaser sprite)
   */
  createTintButtonHover(button) {
    // if cursor is over the button, change the tint to green
    button.on("pointerover", () => {
      button.setTint(0x26ff00);
    });

    // remove tint after cursor leaves this button
    button.on("pointerout", () => {
      button.clearTint();
    });
  }

  /**
   * when a locked level is pressed, we shake the button sprite
   * @param {*} button - a Phaser sprite we want to apply the tween on
   */
  applyShakingTween(button) {
    this.tweens.add({
      targets: button,
      x: button.x + (-Math.random() * 2 + 1) * 5,
      y: button.y,
      ease: "Power1",
      duration: 50,
      yoyo: true,
      loop: 5,
    });
  }

  update(time, delta) {}
}

export default OptionsScene;