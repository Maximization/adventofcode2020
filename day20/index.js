/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

const tiles = input.split('\n\n').map((tile) => {
  const [tileTitle, ...tileRows] = tile.split('\n');

  // Parse tile ID
  const tileId = Number(tileTitle.match(/(?<tileId>\d+)/).groups.tileId);

  // Get top, right, bottom and left borders
  const topBorder = tileRows[0];
  const bottomBorder = tileRows[tileRows.length - 1];
  const leftBorder = tileRows.flatMap((row) => row[0]).join('');
  const rightBorder = tileRows.flatMap((row) => row[row.length - 1]).join('');

  return [tileId, [topBorder, rightBorder, bottomBorder, leftBorder], tileRows];
});

/* Part 1 */
const neighbours = {};
for (const [index, [tileId, tileBorders]] of tiles.entries()) {
  neighbours[tileId] ??= [];

  for (const [innerIndex, [innerTileId, innerTileBorders, tileRows]] of tiles.entries()) {
    if (index === innerIndex) {
      continue;
    }

    for (const [tileBorderIndex, tileBorder] of tileBorders.entries()) {
      for (const [innerTileBorderIndex, innerTileBorder] of innerTileBorders.entries()) {
        const reversedInnerTileBorder = innerTileBorder.split('').reverse().join('');

        if ([innerTileBorder, reversedInnerTileBorder].includes(tileBorder)) {
          const neighbour = {
            id: innerTileId,
            ownBorderIndex: tileBorderIndex,
            borderIndex: innerTileBorderIndex,
            isReversed: tileBorder === innerTileBorder ? false : true,
            tileRows,
          };

          neighbours[tileId].push(neighbour);
        }
      }
    }
  }
}

const productOfCornerTiles = Object.entries(neighbours)
  // Corner tiles only have 2 neighbours
  .filter(([, tileNeighbours]) => tileNeighbours.length === 2)
  .reduce((acc, [cornerTileId]) => acc * Number(cornerTileId), 1);

console.log('Answer part 1:', productOfCornerTiles);

/* Part 2 */

// Helper function that flips a 2d-array horizontally
function flip(tileRows) {
  return tileRows.map((row) => row.split('').reverse().join(''));
}

// Helper function that rotates a 2d-array 90, 180 & 270 degrees
// Assumes it's a square (width === height)
function rotate(tileRows, angle) {
  if (angle === 0) {
    return tileRows;
  } else if (angle === 90) {
    return tileRows.map((_, index) => {
      return tileRows.flatMap((row) => row[index]).reverse().join('');
    });
  } else if (angle === 180) {
    return tileRows.map((_, index) => {
      return tileRows[(tileRows.length - index) - 1].split('').reverse().join('');
    });
  } else if (angle === 270) {
    return tileRows.map((_, index) => {
      return tileRows.flatMap((row) => row[(row.length - index) - 1]).join('');
    });
  }
}

// Image representation with keys being coordinates (0,0) and values the tiles
// in the correct position
const imageMap = {};

// Place first tile as is
const [,, tileRows] = tiles.shift();
imageMap['0,0'] = tileRows;

