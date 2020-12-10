/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const adapters = input.split('\n').map(Number);
adapters.sort((a, b) => a - b);

/* Part 1 */
const sortedJoltDifferences = adapters
  .map((adapter, index) => adapters[index + 1] ? adapters[index + 1] - adapter : 3);
sortedJoltDifferences.unshift(adapters[0] - 0);

const oneJoltDifferences = sortedJoltDifferences.filter((joltDifference) => joltDifference === 1);
const threeJoltDifferences = sortedJoltDifferences.filter((joltDifference) => joltDifference === 3);
console.log('Answer part 1:', oneJoltDifferences.length * threeJoltDifferences.length);

/* Part 2 */
// const graph = Object.fromEntries(
//   adapters
//     .map((adapter, index, sortedAdapters) => {
//       const childrenAdapters = sortedAdapters.slice(index + 1, index + 4)
//         .filter((nextAdapter) => nextAdapter - adapter <= 3);
//       const adapterNode = [adapter, childrenAdapters];
//       return adapterNode;
//     })
// );

function numberOfArrangements(adapter) {
  const index = adapters.indexOf(adapter);
  const childrenAdapters = adapters.slice(index + 1, index + 4)
    .filter((nextAdapter) => nextAdapter - adapter <= 3);

  if (childrenAdapters.length === 0) {
    return 1;
  } else if (childrenAdapters.length === 1) {
    return numberOfArrangements(childrenAdapters[0]);
  } else if (childrenAdapters.length === 2) {
    return numberOfArrangements(childrenAdapters[0]) + numberOfArrangements(childrenAdapters[1]);
  } else {
    return numberOfArrangements(childrenAdapters[0]) + numberOfArrangements(childrenAdapters[1]) + numberOfArrangements(childrenAdapters[2]);
  }
}
console.log('Answer part 2:', numberOfArrangements(adapters[0]));
