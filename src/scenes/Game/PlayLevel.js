// ---imports of various needed data structures---
// a function that creates a data structure used to track note placements in a level
import createLevelScoreMap from "../../lib/createLevelScoreMap";
// a function that creates a data structure used to track note data regarding user's behavior in a level.
import createTimingList from "../../lib/createTimingList";
// --- BandPad utillites ---
// creates the music sheet element and processes the given musicJsons
import createScore from "../../lib/createScore";
// handles score intervals and general sheet music execution
import * as ScoreManager from "bandpad-vexflow";
// handles specific events during the intervals
import { BUS_EVENTS } from "bandpad-vexflow";

// ------------------ CONSTANTS ---------------- //

/**
 * points each note division (1 as smallest note, 4 as biggest) to the relevant
 * note size
 */
const NOTES_SIZES = {
  1: 4, // 1 = quarter note
  2: 8, // 2 = 8th note
  4: 16, // 4 = 16th note
};

/**
 * various states that each level could be in
 */
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

/**
 * in our main interval function, we distinguish between two different interval types:
 * intervals that are part of the count-in, and intervals that are part of the sheet music itself
 */
const INTERVAL_TYPES = {
  COUNT_IN_INTERVAL: 1,
  NOTES_INTERVAL: 2,
};

/**
 * types of notes that could be found in the program
 */
const NOTES = {
  REST_NOTE: "noPlace", // noPlace is the string value that occurs in the given ScoreJsons as an identifier for a rest note
  PLAYED_NOTE: "playedNote",
  COUNT_NOTE: "countDown",
};

/*
    we push a boulder into the game exactly 4 or 8 intervals before the correct note timing so it would reach hero in time.
    if divisions are eighth notes (so 2) it's 4 intervals, if they are 16th, it's 8 intervals.
  */
const INTERVAL_PREDECESSOR = {
  2: 4,
  4: 8,
};

const SIXTEENTH_DIVISIONS = 4;
const LATE_JUMP_MSG = "You jumped too late!";

