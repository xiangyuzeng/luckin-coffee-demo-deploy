'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/LanguageContext';

type FlavorChoice = 'sweet' | 'bitter' | 'fruity' | 'refreshing';
type MilkChoice = 'REGULAR' | 'OAT' | 'ALMOND' | 'COCONUT';
type SugarChoice = 'NONE' | 'LIGHT' | 'NORMAL' | 'EXTRA';
type SizeChoice = 'SMALL' | 'MEDIUM' | 'LARGE';

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [flavor, setFlavor] = useState<FlavorChoice | null>(null);
  const [milk, setMilk] = useState<MilkChoice | null>(null);
  const [sugar, setSugar] = useState<SugarChoice | null>(null);
  const [size, setSize] = useState<SizeChoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milkPreference: milk || 'REGULAR',
          sugarLevel: sugar || 'NORMAL',
          defaultSize: size || 'MEDIUM',
          onboardingComplete: true,
        }),
      });
    } catch {
      // Silently fail -- user can still proceed
    }
    router.push('/');
  };

  const handleSkip = () => {
    router.push('/');
  };

  const canProceed = () => {
    switch (step) {
      case 0: return flavor !== null;
      case 1: return milk !== null;
      case 2: return sugar !== null;
      case 3: return size !== null;
      default: return false;
    }
  };

  const flavorOptions: { key: FlavorChoice; emoji: string; labelKey: string }[] = [
    { key: 'sweet', emoji: '🍯', labelKey: 'onboarding.flavor.sweet' },
    { key: 'bitter', emoji: '☕', labelKey: 'onboarding.flavor.bitter' },
    { key: 'fruity', emoji: '🍊', labelKey: 'onboarding.flavor.fruity' },
    { key: 'refreshing', emoji: '🧊', labelKey: 'onboarding.flavor.refreshing' },
  ];

  const milkOptions: { key: MilkChoice; emoji: string; labelKey: string }[] = [
    { key: 'REGULAR', emoji: '🥛', labelKey: 'onboarding.milk.regular' },
    { key: 'OAT', emoji: '🌾', labelKey: 'onboarding.milk.oat' },
    { key: 'ALMOND', emoji: '🌰', labelKey: 'onboarding.milk.almond' },
    { key: 'COCONUT', emoji: '🥥', labelKey: 'onboarding.milk.coconut' },
  ];

  const sugarOptions: { key: SugarChoice; emoji: string; labelKey: string }[] = [
    { key: 'NONE', emoji: '🚫', labelKey: 'onboarding.sugar.none' },
    { key: 'LIGHT', emoji: '🍃', labelKey: 'onboarding.sugar.light' },
    { key: 'NORMAL', emoji: '✨', labelKey: 'onboarding.sugar.normal' },
    { key: 'EXTRA', emoji: '🍬', labelKey: 'onboarding.sugar.extra' },
  ];

  const sizeOptions: { key: SizeChoice; emoji: string; labelKey: string }[] = [
    { key: 'SMALL', emoji: '☕', labelKey: 'onboarding.size.small' },
    { key: 'MEDIUM', emoji: '🥤', labelKey: 'onboarding.size.medium' },
    { key: 'LARGE', emoji: '🫗', labelKey: 'onboarding.size.large' },
  ];

  const renderCard = <T extends string>(
    option: { key: T; emoji: string; labelKey: string },
    selected: T | null,
    onSelect: (key: T) => void,
  ) => {
    const isSelected = selected === option.key;
    return (
      <motion.button
        key={option.key}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect(option.key)}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-6 transition-all ${
          isSelected
            ? 'ring-2 ring-[#1A3C8B] bg-[#1A3C8B]/5 border-[#1A3C8B]'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <span className="text-4xl">{option.emoji}</span>
        <span
          className={`text-sm font-semibold ${
            isSelected ? 'text-[#1A3C8B]' : 'text-gray-700'
          }`}
        >
          {t(option.labelKey)}
        </span>
      </motion.button>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2 className="mb-6 text-center text-xl font-bold text-gray-800">
              {t('onboarding.flavor.title')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {flavorOptions.map((opt) => renderCard(opt, flavor, setFlavor))}
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="mb-6 text-center text-xl font-bold text-gray-800">
              {t('onboarding.milk.title')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {milkOptions.map((opt) => renderCard(opt, milk, setMilk))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="mb-6 text-center text-xl font-bold text-gray-800">
              {t('onboarding.sugar.title')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {sugarOptions.map((opt) => renderCard(opt, sugar, setSugar))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="mb-6 text-center text-xl font-bold text-gray-800">
              {t('onboarding.size.title')}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {sizeOptions.map((opt) => renderCard(opt, size, setSize))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-white to-blue-50/50 px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-2xl font-bold text-[#1A3C8B]">
          {t('onboarding.welcome')}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {t('onboarding.letsPersonalize')}
        </p>
      </motion.div>

      {/* Progress dots */}
      <div className="mb-8 flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step
                ? 'w-8 bg-[#1A3C8B]'
                : i < step
                ? 'w-2 bg-[#1A3C8B]/50'
                : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step indicator */}
      <p className="mb-6 text-xs text-gray-400">
        {t('onboarding.step', { current: String(step + 1), total: String(TOTAL_STEPS) })}
      </p>

      {/* Step content with slide animation */}
      <div className="relative w-full max-w-md overflow-hidden" style={{ minHeight: 280 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.3 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex w-full max-w-md flex-col gap-3">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              {t('common.back')}
            </button>
          )}
          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all ${
                canProceed()
                  ? 'bg-[#1A3C8B] hover:bg-[#15326F]'
                  : 'cursor-not-allowed bg-gray-300'
              }`}
            >
              {t('common.next')}
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canProceed() || isSubmitting}
              className={`flex-1 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all ${
                canProceed() && !isSubmitting
                  ? 'bg-[#1A3C8B] hover:bg-[#15326F]'
                  : 'cursor-not-allowed bg-gray-300'
              }`}
            >
              {isSubmitting ? t('common.loading') : t('onboarding.complete')}
            </button>
          )}
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="py-2 text-sm text-gray-400 transition-colors hover:text-gray-600"
        >
          {t('onboarding.skipForNow')}
        </button>
      </div>
    </div>
  );
}
