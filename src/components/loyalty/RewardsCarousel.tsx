'use client';

import { motion } from 'framer-motion';
import { REDEMPTION_OPTIONS } from '@/lib/loyalty';
import { toast } from 'sonner';

interface RewardsCarouselProps {
  points: number;
}

export default function RewardsCarousel({ points }: RewardsCarouselProps) {
  const handleRedeem = async (rewardId: string) => {
    try {
      const res = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId }),
      });
      if (res.ok) {
        toast.success('Reward redeemed!');
      } else {
        toast.error('Failed to redeem');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="mb-3 text-lg font-bold">Available Rewards</h2>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {REDEMPTION_OPTIONS.map((reward, i) => {
          const canRedeem = points >= reward.pointsCost;
          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`min-w-[200px] flex-shrink-0 luckin-card p-4 ${
                !canRedeem ? 'opacity-50' : ''
              }`}
            >
              <p className="text-sm font-bold">{reward.name}</p>
              <p className="mt-1 text-xs text-gray-500">{reward.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[#1A3C8B]">
                  {reward.pointsCost} pts
                </span>
                <button
                  onClick={() => canRedeem && handleRedeem(reward.id)}
                  disabled={!canRedeem}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium ${
                    canRedeem
                      ? 'bg-[#1A3C8B] text-white hover:bg-[#2D5BB9]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Redeem
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
