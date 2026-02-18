'use client';

import { motion } from 'framer-motion';
import { getMockWeather } from '@/lib/weather';

export default function WeatherWidget() {
  const weather = getMockWeather();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="w-full"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
        <span className="text-lg">{weather.icon}</span>
        <span className="text-sm text-gray-700">
          {weather.temp}°C & {weather.condition} · {weather.suggestion}
        </span>
      </div>
    </motion.div>
  );
}
