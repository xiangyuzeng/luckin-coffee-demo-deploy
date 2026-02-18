'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Coffee, Gift, Zap, Crown } from 'lucide-react';
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/lib/subscription';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import SavingsCalculator from '@/components/subscription/SavingsCalculator';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function SubscriptionPage() {
  const [recommendedPlan, setRecommendedPlan] = useState<SubscriptionPlan | null>(null);
  const { t } = useTranslation();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    toast.success(t('subscription.selected').replace('{plan}', plan.name), {
      duration: 4000,
    });
  };

  const benefits = [
    { icon: Coffee, labelKey: 'subscription.benefits.unlimitedDrinks', descKey: 'subscription.benefits.premiumPlans' },
    { icon: Zap, labelKey: 'subscription.benefits.skipLine', descKey: 'subscription.benefits.priorityPickup' },
    { icon: Gift, labelKey: 'subscription.benefits.freeUpgrades', descKey: 'subscription.benefits.sizeMilk' },
    { icon: Crown, labelKey: 'subscription.benefits.vipAccess', descKey: 'subscription.benefits.eliteMembers' },
  ];

  const faqs = [
    { qKey: 'subscription.faq.cancelQ', aKey: 'subscription.faq.cancelA' },
    { qKey: 'subscription.faq.rolloverQ', aKey: 'subscription.faq.rolloverA' },
    { qKey: 'subscription.faq.shareQ', aKey: 'subscription.faq.shareA' },
    { qKey: 'subscription.faq.drinksQ', aKey: 'subscription.faq.drinksA' },
  ];

  return (
    <div className="w-full pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1A3C8B]/10">
          <Crown className="h-8 w-8 text-[#1A3C8B]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{t('subscription.title')}</h1>
        <p className="mt-2 text-gray-500">
          {t('subscription.subtitle')}
        </p>
      </motion.div>

      {/* Benefits Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-xl bg-gray-50 p-4 text-center"
          >
            <benefit.icon className="mb-2 h-6 w-6 text-[#1A3C8B]" />
            <p className="text-sm font-medium">{t(benefit.labelKey)}</p>
            <p className="text-xs text-gray-500">{t(benefit.descKey)}</p>
          </div>
        ))}
      </motion.div>

      {/* Savings Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <SavingsCalculator onPlanRecommended={setRecommendedPlan} />
      </motion.div>

      {/* Plans Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="mb-6 text-center text-xl font-bold">{t('subscription.choosePlan')}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              onSelect={handleSelectPlan}
              isRecommended={recommendedPlan?.id === plan.id}
            />
          ))}
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <h2 className="mb-6 text-center text-xl font-bold">{t('subscription.faq')}</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">{t(faq.qKey)}</h3>
              <p className="mt-1 text-sm text-gray-500">{t(faq.aKey)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Demo Notice */}
      <div className="mt-8 rounded-xl bg-yellow-50 p-4 text-center">
        <p className="text-sm text-yellow-800">
          <strong>{t('subscription.demoMode')}</strong> {t('subscription.demoNotice')}
        </p>
      </div>
    </div>
  );
}
