/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const adapters = input.split('\n').map(Number);
adapters.sort((a, b) => a - b);

/* Part 1 */
const sortedJoltDifferences = adapters
  .map((adapter, index, adapters) => adapters[index + 1] ? adapters[index + 1] - adapter : 3);
sortedJoltDifferences.unshift(adapters[0] - 0);

const oneJoltDifferences = sortedJoltDifferences.filter((joltDifference) => joltDifference === 1);
const threeJoltDifferences = sortedJoltDifferences.filter((joltDifference) => joltDifference === 3);
console.log('Answer part 1:', oneJoltDifferences.length * threeJoltDifferences.length);

/* Part 2 */
const graph = Object.fromEntries(
  adapters
    .map((adapter, index, sortedAdapters) => {
      const childrenAdapters = sortedAdapters.slice(index + 1, index + 4)
        .filter((nextAdapter) => nextAdapter - adapter <= 3);
      const adapterNode = [adapter, childrenAdapters];
      return adapterNode;
    })
);

let numberOfArrangements = 0;
function traverseGraph(adapter) {
  const childrenAdapters = graph[adapter];
  if (childrenAdapters.length === 0) {
    numberOfArrangements++;
    if (numberOfArrangements % 10000000 === 0) {
      console.log(numberOfArrangements);
    }
    return;
  }

  return childrenAdapters.forEach(traverseGraph);
}
console.log('Answer part 2:', traverseGraph(adapters[0]));
