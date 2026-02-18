'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore, DEFAULT_CUSTOMIZATION } from '@/lib/store';
import { Recommendation } from '@/lib/ai-barista';
import { WeatherData } from '@/lib/weather';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function AIBaristaCard() {
  const [data, setData] = useState<{ recommendation: Recommendation | null; weather: WeatherData | null } | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchRecommendation() {
      try {
        const res = await fetch('/api/recommendations');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        // silently fail
      }
    }
    fetchRecommendation();
  }, []);

  if (!data?.recommendation) return null;

  const { recommendation } = data;
  const { menu, matchPercentage, reason, zeroSugarAvailable } = recommendation;

  const handleAddToCart = () => {
    addToCart(menu, 'MEDIUM', 1, DEFAULT_CUSTOMIZATION);
    toast.success(`${menu.name} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full"
    >
      <p className="mb-2 text-sm text-gray-500">{reason}</p>

      <div className="luckin-card relative overflow-hidden p-4">
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-[#1A3C8B] px-3 py-1 text-xs font-bold text-white">
            {matchPercentage}% MATCH
          </span>
        </div>

        <div className="flex items-center gap-4">
          {menu.images?.[0] && (
            <img
              src={menu.images[0].url}
              alt={menu.name}
              className="h-16 w-16 rounded-xl object-cover"
            />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold">{menu.name}</h3>
            {zeroSugarAvailable && (
              <p className="text-sm text-green-600">{t('menu.zeroSugar')}</p>
            )}
            <p className="mt-1 text-lg font-bold text-[#1A3C8B]">
              {formatPrice(menu.price)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-full bg-[#1A3C8B] py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#2D5BB9]"
          >
            {t('common.addToCart')}
          </button>
          <button
            onClick={() => window.location.href = '/menu'}
            className="rounded-full border border-[#1A3C8B] px-6 py-3 text-sm font-medium text-[#1A3C8B] transition-colors hover:bg-[#1A3C8B]/5"
          >
            {t('common.customize')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
