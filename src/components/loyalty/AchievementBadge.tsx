'use client';

import { motion } from 'framer-motion';

interface AchievementBadgeProps {
  allAchievements: { name: string; description: string; icon: string }[];
  earnedAchievements: string[];
}

export default function AchievementBadge({ allAchievements, earnedAchievements }: AchievementBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="mb-3 text-lg font-bold">Achievements</h2>
      <div className="grid grid-cols-4 gap-3">
        {allAchievements.map((achievement, i) => {
          const earned = earnedAchievements.includes(achievement.name);
          return (
            <motion.div
              key={achievement.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05 * i }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
                  earned
                    ? 'bg-[#1A3C8B]/10 shadow-sm'
                    : 'bg-gray-100 opacity-40 grayscale'
                }`}
              >
                {earned ? achievement.icon : '🔒'}
              </div>
              <span className={`text-center text-xs ${earned ? 'font-medium' : 'text-gray-400'}`}>
                {achievement.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
