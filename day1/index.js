/* Setup */
const fs = require('fs');
const path = require('path');
const expenseReport = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const expenses = expenseReport.split('\n')
  .map(Number);

/* Part 1 */
// Unoptimized solution: ~2.5ms
// let answerPart1;
// expenses.forEach((firstExpense) => {
//   expenses.forEach((secondExpense) => {
//     if (firstExpense + secondExpense == 2020) {
//       answerPart1 = firstExpense * secondExpense;
//     }
//   });
// });
// console.log('Answer part 1:', answerPart1);

// Optimized solution: ~0.3ms
let answerPart1;
const sortedExpenses = expenses.sort((a, b) => a - b);

for (let i = 0; i < sortedExpenses.length; i++) {
  const firstExpense = sortedExpenses[i];

  for (let j = i + 1; j < sortedExpenses.length; j++) {
    const secondExpense = sortedExpenses[j];

    if (firstExpense + secondExpense == 2020) {
      answerPart1 = firstExpense * secondExpense;
      break;
    }
  }

  if (answerPart1) {
    break;
  }
}
console.log('Answer part 1:', answerPart1);

/* Part 2 */
let answerPart2;
expenses.forEach((firstExpense) => {
  expenses.forEach((secondExpense) => {
    expenses.forEach((thirdExpense) => {
      if (firstExpense + secondExpense + thirdExpense == 2020) {
        answerPart2 = firstExpense * secondExpense * thirdExpense;
      }
    });
  });
});
console.log('Answer part 2:', answerPart2);
