/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

/* Part 1 */
const numbers = input.split('\n').map(Number);
const numberWithoutSumCombination = numbers.find((number, index, numbers) => {
  if (index < 25) {
    return false;
  }

  const previous25Numbers = numbers.slice(index - 25, index);
  let combinationFound = false;
  for (const [indexOfNumberOne, numberOne] of previous25Numbers.entries()) {
    for (const numberTwo of previous25Numbers.slice(indexOfNumberOne + 1)) {
      if (numberOne + numberTwo === number) {
        combinationFound = true;
        break;
      }
    }

    if (combinationFound === true) {
      break;
    }
  }

  return !combinationFound;
});
console.log('Answer part 1:', numberWithoutSumCombination);

/* Part 2 */
let encryptionWeakness;
for (const [index, number] of numbers.entries()) {
  let sum = number;
  let indexNested = index;
  do {
    indexNested++;
    const nextNumber = numbers[indexNested];
    sum += nextNumber;
  } while (sum < numberWithoutSumCombination);

  if (sum === numberWithoutSumCombination) {
    const contiguousSet = numbers.slice(index, indexNested - 1);
    const smallestNumber = Math.min(...contiguousSet);
    const largestNumber = Math.max(...contiguousSet);
    encryptionWeakness = smallestNumber + largestNumber;
    break;
  }
}
console.log('Answer part 2:', encryptionWeakness);
