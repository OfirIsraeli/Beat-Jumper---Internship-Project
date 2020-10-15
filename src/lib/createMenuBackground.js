export function createMenuBackground(that, cloudLocations) {
  // set background
  that.background = that.add.image(0, 0, "emptyMenuBackgroundNormal").setOrigin(0, 0);

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
  that.clouds.forEach((cloud) => {
    cloud.speed = randomizeSpeed(0.05, 0.2);
  });
  that.update = (time, delta) => {
    that.clouds.forEach((cloud) => {
      moveCloud(that, cloud);
    });
  };
  //
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

function moveCloud(that, cloud) {
  cloud.x = Phaser.Math.Wrap(
    cloud.x + cloud.speed,
    0,
    that.sys.game.config.width + cloud.width * 0.9
  );
}

function randomizeSpeed(min, max) {
  return Math.random() * (max - min) + min;
}
