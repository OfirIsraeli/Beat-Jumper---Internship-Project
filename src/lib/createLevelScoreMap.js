const NOTES = {
  REST_NOTE: "noPlace",
  PLAYED_NOTE: "playedNote",
  COUNT_NOTE: "countDown",
};

/**
 * creates a data structure similar to the sub-array of the measures in a given musicJson, with the next changes:
    - taking a given note in a given bar, inserting it into OUR score map as the number of times the smallest note division occurs in that note.
    - for example, given 1 quarter note (that is equal to 4 16th notes), we insert 4 new 16th notes in our scoremap 
    . first one with a "divisions" size of 4, and the three other 16th notes as rest notes.
 */
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
