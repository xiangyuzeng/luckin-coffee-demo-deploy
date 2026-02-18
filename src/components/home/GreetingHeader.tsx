'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/LanguageContext';

function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'greeting.morning';
  if (hour < 17) return 'greeting.afternoon';
  return 'greeting.evening';
}

export default function GreetingHeader() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const greeting = t(getGreetingKey());
  const name = session?.user?.username || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full pt-4"
    >
      <h1 className="text-3xl font-bold text-[#1A3C8B] md:text-4xl">
        {greeting}{name ? ',' : '.'}<br />
        {name && <span>{name}.</span>}
      </h1>
    </motion.div>
  );
}
