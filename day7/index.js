/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

/* Part 1 */
const bagsRules = input.split('.\n');

function traverseBagRulesPart1(bagColor) {
  const bagRule = bagsRules.find((bagRule) => bagRule.startsWith(bagColor));
  if (bagRule.endsWith('no other bags')) {
    return false;
  }

  const [, childrenBag] = bagRule.split(' bags contain ');
  const childrenBagColors = childrenBag.split(', ')
    .map((childrenBagColor) => childrenBagColor.match(/^\d (\w.*?) bag|bags$/)[1]);

  if (childrenBagColors.includes('shiny gold')) {
    return true;
  }

  return childrenBagColors.some((childrenBagColor) => traverseBagRulesPart1(childrenBagColor));
};

const bagsThatCanHoldMyBag = bagsRules
  .filter((bagRule) => {
    const [bagColor] = bagRule.split(' bags contain ');
    return traverseBagRulesPart1(bagColor);
  });
console.log('Answer part 1:', bagsThatCanHoldMyBag.length);

/* Part 2 */
function traverseBagRulesPart2(bagColor) {
  const bagRule = bagsRules.find((bagRule) => bagRule.startsWith(bagColor));
  if (bagRule.endsWith('no other bags')) {
    return 0;
  }

  const [, childrenBag] = bagRule.split(' bags contain ');
  const childrenBagSpecifications = childrenBag.split(', ');

  return childrenBagSpecifications
    .reduce((sumOfBags, childrenBagSpecification) => {
      const [, noOfBags, childrenBagColor] = childrenBagSpecification.match(/(^\d) (\w.*?) bag|bags$/);
      return sumOfBags + Number(noOfBags) + Number(noOfBags) * traverseBagRulesPart2(childrenBagColor);
    }, 0);
};

console.log('Answer part 2:', traverseBagRulesPart2('shiny gold'));
