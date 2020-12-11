/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const seatLayout = input.split('\n')
  .map((row) => row.split(''));

/* Part 1 */
(() => {
  let currentSeatLayout = [...seatLayout.map((row) => [...row])];
  let nextSeatLayout;
  let didLayoutChange = true;
  while (didLayoutChange) {
    didLayoutChange = false;

    nextSeatLayout = currentSeatLayout.map((row, rowIndex) => {
      const adjacentRowAbove = currentSeatLayout[rowIndex - 1];
      const adjacentRowBelow = currentSeatLayout[rowIndex + 1];

      return row.map((seat, columnIndex) => {
        const adjacentSeatLeft = columnIndex === 0 ? '' : row[columnIndex - 1];
        const adjacentSeatRight = columnIndex === row.length - 1 ? '' : row[columnIndex + 1];

        const lowerBound = columnIndex === 0 ? columnIndex : columnIndex - 1;
        const upperBound = columnIndex === row.length - 1 ? columnIndex + 1 : columnIndex + 2;
        const adjacentSeatsAbove = adjacentRowAbove ? adjacentRowAbove.slice(lowerBound, upperBound) : [];
        const adjacentSeatsBelow = adjacentRowBelow ? adjacentRowBelow.slice(lowerBound, upperBound) : [];

        const adjacentSeats = [...adjacentSeatsAbove, adjacentSeatLeft, adjacentSeatRight, ...adjacentSeatsBelow];
        const noOfOccupiedAdjacentSeats = adjacentSeats.filter((seat) => seat === '#').length;

        if (seat === 'L' && noOfOccupiedAdjacentSeats === 0) {
          didLayoutChange = true;
          return '#';
        } else if (seat === '#' && noOfOccupiedAdjacentSeats >= 4) {
          didLayoutChange = true;
          return 'L';
        }

        return seat;
      });
    });

    currentSeatLayout = nextSeatLayout;
  }

  const occupiedSeats = currentSeatLayout.reduce((occupiedSeats, row) => {
    return occupiedSeats + row.filter((seat) => seat === '#').length;
  }, 0);
  console.log('Answer part 1:', occupiedSeats);
})();

/* Part 2 */
(() => {
  function getAdjacentSeat(currentSeatLayout, rowIndex, columnIndex) {
    const adjacentPosition = currentSeatLayout[rowIndex][columnIndex];
    return adjacentPosition === '.' ? undefined : adjacentPosition;
  }

  let currentSeatLayout = [...seatLayout.map((row) => [...row])];
  let nextSeatLayout;
  let didLayoutChange = true;
  while (didLayoutChange) {
    didLayoutChange = false;

    nextSeatLayout = currentSeatLayout.map((row, rowIndex) => {
      return row.map((seat, columnIndex) => {
        if (seat === '.') {
          return seat;
        }

        let adjacentSeatTopLeft;
        let currentRowIndex = rowIndex - 1;
        let currentColumnIndex = columnIndex - 1;
        while (currentRowIndex >= 0 && currentColumnIndex >= 0 && !adjacentSeatTopLeft) {
          adjacentSeatTopLeft = getAdjacentSeat(currentSeatLayout, currentRowIndex, currentColumnIndex);
          currentRowIndex--;
          currentColumnIndex--;
        }

        let adjacentSeatTopCenter;
        currentRowIndex = rowIndex - 1;
        while (currentRowIndex >= 0 && !adjacentSeatTopCenter) {
          adjacentSeatTopCenter = getAdjacentSeat(currentSeatLayout, currentRowIndex, columnIndex);
          currentRowIndex--;
        }

        let adjacentSeatTopRight;
        currentRowIndex = rowIndex - 1;
        currentColumnIndex = columnIndex + 1;
        while (currentRowIndex >= 0 && currentColumnIndex < row.length && !adjacentSeatTopRight) {
          adjacentSeatTopRight = getAdjacentSeat(currentSeatLayout, currentRowIndex, currentColumnIndex);
          currentRowIndex--;
          currentColumnIndex++;
        }

        let adjacentSeatLeft;
        currentColumnIndex = columnIndex - 1;
        while (currentColumnIndex >= 0 && !adjacentSeatLeft) {
          adjacentSeatLeft = getAdjacentSeat(currentSeatLayout, rowIndex, currentColumnIndex);
          currentColumnIndex--;
        }

        let adjacentSeatRight;
        currentColumnIndex = columnIndex + 1;
        while (currentColumnIndex < row.length && !adjacentSeatRight) {
          adjacentSeatRight = getAdjacentSeat(currentSeatLayout, rowIndex, currentColumnIndex);
          currentColumnIndex++;
        }

        let adjacentSeatBottomLeft;
        currentRowIndex = rowIndex + 1;
        currentColumnIndex = columnIndex - 1;
        while (currentRowIndex < currentSeatLayout.length && currentColumnIndex >= 0 && !adjacentSeatBottomLeft) {
          adjacentSeatBottomLeft = getAdjacentSeat(currentSeatLayout, currentRowIndex, currentColumnIndex);
          currentRowIndex++;
          currentColumnIndex--;
        }

        let adjacentSeatBottomCenter;
        currentRowIndex = rowIndex + 1;
        while (currentRowIndex < currentSeatLayout.length && !adjacentSeatBottomCenter) {
          adjacentSeatBottomCenter = getAdjacentSeat(currentSeatLayout, currentRowIndex, columnIndex);
          currentRowIndex++;
        }

        let adjacentSeatBottomRight;
        currentRowIndex = rowIndex + 1;
        currentColumnIndex = columnIndex + 1;
        while (currentRowIndex < currentSeatLayout.length && currentColumnIndex < row.length && !adjacentSeatBottomRight) {
          adjacentSeatBottomRight = getAdjacentSeat(currentSeatLayout, currentRowIndex, currentColumnIndex);
          currentRowIndex++;
          currentColumnIndex++;
        }

        const adjacentSeats = [
          adjacentSeatTopLeft,
          adjacentSeatTopCenter,
          adjacentSeatTopRight,
          adjacentSeatLeft,
          adjacentSeatRight,
          adjacentSeatBottomLeft,
          adjacentSeatBottomCenter,
          adjacentSeatBottomRight,
        ];
        const noOfOccupiedAdjacentSeats = adjacentSeats.filter((seat) => seat === '#').length;

        if (seat === 'L' && noOfOccupiedAdjacentSeats === 0) {
          didLayoutChange = true;
          return '#';
        } else if (seat === '#' && noOfOccupiedAdjacentSeats >= 5) {
          didLayoutChange = true;
          return 'L';
        }

        return seat;
      });
    });

    currentSeatLayout = nextSeatLayout;
  }

  const occupiedSeats = currentSeatLayout.reduce((occupiedSeats, row) => {
    return occupiedSeats + row.filter((seat) => seat === '#').length;
  }, 0);
  console.log('Answer part 2:', occupiedSeats);
})();
