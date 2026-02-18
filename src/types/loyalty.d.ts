export interface LoyaltyAccountData {
  id: string;
  userId: string;
  points: number;
  totalEarned: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  streak: number;
  lastVisit: string | null;
}

export interface PointTransactionData {
  id: string;
  points: number;
  type: 'EARNED' | 'REDEEMED' | 'BONUS' | 'STREAK';
  description: string;
  orderId: string | null;
  createdAt: string;
}

export interface AchievementData {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface RedemptionOption {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  type: 'DISCOUNT' | 'FREE_DRINK' | 'UPGRADE';
}
