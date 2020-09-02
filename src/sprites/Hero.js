export default class Hero {
  constructor(config) {
    this.scene = config.scene.scene;

    this.gameSize = {
      width: this.scene.sys.game.config.width,
      height: this.scene.sys.game.config.height,
    };

    this.init();
  }
  init() {
    this.createAllAnimations();
    this.heroSprite = this.scene.physics.add.sprite(50, this.scene.ground.y - 150, "walkHero").play("standingAnimation");
    this.motion = "stopped";
    this.heroSprite.body.collideWorldBounds=true
    this.heroSprite.setGravityY(100);

  }

  createStandingAnimation() {
    var standingAnimationConfig = {
      key: "standingAnimation",
      frames: this.scene.anims.generateFrameNumbers("walkHero", {
        start: 4,
        end: 4,
        first: 4,
      }),
      frameRate: 1,
      repeat: -1,
    };
    this.scene.anims.create(standingAnimationConfig);
  }

  createWalkAnimation() {
    var walkAnimationConfig = {
      key: "walkAnimation",
      frames: this.scene.anims.generateFrameNumbers("walkHero", {
        start: 0,
        end: 14,
        first: 0,
      }),
      frameRate: 26,
      repeat: -1,
    };

    this.scene.anims.create(walkAnimationConfig);
  }

  createJumpAnimation() {
    var jumpAnimationConfig = {
      key: "jumpAnimation",
      frames: this.scene.anims.generateFrameNumbers("jumpHero", {
        start: 0,
        end: 12,
        first: 0,
      }),
      frameRate: 70,
      repeat: 0,
    };
    this.scene.anims.create(jumpAnimationConfig);
  }

  createMidAirAnimation() {
    var midAirAnimationConfig = {
      key: "midAirAnimation",
      frames: this.scene.anims.generateFrameNumbers("jumpHero", {
        start: 12,
        end: 12,
        first: 12,
      }),
      frameRate: 15,
      repeat: 12,
    };
    this.scene.anims.create(midAirAnimationConfig);
  }

  createLandingAnimation() {
    var landingAnimationConfig = {
      key: "landingAnimation",
      frames: this.scene.anims.generateFrameNumbers("jumpHero", {
        start: 12,
        end: 8,
        first: 12,
      }),
      frameRate: 100,
      repeat: 0,
    };
    this.scene.anims.create(landingAnimationConfig);
  }

  createAllAnimations() {
    this.createWalkAnimation();
    this.createJumpAnimation();
    this.createMidAirAnimation();
    this.createLandingAnimation();
    this.createStandingAnimation();
  }

  heroInAir(justAired, justLanded){
    if (justAired)
    {
      if (this.heroSprite.anims.isPlaying){
        this.heroSprite.anims.chain('midAirAnimation');
      }
      else{
        this.heroSprite.play('midAirAnimation');
      }
      justAired = false;
    }


    if(justLanded){
      this.heroSprite.play('landingAnimation');
      this.heroSprite.anims.chain('walkAnimation');
      justLanded = false;
    }
  }

  stop(){
    //this.heroSprite.setVelocityX(0);
    //this.heroSprite.play('standingAnimation');
    //this.motion = "stopped";
    console.log("hiii");
  }

  walk(){
    this.scene.time.addEvent({
      delay: 2000,
      callback: ()=>{
        this.heroSprite.setVelocityX(100);
        this.heroSprite.play('walkAnimation');

      },
      loop: false
  })
  this.motion = "walking";
  }


  smallJump() {
    
    if (this.heroSprite.body.touching.down)
    {
      this.heroSprite.play('jumpAnimation');
      this.heroSprite.setVelocityY(-125);
      this.heroSprite.anims.chain('midAirAnimation');
      this.heroSprite.anims.chain('landingAnimation');
      this.heroSprite.anims.chain('walkAnimation');
    }

  }
  mediumJump() {
    
    if (this.heroSprite.body.touching.down)
    {
      this.heroSprite.play('jumpAnimation');
      this.heroSprite.setVelocityY(-155);
      this.heroSprite.anims.chain('midAirAnimation');
      this.heroSprite.anims.chain('landingAnimation');
      this.heroSprite.anims.chain('walkAnimation');
    }

  }
  bigJump() {
    
    if (this.heroSprite.body.touching.down)
    {
      this.heroSprite.play('jumpAnimation');
      this.heroSprite.setVelocityY(-180);
      this.heroSprite.anims.chain('midAirAnimation');
      this.heroSprite.anims.chain('landingAnimation');
      this.heroSprite.anims.chain('walkAnimation');
    }

  }

}
