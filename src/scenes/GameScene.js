import Phaser from "phaser";
import Hero from "../sprites/Hero";
class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "GameScene",
    });
  }

  preload() {}

  create() {
    this.setGameButtons();
    this.add.image(0, 0, "backgroundImage").setOrigin(0, 0);
    this.setGameGround();
    this.setGameBlocks();
    this.myHero = new Hero({ scene: this.scene });
    this.setGameColliders();
    this.myHero.walk();
  }

  setGameButtons()
  {
    this.buttonA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.buttonS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.buttonD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  setGameGround()
  {
    this.ground = this.physics.add.sprite(
      this.sys.game.config.width / 2,
      this.sys.game.config.height * 0.747,
      "groundImage"
    );
    this.ground.setVisible(false);
    this.ground.setImmovable();
  }


  setGameBlocks()
  {
    this.smallBlock = this.physics.add.sprite(
      this.sys.game.config.width / 4,
      this.ground.y - 49,
      "smallBlockImage"
    );
    this.smallBlock.setImmovable();

    this.mediumBlock = this.physics.add.sprite(
      this.sys.game.config.width / 3,
      this.ground.y - 50 - 15,
      "mediumBlockImage"
    );
    this.mediumBlock.setImmovable();

    this.largeBlock = this.physics.add.sprite(
      this.sys.game.config.width / 2,
      this.ground.y - 50 - 15 - 19,
      "largeBlockImage"
    );
    this.largeBlock.setImmovable();
  }

  setGameColliders()
  {
    this.physics.add.collider(this.myHero.heroSprite, this.ground);
    this.physics.add.collider(this.myHero.heroSprite, this.smallBlock, this.myHero.stop());
    this.physics.add.collider(this.myHero.heroSprite, this.mediumBlock);
    this.physics.add.collider(this.myHero.heroSprite, this.largeBlock);
  }

  update(time, delta) {

    if (Phaser.Input.Keyboard.JustDown(this.buttonA))
    {
      this.myHero.smallJump();
    }
    if (Phaser.Input.Keyboard.JustDown(this.buttonS))
    {
      this.myHero.mediumJump();
    }
    if (Phaser.Input.Keyboard.JustDown(this.buttonD))
    {
      this.myHero.bigJump();
    }
  }
}

export default GameScene;
