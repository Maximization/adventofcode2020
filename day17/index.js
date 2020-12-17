/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const twoDGrid = input.split('\n').map((xLine) => xLine.split(''));

// Helper function to create a (y) line of inactive cubes
function createInactiveYLine(width) {
  return Array(width).fill('.');
}

// Helper function to create a (z) slice of inactive cubes
function createInactiveZSlice(width, height) {
  const zSlice = [];
  for (let i = 0; i < height; i++) {
    zSlice.push(createInactiveYLine(width));
  }

  return zSlice;
}

// Add inactive cubes in the x dimension
function expandYLine(yLine) {
  return ['.', ...yLine, '.'];
}

// Add inactive cubes in the y dimension
function expandZSlice(zSlice) {
  const newZSlice = zSlice.map(expandYLine);
  const width = newZSlice[0].length;
  return [createInactiveYLine(width), ...newZSlice, createInactiveYLine(width)];
}

// Add inactive cubes in the z dimension
function expandWCube(wCube) {
  const newWCube = wCube.map(expandZSlice);
  const width = newWCube[0][0].length;
  const height = newWCube[0].length;
  return [createInactiveZSlice(width, height), ...newWCube, createInactiveZSlice(width, height)];
}

/* Part 1 */
(() => {
  let threeDGrid = [twoDGrid];

  for (let cycle = 1; cycle <= 6; cycle++) {
    threeDGrid = expandWCube(threeDGrid)
      .map((zSlice, zIndex, expandedThreeDGrid) => {
        // Grab slices at z-1 and z+1
        const zBack = expandedThreeDGrid[zIndex - 1] || [];
        const zFront = expandedThreeDGrid[zIndex + 1] || [];

        return zSlice.map((yLine, yIndex) => {
          // Grab lines at y-1 and y+1
          const yLineTop = zSlice[yIndex - 1] || [];
          const yLineBottom = zSlice[yIndex + 1] || [];

          return yLine.map((cube, xIndex) => {
            const neighboursCurrentZSlice = [
              yLine[xIndex - 1],
              yLine[xIndex + 1],
              yLineTop[xIndex],
              yLineBottom[xIndex],
              yLineTop[xIndex - 1],
              yLineTop[xIndex + 1],
              yLineBottom[xIndex - 1],
              yLineBottom[xIndex + 1],
            ];

            const neighboursAdjacentSlices = [zBack, zFront].flatMap((adjacentSlice) => {
              return adjacentSlice.flatMap((yLineAdjacentSlice, yIndexAdjacentSlice) => {
                // Discard lines in the y dimension that aren't adjacent to the cube
                if (yIndexAdjacentSlice < yIndex - 1 || yIndexAdjacentSlice > yIndex + 1) {
                  return [];
                }

                const leftBound = xIndex === 0 ? 0 : xIndex - 1;
                const rightBound = xIndex === yLineAdjacentSlice.length - 1 ? xIndex : xIndex + 2;
                return yLineAdjacentSlice.slice(leftBound, rightBound);
              });
            });

            const sumOfActiveNeighbours = [
              ...neighboursCurrentZSlice,
              ...neighboursAdjacentSlices,
            ]
              .filter((cube) => cube === '#')
              .length;

            if (cube === '#' && (sumOfActiveNeighbours < 2 || sumOfActiveNeighbours > 3)) {
              return '.';
            } else if (sumOfActiveNeighbours === 3) {
              return '#';
            }

            return cube;
          });
        });
      });
  }

  const sumOfActiveCubes = threeDGrid.flat(2).filter((cube) => cube === '#').length;
  console.log('Answer part 1:', sumOfActiveCubes);
})();

/* Part 2 */

// Helper function to create a (w) cube of inactive cubes
function createInactiveWCube(width, height, depth) {
  const wCube = [];
  for (let i = 0; i < depth; i++) {
    wCube.push(createInactiveZSlice(width, height));
  }

  return wCube;
}

