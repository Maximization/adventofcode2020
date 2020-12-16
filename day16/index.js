/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const [unparsedFields, ourTicket, unparsedNearbyTickets] = input.split('\n\n');

const fields = unparsedFields.split('\n').map((field) => {
  let [fieldName, fieldBoundaries] = field.split(': ');
  fieldBoundaries = fieldBoundaries.split(' or ')
    .flatMap((fieldBoundary) => fieldBoundary.split('-'))
    .map(Number);

  return [fieldName, fieldBoundaries];
});

const [, ...nearbyTickets] = unparsedNearbyTickets.split('\n')
  .map((ticket) => ticket.split(','));

/* Part 1 */
const sumOfInvalidValues = nearbyTickets
  .flatMap((ticket) => {
    return ticket.map(Number).filter((value) => {
      return !fields.some(([, fieldBoundaries]) => {
        const [
          lowerBoundaryFirstHalf,
          upperBoundaryFirstHalf,
          lowerBuondarySecondHalf,
          upperBoundarySecondHalf,
        ] = fieldBoundaries;

        return (value >= lowerBoundaryFirstHalf && value <= upperBoundaryFirstHalf)
          || (value >= lowerBuondarySecondHalf && value <= upperBoundarySecondHalf);
      })
    });
  })
  .reduce((acc, value) => acc + value, 0);
console.log('Answer part 1:', sumOfInvalidValues);

/* Part 2 */
const validTickets = nearbyTickets.filter((ticket) => {
  return ticket.map(Number).every((value) => {
      return fields.some(([, fieldBoundaries]) => {
        const [
          lowerBoundaryFirstHalf,
          upperBoundaryFirstHalf,
          lowerBuondarySecondHalf,
          upperBoundarySecondHalf,
        ] = fieldBoundaries;

        return (value >= lowerBoundaryFirstHalf && value <= upperBoundaryFirstHalf)
        || (value >= lowerBuondarySecondHalf && value <= upperBoundarySecondHalf);
      })
    });
});

const fieldsToValues = validTickets.reduce((fieldsToValues, ticket) => {
  ticket.forEach((value, index) => {
    fieldsToValues[index] = fieldsToValues[index]
      ? fieldsToValues[index].concat(value)
      : [value];
  });

  return fieldsToValues;
}, {});

let fieldsInOrder = Object.entries(fieldsToValues)
  .map(([position, values]) => {
    return fields.filter(([, fieldBoundaries]) => {
      const [
        lowerBoundaryFirstHalf,
        upperBoundaryFirstHalf,
        lowerBuondarySecondHalf,
        upperBoundarySecondHalf,
      ] = fieldBoundaries;

      const areAllValuesValid = values.map(Number).every((value) => {
        return (value >= lowerBoundaryFirstHalf && value <= upperBoundaryFirstHalf)
          || (value >= lowerBuondarySecondHalf && value <= upperBoundarySecondHalf);
      })

      return areAllValuesValid;
    })
    .map(([fieldName]) => fieldName);
  });

let fieldsInOrderCopy = [...fieldsInOrder];
let hasMoreThanOneField = fieldsInOrderCopy.some((fields) => fields.length > 1);
const fieldToPosition = {};
while (hasMoreThanOneField) {
  // Find position with one field
  const position = fieldsInOrderCopy.findIndex((fields) => fields.length === 1);

  // Get single field for position
  const [fieldForPosition] = fieldsInOrderCopy[position];

  fieldToPosition[fieldForPosition] = position;

  fieldsInOrderCopy = fieldsInOrderCopy
    .map((fields, index) => {
      return position === index ? [] : fields.filter((field) => field !== fieldForPosition);
    });

  hasMoreThanOneField = fieldsInOrderCopy.some((fields) => fields.length > 1);
}

const positionsForDepartureFields = Object.entries(fieldToPosition)
  .filter(([fieldName, fieldPosition]) => fieldName.startsWith('departure'))
  .map(([, fieldToPosition]) => fieldToPosition);

const productOfValues = ourTicket.split('\n')[1].split(',')
  .map(Number)
  .filter((value, index) => positionsForDepartureFields.includes(index))
  .reduce((acc, value) => acc * value, 1);

console.log('Answer part 2:', productOfValues);
