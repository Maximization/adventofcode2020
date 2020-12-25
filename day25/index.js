'use strict';

/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

const [publicKeyCard, publicKeyDoor] = input.split('\n').map(Number);

/* Part 1 */

// Calculate loop size of the card
let value = 1;
let loopSizeCard = 0;
while (value !== publicKeyCard) {
  loopSizeCard++;
  value = (value * 7) % 20201227;
}

// Calculate encryption key
let encryptionKey = 1;
let i = 1;
while (i <= loopSizeCard) {
  encryptionKey = (encryptionKey * publicKeyDoor) % 20201227;
  i++
}

console.log('Answer part 1:', encryptionKey);
