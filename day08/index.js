/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const bootInstructions = input.split('\n');

/* Part 1 */
(() => {
  const bootCommands = [...bootInstructions];
  let accumulator = 0;
  let i = 0;
  let command = bootCommands[i];
  while (!command.startsWith('x')) {
    const [operation, argument] = command.split(' ');
    const operand = argument.slice(0, 1);
    const value = Number(argument.slice(1));
    bootCommands[i] = 'x' + command;

    if (operation === 'acc') {
      accumulator = operand === '+' ? accumulator + value : accumulator - value;
      i += 1;
    } else if (operation === 'jmp') {
      i = operand === '+' ? i + value : i - value;
    } else {
      i += 1;
    }

    command = bootCommands[i];
  }

  console.log('Answer part 1:', accumulator);
})();

/* Part 2 */
(() => {
  const bootCommands = [...bootInstructions];
  let accumulator = 0;
  let i = 0;
  let command = bootCommands[i];
  while (true) {
    let [operation, argument] = command.split(' ');
    const operand = argument.slice(0, 1);
    const value = Number(argument.slice(1));

    if (operation === 'acc') {
      accumulator = operand === '+' ? accumulator + value : accumulator - value;
      bootCommands[i] = 'x' + command;
      i += 1;
    } else {
      const newCommands = [...bootCommands];
      newCommands[i] = operation === 'jmp'
        ? bootCommands[i].replace('jmp', 'nop')
        : bootCommands[i].replace('nop', 'jmp');

      let accumulatorNested = accumulator;
      let j = i;
      let commandNested = newCommands[j];
      while (commandNested && !commandNested.startsWith('x')) {
        let [operationNested, argumentNested] = commandNested.split(' ');
        const operandNested = argumentNested.slice(0, 1);
        const valueNested = Number(argumentNested.slice(1));

        newCommands[j] = 'x' + commandNested;

        if (operationNested === 'acc') {
          accumulatorNested = operandNested === '+' ? accumulatorNested + valueNested : accumulatorNested - valueNested;
          j += 1;
        } else if (operationNested === 'jmp') {
          j = operandNested === '+' ? j + valueNested : j - valueNested;
        } else {
          j += 1;
        }

        commandNested = newCommands[j];
      }

      // Program executed successfully
      if (!commandNested) {
        console.log('Answer part 2:', accumulatorNested);
        break;
      }

      // Program encountered an infinite loop
      bootCommands[i] = 'x' + command;
      if (operation === 'jmp') {
        i = operand === '+' ? i + value : i - value;
      } else {
        i += 1;
      }
    }

    command = bootCommands[i];
  }
})();
