class TutorialScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "TutorialScene",
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
    this.add.text(this.sys.game.config.width / 2, 120, "Tutorial", style).setOrigin(0.5, 0.5);

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
    };
    // two options for tutorial text:
    // first, short and simple:
    const basicTutorialText =
      "Press space to jump when a note should be played (according to the sheet music)\nBy jumping in time, you will successfully jump over the boulders that are coming your way";
    // second, long and detailed:
    const detailedTutorialText =
      "In each level, the user will be playing the main character. When a level is started, the character will run, while boulders of different\n" +
      "sizes will roll towards him. The general aim is to jump (by pressing space) above those boulders,\n" +
      "according to the notes diplayed in the sheet music above (there is a metronome beat so user will know when each measure takes place).\n" +
      "Each boulder will reach the character just in the time it's corresponding note in the sheet music will occur in it's measure.\n" +
      "Generally speaking, user will jump successfully above all of the boulders if he presses space in the exact same time he should according to the sheet music.\n" +
      "In each level, the user gets points for each jump, based on how precise his jump was (relative to the note in the sheet music he meant to jump for).\n" +
      "After completing a level (when we finish executing the sheet music displayed), he will get a score representing his points in that level (based on all of the jumps).\n" +
      "If the user will miss a jump, not jump in time (meaning he did not execute the rhythmic pattern precisely enough) or jump when he was not supposed\n" +
      "to (jump in a rest note for example), he will fail the level, and will have to try again. If player has lost a level 3 times during one stage,\n" +
      "he will have to redo the whole stage, until he can complete that stage with failing less than 3 times.";

    this.add.text(640, 300, basicTutorialText, style).setOrigin(0.5, 0.5);
  }

  update(time, delta) {}
}

export default TutorialScene;