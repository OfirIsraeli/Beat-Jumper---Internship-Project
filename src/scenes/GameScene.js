import Phaser from "phaser";
import Hero from "../sprites/Hero";
//import Stave from "../classes/Stave"

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
    //this.setGameBlocks();
    this.myHero = new Hero({ scene: this.scene });
    this.setGameColliders();
    this.myHero.walk();
    var tempo = 60;
    var numberOfBars = 2;
    this.EighthNoteLength = ((60 / tempo) * 1000) / 2;
  }




  setGameButtons()
  {
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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

    // colliders for blocks:

    //this.physics.add.collider(this.myHero.heroSprite, this.smallBlock, this.myHero.stop());
    //this.physics.add.collider(this.myHero.heroSprite, this.mediumBlock);
    //this.physics.add.collider(this.myHero.heroSprite, this.largeBlock);
  }


  jumpTimingCheck(jumpTime){
    var jumpTime = Date.now();
    var timePassedSinceJump = (jumpTime - this.myHero.walkStartTime)  // / 1000
    var delay = timePassedSinceJump % this.EighthNoteLength;
    var premature = this.EighthNoteLength - (timePassedSinceJump % this.EighthNoteLength);
    if (delay < 100 || premature < 100){
      console.log ("jump time is: ", timePassedSinceJump % this.EighthNoteLength);
    }

    /*
    this.stave = new Stave({
      x:200,
      y:200,
      scene: this
    })
    this.stave.drawNotes();*/

  }


  update(time, delta) {

    if (Phaser.Input.Keyboard.JustDown(this.spaceBar))
    {
      this.jumpTimingCheck();
      this.myHero.smallJump();
    }
  }
}

export default GameScene;
