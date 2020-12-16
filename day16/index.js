/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const [unparsedFields, unparsedOurTicket, unparsedNearbyTickets] = input.split('\n\n');

/*
 * Parsing fields, our ticket and nearby tickets
 */

// Fields
// [
//   [ departure location, [30, 828, 839, 971] ],
//   [ departure station, [38, 339, 352, 958] ],
//   ...
// ]
//
const fields = unparsedFields.split('\n')
  .map((field) => {
    let [fieldName, fieldBoundaries] = field.split(': ');
    fieldBoundaries = fieldBoundaries.split(' or ')
      .flatMap((fieldBoundary) => fieldBoundary.split('-'))
      .map(Number);

    return [fieldName, fieldBoundaries];
  });

// Our ticket
// [139, 113, 127, ... ]
const ourTicket = unparsedOurTicket.split('\n')[1].split(',');

// Nearby tickets
// [
//   [475, 649, 830, ...],
//   [888, 593, 683, ...],
//   ...
// ]
const nearbyTickets = unparsedNearbyTickets.split('\n')
  .slice(1)
  .map((ticket) => ticket.split(',').map(Number));

/* Part 1 */
const sumOfInvalidValues = nearbyTickets
  // Get all invalid values from all tickets in a flattened array
  .flatMap((ticket) => {
    // Filter out invalid values for this ticket
    return ticket.filter((value) => {
      // Return true if value is invalid for all fields
      return !fields.some(([, fieldBoundaries]) => {
        const [
          lowerBoundaryFirstHalf,
          upperBoundaryFirstHalf,
          lowerBuondarySecondHalf,
          upperBoundarySecondHalf,
        ] = fieldBoundaries;

        // Return true if value is valid for current field
        return (value >= lowerBoundaryFirstHalf && value <= upperBoundaryFirstHalf)
          || (value >= lowerBuondarySecondHalf && value <= upperBoundarySecondHalf);
      })
    });
  })
  .reduce((acc, value) => acc + value, 0);
console.log('Answer part 1:', sumOfInvalidValues);

/* Part 2 */
const validTickets = nearbyTickets.filter((ticket) => {
  // Return true if all values in this ticket are valid
  return ticket.every((value) => {
      // Return true if value if valid for at least one field
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

// An object with keys denoting the position in the ticket and value all numbers at that position
// {
//   '0': [475, 888, 371, ...],
//   '1': [649, 593, 683, ...],
//   ...
// }
const valuesForPosition = validTickets.reduce((fieldsToValues, ticket) => {
  ticket.forEach((value, index) => {
    fieldsToValues[index] = fieldsToValues[index] ? fieldsToValues[index].concat(value) : [value];
  });

  return fieldsToValues;
}, {});

// Two dimensional array with possible fields at every position
// [
//    ['arrival location', 'price', 'route', ...],
//    ['departure location', 'departure station', 'departure platform', ...],
//    ...
// ]
let possibleFieldsForPosition = Object.values(valuesForPosition)
  .map((values) => {
    return fields.filter(([, fieldBoundaries]) => {
      const [
        lowerBoundaryFirstHalf,
        upperBoundaryFirstHalf,
        lowerBuondarySecondHalf,
        upperBoundarySecondHalf,
      ] = fieldBoundaries;

      return values.every((value) => {
        return (value >= lowerBoundaryFirstHalf && value <= upperBoundaryFirstHalf)
          || (value >= lowerBuondarySecondHalf && value <= upperBoundarySecondHalf);
      })
    })
    .map(([fieldName]) => fieldName);
  });

const fieldToPosition = {};
let hasPositionWithMultipleFields = possibleFieldsForPosition.some((fields) => fields.length > 1);
while (hasPositionWithMultipleFields) {
  // Find position with one field
  const position = possibleFieldsForPosition.findIndex((fields) => fields.length === 1);
  // Get single field for position
  const [fieldForPosition] = possibleFieldsForPosition[position];

  // Store mapping of field and discovered position
  fieldToPosition[fieldForPosition] = position;

  // Remove field from all other positions
  possibleFieldsForPosition = possibleFieldsForPosition.map((fields, index) => {
    return position === index ? [] : fields.filter((field) => field !== fieldForPosition);
  });

  // Do we still have positions with more than one field? If so, continue process of elimination
  hasPositionWithMultipleFields = possibleFieldsForPosition.some((fields) => fields.length > 1);
}

const positionsForDepartureFields = Object.entries(fieldToPosition)
  .filter(([fieldName]) => fieldName.startsWith('departure'))
  .map(([, fieldToPosition]) => fieldToPosition);

const productOfValues = ourTicket
  .filter((value, index) => positionsForDepartureFields.includes(index))
  .reduce((acc, value) => acc * value, 1);

console.log('Answer part 2:', productOfValues);
