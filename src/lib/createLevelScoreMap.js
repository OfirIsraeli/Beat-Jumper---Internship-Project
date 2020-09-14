const NOTES = {
  REST_NOTE: "noPlace",
  PLAYED_NOTE: "playedNote",
  COUNT_NOTE: "countDown",
};

// taking a given note in a given bar, inserting it into our score map as the number of times the smallest note division occurs in that note.
// for example, 1 quarter note equals to 4 16th notes that we will insert to our score map.
export default function createLevelScoreMap(levelJson, amountOfBars) {
  let levelScoreMap = [];
  for (let barIndex = 1; barIndex <= amountOfBars; barIndex++) {
    for (
      let noteIndex = 0;
      noteIndex < levelJson.partElements[0].scoreMap[barIndex].length;
      noteIndex++
    ) {
      if (levelJson.partElements[0].scoreMap[barIndex][noteIndex]["rest"]) {
        for (
          let k = 0;
          k < levelJson.partElements[0].scoreMap[barIndex][noteIndex].divisions;
          k++
        ) {
          levelScoreMap.push([1, NOTES.REST_NOTE]);
        }
      } else {
        levelScoreMap.push([
          levelJson.partElements[0].scoreMap[barIndex][noteIndex].divisions,
          NOTES.PLAYED_NOTE,
        ]);
        for (
          let k = 1;
          k < levelJson.partElements[0].scoreMap[barIndex][noteIndex].divisions;
          k++
        ) {
          levelScoreMap.push([1, NOTES.REST_NOTE]);
        }
      }
    }
  }
  return levelScoreMap;
}
