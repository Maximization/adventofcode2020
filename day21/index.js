/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const foods = input.split('\n');

// Parse food so that each food item is an array with two elements:
// an array of ingredients and an array of allergens
const foodItems = foods.map((foodItem) => {
  const [unparsedIngredients, unparsedAllergens] = foodItem.split(' (contains ');
  const ingredients = unparsedIngredients.split(' ');
  const allergens = unparsedAllergens.slice(0, unparsedAllergens.length - 1).split(', ');
  return [ingredients, allergens];
});

const allergenToPossibleIngredients = {};
const ingredientToAllergen = {};

// As we go through each food item...
for (const [ingredients, foodItemAllergens] of foodItems) {

  // We go through each food item allergen
  for (const foodItemAllergen of foodItemAllergens) {
    // Grab possible ingredients of allergen
    const possibleIngredients = allergenToPossibleIngredients[foodItemAllergen];

    if (!possibleIngredients) {
      // First time we encounter allergen, save current ingredients as possible ingredients
      // except those ingredients that have already been assigned to an allergen
      allergenToPossibleIngredients[foodItemAllergen] = ingredients
        .filter((ingredient) => !ingredientToAllergen[ingredient]);
    } else if (possibleIngredients.length > 1) {
      // Remove possible ingredients that aren't present in current ingredients, or have already
      // been assigned to an allergen, and therefore cannot be associated with allergen
      const newPossibleIngredients = possibleIngredients
        .filter((possibleIngredient) => ingredients.includes(possibleIngredient) && !ingredientToAllergen[possibleIngredient]);
      allergenToPossibleIngredients[foodItemAllergen] = newPossibleIngredients;
    }

    // Found a matching ingredient for this allergen, remove ingredient from other allergens
    if (allergenToPossibleIngredients[foodItemAllergen].length === 1) {
      const [foundIngredient] = allergenToPossibleIngredients[foodItemAllergen];
      ingredientToAllergen[foundIngredient] = foodItemAllergen;

      for (const [allergen, possibleIngredients] of Object.entries(allergenToPossibleIngredients)) {
        // Do not remove found ingredient from current allergen
        if (allergen !== foodItemAllergen) {
          allergenToPossibleIngredients[allergen] = possibleIngredients
            .filter((possibleIngredient) => possibleIngredient !== foundIngredient);

          // Found another matching ingredient, add to ingredientToAllergen mapping
          if (allergenToPossibleIngredients[allergen].length === 1) {
            const [foundAnotherIngredient] = allergenToPossibleIngredients[allergen];
            ingredientToAllergen[foundAnotherIngredient] = allergen;
          }
        }
      }
    }
  }
}

/* Part 1 */
const noOfIngredientOccurencesWithoutAllergens = foodItems.flatMap(([ingredients]) => ingredients)
  .filter((ingredient) => !ingredientToAllergen[ingredient])
  .length;
console.log('Answer part 1:', noOfIngredientOccurencesWithoutAllergens);

/* Part 2 */
const dangerousIngredients = Object.entries(ingredientToAllergen)
  .sort(([, allergenA], [, allergenB]) => allergenA.localeCompare(allergenB))
  .map(([ingredient]) => ingredient)
  .join(',');
console.log('Answer part 2:', dangerousIngredients);
