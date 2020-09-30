class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "BootScene",
    });
  }
  preload() {
    const progress = this.add.graphics();

    this.load.image("backgroundImage", "assets/images/background.png");
    this.load.image("groundImage", "assets/images/ground.png");
    this.load.image("smallBlockImage", "assets/images/little stone grey.png");
    this.load.image("mediumBlockImage", "assets/images/little stone 1 grey.png");
    this.load.image("largeBlockImage", "assets/images/mid stone.png");
    this.load.image("dustCloudImage", "assets/images/dust cloud.png");
    this.load.image("fullHitPoint", "assets/images/Life.png");
    this.load.image("emptyHitPoint", "assets/images/LifeGrey.png");
    this.load.image("unlockedLevelImage", "assets/images/unlocked level.png");
    this.load.image("lockedLevelImage", "assets/images/locked level.png");

    this.load.audio("tick", "assets/sounds/click beat.mp3");
    this.load.audio("hit", "assets/sounds/hit.mp3");
    this.load.audio("failure", "assets/sounds/fail.mp3");

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
      this.scene.start("TitleScene");
    });

    /**
     * Load audio
     */
    // Music to play. It's not properly edited for an continuous loop, but game play experience isn't really the aim of this repository either.
    // this.load.audio("big-laser", ["assets/audio/NFF-big-laser.wav"]);

    /**
     * Load spines
     */
    // changing the assets folder for sprite
    // this.load.setPath("assets/spines/plane");
    // this.load.spine("plane", "skeleton.json", "skeleton.atlas", true);
  }

  create() {}
}

export default BootScene;
