'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Coffee, Gift, Zap, Crown } from 'lucide-react';
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/lib/subscription';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import SavingsCalculator from '@/components/subscription/SavingsCalculator';

export default function SubscriptionPage() {
  const [recommendedPlan, setRecommendedPlan] = useState<SubscriptionPlan | null>(null);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    toast.success(`You selected ${plan.name} Pass! This is a demo - subscription would be processed here.`, {
      duration: 4000,
    });
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Luckin Pass</h1>
        <p className="mt-2 text-gray-500">
          Unlimited coffee, unlimited savings. Choose your perfect plan.
        </p>
      </motion.div>

      {/* Benefits Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {[
          { icon: Coffee, label: 'Unlimited Drinks', desc: 'Premium plans' },
          { icon: Zap, label: 'Skip the Line', desc: 'Priority pickup' },
          { icon: Gift, label: 'Free Upgrades', desc: 'Size & milk' },
          { icon: Crown, label: 'VIP Access', desc: 'Elite members' },
        ].map((benefit, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-xl bg-gray-50 p-4 text-center"
          >
            <benefit.icon className="mb-2 h-6 w-6 text-[#1A3C8B]" />
            <p className="text-sm font-medium">{benefit.label}</p>
            <p className="text-xs text-gray-500">{benefit.desc}</p>
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
        <h2 className="mb-6 text-center text-xl font-bold">Choose Your Plan</h2>
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
        <h2 className="mb-6 text-center text-xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Can I cancel anytime?',
              a: 'Yes! You can cancel your subscription at any time. Your benefits will continue until the end of your billing period.',
            },
            {
              q: 'Do unused drinks roll over?',
              a: 'For the Basic plan, unused drinks do not roll over. Premium and Elite plans have unlimited drinks, so there\'s nothing to roll over!',
            },
            {
              q: 'Can I share my subscription?',
              a: 'Subscriptions are tied to your account and cannot be shared. However, you can gift drinks to friends through the app!',
            },
            {
              q: 'What drinks are included?',
              a: 'Basic includes drip coffee, cold brew, and americano. Premium and Elite include all drinks on our menu.',
            },
          ].map((faq, index) => (
            <div key={index} className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">{faq.q}</h3>
              <p className="mt-1 text-sm text-gray-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Demo Notice */}
      <div className="mt-8 rounded-xl bg-yellow-50 p-4 text-center">
        <p className="text-sm text-yellow-800">
          <strong>Demo Mode:</strong> This is a demonstration of the subscription feature.
          No actual charges will be made.
        </p>
      </div>
    </div>
  );
}
