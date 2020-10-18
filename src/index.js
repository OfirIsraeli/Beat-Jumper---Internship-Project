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

// ------------------ CONSTANTS ---------------- //
// default game language
const DEFAULT_LANGUAGE = "en";
// default location where we import our different language vocabularies from
const DEFAULT_LANGUAGE_VOCAB_URL = "https://bandpad.co/livescore/score/getGameLanguage/";

// Phaser 3 game framework
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
  .then(() => {
    console.log("init sampler successfully");
  })
  .catch((error) => {
    console.error(error);
  });

// load service worker for PWA
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
// get our specific language parameter
window.selectedLanguage = urlParams.get("language");
// if it does not exist, use default language
if (selectedLanguage === null) {
  selectedLanguage = DEFAULT_LANGUAGE;
}

// use axios to get our language vocabulary of the selected language
axios
  .get(DEFAULT_LANGUAGE_VOCAB_URL + selectedLanguage)
  .then((response) => {
    // handle success
    // define our language vocabulary by reaching the default location in the JSON data from the BandPad translation URL
    window.myLanguage = response.data.game;
    // and finally starting the game! here we go. first scene is boot scene for loading assets, and then straight to title scene (the main menu)
    new Phaser.Game(config);
  })
  .catch((error) => {
    // handle error
    console.log(error);
  });
