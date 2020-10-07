const JUMP_SIZE = {
  SMALL: 1,
  MEDIUM: 2,
  BIG: 3,
  LARGE: 4,
};
const DEFAULT_HIT_POINTS = 3;
const DEFAULT_GRAVITY = 7000;
export default class Hero {
  constructor(config) {
    // the Phaser scene hero will be spawned
    this.scene = config.scene.scene;
    this.init();
  }
  init() {
    // creates all needed animations for hero
    this.createAllAnimations();
    // creates his sprite, with default standing animation
    this.heroSprite = this.scene.physics.add
      .sprite(150, this.scene.ground.y - 150, "walkHero")
      .play("standingAnimation");
    // setting screen bounds for hero
    this.heroSprite.body.collideWorldBounds = true;
    // setting gravity
    this.heroSprite.setGravityY(DEFAULT_GRAVITY);
    // define uninitiallized walk start time. will get a value once hero start walking
    this.walkStartTime;
    // set hit points
    this.hitPoints = DEFAULT_HIT_POINTS;
  }

  /**
   * creates phaser animation for hero standing
   */
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

  /**
   * creates phaser animation for hero walking
   */
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

  /**
   *  creates phaser animation for hero jumping
   */
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

  /**
   * creates phaser animation for hero in mid-air
   */
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

  /**
   * creates phaser animation for hero landing
   */
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

  /**
   * creates phaser animation for hero taking a hit
   */
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

  /**
   * creates phaser animation for hero cheering
   */
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

  /**
   * creates all needed animations for hero
   */
  createAllAnimations() {
    this.createWalkAnimation();
    this.createJumpAnimation();
    this.createMidAirAnimation();
    this.createLandingAnimation();
    this.createStandingAnimation();
    this.createHurtAnimation();
    this.createWinAnimation();
  }

  /**
   * boolean method to tell if hero is on ground (returns true) or not (returns false)
   */
  onGround() {
    return this.heroSprite.body.touching.down;
  }

  /**
   * method to play hurt animation
   */
  hurt() {
    this.heroSprite.play("hurtAnimation"); // play failure animation
  }

  /**
   * method to play cheering animation
   */
  cheer() {
    this.heroSprite.play("winAnimation"); // play winning animation
  }

  /**
   * method to play standing animation
   */
  stand() {
    this.heroSprite.anims.chain("standingAnimation"); // stand after level is finished
  }

  /**
   * method to play walking animation
   */
  walk() {
    this.heroSprite.play("walkAnimation");
    // save current time as the start time of this walk
    this.walkStartTime = Date.now();
  }

  /**
   * method for a small hero jump. plays needed animations (if jump was either successful or not) and sets the needed negative gravity so jump will reach needed height
   * @param {*} successfulJump - a boolean to indicate if the jump was successful or not
   */
  smallJump(successfulJump) {
    this.heroSprite.play("jumpAnimation");
    this.heroSprite.setVelocityY(-1200);
    this.heroSprite.anims.chain("midAirAnimation");
    // if the jump is a successful one, finish the jump with landing and keep walking
    // if jump was not successful, game level will take care of the rest, so no need to finish the jump
    if (successfulJump) {
      this.heroSprite.anims.chain("landingAnimation");
      this.heroSprite.anims.chain("walkAnimation");
    }
  }

  /**
   * method for a medium hero jump. plays needed animations (if jump was either successful or not) and sets the needed negative gravity so jump will reach needed height
   * @param {*} successfulJump - a boolean to indicate if the jump was successful or not
   */ mediumJump(successfulJump) {
    this.heroSprite.play("jumpAnimation");
    this.heroSprite.setVelocityY(-1400);
    this.heroSprite.anims.chain("midAirAnimation");
    // if the jump is a successful one, finish the jump with landing and keep walking
    // if jump was not successful, game level will take care of the rest, so no need to finish the jump
    if (successfulJump) {
      this.heroSprite.anims.chain("landingAnimation");
      this.heroSprite.anims.chain("walkAnimation");
    }
  }

  /**
   * method for a big hero jump. plays needed animations (if jump was either successful or not) and sets the needed negative gravity so jump will reach needed height
   * @param {*} successfulJump - a boolean to indicate if the jump was successful or not
   */ bigJump(successfulJump) {
    this.heroSprite.play("jumpAnimation");
    this.heroSprite.setVelocityY(-1600);
    this.heroSprite.anims.chain("midAirAnimation");
    // if the jump is a successful one, finish the jump with landing and keep walking
    // if jump was not successful, game level will take care of the rest, so no need to finish the jump
    if (successfulJump) {
      this.heroSprite.anims.chain("landingAnimation");
      this.heroSprite.anims.chain("walkAnimation");
    }
  }

  /**
   * general function to make hero jump.
   * @param {*} successfulJump - a boolean to indicate if the jump was successful or not
   * @param {*} jumpSize - indicates the kind of jump we need this time
   */
  jump(successfulJump, jumpSize) {
    if (jumpSize === JUMP_SIZE.SMALL) {
      this.smallJump(successfulJump);
    }
    if (jumpSize === JUMP_SIZE.MEDIUM) {
      this.smallJump(successfulJump);
    }
    if (jumpSize === JUMP_SIZE.BIG) {
      this.mediumJump(successfulJump);
    }
    if (jumpSize === JUMP_SIZE.LARGE) {
      this.bigJump(successfulJump);
    }
  }
}