// Place remaining tiles
while (tiles.length) {
  // Create a mapping of all empty positions and adjacent tile borders that
  // need to be matched
  const emptySpots = {};
  Object.entries(imageMap).forEach(([coordinates, tileRows]) => {
    const [xCoordinate, yCoordinate] = coordinates.split(',').map(Number);
    const topCoordinates = `${xCoordinate},${yCoordinate + 1}`;
    const rightCoordinates = `${xCoordinate + 1},${yCoordinate}`;
    const bottomCoordinates = `${xCoordinate},${yCoordinate - 1}`;
    const leftCoordinates = `${xCoordinate - 1},${yCoordinate}`;

    if (!imageMap[topCoordinates]) {
      emptySpots[topCoordinates] ??= {};
      emptySpots[topCoordinates].bottom = tileRows[0];
    }

    if (!imageMap[rightCoordinates]) {
      emptySpots[rightCoordinates] ??= {};
      emptySpots[rightCoordinates].left = tileRows.flatMap((row) => row[row.length - 1]).join('');
    }

    if (!imageMap[bottomCoordinates]) {
      emptySpots[bottomCoordinates] ??= {};
      emptySpots[bottomCoordinates].top = tileRows[tileRows.length - 1];
    }

    if (!imageMap[leftCoordinates]) {
      emptySpots[leftCoordinates] ??= {};
      emptySpots[leftCoordinates].right = tileRows.flatMap((row) => row[0]).join('');
    }
  });

  // Go through all tiles and evaluate whether they can be placed in one of the
  // empty spots
  for (const [index, [,, tileRows]] of tiles.entries()) {
    for (const [coordinates, borders] of Object.entries(emptySpots)) {
      for (let angle = 0; angle < 360; angle += 90) {
        const tileRowsToTest = [
          rotate(tileRows, angle), // unflipped
          rotate(flip(tileRows), angle), // flipped
        ];

        for (const tileRowToTest of tileRowsToTest) {
          const matchesTop = !borders.top || borders.top === tileRowToTest[0];
          const matchesRight = !borders.right || borders.right === tileRowToTest.flatMap((row) => row[row.length - 1]).join('');
          const matchesBottom = !borders.bottom || borders.bottom === tileRowToTest[tileRowToTest.length - 1];
          const matchesLeft = !borders.left || borders.left === tileRowToTest.flatMap((row) => row[0]).join('');

          if (matchesTop && matchesRight && matchesBottom && matchesLeft) {
            imageMap[coordinates] = tileRowToTest;
            delete emptySpots[coordinates];
            tiles.splice(index, 1);
            break;
          }
        }

        if (imageMap[coordinates]) {
          break;
        }
      }

      if (imageMap[coordinates]) {
        break;
      }
    };
  }
}

// Construct image
const xCoordinates = Object.keys(imageMap)
  .map((coordinates) => Number(coordinates.split(',')[0]));
const minX = Math.min(...xCoordinates);
const maxX = Math.max(...xCoordinates);
const yCoordinates = Object.keys(imageMap)
  .map((coordinates) => Number(coordinates.split(',')[1]));
const minY = Math.min(...yCoordinates);
const maxY = Math.max(...yCoordinates);

const image = [];
for (let y = maxY; y >= minY; y--) {
  for (let rowIndex = 1; rowIndex <= 8; rowIndex++) {
    const row = [];
    for (let x = minX; x <= maxX; x++) {
      row.push(imageMap[`${x},${y}`][rowIndex].slice(1, -1));
    }

    image.push(row.join(''));
  }
}

// Find sea monster
const seaMonster = [
  '                  # ',
  '#    ##    ##    ###',
  ' #  #  #  #  #  #   ',
];

let finalImage;
let foundSeaMonster = false;
for (let angle = 0; angle < 360; angle += 90) {
  const imagesToTest = [
    rotate(image, angle), // unflipped
    rotate(flip(image), angle), // flipped
  ];

  for (const imageToTest of imagesToTest) {
    for (let rowIndex = 0; rowIndex <= imageToTest.length - seaMonster.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex <= imageToTest[0].length - seaMonster[0].length; columnIndex++) {
        // Look ahead to see if we are at a sea monster
        let isSeaMonster = true;
        for (let seaMonsterRow = 0; seaMonsterRow < seaMonster.length; seaMonsterRow++) {
          for (let seaMonsterColumn = 0; seaMonsterColumn < seaMonster[0].length; seaMonsterColumn++) {
            const applySeaMonsterMask = seaMonster[seaMonsterRow][seaMonsterColumn] === '#';
            const isDot = imageToTest[rowIndex + seaMonsterRow][columnIndex + seaMonsterColumn] === '.';
            if (applySeaMonsterMask && isDot) {
              isSeaMonster = false;
              break;
            }
          }

          if (!isSeaMonster) {
            break;
          }
        }

        // Replace sea monster in image with emoji
        if (isSeaMonster) {
          foundSeaMonster = true;

          for (let seaMonsterRow = 0; seaMonsterRow < seaMonster.length; seaMonsterRow++) {
            for (let seaMonsterColumn = 0; seaMonsterColumn < seaMonster[0].length; seaMonsterColumn++) {
              if (seaMonster[seaMonsterRow][seaMonsterColumn] === '#') {
                const row = imageToTest[rowIndex + seaMonsterRow].split('');
                row[columnIndex + seaMonsterColumn] = 'O';
                imageToTest[rowIndex + seaMonsterRow] = row.join('');
              }
            }
          }
        }
      }
    }

    if (foundSeaMonster) {
      finalImage = imageToTest;
      break;
    }
  }

  if (foundSeaMonster) {
    break;
  }
}

const waterRougness = finalImage.join('').split('').filter((pixel) => pixel === '#').length;
console.log('Answer part 2:', waterRougness);
