/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const startingNumbers = input.split(',').map(Number);

/* Part 1 */
(() => {
  const memoryGame = [...startingNumbers];
  let i = startingNumbers.length;
  while (i < 2020) {
    const previousNumber = memoryGame[i - 1];
    const indexOfPreviousNumberSpokenBefore = memoryGame.lastIndexOf(previousNumber, i - 2);
    memoryGame[i] = indexOfPreviousNumberSpokenBefore === -1
    ? 0
    : (i - 1) - indexOfPreviousNumberSpokenBefore;

    i++;
  }

  console.log('Answer part 1:', memoryGame[2019]);
})();

/* Part 2 */
(() => {
  const memoryGame = [...startingNumbers];
  let i = startingNumbers.length;
  const previousIndexOfNumber = new Map(memoryGame.map((number, index) => [number, index]));
  const previous2ndIndexOfNumber = new Map();
  while (i < 30000000) {
    const previousNumber = memoryGame[i - 1];
    const secondIndexOfNumber = previous2ndIndexOfNumber.get(previousNumber);
    const currentNumber = secondIndexOfNumber !== undefined ? (i - 1) - secondIndexOfNumber : 0;
    memoryGame[i] = currentNumber;

    const firstIndexOfNumber = previousIndexOfNumber.get(currentNumber);
    if (firstIndexOfNumber !== undefined) {
      previous2ndIndexOfNumber.set(currentNumber, firstIndexOfNumber);
    }

    previousIndexOfNumber.set(currentNumber, i);
    i++;
  }

  console.log('Answer part 2:', memoryGame[30000000 - 1]);
})();
