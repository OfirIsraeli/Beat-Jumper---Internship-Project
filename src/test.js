import Phaser from "phaser";
import TestScene from "./scenes/TestScene";
import axios from "axios";
import * as WaaSampler from "waa-sampler";
import * as liveScore from "bandpad-vexflow";
import test from "./sheets/beat";

let language = "he";
let text = {};
let font = "";
let hostUrl = "";

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
  scene: TestScene,
};

function init() {
  if (window.location.hostname === "localhost") {
    hostUrl = "https://bandpad.co/livescore/score";
  } else {
    hostUrl = "https://bandpad.co/livescore/score";
  }

  // get language

  if (!["he", "en", "ar", "de", "ch"].includes(language)) {
    language = "en"; // default language
  }

  switch (language) {
    case "en":
      font = "Chewy";
      break;
    case "he":
      font = "Assistant";
      break;
    default:
      font = "Chewy";
      break;
  }

  axios.get(hostUrl + "/getGameLanguage/" + language).then(
    // success
    function (response) {
      // add language
      text = Object.assign(text, response);

      let options = {
        interludeQuarters: 0,
        fitScore: false,
        screenSideMargins: 52,

        disableMeasureRect: true,

        // audio playback parameters
        pickupQuarters: 0,
        pickupMeasures: 2,
        interludeMeasures: 0,
        endingMeasures: 0,
        cloudTempo: 90,

        staticFontSize: 14,
        removeExtraText: true,

        // debugging
        debugDisplay: false,
      };

      WaaSampler.initWaaSampler(
        ["piano", "metronome"],
        "https://bandpad.co/livescoreV2/statics/create-bandpad-soundfont/soundfont",
        "COWBELL",
        90
      )
        .then(function () {
          console.log("init sampler successfully");

          liveScore.createScore(test, "score-id", options, function (event, value) {
            console.log("got new event");
            console.log(event, value);
          });
          window.test = test;
          new Phaser.Game(config);
          console.log("init score display");
        })
        .catch(function (e) {
          console.error(e);
        });
    }
  );
}

init();
console.log("Initializing game app");
/*
FontFaceOnload("Assistant", {
  success: function () {
    FontFaceOnload("Chewy", {
      success: function () {
        console.log("font loaded");
        init();
      },
    });
  },
});
*/
