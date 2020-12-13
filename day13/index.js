/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

/* Part 1 */
const timestampEstimate = Number(input.split('\n')[0]);
const busesInService = input.split('\n')[1]
  .split(',')
  .filter((bus) => bus !== 'x')
  .map(Number);

const waitingTimes = busesInService.map((bus) => bus - (timestampEstimate % bus));
const shortestWaitingTime = Math.min(...waitingTimes);
const busIdWithShortestWaitingTime = busesInService[waitingTimes.findIndex((waitingTime) => waitingTime === shortestWaitingTime)];

console.log('Answer part 1:', shortestWaitingTime * busIdWithShortestWaitingTime);

/* Part 2 */

/*
 * This problem is similar to the Chinese Remainder Theorem
 *
 * Introduction to CRT and brute-force solution:
 * https://www.geeksforgeeks.org/chinese-remainder-theorem-set-1-introduction/
 *
 * The puzzle hints the earliest timestamp is not before 100 trillion. Therefore a brute-force approach will
 * take far too long to resolve to an answer. We'll have to use an Inverse Modulo based solution instead:
 * https://www.geeksforgeeks.org/chinese-remainder-theorem-set-2-implementation/
 *
 * Given `x` (our timestamp answer for part 2), the equation we need to solve is:
 * x = ( ∑ (busDelay[i] * productDividedByBusId[i] * modularInverse[i]) ) % productOfBusIds
 *
 * `busDelay` is the bus position in the schedule
 * `productOfBusIds` is the product of all bus IDs
 * `productDividedByBusId` is product of all bus IDs divided by bus ID
 * `modularInverse` is the Modular Multiplicative Inverse of `productDividedByBusId` with respect to bus ID
 *
 * Visual explanations of maths used in this solution:
 * Chinese Remainder Theorem - https://www.youtube.com/watch?v=ru7mWZJlRQg
 * Modular arithmetic - https://www.youtube.com/watch?v=2zEXtoQDpXY
 * Greatest Common Divisor - https://www.youtube.com/watch?v=klTIrnovoEE
 * Euclid's algorithm - https://www.youtube.com/watch?v=5jLWXwSXJdg
 * Modular inverse - https://www.youtube.com/watch?v=mgvA3z-vOzc
 */

const busToIndexMap = Object.fromEntries(
  input.split('\n')[1]
    .split(',')
    .map((bus, index) => [bus, index])
    .filter(([bus]) => bus !== 'x')
);

const productOfBusIds = Object.keys(busToIndexMap)
  .map(Number)
  .reduce((acc, busId) => acc * busId, 1);

/*
 * Given two integers `a` and `m`, find modular multiplicative inverse of `a` under modulo `m`.
 * The modular multiplicative inverse is an integer `x` such that:
 * a * x ≅ 1 (mod m)
 *
 * The value of `x` should be in {0, 1, 2, … m-1}, i.e., in the range of integer modulo `m`.
 * The multiplicative inverse of “a modulo m” exists if and only if `a` and `m` are
 * relatively prime (i.e., if gcd(a, m) = 1).
 */
function calculateModularInverse(a, m) {
  if (m === 1) {
    return 0;
  }

  let nextA = a;
  let nextM = m;
  let previousX = 1;
  let currentX = 0;
  while (nextA > 1) {
    const quotient = Math.floor(nextA / nextM);
    const remainder = nextA % nextM;
    [nextA, nextM] = [nextM, remainder];
    [previousX, currentX] = [currentX, previousX - quotient * currentX];
  }

  if (previousX < 0) {
    previousX += m;
  }

  return previousX;
}

const result = Object.entries(busToIndexMap)
  .reduce((acc, [busId, busIndex]) => {
    const busDelay = Number(busId) - busIndex;
    const productDividedByBusId = productOfBusIds / busId;
    const modularInverse = calculateModularInverse(productDividedByBusId, Number(busId));

    return acc + BigInt(busDelay) * BigInt(productDividedByBusId) * BigInt(modularInverse);
  }, BigInt(0));

console.log('Answer part 2:', result % BigInt(productOfBusIds));
