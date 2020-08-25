import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "GameScene",
    });
  }

  preload() {

  }

  create() {
    // background image
    this.add.image(0, 0, "backgroundImage").setOrigin(0, 0);

    var config = {
      key: 'walkAnimation',
      frames: this.anims.generateFrameNumbers('walkHero', { start: 0, end: 14, first: 0 }),
      frameRate: 20,
      repeat: -1
    };

    this.anims.create(config);

    this.add.sprite(400, 300, 'walkHero').play('walkAnimation');
  }

  update(time, delta) {
  }
}

export default GameScene;
