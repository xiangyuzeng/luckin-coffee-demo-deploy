'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface ActiveOrder {
  id: string;
  tracking: {
    status: string;
  };
  cartItems: {
    menu: { name: string; images: { url: string }[] };
    size: string;
  }[];
}

export default function ActiveOrderBanner() {
  const { data: session } = useSession();
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!session?.user) return;

    async function fetchActiveOrder() {
      try {
        const res = await fetch('/api/tracking');
        if (res.ok) {
          const data = await res.json();
          setActiveOrder(data);
        }
      } catch (error) {
        // silently fail
      }
    }

    fetchActiveOrder();
    const interval = setInterval(fetchActiveOrder, 10000);
    return () => clearInterval(interval);
  }, [session]);

  if (!activeOrder) return null;

  const statusLabels: Record<string, string> = {
    PLACED: t('tracking.placed'),
    PREPARING: t('tracking.preparing'),
    READY: t('tracking.ready'),
  };

  const firstItem = activeOrder.cartItems[0];
  const status = activeOrder.tracking?.status || 'PLACED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="luckin-card overflow-hidden p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse-blue rounded-full bg-[#1A3C8B]" />
          <span className="text-sm font-medium text-[#1A3C8B]">
            {statusLabels[status] || status}
          </span>
        </div>

        {firstItem && (
          <div className="mb-3 flex items-center gap-3">
            {firstItem.menu.images[0] && (
              <img
                src={firstItem.menu.images[0].url}
                alt={firstItem.menu.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
            )}
            <div>
              <p className="font-medium">{firstItem.menu.name}</p>
              <p className="text-sm text-gray-500">{firstItem.size}</p>
            </div>
          </div>
        )}

        <Link
          href={`/track/${activeOrder.id}`}
          className={cn(
            buttonVariants({ variant: 'default' }),
            'w-full rounded-full bg-[#1A3C8B] py-6 text-base hover:bg-[#2D5BB9]'
          )}
        >
          {t('tracking.trackLive')}
        </Link>
      </div>
    </motion.div>
  );
}
