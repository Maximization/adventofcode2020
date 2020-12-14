/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const instructions = input.split('\n')
  .map((instruction) => instruction.split(' = '));

/* Part 1 */
(() => {
  const memory = [];
  let bitmask;
  for (const [variable, value] of instructions) {
    if (variable === 'mask') {
      bitmask = value;
    } else {
      const memoryAddress = Number(variable.slice(4, -1));
      const valueBinary = Number(value).toString(2).padStart(36, '0');
      const valueBinaryMasked = bitmask.split('')
        .map((bit, index) => bit === 'X' ? valueBinary[index] : bit)
        .join('');
      const valueMasked = parseInt(valueBinaryMasked, 2);
      memory[memoryAddress] = valueMasked;

      // This doesn't work for some reason
      // const maskedValue = BigInt(Number(value))
      //   | BigInt(parseInt(bitmask.replaceAll('X', '0'), 2))
      //   & BigInt(parseInt(bitmask.replaceAll('X', '1'), 2));
      // memory[memoryAddress] = Number(maskedValue);
    }
  }

  const sum = memory.filter(Boolean).reduce((acc, value) => acc + value, 0);
  console.log('Answer part 1:', sum);
})();

/* Part 2 */
(() => {
  function getPermutations(binary) {
    if (!binary.includes('X')) {
      return [binary];
    }

    const zeroVariant = binary.replace('X', '0');
    const oneVariant = binary.replace('X', '1');
    return [...getPermutations(zeroVariant), ...getPermutations(oneVariant)];
  }

  const memory = new Map();
  let bitmask;
  for (const [variable, value] of instructions) {
    if (variable === 'mask') {
      bitmask = value;
    } else {
      const memoryAddress = Number(variable.slice(4, -1));
      const memoryAddressBinary = memoryAddress.toString(2).padStart(36, '0');
      const memoryAddressBinaryMasked = bitmask.split('')
        .map((bit, index) => bit === '0' ? memoryAddressBinary[index] : bit)
        .join('');

      getPermutations(memoryAddressBinaryMasked).forEach((permutation) => {
        const memoryAddressMasked = parseInt(permutation, 2);
        memory.set(memoryAddressMasked, Number(value));
      });
    }
  }

  const sum = [...memory.values()].reduce((acc, value) => acc + value, 0);
  console.log('Answer part 2:', sum);
})();
