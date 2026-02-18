'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, TrendingUp } from 'lucide-react';
import { SUBSCRIPTION_PLANS, calculateSavings, getRecommendedPlan, SubscriptionPlan } from '@/lib/subscription';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface SavingsCalculatorProps {
  onPlanRecommended?: (plan: SubscriptionPlan) => void;
}

export default function SavingsCalculator({ onPlanRecommended }: SavingsCalculatorProps) {
  const [drinksPerWeek, setDrinksPerWeek] = useState(7);
  const [avgPrice, setAvgPrice] = useState(5.5);
  const { t } = useTranslation();

  const recommendedPlan = getRecommendedPlan(drinksPerWeek);
  const savings = calculateSavings(drinksPerWeek, avgPrice, recommendedPlan);

  useEffect(() => {
    if (onPlanRecommended) {
      onPlanRecommended(recommendedPlan);
    }
  }, [drinksPerWeek, recommendedPlan, onPlanRecommended]);

  const regularMonthlyCost = drinksPerWeek * 4 * avgPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-[#1A3C8B] to-[#2D5BB9] p-6 text-white shadow-xl"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold">{t('subscription.calculator.title')}</h3>
          <p className="text-sm opacity-80">{t('subscription.calculator.subtitle')}</p>
        </div>
      </div>

      {/* Drinks per week slider */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">{t('subscription.calculator.drinksPerWeek')}</label>
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
            <Coffee className="h-4 w-4" />
            {drinksPerWeek}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="21"
          value={drinksPerWeek}
          onChange={(e) => setDrinksPerWeek(parseInt(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-white"
        />
        <div className="mt-1 flex justify-between text-xs opacity-60">
          <span>1</span>
          <span>7</span>
          <span>14</span>
          <span>21</span>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3 rounded-xl bg-white/10 p-4">
        <div className="flex justify-between text-sm">
          <span className="opacity-80">{t('subscription.calculator.withoutSub')}</span>
          <span className="font-medium">{formatPrice(regularMonthlyCost)}{t('subscription.card.perMonth')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="opacity-80">{t('subscription.calculator.withPlan').replace('{plan}', recommendedPlan.name)}</span>
          <span className="font-medium">{formatPrice(recommendedPlan.price)}{t('subscription.card.perMonth')}</span>
        </div>
        <div className="border-t border-white/20 pt-3">
          <div className="flex justify-between">
            <span className="font-medium">{t('subscription.calculator.yourSavings')}</span>
            <span className="text-xl font-bold text-green-300">
              {formatPrice(savings.monthlySavings)}{t('subscription.card.perMonth')}
            </span>
          </div>
          {savings.percentSaved > 0 && (
            <p className="mt-1 text-right text-sm text-green-300">
              {t('subscription.calculator.percentOff').replace('{percent}', savings.percentSaved.toString())}
            </p>
          )}
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-4 rounded-xl bg-white/10 p-3 text-center">
        <p className="text-sm">
          {t('subscription.calculator.recommend')}{' '}
          <span className="font-bold">{recommendedPlan.name}</span>
        </p>
      </div>
    </motion.div>
  );
}
