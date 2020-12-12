/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const instructions = input.split('\n')
  .map((instruction) => [instruction[0], Number(instruction.slice(1))]);

/* Part 1 */
(() => {
  let xCoordinate = 0;
  let yCoordinate = 0;
  let currentHeadingDegrees = 90;
  for (const instruction of instructions) {
    const [action, value] = instruction;

    if (action === 'N' || (action === 'F' && currentHeadingDegrees === 0)) {
      yCoordinate += value;
    } else if (action === 'S' || (action === 'F' && currentHeadingDegrees === 180)) {
      yCoordinate -= value;
    } else if (action === 'E' || (action === 'F' && currentHeadingDegrees === 90)) {
      xCoordinate += value;
    } else if (action === 'W' || (action === 'F' && currentHeadingDegrees === 270)) {
      xCoordinate -= value;
    } else if (action === 'L') {
      currentHeadingDegrees -= value;
    } else if (action === 'R') {
      currentHeadingDegrees += value;
    }

    if (currentHeadingDegrees < 0) {
      currentHeadingDegrees = 360 + currentHeadingDegrees;
    } else if (currentHeadingDegrees >= 360) {
      currentHeadingDegrees = currentHeadingDegrees - 360;
    }
  }

  console.log('Answer part 1:', Math.abs(xCoordinate) + Math.abs(yCoordinate));
})();

/* Part 2 */
(() => {
  let xCoordinate = 0;
  let yCoordinate = 0;
  let waypointXCoordinate = 10;
  let waypointYCoordinate = 1;
  for (const instruction of instructions) {
    const [action, value] = instruction;

    if (action === 'N') {
      waypointYCoordinate += value;
    } else if (action === 'S') {
      waypointYCoordinate -= value;
    } else if (action === 'E') {
      waypointXCoordinate += value;
    } else if (action === 'W') {
      waypointXCoordinate -= value;
    } else if (action === 'L' && value === 90 || action === 'R' && value === 270) {
      [waypointXCoordinate, waypointYCoordinate] = [-waypointYCoordinate, waypointXCoordinate];
    } else if (action === 'L' && value === 270 || action === 'R' && value === 90) {
      [waypointXCoordinate, waypointYCoordinate] = [waypointYCoordinate, -waypointXCoordinate];
    } else if (action === 'L' && value === 180 || action === 'R' && value === 180) {
      [waypointXCoordinate, waypointYCoordinate] = [-waypointXCoordinate, -waypointYCoordinate];
    } else if (action === 'F') {
      xCoordinate += waypointXCoordinate * value;
      yCoordinate += waypointYCoordinate * value;
    }
  }

  console.log('Answer part 2:', Math.abs(xCoordinate) + Math.abs(yCoordinate));
})();
