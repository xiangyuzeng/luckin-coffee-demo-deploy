'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { getDailyQuote, getDailyFact } from '@/lib/coffee-content';

export default function CoffeeInsight() {
  const { locale, t } = useTranslation();
  const [quote, setQuote] = useState('');
  const [fact, setFact] = useState('');

  useEffect(() => {
    setQuote(getDailyQuote(locale));
    setFact(getDailyFact(locale));
  }, [locale]);

  if (!quote) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="w-full"
    >
      <div className="luckin-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#FFD700]" />
          <span className="text-xs font-medium uppercase tracking-wide text-[#1A3C8B]">
            {t('insight.label')}
          </span>
        </div>
        <p className="text-base font-medium italic text-gray-700">&ldquo;{quote}&rdquo;</p>
        {fact && (
          <p className="mt-2 text-xs text-gray-500">☕ {fact}</p>
        )}
      </div>
    </motion.div>
  );
}
