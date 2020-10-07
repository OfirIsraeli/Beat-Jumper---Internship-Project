import * as liveScore from "bandpad-vexflow";
import Phaser from "phaser";
import GameScene from "../scenes/Game/GameScene";
export default function createScore(scoreJson, levelTempo, disableNoteRect, eventFunction) {
  let options = {
    interludeQuarters: 0,
    fitScore: false,
    screenSideMargins: 52,

    disableMeasureRect: true,
    disableNoteRect: disableNoteRect,

    // audio playback parameters
    pickupQuarters: 0,
    pickupMeasures: 2,
    interludeMeasures: 0,
    endingMeasures: 0,
    cloudTempo: levelTempo,

    staticFontSize: 14,
    removeExtraText: true,
    scoreBackground: "white",
    // debugging
    debugDisplay: false,
  };
  let scoreNode = document.getElementById("score-id");
  scoreNode.innerHTML = "";
  liveScore.createScore(scoreJson, "score-id", options, eventFunction);
  if (disableNoteRect) {
    scoreNode.style.top = "120px";
  } else {
    scoreNode.style.top = "50px";
  }
}
