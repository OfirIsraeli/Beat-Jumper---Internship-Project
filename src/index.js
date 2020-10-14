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

// get game location
let thisLocation = window.location.href;

// if we're in localhost (so testing stuff), use the real site address as the location, with default language
if (thisLocation === DEFAULT_LOCALHOST_SERVER) {
  thisLocation = DEFAULT_GAME_URL + DEFAULT_LANGUAGE;
}
// language in our case will be in this specific location. fetch it.
let selectedLanguage = thisLocation.slice(31, 33);
// if it does not exist, use default language
if (selectedLanguage === "") {
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
