/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const adapters = input.split('\n').map(Number);
adapters.sort((a, b) => a - b);
const adaptersWithOutlet = [0, ...adapters];

/* Part 1 */
const sortedJoltDifferences = adaptersWithOutlet
  .map((adapter, index) => adaptersWithOutlet[index + 1] ? adaptersWithOutlet[index + 1] - adapter : 3);

const oneJoltDifferences = sortedJoltDifferences.filter((joltDifference) => joltDifference === 1);
const threeJoltDifferences = sortedJoltDifferences.filter((joltDifference) => joltDifference === 3);
console.log('Answer part 1:', oneJoltDifferences.length * threeJoltDifferences.length);

/* Part 2 */
const graph = Object.fromEntries(
  adaptersWithOutlet.map((adapter, index) => {
    const childrenAdapters = adaptersWithOutlet.slice(index + 1, index + 4)
      .filter((nextAdapter) => nextAdapter - adapter <= 3);
    return [adapter, childrenAdapters];
  })
);

let memoization = {};
function numberOfArrangements(adapter) {
  if (!memoization[adapter]) {
    const childrenAdapters = graph[adapter];
    memoization[adapter] = childrenAdapters.length
      ? childrenAdapters.reduce((acc, childAdapter) => acc + numberOfArrangements(childAdapter), 0)
      : 1;
  }

  return memoization[adapter];
}

console.log('Answer part 2:', numberOfArrangements(0));
