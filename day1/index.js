/* Setup */
const fs = require('fs');
const path = require('path');
const expenseReport = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const expenses = expenseReport.split('\n')
  .map(Number);

/* Part 1 */
// Unoptimized solution: 2.5ms
// expenses.forEach((expense) => {
//   expenses.forEach((secondExpense) => {
//     if (expense + secondExpense == 2020) {
//       console.log('Answer part 1:', expense * secondExpense);
//     }
//   });
// });

// Optimized solution: ~0.3ms
const sortedExpenses = expenses.sort((a, b) => a - b);

let answerPart1;
for (let i = 0; i < expenses.length; i++) {
  const firstExpense = expenses[i];

  for (let j = i + 1; j < expenses.length; j++) {
    const secondExpense = expenses[j];

    if (firstExpense + secondExpense == 2020) {
      answerPart1 = firstExpense * secondExpense;
      break;
    }
  }

  if (answerPart1) {
    break;
  }
}
console.log('Answer part 1', answerPart1);

/* Part 2 */
expenses.forEach((expense) => {
  expenses.forEach((secondExpense) => {
    expenses.forEach((thirdExpense) => {
      if (expense + secondExpense + thirdExpense == 2020) {
        console.log('Answer part 2:', expense * secondExpense * thirdExpense);
      }
    });
  });
});
