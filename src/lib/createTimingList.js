const COUNTIN_BEATS = 16;

const NOTES = {
  REST_NOTE: "noPlace",
  PLAYED_NOTE: "playedNote",
  COUNT_NOTE: "countDown",
};

/**
 * creates a data structure that for each note (including count-in) hold the next data:
 *  - division - the time in milliseconds that note occurs in the level
 *  - noteType - the type of note that note is
 *  - visited - boolean that indicates if player has jumped (registered) on that note
 */
export default function createTimingList(divisionLength, scoreMap, coundownIntervals) {
  let timingList = [];

  for (let i = 0; i < coundownIntervals; i++) {
    timingList.push({
      division: i * divisionLength,
      noteType: NOTES.COUNT_NOTE,
      visited: false,
    });
  }

  let countLength = timingList.length;

  for (let j = 0; j < scoreMap.length; j++) {
    timingList.push({
      division: (j + countLength) * divisionLength,
      noteType: scoreMap[j][1],
      visited: false,
      noteSize: scoreMap[j][0],
    });
  }
  return timingList;
}
