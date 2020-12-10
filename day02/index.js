/* Setup */
const fs = require('fs');
const path = require('path');
const passwordDatabase = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const passwordEntries = passwordDatabase.split('\n');

/* Part 1 */
const validPasswordsPartOne = passwordEntries.filter((entry) => {
  let [policy, password] = entry.split(':');

  // Policy
  const [pairOfBounds, letter] = policy.split(' ');
  const [lowerBound, upperBound] = pairOfBounds.split('-').map(Number);

  // Password
  password = password.trim();

  const regex = new RegExp(`[^${letter}]*`, 'g');
  const noOfOccurrences = password.replace(regex, '').length;
  const isPasswordValid = noOfOccurrences >= lowerBound && noOfOccurrences <= upperBound;

  return isPasswordValid;
});
console.log('Answer part 1:', validPasswordsPartOne.length);

/* Part 2 */
const validPasswordsPartTwo = passwordEntries.filter((entry) => {
  let [policy, password] = entry.split(':');

  // Policy
  const [pairOfPositions, letter] = policy.split(' ');
  const [positionOne, positionTwo] = pairOfPositions.split('-').map(Number);

  // Password
  password = password.trim();

  const letterAtPositionOne = password[positionOne - 1];
  const letterAtPositionTwo = password[positionTwo - 1];

  let isPasswordValid;
  if (letterAtPositionOne !== letter && letterAtPositionTwo !== letter) {
    isPasswordValid = false;
  } else if (letterAtPositionOne === letter && letterAtPositionTwo === letter) {
    isPasswordValid = false;
  } else {
    isPasswordValid = true;
  }

  return isPasswordValid;
});
console.log('Answer part 2:', validPasswordsPartTwo.length);
