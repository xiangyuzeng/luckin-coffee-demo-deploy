'use client';

import { motion } from 'framer-motion';
import { pointsToNextTier, TIER_THRESHOLDS } from '@/lib/loyalty';

interface PointsTrackerProps {
  points: number;
  totalEarned: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
}

const TIER_COLORS = {
  BRONZE: { bg: 'from-amber-600 to-amber-800', text: 'text-amber-100', badge: '#CD7F32' },
  SILVER: { bg: 'from-gray-400 to-gray-600', text: 'text-gray-100', badge: '#C0C0C0' },
  GOLD: { bg: 'from-yellow-400 to-yellow-600', text: 'text-yellow-100', badge: '#FFD700' },
};

const TIER_ICONS = { BRONZE: '🥉', SILVER: '🥈', GOLD: '🥇' };

export default function PointsTracker({ points, totalEarned, tier }: PointsTrackerProps) {
  const { nextTier, pointsNeeded } = pointsToNextTier(totalEarned);
  const colors = TIER_COLORS[tier];

  const currentThreshold = TIER_THRESHOLDS[tier];
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : totalEarned;
  const progress = nextTier
    ? ((totalEarned - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`luckin-gradient overflow-hidden rounded-2xl p-6 text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{tier} Member</p>
          <p className="text-4xl font-bold">{points.toLocaleString()}</p>
          <p className="text-sm opacity-80">points available</p>
        </div>
        <div className="text-5xl">{TIER_ICONS[tier]}</div>
      </div>

      {nextTier && (
        <div className="mt-4">
          <div className="flex justify-between text-xs opacity-80">
            <span>{tier}</span>
            <span>{pointsNeeded} pts to {nextTier}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
