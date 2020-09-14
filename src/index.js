import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import TitleScene from "./scenes/TitleScene";
import GameScene from "./scenes/GameScene";
import * as SpinePlugin from "./SpinePlugin.js";
import * as WaaSampler from "waa-sampler";

/*
  https://github.com/nkholski/phaser3-es6-webpack
  https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Body.html
  https://www.barbarianmeetscoding.com/wiki/phaser/
  https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html
  https://labs.phaser.io
*/

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 760,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [BootScene, TitleScene, GameScene],
  plugins: {
    scene: [{ key: "SpinePlugin", plugin: window.SpinePlugin, mapping: "spine" }],
  },
};

WaaSampler.initWaaSampler(
  ["metronome", "piano"],
  "https://bandpad.co/livescoreV2/statics/create-bandpad-soundfont/soundfont",
  "COWBELL",
  90
)
  .then(function () {
    console.log("init sampler successfully");
    new Phaser.Game(config);
  })
  .catch(function (e) {
    console.error(e);
  });
