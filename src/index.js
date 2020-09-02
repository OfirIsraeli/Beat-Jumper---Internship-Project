import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import TitleScene from "./scenes/TitleScene";
import GameScene from "./scenes/GameScene";
import * as SpinePlugin from "./SpinePlugin.js";

/*
  https://github.com/nkholski/phaser3-es6-webpack
  https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Body.html
  https://www.barbarianmeetscoding.com/wiki/phaser/
  https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html
  https://labs.phaser.io
*/

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
      debug: true,
    },
  },
  scene: [BootScene, TitleScene, GameScene],
  plugins: {
    scene: [
      { key: "SpinePlugin", plugin: window.SpinePlugin, mapping: "spine" },
    ],
  },
};

new Phaser.Game(config);
