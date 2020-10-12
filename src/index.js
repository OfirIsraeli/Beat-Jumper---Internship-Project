import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import TitleScene from "./scenes/TitleScene";
import LevelMenuScene from "./scenes/LevelMenuScene";
import GameScene from "./scenes/Game/GameScene";
import HighScoreMenuScene from "./scenes/Highscores/HighScoreMenuScene";
import StageHighScoreScene from "./scenes/Highscores/StageHighScoreScene";
import TutorialScene from "./scenes/TutorialScene";
import CreditsScene from "./scenes/CreditsScene";
import OptionsScene from "./scenes/OptionsScene";
import * as WaaSampler from "waa-sampler";
/*
  https://github.com/nkholski/phaser3-es6-webpack
  https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Body.html
  https://www.barbarianmeetscoding.com/wiki/phaser/
  https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html
  https://labs.phaser.io
*/

/**
 * general Phaser game config
 */
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 760,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [
    BootScene,
    TitleScene,
    TutorialScene,
    CreditsScene,
    HighScoreMenuScene,
    StageHighScoreScene,
    OptionsScene,
    LevelMenuScene,
    GameScene,
  ],
};
// intiiallize BandPad sound sampler
WaaSampler.initWaaSampler(
  ["metronome"],
  "https://bandpad.co/livescoreV2/statics/create-bandpad-soundfont/soundfont",
  "OFF",
  90
)
  .then(function () {
    console.log("init sampler successfully");
    new Phaser.Game(config);
  })
  .catch(function (e) {
    console.error(e);
  });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
