import * as liveScore from "bandpad-vexflow";
const LEVEL_STATES = {
  // not started yet
  NOT_STARTED: -2,
  // level is on motion
  ON_MOTION: -1,
  // level lost
  LOST: 0,
  // level win
  WON: 1,
};

const DEFAULT_INTERVAL_TIMING = 7;
export default function createScore(
  scene,
  scoreJson,
  levelTempo,
  levelState,
  disableNoteRect,
  eventFunction
) {
  let options = {
    interludeQuarters: 0,
    fitScore: false,
    screenSideMargins: 52,

    disableMeasureRect: true,
    disableNoteRect: disableNoteRect,
    disableTracksSound: true,

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
  // if player has a screen such that there is a top margin, we want to define score-id DIV to spawn in our game and not in that margin
  // get that margin
  const screenToGameDifference = parseInt(document.querySelector("body > canvas").style.marginTop);
  // default up position for the div
  const DIVUpPosition = 0 + screenToGameDifference;
  // default down position for the div
  const DIVDownPosition = 80 + screenToGameDifference;
  // moving the DIV element in the scene. if we are in a level's first part, it is on top, else it's moved downwards
  //  if disableNoteRect is true, it means we are on a level's second part, so move DIV down.
  if (disableNoteRect) {
    // if player has lost the level in his last try, just position the DIV in the same place as before
    if (levelState === LEVEL_STATES.LOST) {
      scoreNode.style.top = DIVDownPosition + "px";
    }
    // else, player just entered part 2. creating small animation of moving the DIV downwards using intervals
    else {
      let i = DIVUpPosition;
      let interval = setInterval(() => {
        scoreNode.style.top = i + "px";
        i++;
        if (i === DIVDownPosition) {
          clearInterval(interval);
        }
      }, DEFAULT_INTERVAL_TIMING);
    }
  }
  //  if disableNoteRect is false, it means we are on a level's first part, so move DIV up.
  else {
    // if player has lost the level in his last try or just starting the session, just position the DIV in top position
    if (levelState === LEVEL_STATES.LOST || levelState === LEVEL_STATES.NOT_STARTED) {
      scoreNode.style.top = DIVUpPosition + "px";
    }
    // else, player just entered part 1 of a new level. creating small animation of moving the DIV upwards using intervals
    else {
      let i = DIVDownPosition;
      let interval = setInterval(() => {
        scoreNode.style.top = i + "px";
        i--;
        if (i === DIVUpPosition) {
          clearInterval(interval);
        }
      }, DEFAULT_INTERVAL_TIMING);
    }
  }
}
