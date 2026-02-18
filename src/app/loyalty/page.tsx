'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { redirect } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import PointsTracker from '@/components/loyalty/PointsTracker';
import StreakCounter from '@/components/loyalty/StreakCounter';
import AchievementBadge from '@/components/loyalty/AchievementBadge';
import RewardsCarousel from '@/components/loyalty/RewardsCarousel';
import Loading from '@/components/Loading';
import { ACHIEVEMENTS } from '@/lib/loyalty';

interface LoyaltyData {
  id: string;
  points: number;
  totalEarned: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  streak: number;
  lastVisit: string | null;
  achievements: { id: string; name: string; description: string; icon: string; earnedAt: string }[];
  transactions: { id: string; points: number; type: string; description: string; createdAt: string }[];
}

export default function LoyaltyPage() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/login');
    }
  }, [status]);

  useEffect(() => {
    if (!session?.user) return;

    async function fetchLoyalty() {
      try {
        const res = await fetch('/api/loyalty');
        if (res.ok) {
          const data = await res.json();
          setLoyaltyData(data);
        }
      } catch (error) {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchLoyalty();
  }, [session]);

  if (loading || status === 'loading') {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!loyaltyData) return null;

  const earnedNames = loyaltyData.achievements.map((a) => a.name);

  return (
    <div className="w-full space-y-6 pb-20 pt-4">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold"
      >
        {t('loyalty.myRewards')}
      </motion.h1>

      <PointsTracker
        points={loyaltyData.points}
        totalEarned={loyaltyData.totalEarned}
        tier={loyaltyData.tier}
      />

      <StreakCounter
        streak={loyaltyData.streak}
        lastVisit={loyaltyData.lastVisit}
      />

      <RewardsCarousel points={loyaltyData.points} />

      <AchievementBadge
        allAchievements={ACHIEVEMENTS}
        earnedAchievements={earnedNames}
      />

      {/* Recent Transactions */}
      {loyaltyData.transactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="mb-3 text-lg font-bold">{t('loyalty.recentActivity')}</h2>
          <div className="luckin-card divide-y divide-gray-100">
            {loyaltyData.transactions.slice(0, 10).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-sm font-bold ${tx.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.points > 0 ? '+' : ''}{tx.points} pts
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
