/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

/* Part 1 */
function getNewRange(range, keepFirstHalf) {
  const [lowerBound, upperBound] = range;
  const newLowerBound = !keepFirstHalf ? lowerBound + Math.ceil((upperBound - lowerBound) / 2) : lowerBound;
  const newUpperBound = keepFirstHalf ? upperBound - Math.ceil((upperBound - lowerBound) / 2) : upperBound;

  return [newLowerBound, newUpperBound];
}

const seats = input.split('\n');
const seatIds = seats.map((seat) => {
  const rowInstructions = seat.slice(0, 7).split('');
  const columnInstructions = seat.slice(-3).split('');

  const [rowNumber] = rowInstructions.reduce((range, rowInstruction) => {
    const newRange = getNewRange(range, rowInstruction === 'F');
    return newRange;
  }, [0, 127]);

  const [columnNumber] = columnInstructions.reduce((range, columnInstruction) => {
    const newRange = getNewRange(range, columnInstruction === 'L');
    return newRange;
  }, [0, 7]);

  return rowNumber * 8 + columnNumber;
});
console.log('Answer part 1:', Math.max(...seatIds));

/* Part 2 */
const [seatIdBelowMySeatId] = seatIds
  .sort((a, b) => a - b)
  .filter((seatId, index, seatIds) => {
    return index < seatIds.length - 1 && seatIds[index + 1] !== seatId + 1;
  });

console.log('Answer part 2:', seatIdBelowMySeatId + 1);
