export const calculateTotals = (nutritionData) => {
  if (!nutritionData) return null;
  
  return nutritionData.reduce((acc, item) => ({
    calories: acc.calories + item.nutritionFacts.calories,
    protein: acc.protein + item.nutritionFacts.protein_g,
    carbs: acc.carbs + item.nutritionFacts.carbohydrates_g,
    fat: acc.fat + item.nutritionFacts.fat_g,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
};

export const formatFoodEntry = (item, imageFile) => ({
  imageUrl: imageFile ? URL.createObjectURL(imageFile) : '',
  ingredientName: item.ingredientName,
  portionSize_g: item['portionSize(g)'],
  calories: item.nutritionFacts.calories,
  protein_g: item.nutritionFacts.protein_g,
  carbohydrates_g: item.nutritionFacts.carbohydrates_g,
  fat_g: item.nutritionFacts.fat_g,
  fiber_g: item.nutritionFacts.fiber_g || 0,
  sugar_g: item.nutritionFacts.sugar_g || 0,
  sodium_mg: item.nutritionFacts.sodium_mg || 0,
  vitamin_A: item.nutritionFacts['Vitamin A'] || 0,
  vitamin_C: item.nutritionFacts['Vitamin C'] || 0,
  calcium: item.nutritionFacts['Calcium'] || 0,
  iron: item.nutritionFacts['Iron'] || 0,
});