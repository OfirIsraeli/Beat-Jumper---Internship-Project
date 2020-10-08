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

const DIV_UP_POSITION = 50;
const DIV_DOWN_POSITION = 130;
const DEFAULT_INTERVAL_TIMING = 7;
export default function createScore(
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
  // moving the DIV element in the scene. if we are in a level's first part, it is on top, else it's moved downwards
  //  if disableNoteRect is true, it means we are on a level's second part, so move DIV down.
  if (disableNoteRect) {
    // if player has lost the level in his last try, just position the DIV in the same place as before
    if (levelState === LEVEL_STATES.LOST) {
      scoreNode.style.top = DIV_DOWN_POSITION + "px";
    }
    // else, player just entered part 2. creating small animation of moving the DIV downwards using intervals
    else {
      let i = DIV_UP_POSITION;
      let interval = setInterval(() => {
        scoreNode.style.top = i + "px";
        i++;
        if (i === DIV_DOWN_POSITION) {
          clearInterval(interval);
        }
      }, DEFAULT_INTERVAL_TIMING);
    }
  }
  //  if disableNoteRect is false, it means we are on a level's first part, so move DIV up.
  else {
    // if player has lost the level in his last try or just starting the session, just position the DIV in top position
    if (levelState === LEVEL_STATES.LOST || levelState === LEVEL_STATES.NOT_STARTED) {
      scoreNode.style.top = DIV_UP_POSITION + "px";
    }
    // else, player just entered part 1 of a new level. creating small animation of moving the DIV upwards using intervals
    else {
      let i = DIV_DOWN_POSITION;
      let interval = setInterval(() => {
        scoreNode.style.top = i + "px";
        i--;
        if (i === DIV_UP_POSITION) {
          clearInterval(interval);
        }
      }, DEFAULT_INTERVAL_TIMING);
    }
  }
}
