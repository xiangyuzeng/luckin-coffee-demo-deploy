'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { SubscriptionPlan } from '@/lib/subscription';
import { formatPrice } from '@/lib/utils';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  onSelect: (plan: SubscriptionPlan) => void;
  isRecommended?: boolean;
}

export default function SubscriptionCard({ plan, onSelect, isRecommended }: SubscriptionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl ${
        plan.popular
          ? 'border-[#1A3C8B] ring-2 ring-[#1A3C8B]/20'
          : 'border-gray-200'
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -right-8 top-6 rotate-45 bg-[#1A3C8B] px-10 py-1 text-xs font-bold text-white">
          Most Popular
        </div>
      )}

      {/* Recommended badge */}
      {isRecommended && !plan.popular && (
        <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Star className="h-3 w-3" />
          Recommended for you
        </div>
      )}

      {/* Plan name and price */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#1A3C8B]">{formatPrice(plan.price)}</span>
          <span className="text-gray-500">/month</span>
        </div>
        {plan.savings && (
          <p className="mt-1 text-sm text-green-600">{plan.savings}</p>
        )}
      </div>

      {/* Drinks included */}
      <div className="mb-4 rounded-xl bg-gray-50 p-3">
        <p className="text-sm font-medium text-gray-700">
          {plan.drinks === 'unlimited' ? (
            <span className="text-[#1A3C8B]">Unlimited drinks</span>
          ) : (
            <span><span className="text-[#1A3C8B]">{plan.drinks}</span> drinks/month</span>
          )}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Includes: {plan.includes.join(', ')}
        </p>
      </div>

      {/* Features list */}
      <ul className="mb-6 space-y-2">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Subscribe button */}
      <button
        onClick={() => onSelect(plan)}
        className={`w-full rounded-full py-3 font-medium transition-colors ${
          plan.popular
            ? 'bg-[#1A3C8B] text-white hover:bg-[#2D5BB9]'
            : 'border-2 border-[#1A3C8B] text-[#1A3C8B] hover:bg-[#1A3C8B]/5'
        }`}
      >
        Subscribe to {plan.name}
      </button>
    </motion.div>
  );
}
