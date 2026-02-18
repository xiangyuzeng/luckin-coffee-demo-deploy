// Fake nutritional data for demo purposes
// Values are approximate and for demonstration only

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  caffeine: number; // mg
  sugar: number;
  fiber: number;
}

// Base nutrition by drink type (for medium size)
const BASE_NUTRITION: Record<string, NutritionInfo> = {
  latte: { calories: 190, protein: 10, carbs: 18, fat: 7, caffeine: 150, sugar: 14, fiber: 0 },
  cappuccino: { calories: 120, protein: 8, carbs: 12, fat: 5, caffeine: 150, sugar: 10, fiber: 0 },
  americano: { calories: 15, protein: 1, carbs: 2, fat: 0, caffeine: 225, sugar: 0, fiber: 0 },
  espresso: { calories: 5, protein: 0, carbs: 1, fat: 0, caffeine: 75, sugar: 0, fiber: 0 },
  coldBrew: { calories: 5, protein: 0, carbs: 0, fat: 0, caffeine: 200, sugar: 0, fiber: 0 },
  mocha: { calories: 290, protein: 11, carbs: 38, fat: 11, caffeine: 150, sugar: 32, fiber: 2 },
  refresher: { calories: 90, protein: 0, carbs: 22, fat: 0, caffeine: 45, sugar: 20, fiber: 0 },
  matcha: { calories: 240, protein: 12, carbs: 32, fat: 7, caffeine: 80, sugar: 28, fiber: 1 },
  tea: { calories: 0, protein: 0, carbs: 0, fat: 0, caffeine: 40, sugar: 0, fiber: 0 },
  food: { calories: 350, protein: 8, carbs: 45, fat: 15, caffeine: 0, sugar: 18, fiber: 2 },
};

// Modifiers for milk types
const MILK_MODIFIERS: Record<string, Partial<NutritionInfo>> = {
  REGULAR: { calories: 0, fat: 0, protein: 0 },
  OAT: { calories: 20, fat: 1, protein: -2, carbs: 4 },
  ALMOND: { calories: -30, fat: -2, protein: -3 },
  COCONUT: { calories: 10, fat: 3, protein: -4 },
};

// Size modifiers (multipliers)
const SIZE_MODIFIERS: Record<string, number> = {
  SMALL: 0.75,
  MEDIUM: 1,
  LARGE: 1.35,
};

function getDrinkType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('refresher')) return 'refresher';
  if (lower.includes('cold brew')) return 'coldBrew';
  if (lower.includes('matcha')) return 'matcha';
  if (lower.includes('mocha')) return 'mocha';
  if (lower.includes('latte')) return 'latte';
  if (lower.includes('cappuccino')) return 'cappuccino';
  if (lower.includes('americano')) return 'americano';
  if (lower.includes('espresso')) return 'espresso';
  if (lower.includes('tea')) return 'tea';
  if (lower.includes('croissant') || lower.includes('muffin') || lower.includes('sandwich')) return 'food';
  return 'latte'; // default
}

export function getNutritionForDrink(
  drinkName: string,
  size: string = 'MEDIUM',
  milkType: string = 'REGULAR'
): NutritionInfo {
  const drinkType = getDrinkType(drinkName);
  const base = BASE_NUTRITION[drinkType] || BASE_NUTRITION.latte;
  const sizeMultiplier = SIZE_MODIFIERS[size] || 1;
  const milkMod = MILK_MODIFIERS[milkType] || MILK_MODIFIERS.REGULAR;

  return {
    calories: Math.round((base.calories + (milkMod.calories || 0)) * sizeMultiplier),
    protein: Math.round((base.protein + (milkMod.protein || 0)) * sizeMultiplier),
    carbs: Math.round((base.carbs + (milkMod.carbs || 0)) * sizeMultiplier),
    fat: Math.round((base.fat + (milkMod.fat || 0)) * sizeMultiplier),
    caffeine: Math.round(base.caffeine * sizeMultiplier),
    sugar: Math.round(base.sugar * sizeMultiplier),
    fiber: Math.round(base.fiber * sizeMultiplier),
  };
}

// Quick nutrition badge info (calories + caffeine)
export function getQuickNutrition(drinkName: string): { calories: number; caffeine: number } {
  const nutrition = getNutritionForDrink(drinkName);
  return {
    calories: nutrition.calories,
    caffeine: nutrition.caffeine,
  };
}

// Caffeine level indicator
export function getCaffeineLevel(caffeine: number): 'none' | 'low' | 'medium' | 'high' {
  if (caffeine === 0) return 'none';
  if (caffeine < 75) return 'low';
  if (caffeine < 175) return 'medium';
  return 'high';
}

// Format caffeine for display
export function formatCaffeine(caffeine: number): string {
  if (caffeine === 0) return 'Caffeine-free';
  return `${caffeine}mg caffeine`;
}
