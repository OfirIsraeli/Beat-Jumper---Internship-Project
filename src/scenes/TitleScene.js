// imports of all scoreJsons as levels
import scoreJson from "../sheets/beat";
import scoreJson2 from "../sheets/sixh-test";
import level1_1 from "../sheets/levels/level1-1";
import level1_2 from "../sheets/levels/level1-2";
import level1_3 from "../sheets/levels/level1-3";
import level1_4 from "../sheets/levels/level1-4";
import level1_5 from "../sheets/levels/level1-5";
import level1_6 from "../sheets/levels/level1-6";

class TitleScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "TitleScene",
    });
  }
  preload() {
    // set background
    this.background = this.add
      .tileSprite(0, 0, this.width, this.height, "backgroundImage")
      .setOrigin(0, 0);
  }
  create() {
    //define each phase as an array of levels
    const PhaseOne = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6];
    const PhaseTwo = [scoreJson, scoreJson, scoreJson, scoreJson, scoreJson, scoreJson];
    const PhaseThree = [scoreJson2, scoreJson2, scoreJson2, scoreJson2, scoreJson2, scoreJson2];
    //define all phases as an array of phases (meaning it's a matrix of levels)
    this.Phases = [PhaseOne, PhaseTwo, PhaseThree];

    // create the level-menu matrix that directs each new level button to its' phase and level.
    // first for loop is for phases, inner for loop is for levels per phase
    for (let phaseIndex = 0; phaseIndex < 3; phaseIndex++) {
      // add a new text to the scene with the needed phase number
      const text = "Phase " + (phaseIndex + 1);
      this.add.text(120, 180 + phaseIndex * 100, text, {
        fill: "#000000",
        align: "center",
        fontSize: "50px",
      });
      // add 6 level buttons to this phase, with default locked image
      for (let levelIndex = 0; levelIndex < 6; levelIndex++) {
        let newButton = this.add
          .sprite(400 + levelIndex * 130, 200 + phaseIndex * 100, "lockedLevelImage")
          .setInteractive({ cursor: "pointer" })
          .on("pointerdown", () => {
            // when pressed, start GameScene with current phase and level
            this.scene.start("GameScene", { phase: this.Phases[phaseIndex], level: levelIndex });
          });
        // todo: change cursor over sprites
        /*
        newButton.on("pointerover", () => {
          console.log("hia");
        });*/
      }
    }
  }

  update(time, delta) {}
}

export default TitleScene;
