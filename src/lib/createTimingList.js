const COUNTIN_BEATS = 16;

const NOTES = {
  REST_NOTE: "noPlace",
  PLAYED_NOTE: "playedNote",
  COUNT_NOTE: "countDown",
};

export default function createTimingList(divisionLength, scoreMap) {
  let timingList = [];

  for (let i = 0; i < COUNTIN_BEATS; i++) {
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
    });
  }
  return timingList;
}
