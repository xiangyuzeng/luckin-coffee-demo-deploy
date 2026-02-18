'use client';

import { motion } from 'framer-motion';

interface StreakCounterProps {
  streak: number;
  lastVisit: string | null;
}

export default function StreakCounter({ streak, lastVisit }: StreakCounterProps) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
      filled: i >= 7 - streak,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="luckin-card p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-lg font-bold">{streak}-Day Streak</p>
            <p className="text-xs text-gray-500">Keep ordering daily!</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.05 * i }}
              className={`h-8 w-8 rounded-full ${
                day.filled
                  ? 'bg-[#1A3C8B] text-white'
                  : 'bg-gray-100 text-gray-400'
              } flex items-center justify-center text-xs font-medium`}
            >
              {day.filled ? '✓' : ''}
            </motion.div>
            <span className="text-xs text-gray-400">{day.day}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
