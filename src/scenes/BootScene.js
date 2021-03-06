/**
 * scene for loading assets into the game
 */
class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "BootScene",
    });
  }
  preload() {
    const progress = this.add.graphics();

    // loading images
    this.load.image("backgroundImage", "assets/images/background.png");
    this.load.image("backgroundDesertImage", "assets/images/MyBackground2.png");

    this.load.image("emptyMenuBackgroundSand", "assets/images/emptyMenuBackgroundSand.png");
    this.load.image("emptyMenuBackgroundNormal", "assets/images/emptyMenuBackgroundNormal.png");
    this.load.image("cloudLeftBig", "assets/images/cloudLeftBig.png");
    this.load.image("cloudLeftMedium", "assets/images/cloudLeftMedium.png");
    this.load.image("cloudLeftSmall", "assets/images/cloudLeftSmall.png");

    this.load.image("cloudRightBig", "assets/images/cloudRightBig.png");
    this.load.image("cloudRightMedium", "assets/images/cloudRightMedium.png");
    this.load.image("cloudRightSmall", "assets/images/cloudRightSmall.png");

    this.load.image("menuBackgroundImage", "assets/images/menuBackground.png");
    this.load.image("groundImage", "assets/images/ground.png");
    this.load.image("smallBoulderImage", "assets/images/small boulder.png");
    this.load.image("mediumBoulderImage", "assets/images/medium boulder.png");
    this.load.image("bigBoulderImage", "assets/images/big boulder.png");
    this.load.image("largeBoulderImage", "assets/images/large boulder.png");
    this.load.image("dustCloudImage", "assets/images/dust cloud.png");
    this.load.image("fullHitPoint", "assets/images/Life.png");
    this.load.image("emptyHitPoint", "assets/images/LifeGrey.png");
    this.load.image("unlockedLevelImage", "assets/images/unlocked level.png");
    this.load.image("lockedLevelImage", "assets/images/locked level.png");
    this.load.image("unlockedStageImage", "assets/images/unlocked stage.png");
    this.load.image("lockedStageImage", "assets/images/locked stage.png");
    this.load.image("stopImage", "assets/images/stop.png");

    // loading spritesheets for animations
    this.load.spritesheet("walkHero", "assets/images/walkHero.png", {
      frameWidth: 140,
      frameHeight: 200,
      endFrame: 15,
    });
    this.load.spritesheet("jumpHero", "assets/images/jumpHero.png", {
      frameWidth: 136,
      frameHeight: 200,
      endFrame: 13,
    });
    this.load.spritesheet("hurtHero", "assets/images/hurtHero.png", {
      frameWidth: 131.4,
      frameHeight: 200,
      endFrame: 11,
    });
    this.load.spritesheet("winHero", "assets/images/winHero.png", {
      frameWidth: 145.35,
      frameHeight: 200,
      endFrame: 15,
    });

    // loading sounds
    this.load.audio("hit", "assets/sounds/hit.wav");
    this.load.audio("measureBeat", "assets/sounds/click beat.wav");
    this.load.audio("quarterBeat", "assets/sounds/clickBeatLower.wav");
    this.load.audio("levelWin", "assets/sounds/level win.wav");
    this.load.audio("stageWin", "assets/sounds/stage win.wav");
    this.load.audio("levelFail", "assets/sounds/level fail.wav");
    this.load.audio("stageFail", "assets/sounds/stage fail.wav");
    this.load.audio("buttonSelect", "assets/sounds/button select.wav");

    // Register a load progress event to show a load bar
    this.load.on("progress", (value) => {
      progress.clear();
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(0, 0, this.sys.game.config.width * value, 10);
    });

    // Register a load complete event to launch the title screen when all files are loaded
    this.load.on("complete", () => {
      // prepare all animations, defined in a separate file
      progress.destroy();
      // and we are done with loading assets, start main menu
      this.scene.start("TitleScene");
    });
  }

  create() {}
}

export default BootScene;
