/**
 * points each note division (1 as smallest note, 4 as biggest) to the relevant
 * adjustment in height (in game) that is needed for a boulder of the same size
 * so they would appear on ground
 */
const BOULDER_HEIGHTS = {
  1: -34,
  2: -50,
  3: -60,
  4: -75,
};

const BOULDER_RADIUSES = {
  1: 24,
  2: 34,
  3: 44,
  4: 57,
};

/**
 * points each note division (1 as smallest note, 4 as biggest) to the relevant
 * image string for image loading
 */
const BOULDER_IMAGES = {
  1: "smallBoulderImage",
  2: "mediumBoulderImage",
  3: "bigBoulderImage",
  4: "largeBoulderImage",
};

/**
 * points a size of a boulder to the relevant
 * image string for image loading
 */
const BOULDER_SIZES = {
  SMALL: "smallBoulderImage",
  MEDIUM: "mediumBoulderImage",
  BIG: "bigBoulderImage",
  LARGE: "largeBoulderImage",
};

export default class Boulder {
  constructor(config) {
    // the Phaser scene hero will be spawned
    this.scene = config.scene.scene;
    this.noteIndex = config.noteIndex;
    this.init();
  }
  init() {
    this.size = this.getRelevantBoulderName();
    this.sprite = this.scene.physics.add.sprite(
      // define a new sprite
      this.scene.sys.game.config.width,
      this.scene.ground.y + this.getRelevantBoulderHeight(),
      this.size
    );
    this.sprite.setImmovable(); // boulders are heavy...
    this.sprite.setVelocityX(this.getVelocityForTempo()); // and fast...
    // this.sprite.body.setCircle(BOULDER_RADIUSES[this.size]);

    // add the dust cloud sprite for this boulder
    this.dustCloud = this.scene.physics.add.sprite(
      this.scene.sys.game.config.width + 30,
      this.scene.ground.y - 20,
      "dustCloudImage"
    );
    // appreantly dust clouds are as heavy and fast as the boulders...
    this.dustCloud.setImmovable();
    this.dustCloud.setVelocityX(this.getVelocityForTempo());
  }
  /**
   * destory this boulder's sprites
   */
  destroy() {
    this.sprite.destroy();
    this.dustCloud.destroy();
  }

  /**
   * each boulder of each size will get a different roation speed
   */
  roll() {
    if (this.size === BOULDER_SIZES.SMALL) {
      this.sprite.angle -= 15;
    } else if (this.size === BOULDER_SIZES.MEDIUM) {
      this.sprite.angle -= 10;
    } else {
      this.sprite.angle -= 5;
    }
  }

  /**
   * function that gets the needed height for the current boulder to spawn, by the current note length
   */
  getRelevantBoulderName() {
    return BOULDER_IMAGES[this.scene.scoreMap[this.noteIndex][0]];
  }

  /**
   *  function that gets the needed height for the current boulder to spawn, by the current note length
   */
  getRelevantBoulderHeight() {
    return BOULDER_HEIGHTS[this.scene.scoreMap[this.noteIndex][0]];
  }
  /**
   * function that calculates the needed boulder velocity to match the given tempo
   */
  getVelocityForTempo() {
    return -8 * this.scene.tempo - 37;
  }
}
