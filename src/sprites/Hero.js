const JUMP_STATES = {
  failedJump: 0,
  goodJump: 1,
};

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
    this.heroSprite = this.scene.physics.add
      .sprite(150, this.scene.ground.y - 150, "walkHero")
      .play("standingAnimation");
    this.heroSprite.body.collideWorldBounds = true;
    this.heroSprite.setGravityY(7000);
    this.walkStartTime;
    this.hitPoints = 3;
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
        end: 6,
        first: 0,
      }),
      frameRate: 100,
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
      frameRate: 30,
      repeat: 1,
    };
    this.scene.anims.create(midAirAnimationConfig);
  }

  createLandingAnimation() {
    var landingAnimationConfig = {
      key: "landingAnimation",
      frames: this.scene.anims.generateFrameNumbers("jumpHero", {
        start: 12,
        end: 6,
        first: 12,
      }),
      frameRate: 100,
      repeat: 0,
    };
    this.scene.anims.create(landingAnimationConfig);
  }

  createHurtAnimation() {
    var hurtAnimationConfig = {
      key: "hurtAnimation",
      frames: this.scene.anims.generateFrameNumbers("hurtHero", {
        start: 0,
        end: 10,
        first: 0,
      }),
      frameRate: 26,
      repeat: 4,
    };
    this.scene.anims.create(hurtAnimationConfig);
  }

  createWinAnimation() {
    var winAnimationConfig = {
      key: "winAnimation",
      frames: this.scene.anims.generateFrameNumbers("winHero", {
        start: 0,
        end: 14,
        first: 0,
      }),
      frameRate: 26,
      repeat: 4,
    };
    this.scene.anims.create(winAnimationConfig);
  }

  createAllAnimations() {
    this.createWalkAnimation();
    this.createJumpAnimation();
    this.createMidAirAnimation();
    this.createLandingAnimation();
    this.createStandingAnimation();
    this.createHurtAnimation();
    this.createWinAnimation();
  }

  walk() {
    this.heroSprite.play("walkAnimation");
    this.walkStartTime = Date.now();
  }

  smallJump() {
    this.heroSprite.play("jumpAnimation");
    this.heroSprite.setVelocityY(-1200);
    this.heroSprite.anims.chain("midAirAnimation");
    this.heroSprite.anims.chain("landingAnimation");
    this.heroSprite.anims.chain("walkAnimation");
  }

  /*
  mediumJump() {
    
    this.heroSprite.play('jumpAnimation');
    this.heroSprite.setVelocityY(-155);
    this.heroSprite.anims.chain('midAirAnimation');
    this.heroSprite.anims.chain('landingAnimation');
    this.heroSprite.anims.chain('walkAnimation');

  }
  bigJump() {
    
    this.heroSprite.play('jumpAnimation');
    this.heroSprite.setVelocityY(-155);
    this.heroSprite.anims.chain('midAirAnimation');
    this.heroSprite.anims.chain('landingAnimation');
    this.heroSprite.anims.chain('walkAnimation');

  }*/
}
