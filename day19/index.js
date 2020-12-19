/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const [unparsedRules, unparsedMessages] = input.split('\n\n');

const parsedRules = unparsedRules.split('\n').map((rule) => rule.split(': '));
const messages = unparsedMessages.split('\n');

function evaluateRules(parsedRules) {
  const rules = {};
  const rulesToEvaluate = [...parsedRules];

  while (rulesToEvaluate.length) {
    for (const [index, [ruleId, ruleSpec]] of rulesToEvaluate.entries()) {
      const subRuleIds = ruleSpec.match(/(\d)+/g);

      if (!subRuleIds) {
        rules[ruleId] = ruleSpec.replaceAll('"', '').replaceAll(' ', '');
        rulesToEvaluate.splice(index, 1);
      } else {
        for (const subRuleId of subRuleIds) {
          const subRuleSpec = rules[subRuleId];

          if (subRuleSpec) {
            const replacement = subRuleSpec.includes('|') ? `(${subRuleSpec})` : subRuleSpec;
            rulesToEvaluate[index][1] = ruleSpec.replace(new RegExp(`\\b${subRuleId}\\b`), replacement);
          }
        }
      }
    }
  }

  return rules;
}

/* Part 1 */
(() => {
  const rules = evaluateRules(parsedRules);
  const matchedMessages = messages.filter((message) => new RegExp(`^${rules[0]}$`).test(message));
  console.log('Answer part 1:', matchedMessages.length);
})();

/* Part 2 */
(() => {
  const rules = evaluateRules(parsedRules);

  let noOfMatchedMessages;
  let newNoOfMatchedMessages;
  do {
    noOfMatchedMessages = messages.filter((message) => new RegExp(`^${rules[0]}$`).test(message)).length;

    rules[8] = `(${rules[42]})|(${rules[42]})(${rules[8]})`;
    rules[11] = `(${rules[42]})(${rules[31]})|(${rules[42]})(${rules[11]})(${rules[31]})`;
    rules[0] = `(${rules[8]})(${rules[11]})`;

    newNoOfMatchedMessages = messages.filter((message) => new RegExp(`^${rules[0]}$`).test(message)).length;
  } while (noOfMatchedMessages !== newNoOfMatchedMessages);

  console.log('Answer part 2:', noOfMatchedMessages);
})();
