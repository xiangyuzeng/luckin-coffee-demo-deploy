'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import OrderTracker from '@/components/order/OrderTracker';
import Loading from '@/components/Loading';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface OrderEventData {
  id: string;
  status: string;
  label: string;
  createdAt: string;
}

interface TrackingData {
  id: string;
  orderId: string;
  status: 'PLACED' | 'PREPARING' | 'READY' | 'PICKED_UP';
  placedAt: string;
  preparingAt: string | null;
  readyAt: string | null;
  pickedUpAt: string | null;
  events?: OrderEventData[];
}

interface OrderData {
  id: string;
  customerName: string;
  pickupName: string;
  tracking: TrackingData;
  cartItems: {
    menu: { name: string; images: { url: string }[] };
    size: string;
    milkType: string;
    sugarLevel: string;
    quantity: number;
  }[];
}

export default function TrackPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // Initial fetch for full order data (items, names, etc.)
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/tracking`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.id === orderId) {
            setOrder(data);
          }
        }
      } catch (error) {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  // SSE subscription for live tracking updates
  useEffect(() => {
    if (!orderId) return;

    const es = new EventSource(`/api/tracking/${orderId}/stream`);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) return;

        setOrder((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            tracking: {
              ...prev.tracking,
              status: data.status,
              placedAt: data.placedAt,
              preparingAt: data.preparingAt,
              readyAt: data.readyAt,
              pickedUpAt: data.pickedUpAt,
              events: data.events,
            },
          };
        });
      } catch {
        // Ignore parse errors
      }
    };

    es.onerror = () => {
      // EventSource will auto-reconnect
    };

    return () => {
      es.close();
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-20 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-sm text-gray-500">Order #{orderId.slice(-6).toUpperCase()}</p>
        <h1 className="mt-1 text-2xl font-bold text-[#1A3C8B]">
          {order.tracking.status === 'READY' ? t('tracking.orderReady') : t('tracking.trackingOrder')}
        </h1>
      </motion.div>

      <OrderTracker
        status={order.tracking.status}
        placedAt={order.tracking.placedAt}
        preparingAt={order.tracking.preparingAt}
        readyAt={order.tracking.readyAt}
        events={order.tracking.events}
      />

      {/* Order Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="luckin-card space-y-3 p-4"
      >
        <h3 className="font-medium">{t('tracking.orderDetails')}</h3>
        {order.cartItems.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {item.menu.images[0] && (
              <img
                src={item.menu.images[0].url}
                alt={item.menu.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <p className="font-medium">{item.menu.name}</p>
              <p className="text-sm text-gray-500">
                {item.size} · Qty: {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Pickup Name */}
      {order.tracking.status === 'READY' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
          className="mx-auto w-fit rounded-full bg-white px-8 py-4 text-center shadow-lg"
        >
          <p className="text-xs text-gray-400 uppercase tracking-wider">{t('tracking.reservedFor')}</p>
          <p className="text-xl font-bold text-[#1A3C8B]">
            {order.pickupName || order.customerName}
          </p>
        </motion.div>
      )}
    </div>
  );
}