// main function that runs a level in GameScene with a given musicJson
export function playLevel(that, levelJson, invisibleLevel) {
  // show the score DIV element.
  let scoreDIVElement = document.getElementById("score-id");
  scoreDIVElement.style.display = "block";

  // check if level we're about to play is the last level unlocked by user.
  that.levelIsLastUnlocked = that.checkIfLastLevelUnlocked();

  // inform player what the high score of this level is
  that.highScoreLowerText.text = that.userHighScores[that.stageIndex][that.levelIndex];
  // until this level is complete so we can calculate the score (points), we set default value of 0
  that.pointsLowerText.text = 0;
  // at a start of each level, infoText is empty so screen would be clear
  that.infoText.text = "";

  //level divisions. 1 = quarters, 2 = eights, 4 = 16th
  that.divisions = levelJson.divisions;

  // set tempo for this level
  that.tempo = 80;

  // if level is based on 16th notes, play in hald tempo (it's a game for children after all...)
  if (that.divisions === SIXTEENTH_DIVISIONS) {
    that.tempo = that.tempo / 2;
  }

  // create music score for the level
  createScore(levelJson, that.tempo, function (event, value) {});

  // array of boulder sprites. will be filled with sprites during the intervals
  that.bouldersArray = [];

  // actual size of the division. quarters = 4 etc
  that.divSize = NOTES_SIZES[that.divisions];

  // total amount of measures in this level (excluding count-in)
  that.amountOfBars = Object.keys(levelJson.partElements[0].scoreMap).length;

  //this calculates the smallest division in the game in milliseconds
  that.divisionDuration = ((60 / that.tempo) * 1000) / that.divisions;

  /*
    variables needed for intervals:
    */
  let intervalType = INTERVAL_TYPES.COUNT_IN_INTERVAL; // define the starting interval type as a count-in interval
  let noteIndex = 0; // index that tracks the notes of our scoreMap (so excluding the count-in notes)
  let intervalNumber = 0; // tracks the number of overall interval we're in
  let countInIndex = 1; // index that will appear on screen on the final bar of count-in each quarter note
  const countInIntervals = 2 * that.divSize; // 2 bars, each has divSize number of intervals
  const totalIntervals = countInIntervals + that.divSize * that.amountOfBars; // total amount of intervals

  // data structures processing - each one explained in its' function description
  that.scoreMap = createLevelScoreMap(levelJson, that.amountOfBars);
  that.timingList = createTimingList(that.divisionDuration, that.scoreMap, countInIntervals);

  // start level
  that.levelState = LEVEL_STATES.ON_MOTION;
  that.myHero.walk(); // there goes my hero...

  // the arrow function that happens each interval
  ScoreManager.setEventFunction((event, value) => {
    if (event === BUS_EVENTS.UPDATE) {
      if (intervalNumber < totalIntervals) {
        // the 3 notes items closest to the current interval. Needed for calculations for user's jump.
        that.curNotes = {
          prevNote: that.timingList[intervalNumber - 1],
          curNote: that.timingList[intervalNumber],
          nextNote: that.timingList[intervalNumber + 1],
        };
        // if we are not in count-in
        if (intervalType !== INTERVAL_TYPES.COUNT_IN_INTERVAL) {
          // check if user jumped (visited) the previous note, if it was a played note. level lost if not.
          if (
            that.curNotes.prevNote.noteType === NOTES.PLAYED_NOTE &&
            that.curNotes.prevNote.visited === false
          ) {
            that.levelState = LEVEL_STATES.LOST;
            that.infoMessage = LATE_JUMP_MSG;
          }
        }
      }

      // if we're in an interval of a quarter note in the second bar of the count-in.
      // happens 4 times overall regardless of divisions
      if (
        value >= countInIntervals / 2 && // second bar
        intervalType === INTERVAL_TYPES.COUNT_IN_INTERVAL && // of the count-in
        value <= countInIntervals &&
        value % that.divisions === 0 // we're in a quarter note interval
      ) {
        that.countInText.text = countInIndex; // change countInText to the number of quarter note in the bar we're in
        countInIndex++;
      }
      // after we're done with count-in, show no text from countInText
      if (value === 0 && intervalType === INTERVAL_TYPES.NOTES_INTERVAL) {
        //this.countInText.text = "";
      }

      //we push a boulder into the game exactly 4 or 8 intervals before the correct note timing so it would reach hero in time.
      //if divisions are eighth notes (so 2) it's 4 intervals, if they are 16th, it's 8 intervals.
      if (
        (value >= countInIntervals - INTERVAL_PREDECESSOR[that.divisions] &&
          intervalType === INTERVAL_TYPES.COUNT_IN_INTERVAL) || // if we're less than 4 intervals before the end of count in
        (value < that.scoreMap.length - INTERVAL_PREDECESSOR[that.divisions] &&
          intervalType === INTERVAL_TYPES.NOTES_INTERVAL) // if we're more than 4 intervals before the end of notes
      ) {
        if (that.scoreMap[noteIndex][1] !== NOTES.REST_NOTE && !invisibleLevel) {
          // if current note is not a rest note, and also if invisibleLevel is true we do not spawn any boulders
          that.addBoulder(noteIndex); // add a boulder to the game
        }
        noteIndex++;
      }

      intervalNumber++;
      // if countdown is done
      if (intervalNumber === countInIntervals) {
        intervalType = INTERVAL_TYPES.NOTES_INTERVAL; // switch to note interval type
        that.countInText.text = ""; // after we're done with count-in, show no text from countInText
      }
      that.levelStatusCheck(intervalNumber, totalIntervals); // check if there is a need to end the level.
    }
  });

  // start vexflow, plays the score along with executing the intervals
  ScoreManager.scoreGetEvent(BUS_EVENTS.PLAY, {
    smoothNotePointer: true,
  });
}
