/**
 *
 * @param {*} that  - a Phaser scene.
 * @param {*} cloudLocations - the requested locations to spawn the clouds in this scene before they start their motion
 */
export function createMenuBackground(that, cloudLocations) {
  // set background image
  that.background = that.add.image(0, 0, "emptyMenuBackgroundNormal").setOrigin(0, 0);

  // set cloud sprites
  that.clouds = [
    that.add.sprite(cloudLocations[0].x, cloudLocations[0].y, "cloudLeftSmall").setOrigin(1, 0.5),
    that.add.sprite(cloudLocations[1].x, cloudLocations[1].y, "cloudLeftMedium").setOrigin(1, 0.5),
    that.add.sprite(cloudLocations[2].x, cloudLocations[2].y, "cloudLeftMedium").setOrigin(1, 0.5),
    that.add.sprite(cloudLocations[3].x, cloudLocations[3].y, "cloudLeftSmall").setOrigin(1, 0.5),
    that.add.sprite(cloudLocations[4].x, cloudLocations[4].y, "cloudLeftBig").setOrigin(1, 0.5),
    that.add.sprite(cloudLocations[5].x, cloudLocations[5].y, "cloudRightBig").setOrigin(1, 0.5),
    that.add.sprite(cloudLocations[6].x, cloudLocations[6].y, "cloudRightMedium").setOrigin(1, 0.5),
    that.add.sprite(cloudLocations[7].x, cloudLocations[7].y, "cloudRightMedium").setOrigin(1, 0.5),
    that.add.sprite(cloudLocations[8].x, cloudLocations[8].y, "cloudRightMedium").setOrigin(1, 0.5),
    that.add.sprite(cloudLocations[9].x, cloudLocations[9].y, "cloudRightSmall").setOrigin(1, 0.5),
    that.add
      .sprite(cloudLocations[10].x, cloudLocations[10].y, "cloudRightSmall")
      .setOrigin(1, 0.5),
  ];
  // for each cloud we have, set random speed
  that.clouds.forEach((cloud) => {
    cloud.speed = randomizeSpeed(0.05, 0.3);
  });
  // re-define the update function of the scene to this arrow function.
  that.update = (time, delta) => {
    // move each cloud
    that.clouds.forEach((cloud) => {
      moveCloud(that, cloud);
    });
  };
  // define new scene arrow function that returns all of the clouds' current positions
  that.getCloudLocations = () => {
    let lastCloudLocation = {};
    let index = 0;
    that.clouds.forEach((cloud) => {
      lastCloudLocation[index] = { x: cloud.x, y: cloud.y };
      index++;
    });
    return lastCloudLocation;
  };
}

/**
 * a function to move a cloud in our scene
 * @param {*} that  - a Phaser scene.
 * @param {*} cloud - a cloud sprite as we defined it above
 */
function moveCloud(that, cloud) {
  // math wrap so when the sprite reaches the right end of the screen it will respawn in the left side, thus creating an endless loop
  cloud.x = Phaser.Math.Wrap(
    cloud.x + cloud.speed,
    0,
    that.sys.game.config.width + cloud.width * 0.9
  );
}
/**
 * a function to get a random float between min and max
 * @param {*} min
 * @param {*} max
 */
function randomizeSpeed(min, max) {
  return Math.random() * (max - min) + min;
}
