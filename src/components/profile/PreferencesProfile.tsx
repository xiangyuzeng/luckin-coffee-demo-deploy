'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/button';

interface PreferencesProfileProps {
  preferences: {
    milkPreference: string;
    sugarLevel: string;
    defaultSize: string;
  } | null;
}

export default function PreferencesProfile({ preferences }: PreferencesProfileProps) {
  const { t } = useTranslation();
  const [milk, setMilk] = useState(preferences?.milkPreference || 'REGULAR');
  const [sugar, setSugar] = useState(preferences?.sugarLevel || 'NORMAL');
  const [size, setSize] = useState(preferences?.defaultSize || 'MEDIUM');
  const [isSaving, setIsSaving] = useState(false);

  const milkOptions = [
    { key: 'REGULAR', emoji: '🥛', labelKey: 'onboarding.milk.regular' },
    { key: 'OAT', emoji: '🌾', labelKey: 'onboarding.milk.oat' },
    { key: 'ALMOND', emoji: '🌰', labelKey: 'onboarding.milk.almond' },
    { key: 'COCONUT', emoji: '🥥', labelKey: 'onboarding.milk.coconut' },
  ];

  const sugarOptions = [
    { key: 'NONE', emoji: '🚫', labelKey: 'onboarding.sugar.none' },
    { key: 'LIGHT', emoji: '🍃', labelKey: 'onboarding.sugar.light' },
    { key: 'NORMAL', emoji: '✨', labelKey: 'onboarding.sugar.normal' },
    { key: 'EXTRA', emoji: '🍬', labelKey: 'onboarding.sugar.extra' },
  ];

  const sizeOptions = [
    { key: 'SMALL', emoji: '☕', labelKey: 'onboarding.size.small' },
    { key: 'MEDIUM', emoji: '🥤', labelKey: 'onboarding.size.medium' },
    { key: 'LARGE', emoji: '🫗', labelKey: 'onboarding.size.large' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milkPreference: milk,
          sugarLevel: sugar,
          defaultSize: size,
        }),
      });
      if (res.ok) {
        toast.success(t('profile.saved'));
      } else {
        toast.error('Failed to save preferences');
      }
    } catch {
      toast.error('Failed to save preferences');
    }
    setIsSaving(false);
  };

  const renderCards = (
    options: { key: string; emoji: string; labelKey: string }[],
    selected: string,
    onSelect: (key: string) => void,
    cols: number = 4,
  ) => (
    <div className={`grid ${cols === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'} gap-3`}>
      {options.map((opt) => (
        <motion.button
          key={opt.key}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(opt.key)}
          className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-4 transition-all ${
            selected === opt.key
              ? 'border-[#1A3C8B] bg-[#1A3C8B]/5 ring-2 ring-[#1A3C8B]'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <span className="text-2xl">{opt.emoji}</span>
          <span className={`text-xs font-medium ${selected === opt.key ? 'text-[#1A3C8B]' : 'text-gray-600'}`}>
            {t(opt.labelKey)}
          </span>
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 rounded-lg border p-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">{t('onboarding.milk.title')}</h3>
        {renderCards(milkOptions, milk, setMilk)}
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">{t('onboarding.sugar.title')}</h3>
        {renderCards(sugarOptions, sugar, setSugar)}
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">{t('onboarding.size.title')}</h3>
        {renderCards(sizeOptions, size, setSize, 3)}
      </div>
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full rounded-full bg-[#1A3C8B] py-6 text-base hover:bg-[#2D5BB9]"
      >
        {isSaving ? t('common.loading') : t('common.save')}
      </Button>
    </div>
  );
}
