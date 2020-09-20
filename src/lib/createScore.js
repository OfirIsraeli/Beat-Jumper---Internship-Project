import * as liveScore from "bandpad-vexflow";
import Phaser from "phaser";
import GameScene from "../scenes/GameScene";
export default function createScore(scoreJson, eventFunction) {
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
    cloudTempo: 80,

    staticFontSize: 14,
    removeExtraText: true,

    // debugging
    debugDisplay: false,
  };

  liveScore.createScore(scoreJson, "score-id", options, eventFunction);
}
