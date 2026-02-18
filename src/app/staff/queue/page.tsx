'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Clock, Coffee, Package, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/Loading';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface CartItem {
  menu: { name: string; images: { url: string }[] };
  size: string;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  pickupName: string;
  tracking: {
    status: 'PLACED' | 'PREPARING' | 'READY' | 'PICKED_UP';
    placedAt: string;
    events: unknown[];
  };
  cartItems: CartItem[];
}

type ActiveStatus = 'PLACED' | 'PREPARING' | 'READY';

const COLUMNS: { status: ActiveStatus; labelKey: string; actionKey: string; color: string; bgColor: string; borderColor: string; icon: typeof Package }[] = [
  {
    status: 'PLACED',
    labelKey: 'staff.newOrders',
    actionKey: 'staff.startPreparing',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Package,
  },
  {
    status: 'PREPARING',
    labelKey: 'staff.inProgress',
    actionKey: 'staff.markReady',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: Coffee,
  },
  {
    status: 'READY',
    labelKey: 'staff.readyPickup',
    actionKey: 'staff.markPickedUp',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle2,
  },
];

const STATUS_BADGE_CLASSES: Record<ActiveStatus, string> = {
  PLACED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-amber-100 text-amber-700',
  READY: 'bg-green-100 text-green-700',
};

function getMinutesAgo(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / 60000));
}

export default function StaffQueuePage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [advancingIds, setAdvancingIds] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/staff/orders');
      if (res.ok) {
        const data: Order[] = await res.json();
        setOrders(data);
      }
    } catch {
      // silently fail on poll
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status !== 'authenticated') return;

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [status, router, fetchOrders]);

  const advanceOrder = async (orderId: string) => {
    setAdvancingIds((prev) => new Set(prev).add(orderId));
    try {
      const res = await fetch(`/api/staff/orders/${orderId}/advance`, {
        method: 'POST',
      });
      if (res.ok) {
        toast.success(t('staff.title'), {
          description: `Order #${orderId.slice(-6).toUpperCase()} advanced`,
        });
        await fetchOrders();
      } else {
        toast.error('Failed to advance order');
      }
    } catch {
      toast.error('Failed to advance order');
    } finally {
      setAdvancingIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  // Auth guard
  if (status === 'loading') {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // redirect happens in useEffect
  }

  if (session?.user?.role !== 'STAFF' && session?.user?.role !== 'ADMIN') {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-gray-700">Forbidden</p>
        <p className="text-sm text-gray-500">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  const ordersByStatus: Record<ActiveStatus, Order[]> = {
    PLACED: orders.filter((o) => o.tracking.status === 'PLACED'),
    PREPARING: orders.filter((o) => o.tracking.status === 'PREPARING'),
    READY: orders.filter((o) => o.tracking.status === 'READY'),
  };

  const totalActive = ordersByStatus.PLACED.length + ordersByStatus.PREPARING.length + ordersByStatus.READY.length;

  return (
    <div className="w-full space-y-6 pb-24 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-[#1A3C8B] md:text-3xl">
          {t('staff.title')}
        </h1>
      </motion.div>

      {totalActive === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-64 flex-col items-center justify-center gap-3 text-gray-400"
        >
          <Coffee className="h-12 w-12" />
          <p className="text-lg">{t('staff.empty')}</p>
        </motion.div>
      ) : (
        <LayoutGroup>
          {/* Desktop: 3-column Kanban */}
          <div className="hidden gap-4 md:grid md:grid-cols-3">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.status}
                column={col}
                orders={ordersByStatus[col.status]}
                advancingIds={advancingIds}
                onAdvance={advanceOrder}
                t={t}
              />
            ))}
          </div>

          {/* Mobile: single scrollable list */}
          <div className="space-y-6 md:hidden">
            {COLUMNS.map((col) => (
              <MobileSection
                key={col.status}
                column={col}
                orders={ordersByStatus[col.status]}
                advancingIds={advancingIds}
                onAdvance={advanceOrder}
                t={t}
              />
            ))}
          </div>
        </LayoutGroup>
      )}
    </div>
  );
}

/* --- Kanban Column (Desktop) --- */

function KanbanColumn({
  column,
  orders,
  advancingIds,
  onAdvance,
  t,
}: {
  column: (typeof COLUMNS)[number];
  orders: Order[];
  advancingIds: Set<string>;
  onAdvance: (id: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const Icon = column.icon;

  return (
    <div className={`rounded-xl border ${column.borderColor} ${column.bgColor} p-4`}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${column.color}`} />
        <h2 className={`text-sm font-semibold uppercase tracking-wide ${column.color}`}>
          {t(column.labelKey)}
        </h2>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${column.color} ${column.bgColor} border ${column.borderColor}`}>
          {orders.length}
        </span>
      </div>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actionLabel={t(column.actionKey)}
              isAdvancing={advancingIds.has(order.id)}
              onAdvance={() => onAdvance(order.id)}
              t={t}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* --- Mobile Section --- */

function MobileSection({
  column,
  orders,
  advancingIds,
  onAdvance,
  t,
}: {
  column: (typeof COLUMNS)[number];
  orders: Order[];
  advancingIds: Set<string>;
  onAdvance: (id: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const Icon = column.icon;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${column.color}`} />
        <h2 className={`text-sm font-semibold uppercase tracking-wide ${column.color}`}>
          {t(column.labelKey)}
        </h2>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${column.color} ${column.bgColor} border ${column.borderColor}`}>
          {orders.length}
        </span>
      </div>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actionLabel={t(column.actionKey)}
              isAdvancing={advancingIds.has(order.id)}
              onAdvance={() => onAdvance(order.id)}
              t={t}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* --- Order Card --- */

function OrderCard({
  order,
  actionLabel,
  isAdvancing,
  onAdvance,
  t,
}: {
  order: Order;
  actionLabel: string;
  isAdvancing: boolean;
  onAdvance: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const minutesAgo = getMinutesAgo(order.tracking.placedAt);
  const status = order.tracking.status as ActiveStatus;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      {/* Header row */}
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-gray-900">
            #{order.id.slice(-6).toUpperCase()}
          </p>
          <p className="text-xs text-gray-500">
            {order.pickupName || order.customerName}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[status]}`}
        >
          {status}
        </span>
      </div>

      {/* Time elapsed */}
      <div className="mb-3 flex items-center gap-1 text-xs text-gray-400">
        <Clock className="h-3 w-3" />
        <span>{t('staff.elapsed', { minutes: minutesAgo })}</span>
      </div>

      {/* Items */}
      <div className="mb-3 space-y-1">
        {order.cartItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              {item.quantity}x {item.menu.name}
            </span>
            <span className="text-xs text-gray-400">{item.size}</span>
          </div>
        ))}
      </div>

      {/* Action button */}
      <button
        onClick={onAdvance}
        disabled={isAdvancing}
        className="w-full rounded-lg bg-[#1A3C8B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#15336F] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAdvancing ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            ...
          </span>
        ) : (
          actionLabel
        )}
      </button>
    </motion.div>
  );
}
