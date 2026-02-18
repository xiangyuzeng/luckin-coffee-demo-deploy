'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Users, Plus, Coffee, ShoppingCart, Lock } from 'lucide-react';
import { useGroupOrderStore } from '@/lib/group-order-store';
import ShareLink from '@/components/group-order/ShareLink';
import ParticipantsList from '@/components/group-order/ParticipantsList';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function GroupOrderPage() {
  const router = useRouter();
  const [hostName, setHostName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  const {
    currentOrder,
    currentParticipantId,
    createGroupOrder,
    joinGroupOrder,
    lockOrder,
    clearGroupOrder,
    isHost,
  } = useGroupOrderStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateOrder = () => {
    if (!hostName.trim()) {
      toast.error(t('groupOrder.enterName'));
      return;
    }
    createGroupOrder(hostName.trim());
    toast.success(t('groupOrder.created'));
  };

  const handleJoinOrder = () => {
    if (!joinCode.trim() || !joinName.trim()) {
      toast.error(t('groupOrder.enterCodeName'));
      return;
    }
    const success = joinGroupOrder(joinCode.trim().toUpperCase(), joinName.trim());
    if (success) {
      toast.success(t('groupOrder.joined'));
    } else {
      toast.error(t('groupOrder.invalidCode'));
    }
  };

  const handleLockOrder = () => {
    lockOrder();
    toast.success(t('groupOrder.locked'));
  };

  const handleCheckout = () => {
    toast.success(t('groupOrder.checkoutDemo'));
    clearGroupOrder();
    router.push('/checkout');
  };

  if (!mounted) return null;

  // No active order - show create/join options
  if (!currentOrder) {
    return (
      <div className="w-full pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1A3C8B]/10">
            <Users className="h-8 w-8 text-[#1A3C8B]" />
          </div>
          <h1 className="text-2xl font-bold">{t('groupOrder.title')}</h1>
          <p className="mt-2 text-gray-500">
            {t('groupOrder.subtitle')}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Create Order */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border-2 border-[#1A3C8B] bg-white p-6"
          >
            <h2 className="mb-4 text-lg font-bold">{t('groupOrder.startTitle')}</h2>
            <p className="mb-4 text-sm text-gray-500">
              {t('groupOrder.startDesc')}
            </p>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder={t('groupOrder.yourName')}
              className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#1A3C8B] focus:outline-none"
            />
            <button
              onClick={handleCreateOrder}
              className="w-full rounded-full bg-[#1A3C8B] py-3 font-medium text-white transition-colors hover:bg-[#2D5BB9]"
            >
              {t('groupOrder.createBtn')}
            </button>
          </motion.div>

          {/* Join Order */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <h2 className="mb-4 text-lg font-bold">{t('groupOrder.joinTitle')}</h2>
            <p className="mb-4 text-sm text-gray-500">
              {t('groupOrder.joinDesc')}
            </p>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder={t('groupOrder.enterCode')}
              maxLength={6}
              className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-lg font-bold tracking-widest focus:border-[#1A3C8B] focus:outline-none"
            />
            <input
              type="text"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              placeholder={t('groupOrder.yourName')}
              className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#1A3C8B] focus:outline-none"
            />
            <button
              onClick={handleJoinOrder}
              className="w-full rounded-full border-2 border-[#1A3C8B] py-3 font-medium text-[#1A3C8B] transition-colors hover:bg-[#1A3C8B]/5"
            >
              {t('groupOrder.joinBtn')}
            </button>
          </motion.div>
        </div>

        {/* Demo notice */}
        <div className="mt-8 rounded-xl bg-yellow-50 p-4 text-center">
          <p className="text-sm text-yellow-800">
            <strong>{t('groupOrder.demoMode')}</strong> {t('groupOrder.demoNotice')}
          </p>
        </div>
      </div>
    );
  }

  // Active order view
  return (
    <div className="w-full pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('groupOrder.title')}</h1>
            <p className="text-sm text-gray-500">
              {currentOrder.status === 'active' ? t('groupOrder.addItems') : t('groupOrder.orderLocked')}
            </p>
          </div>
          <div className={`rounded-full px-3 py-1 text-sm font-medium ${
            currentOrder.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {currentOrder.status === 'active' ? t('groupOrder.statusActive') : t('groupOrder.statusLocked')}
          </div>
        </div>
      </motion.div>

      {/* Share section (host only, when active) */}
      {isHost() && currentOrder.status === 'active' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <ShareLink code={currentOrder.code} />
        </motion.div>
      )}

      {/* Participants list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <ParticipantsList
          participants={currentOrder.participants}
          currentParticipantId={currentParticipantId}
        />
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {currentOrder.status === 'active' && (
          <Link
            href="/menu"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1A3C8B] py-3 font-medium text-white transition-colors hover:bg-[#2D5BB9]"
          >
            <Plus className="h-5 w-5" />
            {t('groupOrder.addFromMenu')}
          </Link>
        )}

        {isHost() && currentOrder.status === 'active' && (
          <button
            onClick={handleLockOrder}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#1A3C8B] py-3 font-medium text-[#1A3C8B] transition-colors hover:bg-[#1A3C8B]/5"
          >
            <Lock className="h-5 w-5" />
            {t('groupOrder.lockCheckout')}
          </button>
        )}

        {isHost() && currentOrder.status === 'locked' && (
          <button
            onClick={handleCheckout}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1A3C8B] py-3 font-medium text-white transition-colors hover:bg-[#2D5BB9]"
          >
            <ShoppingCart className="h-5 w-5" />
            {t('groupOrder.proceedCheckout')}
          </button>
        )}

        <button
          onClick={() => {
            clearGroupOrder();
            toast.success(t('groupOrder.left'));
          }}
          className="w-full py-2 text-center text-sm text-gray-500 hover:text-red-500"
        >
          {t('groupOrder.leaveOrder')}
        </button>
      </motion.div>
    </div>
  );
}
