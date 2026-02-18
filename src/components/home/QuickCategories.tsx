'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface Category {
  id: string;
  name: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  Signatures: '✨',
  Classics: '☕',
  'Cold Brew': '🧊',
  Refreshers: '🍹',
  Food: '🥐',
};

export default function QuickCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/category');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categoryList || []);
        }
      } catch (error) {
        // silently fail
      }
    }
    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="w-full pb-6"
    >
      <h2 className="mb-4 text-xl font-bold">{t('quickPick.title')}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            <Link
              href={`/menu?category=${category.id}`}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1A3C8B]/5 text-2xl transition-colors hover:bg-[#1A3C8B]/10">
                {CATEGORY_ICONS[category.name] || '☕'}
              </div>
              <span className="text-xs font-medium text-gray-700">{category.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
