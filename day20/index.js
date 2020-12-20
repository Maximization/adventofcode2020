/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

const tiles = input.split('\n\n').map((tile) => {
  const [tileTitle, ...tileLines] = tile.split('\n');

  // Parse tile ID
  const tileId = Number(tileTitle.match(/(?<tileId>\d+)/).groups.tileId);

  // Get top, right, bottom and left borders
  const topBorder = tileLines[0];
  const bottomBorder = tileLines[tileLines.length - 1];
  const leftBorder = tileLines.flatMap((tileLine) => tileLine[0]).join('');
  const rightBorder = tileLines.flatMap((tileLine) => tileLine[tileLine.length - 1]).join('');

  return [tileId, [topBorder, rightBorder, bottomBorder, leftBorder]];
});

/* Part 1 */
const neighbours = {};
for (const [index, [tileId, tileBorders]] of tiles.entries()) {
  neighbours[tileId] ??= [];

  for (const [innerTileId, innerTileBorders] of tiles.slice(index + 1)) {
    neighbours[innerTileId] ??= [];

    for (const tileBorder of tileBorders) {
      const reversedTileBorder = tileBorder.split('').reverse().join('');

      for (const innerTileBorder of innerTileBorders) {
        const reversedInnerTileBorder = innerTileBorder.split('').reverse().join('');

        if ([tileBorder, reversedTileBorder].includes(innerTileBorder)
          || [tileBorder, reversedTileBorder].includes(reversedInnerTileBorder)) {
          neighbours[tileId].push(innerTileId);
          neighbours[innerTileId].push(tileId);
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
// const tilesAndNeighbours = {};
// for (const [index, [tileId, tileBorders]] of tiles.entries()) {
//   tilesAndNeighbours[tileId] ??= { top: '', right: '', bottom: '', left: '' };

//   for (const [innerTileId, innerTileBorders] of tiles.slice(index + 1)) {
//     tilesAndNeighbours[innerTileId] ??= { top: '', right: '', bottom: '', left: '' };

//     for (const [tileIndex, tileBorder] of tileBorders.entries()) {
//       const reversedTileBorder = tileBorder.split('').reverse().join('');

//       for (const [innerTileIndex, innerTileBorder] of innerTileBorders.entries()) {
//         const reversedInnerTileBorder = innerTileBorder.split('').reverse().join('');

//         if (tileBorder === innerTileBorder) {
//           neighbours[tileId][innerTileId] ??= [];
//           neighbours[tileId][innerTileId].push(tileBorder);
//           neighbours[innerTileId][tileId] ??= [];
//           neighbours[innerTileId][tileId].push(innerTileBorder);
//         }

//         if (tileBorder === reversedInnerTileBorder) {
//           neighbours[tileId][innerTileId] ??= [];
//           neighbours[tileId][innerTileId].push(tileBorder);
//           neighbours[innerTileId][tileId] ??= [];
//           neighbours[innerTileId][tileId].push(reversedInnerTileBorder);
//         }

//         if (reversedTileBorder === innerTileBorder) {
//           neighbours[tileId][innerTileId] ??= [];
//           neighbours[tileId][innerTileId].push(reversedTileBorder);
//           neighbours[innerTileId][tileId] ??= [];
//           neighbours[innerTileId][tileId].push(innerTileBorder);
//         }

//         if (reversedTileBorder === reversedInnerTileBorder) {
//           neighbours[tileId][innerTileId] ??= [];
//           neighbours[tileId][innerTileId].push(reversedTileBorder);
//           neighbours[innerTileId][tileId] ??= [];
//           neighbours[innerTileId][tileId].push(reversedInnerTileBorder);
//         }
//       }
//     }
//   }
// }
