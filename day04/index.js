/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

/* Part 1 */
const passports = input.split('\n\n')
  .map((passport) => passport.replaceAll('\n', ' '))
  .map((passport) => {
    return keyValuePairs = passport.split(' ')
      .map((keyValuePair) => keyValuePair.split(':'));
  });

const vaildPassportsPartOne = passports.filter((passport) => {
  const isCidPresent = passport.some(([fieldId]) => fieldId === 'cid');
  return passport.length === 8 || (passport.length === 7 && !isCidPresent);
});

console.log('Answer part 1:', vaildPassportsPartOne.length);

/* Part 2 */
const vaildPassportsPartTwo = passports.filter((passport) => {
  const passportObject = Object.fromEntries(passport);
  const isCidPresent = Boolean(passportObject.cid);

  if (passport.length < 7 || (passport.length < 8 && isCidPresent)) {
    return false;
  }

  passportObject.byr = Number(passportObject.byr);
  if (passportObject.byr < 1920 || passportObject.byr > 2002) {
    return false;
  }

  passportObject.iyr = Number(passportObject.iyr);
  if (passportObject.iyr < 2010 || passportObject.iyr > 2020) {
    return false;
  }

  passportObject.eyr = Number(passportObject.eyr);
  if (passportObject.eyr < 2020 || passportObject.eyr > 2030) {
    return false;
  }

  const measurementUnit = passportObject.hgt.slice(-2);
  const measurementValue = Number(passportObject.hgt.replace(measurementUnit, ''));
  if (measurementUnit === 'cm') {
    if (measurementValue < 150 || measurementValue > 193) {
      return false;
    }
  } else if (measurementUnit === 'in') {
    if (measurementValue < 59 || measurementValue > 76) {
      return false;
    }
  } else {
    return false;
  }

  if (!/^#[0-9a-f]{6}$/.test(passportObject.hcl)) {
    return false;
  }

  if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(passportObject.ecl)) {
    return false;
  }

  if (passportObject.pid.length !== 9 || /[^0-9]/.test(passportObject.pid)) {
    return false;
  }

  return true;
});
console.log('Answer part 2:', vaildPassportsPartTwo.length);
