// imports of all scoreJsons as levels
import scoreJson from "../sheets/beat";
import scoreJson2 from "../sheets/sixh-test";
import level1_1 from "../sheets/levels/level1-1";
import level1_2 from "../sheets/levels/level1-2";
import level1_3 from "../sheets/levels/level1-3";
import level1_4 from "../sheets/levels/level1-4";
import level1_5 from "../sheets/levels/level1-5";
import level1_6 from "../sheets/levels/level1-6";

const NUMBER_OF_STAGES = 6;
const NUMBER_OF_LEVELS = 6;

class TitleScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "TitleScene",
    });
  }
  preload() {
    // set background
    this.background = this.add
      .tileSprite(0, 0, this.width, this.height, "menuBackgroundImage")
      .setOrigin(0, 0);
  }
  create() {
    console.log("played title scene");
    this.scene.start("LevelMenuScene");
  }

  update(time, delta) {}
}

export default TitleScene;
