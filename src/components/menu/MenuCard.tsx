'use client';

import { motion } from 'framer-motion';
import { ExtendedMenu } from '@/types/menu';
import { formatPrice } from '@/lib/utils';
import { getQuickNutrition, getCaffeineLevel } from '@/lib/fake-data/nutrition';
import { Flame, Zap } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface MenuCardProps {
  menu: ExtendedMenu;
  onClick: () => void;
  index: number;
}

export default function MenuCard({ menu, onClick, index }: MenuCardProps) {
  const { t } = useTranslation();
  const nutrition = getQuickNutrition(menu.name);
  const caffeineLevel = getCaffeineLevel(nutrition.caffeine);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className={`luckin-card overflow-hidden transition-shadow hover:shadow-md ${menu.isSignature ? 'ring-2 ring-[#FFD700]/50' : ''}`}>
        <div className="flex gap-4 p-4">
          {menu.images?.[0] && (
            <div className="relative">
              <img
                src={menu.images[0].url}
                alt={menu.name}
                className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
              />
              {/* Rating badge - placeholder for reviews feature */}
              {menu.isSignature && (
                <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-yellow-900">
                  <span>4.8</span>
                  <span>★</span>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="font-medium leading-tight">{menu.name}</h3>
                {menu.isSignature && (
                  <span className="ml-2 flex-shrink-0 rounded-full bg-[#FFD700]/20 px-2 py-0.5 text-xs font-medium text-yellow-700">
                    {t('menu.signature')}
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                {menu.description}
              </p>
              {/* Nutrition badges */}
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] text-orange-600">
                  <Flame className="h-3 w-3" />
                  <span>{nutrition.calories} cal</span>
                </div>
                {nutrition.caffeine > 0 && (
                  <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${
                    caffeineLevel === 'high'
                      ? 'bg-purple-50 text-purple-600'
                      : caffeineLevel === 'medium'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-50 text-gray-500'
                  }`}>
                    <Zap className="h-3 w-3" />
                    <span>{nutrition.caffeine}mg</span>
                  </div>
                )}
              </div>
              {menu.tags && menu.tags.length > 0 && (
                <div className="mt-1 flex gap-1">
                  {menu.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#1A3C8B]/10 px-2 py-0.5 text-xs text-[#1A3C8B]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-2 text-base font-bold text-[#1A3C8B]">
              {formatPrice(menu.price)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
