// Sustainability calculations for carbon footprint tracking

export interface CarbonSavings {
  oatMilk: number;      // kg CO2 saved vs dairy
  almondMilk: number;
  coconutMilk: number;
  reusableCup: number;  // kg CO2 saved per use
}

// CO2 savings in kg per item
export const CARBON_SAVINGS: CarbonSavings = {
  oatMilk: 0.4,      // Oat milk produces ~0.4kg less CO2 than dairy per serving
  almondMilk: 0.35,
  coconutMilk: 0.38,
  reusableCup: 0.05, // Disposable cup + lid CO2 equivalent
};

export interface OrderCarbonImpact {
  totalSaved: number;
  breakdown: {
    label: string;
    amount: number;
  }[];
  treesEquivalent: number;
  milesEquivalent: number;
}

export function calculateOrderCarbonSavings(
  milkType: string,
  hasReusableCup: boolean,
  quantity: number = 1
): OrderCarbonImpact {
  const breakdown: { label: string; amount: number }[] = [];
  let totalSaved = 0;

  // Milk savings
  if (milkType === 'OAT') {
    const saved = CARBON_SAVINGS.oatMilk * quantity;
    totalSaved += saved;
    breakdown.push({ label: 'Oat milk choice', amount: saved });
  } else if (milkType === 'ALMOND') {
    const saved = CARBON_SAVINGS.almondMilk * quantity;
    totalSaved += saved;
    breakdown.push({ label: 'Almond milk choice', amount: saved });
  } else if (milkType === 'COCONUT') {
    const saved = CARBON_SAVINGS.coconutMilk * quantity;
    totalSaved += saved;
    breakdown.push({ label: 'Coconut milk choice', amount: saved });
  }

  // Reusable cup savings
  if (hasReusableCup) {
    const saved = CARBON_SAVINGS.reusableCup * quantity;
    totalSaved += saved;
    breakdown.push({ label: 'Reusable cup', amount: saved });
  }

  // Convert to equivalents
  // 1 tree absorbs ~21kg CO2 per year, so per day ~0.058kg
  // 1 mile of driving produces ~0.4kg CO2
  const treesEquivalent = totalSaved / 0.058; // Days of tree absorption
  const milesEquivalent = totalSaved / 0.4;   // Miles not driven

  return {
    totalSaved,
    breakdown,
    treesEquivalent,
    milesEquivalent,
  };
}

// User's cumulative sustainability stats (fake data for demo)
export interface SustainabilityStats {
  totalCO2Saved: number;      // kg
  treesPlanted: number;       // equivalent
  plasticCupsSaved: number;
  ecoOrders: number;
  streak: number;             // consecutive eco-friendly orders
}

export function getUserSustainabilityStats(): SustainabilityStats {
  // Fake stats for demo
  return {
    totalCO2Saved: 12.4,
    treesPlanted: 0.6,
    plasticCupsSaved: 47,
    ecoOrders: 23,
    streak: 5,
  };
}

// Format CO2 for display
export function formatCO2(kg: number): string {
  if (kg < 1) {
    return `${Math.round(kg * 1000)}g`;
  }
  return `${kg.toFixed(1)}kg`;
}

// Get eco badge level based on stats
export function getEcoBadgeLevel(stats: SustainabilityStats): {
  level: string;
  color: string;
  nextLevel: string;
  progress: number;
} {
  if (stats.ecoOrders >= 50) {
    return { level: 'Eco Champion', color: 'emerald', nextLevel: 'Max level!', progress: 100 };
  } else if (stats.ecoOrders >= 25) {
    return { level: 'Green Warrior', color: 'green', nextLevel: 'Eco Champion', progress: (stats.ecoOrders / 50) * 100 };
  } else if (stats.ecoOrders >= 10) {
    return { level: 'Earth Friend', color: 'lime', nextLevel: 'Green Warrior', progress: (stats.ecoOrders / 25) * 100 };
  } else {
    return { level: 'Eco Starter', color: 'yellow', nextLevel: 'Earth Friend', progress: (stats.ecoOrders / 10) * 100 };
  }
}
