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
// fetch axios
const axios = require("axios");
// default game language
const DEFAULT_LANGUAGE = "en";
// default deployed address, without the language setting at the end
const DEFAULT_GAME_URL = "https://bandpad.co/beat-jumper/";
// default server we use in localhost is 8080
const DEFAULT_LOCALHOST_SERVER = "http://localhost:8080/";
//
const DEFAULT_LANGUAGE_VOCAB_URL = "https://bandpad.co/livescore/score/getGameLanguage/";
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
  scale: {
    mode: Phaser.Scale.FIT,
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

// language in our case will be provided as URL parameter. fetch it.

// get the URL parameters
const urlParams = new URLSearchParams(window.location.search);
// get our specific parameter
window.selectedLanguage = urlParams.get("language");
// if it does not exist, use default language
if (selectedLanguage === null) {
  selectedLanguage = DEFAULT_LANGUAGE;
}

// use axios to get our language vocabulary
axios
  .get(DEFAULT_LANGUAGE_VOCAB_URL + selectedLanguage)
  .then((response) => {
    // handle success
    window.myLanguage = response.data.game;
    new Phaser.Game(config);
  })
  .catch((error) => {
    // handle error
    console.log(error);
  });
