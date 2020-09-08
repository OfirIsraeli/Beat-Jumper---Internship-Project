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
    this.load.image("smallBlockImage", "assets/images/E Block2.png");
    this.load.image("mediumBlockImage", "assets/images/Q Block.png");
    this.load.image("largeBlockImage", "assets/images/H Block.png");
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
