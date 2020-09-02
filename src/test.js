import Phaser from "phaser";
import TestScene from "./scenes/TestScene";


const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "content",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 760,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: TestScene
};

new Phaser.Game(config);
