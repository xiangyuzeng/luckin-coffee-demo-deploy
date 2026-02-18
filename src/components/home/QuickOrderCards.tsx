'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useCartStore, DEFAULT_CUSTOMIZATION } from '@/lib/store';
import { ExtendedMenu } from '@/types/menu';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';

type UsualOrder = {
  count: number;
  menu: ExtendedMenu;
  size: string;
  milkType: string;
  sugarLevel: string;
} | null;

export default function QuickOrderCards() {
  const { data: session } = useSession();
  const [usual, setUsual] = useState<UsualOrder>(null);
  const [quickItems, setQuickItems] = useState<ExtendedMenu[]>([]);
  const addToCart = useCartStore((state) => state.addToCart);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      try {
        if (session?.user) {
          const usualRes = await fetch('/api/orders/usual');
          if (usualRes.ok) {
            const data = await usualRes.json();
            setUsual(data);
          }
        }

        const quickRes = await fetch('/api/orders/quick');
        if (quickRes.ok) {
          const data = await quickRes.json();
          setQuickItems(Array.isArray(data) ? data : []);
        }
      } catch {
        // silently fail
      }
    }
    fetchData();
  }, [session]);

  const handleReorder = () => {
    if (!usual) return;
    addToCart(usual.menu, usual.size, 1, {
      milkType: usual.milkType as any,
      sugarLevel: usual.sugarLevel as any,
      shots: 1,
    });
    toast.success(t('quickOrder.addedToCart', { name: usual.menu.name }));
  };

  const handleAddQuick = (item: ExtendedMenu) => {
    addToCart(item, 'MEDIUM', 1, DEFAULT_CUSTOMIZATION);
    toast.success(t('quickOrder.addedToCart', { name: item.name }));
  };

  if (!session?.user && quickItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {/* Order My Usual Card */}
      {session?.user && (
        <div className="luckin-card overflow-hidden p-4">
          <h3 className="mb-3 text-sm font-bold text-[#1A3C8B]">
            {t('quickOrder.usualTitle')}
          </h3>
          {usual ? (
            <div className="flex items-center gap-3">
              {usual.menu.images?.[0] && (
                <img
                  src={usual.menu.images[0].url}
                  alt={usual.menu.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold">{usual.menu.name}</p>
                <p className="text-xs text-gray-500">{usual.size}</p>
              </div>
              <button
                onClick={handleReorder}
                className="rounded-full bg-[#1A3C8B] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2D5BB9]"
              >
                {t('quickOrder.reorder')}
              </button>
            </div>
          ) : (
            <Link
              href="/menu"
              className="block text-sm text-gray-500 transition-colors hover:text-[#1A3C8B]"
            >
              {t('quickOrder.startTradition')}
            </Link>
          )}
        </div>
      )}

      {/* Best in <5 min Card */}
      {quickItems.length > 0 && (
        <div className="luckin-card overflow-hidden p-4">
          <h3 className="mb-3 text-sm font-bold text-[#1A3C8B]">
            {t('quickOrder.quickTitle')}
          </h3>
          <div className="space-y-2">
            {quickItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                {item.images?.[0] && (
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium leading-tight">{item.name}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.828a1 1 0 101.415-1.414L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{t('quickOrder.minutes', { min: item.estimatedPrepMinutes })}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1A3C8B]">
                  {formatPrice(item.price)}
                </span>
                <button
                  onClick={() => handleAddQuick(item)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A3C8B] text-white transition-colors hover:bg-[#2D5BB9]"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
