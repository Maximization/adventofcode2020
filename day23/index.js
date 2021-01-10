'use strict';

/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const parsedCups = input.split('').map(Number);

/* Part 1 */
(() => {
  const cups = [...parsedCups];
  const highestCup = Math.max(...parsedCups);

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
  const TOTAL_CUPS = 1_000_000;
  const TOTAL_MOVES = 10_000_000;

  // Create a singly linked list using an array where the index is the cup label
  // and value is the next cup's label. We put a dummy value of 0 at the start so
  // that `cup` = index (since array indeces start at 0)
  // 389125467 is represented as [0, 2, 5, 8, 6, 4, 7, 3, 9, 1]
  const cups = [0];
  for (let cup = 1; cup <= TOTAL_CUPS; cup++) {
    let nextCup;
    if (cup <= parsedCups.length) {
      nextCup = parsedCups[parsedCups.indexOf(cup) + 1] || parsedCups.length + 1;
    } else if (cup === TOTAL_CUPS) {
      nextCup = parsedCups[0];
    } else {
      nextCup = cup + 1;
    }

    cups[cup] = nextCup;
  }

  let move = 1;
  let currentCup = parsedCups[0];
  while (move <= TOTAL_MOVES) {
    // Pick up three cups that are immediately clockwise of current cup
    const cupOne = cups[currentCup];
    const cupTwo = cups[cupOne];
    const cupThree = cups[cupTwo];
    cups[currentCup] = cups[cupThree];

    // Select destination cup
    let destinationCup = currentCup;
    do {
      // Cups with label below 1 don't exist so we wrap around to the highest label
      destinationCup = destinationCup === 1 ? TOTAL_CUPS : destinationCup - 1;
    } while ([cupOne, cupTwo, cupThree].includes(destinationCup))

    // Place three cups immediately clockwise of destination cup
    [cups[destinationCup], cups[cupThree]] = [cupOne, cups[destinationCup]];

    // Select new current cup, which is immediately clockwise of current cup
    currentCup = cups[currentCup];

    move++;
  }

  console.log('Answer part 2:', cups[1] * cups[cups[1]]);
})();
