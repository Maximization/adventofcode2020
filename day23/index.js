'use strict';

/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

const parsedCups = input.split('').map(Number);
const highestCup = Math.max(...parsedCups);

/* Part 1 */
(() => {
  const cups = [...parsedCups];
  let move = 1;
  let indexOfCurrentCup = 0;
  let currentCup = cups[indexOfCurrentCup];
  while (move <= 100) {
    let threeCups = cups.splice(indexOfCurrentCup + 1, 3);
    while (threeCups.length < 3) {
      threeCups.push(cups.shift());
    }

    indexOfCurrentCup = cups.findIndex((cup) => cup === currentCup);

    let indexOfDestinationCup = -1;
    let destinationCup = currentCup;
    while (indexOfDestinationCup === -1) {
      destinationCup = destinationCup === 1 ? highestCup : (destinationCup - 1) % highestCup;
      indexOfDestinationCup = cups.findIndex((cup) => cup === destinationCup);
    }

    indexOfCurrentCup = (indexOfCurrentCup + 1) % cups.length;
    currentCup = cups[indexOfCurrentCup];

    cups.splice(indexOfDestinationCup + 1, 0, ...threeCups);
    indexOfCurrentCup = cups.findIndex((cup) => cup === currentCup);

    move++;
  }

  const indexOfOne = cups.findIndex((cup) => cup === 1);
  const finalLabels = `${cups.slice(indexOfOne + 1, cups.length).join('')}${cups.slice(0, indexOfOne).join('')}`;
  console.log('Answer part 1:', finalLabels);
})();

/* Part 2 */
(() => {
  // TODO
})();

