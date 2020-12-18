/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const expressions = input.split('\n');

// Evaluate an expression with possible characters being: ' ', '*', '+', '(', ')' and any digits
// Unlike real math, addition and multiplication have equal precedence
function evaluateExpression(tokens) {
  let leftOperand;
  let operator;
  let numberString = '';
  let token = tokens.shift(tokens);

  while (token) {
    const isNumber = token !== ' ' && !isNaN(Number(token));
    const isOperator = token === '+' || token === '*';
    const isOpenParanthesis = token === '(';
    const isClosingParanthesis = token === ')';

    if (isClosingParanthesis) {
      break;
    }

    if (isOperator) {
      operator = token;
    } else if (isNumber || isOpenParanthesis) {
      if (isNumber) {
        numberString += token;
      }

      const nextTokenisNumber = tokens[0] !== ' ' && !isNaN(Number(tokens[0]));
      if (isNumber && !nextTokenisNumber || isOpenParanthesis) {
        const result = isNumber ? Number(numberString) : evaluateExpression(tokens);
        leftOperand = leftOperand
          ? operator === '+' ? leftOperand + result : leftOperand * result
          : result;
        numberString = '';
      }
    }

    token = tokens.shift();
  }

  return leftOperand;
}

/* Part 1 */
const sumOfExpressionsPart1 = expressions.reduce((acc, expression) => acc + evaluateExpression(expression.split('')), 0);
console.log('Answer part 1:', sumOfExpressionsPart1);

/* Part 2 */

// Evaluate expression with addition taking precedence over multiplication
function evaluateExpressionPart2(expression) {
  // Clean expression of parantheses that hold a single number: (10) -> 10
  const cleanExpression = expression.replace(/\((?<number>\d+)\)/g, '$<number>');

  const additionExpression = cleanExpression.match(/(?<match>\d+ \+ \d+)/)?.groups?.match;
  const multiplicationExpression = cleanExpression.match(/(?<match>\(\d+( \* \d+)+\))/)?.groups?.match;

  // Evaluate additions first, otherwise multiplications surrounded by parantheses
  const expressionToEvaluate = additionExpression || multiplicationExpression;
  if (expressionToEvaluate) {
    const result = evaluateExpression(expressionToEvaluate.split(''));
    const newExpression = cleanExpression.replace(expressionToEvaluate, String(result));
    return evaluateExpressionPart2(newExpression);
  }

  // Otherwise we only have multiplications and no parantheses so evaluate like in Part 1
  return evaluateExpression(expression.split(''));
}

const sumOfExpressionsPart2 = expressions.reduce((acc, expression) => acc + evaluateExpressionPart2(expression), 0);
console.log('Answer part 2:', sumOfExpressionsPart2);
