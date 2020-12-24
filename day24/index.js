'use strict';

/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

const tilesList = input.split('\n').map((directions) => directions.match(/(e|w|ne|nw|se|sw)/g));
const tileFlips = {};

/* Part 1 */
(() => {
  for (const directions of tilesList) {
    let x = 0;
    let y = 0;
    let z = 0;

    for (const direction of directions) {
      if (direction === 'e') {
        x++;
        y--;
      } else if (direction === 'se') {
        z++;
        y--;
      } else if (direction === 'sw') {
        x--;
        z++;
      } else if (direction === 'w') {
        x--;
        y++;
      } else if (direction === 'nw') {
        y++;
        z--;
      } else if (direction === 'ne') {
        x++;
        z--;
      }
    }

    tileFlips[`x${x},y${y},z${z}`] ??= 0;
    tileFlips[`x${x},y${y},z${z}`]++;
  }

  const noOfBlackTiles = Object.values(tileFlips).filter((flips) => flips % 2 !== 0).length;
  console.log('Answer part 1:', noOfBlackTiles);
})();

/* Part 2 */
(() => {
  let day = 1;
  let currentTileFlips = Object.assign({}, tileFlips);
  while (day <= 100) {
    const nextTileFlips = Object.assign({}, currentTileFlips);
    const coordinates = Object.keys(currentTileFlips).map((tileCoordinates) => tileCoordinates.split(','));

    const xCoordinates = [...new Set(coordinates.map(([xCoordinate]) => Number(xCoordinate.substr(1))))];
    const minX = Math.min(...xCoordinates);
    const maxX = Math.max(...xCoordinates);

    const yCoordinates = [...new Set(coordinates.map(([, yCoordinate]) => Number(yCoordinate.substr(1))))];
    const minY = Math.min(...yCoordinates);
    const maxY = Math.max(...yCoordinates);

    const zCoordinates = [...new Set(coordinates.map(([, , zCoordinate]) => Number(zCoordinate.substr(1))))];
    const minZ = Math.min(...zCoordinates);
    const maxZ = Math.max(...zCoordinates);

    for (let z = minZ - 1; z <= maxZ + 1; z++) {
      for (let y = minY - 1; y <= maxY + 1; y++) {
        for (let x = minX - 1; x <= maxX + 1; x++) {
          const currentTile = currentTileFlips[`x${x},y${y},z${z}`] || 0;
          const neighbours = [
            currentTileFlips[`x${x + 1},y${y - 1},z${z}`] || 0, // east
            currentTileFlips[`x${x},y${y - 1},z${z + 1}`] || 0, // southeast
            currentTileFlips[`x${x - 1},y${y},z${z + 1}`] || 0, // southwest
            currentTileFlips[`x${x - 1},y${y + 1},z${z}`] || 0, // west
            currentTileFlips[`x${x},y${y + 1},z${z - 1}`] || 0, // northwest
            currentTileFlips[`x${x + 1},y${y},z${z - 1}`] || 0, // northeast
          ];

          const noOfBlackTileNeighbours = neighbours.filter((neighbour) => neighbour % 2 !== 0).length;
          const isBlackTileToBeFlipped = currentTile % 2 !== 0 && (noOfBlackTileNeighbours === 0 || noOfBlackTileNeighbours > 2);
          const isWhiteTileToBeFlipped = currentTile % 2 === 0 && noOfBlackTileNeighbours === 2;

          if (isBlackTileToBeFlipped || isWhiteTileToBeFlipped) {
            nextTileFlips[`x${x},y${y},z${z}`] ??= 0;
            nextTileFlips[`x${x},y${y},z${z}`]++;
          }
        }
      }
    }

    currentTileFlips = nextTileFlips;
    day++;
  }

  const noOfBlackTiles = Object.values(currentTileFlips).filter((flips) => flips % 2 !== 0).length;
  console.log('Answer part 2:', noOfBlackTiles);
})();
