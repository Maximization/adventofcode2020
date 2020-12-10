/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

/* Part 1 */
const sumOfAnswersPart1 = input.split('\n\n')
  .map((groupAnswers) => {
    return [...new Set(groupAnswers.split('\n').join('').split(''))].length;
  })
  .reduce((sumOfAnswers, uniqueYesAnswersForGroup) => sumOfAnswers + uniqueYesAnswersForGroup, 0);
console.log('Answer part 1:', sumOfAnswersPart1);

/* Part 2 */
const sumOfAnswersPart2 = input.split('\n\n')
  .map((groupAnswers) => {
    const personsAnswers = groupAnswers.split('\n');

    return personsAnswers[0].split('')
      .filter((questionAnswerOfFirstPerson) => {
        return personsAnswers.slice(1).every((personAnswers) => {
          return personAnswers.includes(questionAnswerOfFirstPerson);
        });
      })
      .length;
  })
  .reduce((sumOfAnswers, combinedYesAnswersForGroup) => sumOfAnswers + combinedYesAnswersForGroup, 0);
console.log('Answer part 2:', sumOfAnswersPart2);
