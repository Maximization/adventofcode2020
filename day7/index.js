/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const bagRules = input.split('.\n');

/* Part 1 */
function hasShinyGoldBag(bagColor) {
  const bagRule = bagRules.find((bagRule) => bagRule.startsWith(bagColor));
  if (bagRule.endsWith('no other bags')) {
    return false;
  }

  const [, childrenBags] = bagRule.split(' bags contain ');
  const childrenBagColors = childrenBags.split(', ')
    .map((childBagSpecification) => childBagSpecification.match(/^\d (\w.*?) bag|bags$/)[1]);

  if (childrenBagColors.includes('shiny gold')) {
    return true;
  }

  return childrenBagColors.some(hasShinyGoldBag);
};

const bagsThatCanHoldMyBag = bagRules.filter((bagRule) => {
  const [bagColor] = bagRule.split(' bags contain ');
  return hasShinyGoldBag(bagColor);
});
console.log('Answer part 1:', bagsThatCanHoldMyBag.length);

/* Part 2 */
function getNoOfBags(bagColor) {
  const bagRule = bagRules.find((bagRule) => bagRule.startsWith(bagColor));
  if (bagRule.endsWith('no other bags')) {
    return 0;
  }

  const [, childrenBag] = bagRule.split(' bags contain ');
  const childrenBagSpecifications = childrenBag.split(', ');

  return childrenBagSpecifications.reduce((sumOfBags, childBagSpecification) => {
    const [, noOfBags, childBagColor] = childBagSpecification.match(/(^\d) (\w.*?) bag|bags$/);
    return sumOfBags + Number(noOfBags) + Number(noOfBags) * getNoOfBags(childBagColor);
  }, 0);
};

console.log('Answer part 2:', getNoOfBags('shiny gold'));
