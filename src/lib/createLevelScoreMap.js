const NOTES = {
  REST_NOTE: "noPlace",
  PLAYED_NOTE: "playedNote",
  COUNT_NOTE: "countDown",
};

export default function createLevelScoreMap(levelJson) {
  let levelScoreMap = [];
  let amountOfBars = Object.keys(levelJson.partElements[0].scoreMap).length;
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
