'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Users, Coffee } from 'lucide-react';
import { useGroupOrderStore } from '@/lib/group-order-store';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function JoinGroupOrderPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [name, setName] = useState('');
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  const { currentOrder, joinGroupOrder } = useGroupOrderStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleJoin = () => {
    if (!name.trim()) {
      toast.error(t('groupOrder.enterName'));
      return;
    }

    const success = joinGroupOrder(code.toUpperCase(), name.trim());
    if (success) {
      toast.success(t('groupOrder.join.success'));
      router.push('/group-order');
    } else {
      toast.error(t('groupOrder.join.failed'));
    }
  };

  if (!mounted) return null;

  // Already in a group order
  if (currentOrder) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center pb-20">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Coffee className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-xl font-bold">{t('groupOrder.join.alreadyIn')}</h1>
          <p className="mt-2 text-gray-500">
            {t('groupOrder.join.leaveFirst')}
          </p>
          <button
            onClick={() => router.push('/group-order')}
            className="mt-6 rounded-full bg-[#1A3C8B] px-8 py-3 font-medium text-white transition-colors hover:bg-[#2D5BB9]"
          >
            {t('groupOrder.join.goToCurrent')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1A3C8B]/10">
          <Users className="h-8 w-8 text-[#1A3C8B]" />
        </div>

        <h1 className="text-2xl font-bold">{t('groupOrder.join.title')}</h1>
        <p className="mt-2 text-gray-500">
          {t('groupOrder.join.invited')}
        </p>

        {/* Code display */}
        <div className="my-6 rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">{t('groupOrder.join.orderCode')}</p>
          <p className="text-2xl font-bold tracking-widest text-[#1A3C8B]">
            {code.toUpperCase()}
          </p>
        </div>

        {/* Name input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('groupOrder.join.enterName')}
          className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-center focus:border-[#1A3C8B] focus:outline-none"
        />

        <button
          onClick={handleJoin}
          className="w-full rounded-full bg-[#1A3C8B] py-3 font-medium text-white transition-colors hover:bg-[#2D5BB9]"
        >
          {t('groupOrder.join.joinBtn')}
        </button>

        <p className="mt-4 text-xs text-gray-400">
          {t('groupOrder.join.byJoining')}
        </p>
      </motion.div>
    </div>
  );
}
