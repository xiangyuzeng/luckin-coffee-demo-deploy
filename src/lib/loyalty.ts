export const POINTS_PER_DOLLAR = 10;

export const TIER_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 500,
  GOLD: 1500,
} as const;

export const STREAK_BONUSES: Record<number, number> = {
  3: 50,
  7: 150,
  14: 400,
  30: 1000,
};

export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD';

export interface RedemptionOption {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  type: 'DISCOUNT' | 'FREE_DRINK' | 'UPGRADE';
}

export const REDEMPTION_OPTIONS: RedemptionOption[] = [
  { id: 'discount-1', name: '$1 Off Any Drink', pointsCost: 200, description: 'Save $1 on your next drink order', type: 'DISCOUNT' },
  { id: 'upgrade-1', name: 'Free Size Upgrade', pointsCost: 500, description: 'Upgrade any drink to the next size for free', type: 'UPGRADE' },
  { id: 'free-classic', name: 'Free Classic Drink', pointsCost: 800, description: 'Any classic menu drink on the house', type: 'FREE_DRINK' },
  { id: 'free-signature', name: 'Free Signature Drink', pointsCost: 1500, description: 'Any signature menu drink on the house', type: 'FREE_DRINK' },
];

export function calculatePointsForOrder(orderTotal: number): number {
  return Math.round(orderTotal * POINTS_PER_DOLLAR);
}

export function calculateTier(totalEarned: number): LoyaltyTier {
  if (totalEarned >= TIER_THRESHOLDS.GOLD) return 'GOLD';
  if (totalEarned >= TIER_THRESHOLDS.SILVER) return 'SILVER';
  return 'BRONZE';
}

export function pointsToNextTier(totalEarned: number): { nextTier: LoyaltyTier | null; pointsNeeded: number } {
  if (totalEarned >= TIER_THRESHOLDS.GOLD) return { nextTier: null, pointsNeeded: 0 };
  if (totalEarned >= TIER_THRESHOLDS.SILVER) return { nextTier: 'GOLD', pointsNeeded: TIER_THRESHOLDS.GOLD - totalEarned };
  return { nextTier: 'SILVER', pointsNeeded: TIER_THRESHOLDS.SILVER - totalEarned };
}

export function calculateStreak(lastVisit: Date | null, currentDate: Date = new Date()): { newStreak: number; bonusPoints: number; isStreakDay: boolean } {
  if (!lastVisit) {
    return { newStreak: 1, bonusPoints: 0, isStreakDay: true };
  }

  const diffMs = currentDate.getTime() - lastVisit.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  // Same day - no streak increment
  if (diffHours < 24 && currentDate.getDate() === lastVisit.getDate()) {
    return { newStreak: 0, bonusPoints: 0, isStreakDay: false };
  }

  // Next day (within 48 hours) - streak continues
  if (diffHours < 48) {
    const newStreak = 1; // Will be added to existing streak externally
    let bonusPoints = 0;

    // Check if any streak milestone is hit (will be checked against total)
    return { newStreak: 1, bonusPoints, isStreakDay: true };
  }

  // More than 48 hours - streak broken
  return { newStreak: 1, bonusPoints: 0, isStreakDay: true };
}

export function getStreakBonus(streak: number): number {
  let bonus = 0;
  for (const [milestone, points] of Object.entries(STREAK_BONUSES)) {
    if (streak === parseInt(milestone)) {
      bonus = points;
    }
  }
  return bonus;
}

export function getAvailableRedemptions(points: number): RedemptionOption[] {
  return REDEMPTION_OPTIONS.filter((option) => points >= option.pointsCost);
}

export const ACHIEVEMENTS = [
  { name: 'First Sip', description: 'Place your first order', icon: '☕' },
  { name: 'Regular', description: 'Place 10 orders', icon: '🏆' },
  { name: 'Devoted Fan', description: 'Place 50 orders', icon: '⭐' },
  { name: 'Signature Explorer', description: 'Try a signature drink', icon: '✨' },
  { name: 'Category Hopper', description: 'Order from every category', icon: '🎯' },
  { name: 'Week Warrior', description: '7-day order streak', icon: '🔥' },
  { name: 'Month Master', description: '30-day order streak', icon: '💎' },
  { name: 'Gold Member', description: 'Reach Gold tier', icon: '👑' },
];
