'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExtendedMenu } from '@/types/menu';
import { formatPrice } from '@/lib/utils';
import { useCartStore, DEFAULT_CUSTOMIZATION } from '@/lib/store';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function ExploreSection() {
  const [menus, setMenus] = useState<ExtendedMenu[]>([]);
  const addToCart = useCartStore((state) => state.addToCart);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch('/api/menu');
        if (res.ok) {
          const data = await res.json();
          const items = data.menuList || data;
          setMenus(Array.isArray(items) ? items.slice(0, 8) : []);
        }
      } catch (error) {
        // silently fail
      }
    }
    fetchMenus();
  }, []);

  if (menus.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="w-full"
    >
      <h2 className="mb-4 text-xl font-bold">{t('explore.title')}</h2>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {menus.map((menu, index) => (
          <motion.div
            key={menu.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
            className="min-w-[160px] flex-shrink-0"
          >
            <div className={`luckin-card overflow-hidden transition-transform hover:scale-105 ${menu.isSignature ? 'ring-2 ring-[#FFD700]' : ''}`}>
              {menu.images?.[0] && (
                <img
                  src={menu.images[0].url}
                  alt={menu.name}
                  className="h-32 w-full object-cover"
                />
              )}
              <div className="p-3">
                <h3 className="text-sm font-medium leading-tight">{menu.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1A3C8B]">
                    {formatPrice(menu.price)}
                  </span>
                  <button
                    onClick={() => {
                      addToCart(menu, 'MEDIUM', 1, DEFAULT_CUSTOMIZATION);
                      toast.success(`${menu.name} ${t('explore.added')}`);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A3C8B] text-white transition-colors hover:bg-[#2D5BB9]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
