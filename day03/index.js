/* Setup */
const fs = require('fs');
const path = require('path');
const map = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

/* Part 1 */
const mapWithArrays = map.split('\n');

// Generate map
const mapHeight = mapWithArrays.length;
const mapWidthOfSection = mapWithArrays[0].length;
const requiredNoOfSections = Math.ceil((mapHeight * 3) / mapWidthOfSection);

const fullMap = mapWithArrays.map((section) => {
  let newSection = [];
  for (let sectionMultiplier = 0; sectionMultiplier <= requiredNoOfSections; sectionMultiplier++) {
    newSection = newSection.concat([...section]);
  }

  return newSection;
});

let xCoordinate = 0;
let treesBumpedInto = 0;
for (let yCoordinate = 1; yCoordinate < fullMap.length; yCoordinate++) {
  xCoordinate += 3;
  const gridItem = fullMap[yCoordinate][xCoordinate];
  if (gridItem === '#') {
    treesBumpedInto++;
  }
}
console.log('Answer part 1:', treesBumpedInto);

/* Part 2 */
// Generate map
const requiredNoOfSectionsPart2 = Math.ceil((mapHeight * 7) / mapWidthOfSection);

const fullMapPart2 = mapWithArrays.map((section) => {
  let newSection = [];
  for (let sectionMultiplier = 0; sectionMultiplier <= requiredNoOfSectionsPart2; sectionMultiplier++) {
    newSection = newSection.concat([...section]);
  }

  return newSection;
});

const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];
let treesBumpedForEachSlope = [];
slopes.forEach((slope) => {
  let xCoordinate = 0;
  let treesBumpedInto = 0;
  for (let yCoordinate = slope[1]; yCoordinate < fullMapPart2.length; yCoordinate += slope[1]) {
    xCoordinate += slope[0];

    const gridItem = fullMapPart2[yCoordinate][xCoordinate];
    if (gridItem === '#') {
      treesBumpedInto++;
    }
  }

  treesBumpedForEachSlope = treesBumpedForEachSlope.concat([treesBumpedInto]);
});

const answerPart2 = treesBumpedForEachSlope
  .reduce((answer, treesBumpedInto) => answer * treesBumpedInto, 1);

console.log('Answer part 2:', answerPart2);