// Add inactive cubes in the w dimension
function expandTesseract(tesseract) {
  const newTesseract = tesseract.map(expandWCube);
  const width = newTesseract[0][0][0].length;
  const height = newTesseract[0][0].length;
  const depth = newTesseract[0].length;
  return [
    createInactiveWCube(width, height, depth),
    ...newTesseract,
    createInactiveWCube(width, height, depth)
  ];
}

(() => {
  let fourDGrid = [[twoDGrid]];

  for (let cycle = 1; cycle <= 6; cycle++) {
    fourDGrid = expandTesseract(fourDGrid)
      .map((wCube, wIndex, expandedFourDGrid) => {
        // Grab cubes at w-1 and w+1
        const wMinusOne = expandedFourDGrid[wIndex - 1] || [];
        const wPlusOne = expandedFourDGrid[wIndex + 1] || [];

        return wCube.map((zSlice, zIndex) => {
          // Grab slices at z-1 and z+1
          const zBack = wCube[zIndex - 1] || [];
          const zFront = wCube[zIndex + 1] || [];

          return zSlice.map((yLine, yIndex) => {
            // Grab lines at y-1 and y+1
            const yLineTop = zSlice[yIndex - 1] || [];
            const yLineBottom = zSlice[yIndex + 1] || [];

            return yLine.map((cube, xIndex) => {
              const neighboursCurrentZSlice = [
                yLine[xIndex - 1],
                yLine[xIndex + 1],
                yLineTop[xIndex],
                yLineBottom[xIndex],
                yLineTop[xIndex - 1],
                yLineTop[xIndex + 1],
                yLineBottom[xIndex - 1],
                yLineBottom[xIndex + 1],
              ];

              const neighboursAdjacentSlices = [zBack, zFront].flatMap((adjacentSlice) => {
                return adjacentSlice.flatMap((yLineAdjacentSlice, yIndexAdjacentSlice) => {
                  // Discard lines in the y dimension that aren't adjacent to the cube
                  if (yIndexAdjacentSlice < yIndex - 1 || yIndexAdjacentSlice > yIndex + 1) {
                    return [];
                  }

                  const leftBound = xIndex === 0 ? 0 : xIndex - 1;
                  const rightBound = xIndex === yLineAdjacentSlice.length - 1 ? xIndex : xIndex + 2;
                  return yLineAdjacentSlice.slice(leftBound, rightBound);
                });
              });

              const neighboursAdjacentCubes = [wMinusOne, wPlusOne].flatMap((adjacentCube) => {
                return adjacentCube.flatMap((zSliceAdjacentCube, zIndexAdjacentCube) => {
                  // Discard slices in the z dimension that aren't adjacent to the cube
                  if (zIndexAdjacentCube < zIndex - 1 || zIndexAdjacentCube > zIndex + 1) {
                    return [];
                  }

                  return zSliceAdjacentCube.flatMap((yLineAdjacentCube, yIndexAdjacentCube) => {
                    // Discard lines in the y dimension that aren't adjacent to the cube
                    if (yIndexAdjacentCube < yIndex - 1 || yIndexAdjacentCube > yIndex + 1) {
                      return [];
                    }

                    const leftBound = xIndex === 0 ? 0 : xIndex - 1;
                    const rightBound = xIndex === yLineAdjacentCube.length - 1 ? xIndex : xIndex + 2;
                    return yLineAdjacentCube.slice(leftBound, rightBound);
                  });
                });
              });

              const sumOfActiveNeighbours = [
                ...neighboursCurrentZSlice,
                ...neighboursAdjacentSlices,
                ...neighboursAdjacentCubes,
              ]
                .filter((cube) => cube === '#')
                .length;

              if (cube === '#' && (sumOfActiveNeighbours < 2 || sumOfActiveNeighbours > 3)) {
                return '.';
              } else if (sumOfActiveNeighbours === 3) {
                return '#';
              }

              return cube;
            });
          });
        });
      });
  }

  const sumOfActiveCubes = fourDGrid.flat(3).filter((cube) => cube === '#').length;
  console.log('Answer part 2:', sumOfActiveCubes);
})();
