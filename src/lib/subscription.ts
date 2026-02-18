// Subscription plan definitions for Luckin Pass

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  drinks: number | 'unlimited';
  includes: string[];
  features: string[];
  popular?: boolean;
  savings?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29.99,
    drinks: 20,
    includes: ['Drip coffee', 'Cold brew', 'Americano'],
    features: [
      '20 drinks per month',
      'Basic coffee selection',
      'Skip the line ordering',
      '10% off food items',
    ],
    savings: 'Save up to $30/month',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    drinks: 'unlimited',
    includes: ['All drinks'],
    features: [
      'Unlimited drinks',
      'All drink categories',
      'Free size upgrades',
      '15% off food items',
      'Priority pickup',
    ],
    popular: true,
    savings: 'Best value for daily drinkers',
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 69.99,
    drinks: 'unlimited',
    includes: ['All drinks', 'Food items'],
    features: [
      'Unlimited drinks',
      'All drink categories',
      '2 free food items/day',
      'Free size upgrades',
      'Free milk alternatives',
      'VIP lounge access',
      'Exclusive member events',
    ],
    savings: 'Ultimate coffee experience',
  },
];

// Calculate potential savings based on usage
export function calculateSavings(
  drinksPerWeek: number,
  avgDrinkPrice: number = 5.5,
  plan: SubscriptionPlan
): { monthlySavings: number; percentSaved: number } {
  const drinksPerMonth = drinksPerWeek * 4;
  const regularCost = drinksPerMonth * avgDrinkPrice;

  let effectiveDrinks = drinksPerMonth;
  if (typeof plan.drinks === 'number') {
    effectiveDrinks = Math.min(drinksPerMonth, plan.drinks);
  }

  const savingsFromDrinks = effectiveDrinks * avgDrinkPrice;
  const monthlySavings = savingsFromDrinks - plan.price;
  const percentSaved = regularCost > 0 ? Math.round((monthlySavings / regularCost) * 100) : 0;

  return {
    monthlySavings: Math.max(0, monthlySavings),
    percentSaved: Math.max(0, percentSaved),
  };
}

// Get recommended plan based on usage
export function getRecommendedPlan(drinksPerWeek: number): SubscriptionPlan {
  if (drinksPerWeek <= 5) {
    return SUBSCRIPTION_PLANS[0]; // Basic
  } else if (drinksPerWeek <= 10) {
    return SUBSCRIPTION_PLANS[1]; // Premium
  } else {
    return SUBSCRIPTION_PLANS[2]; // Elite
  }
}
