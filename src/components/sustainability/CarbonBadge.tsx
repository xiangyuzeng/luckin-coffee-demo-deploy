'use client';

import { motion } from 'framer-motion';
import { Leaf, TreePine, Car } from 'lucide-react';
import { OrderCarbonImpact, formatCO2 } from '@/lib/sustainability';

interface CarbonBadgeProps {
  impact: OrderCarbonImpact;
  compact?: boolean;
}

export default function CarbonBadge({ impact, compact = false }: CarbonBadgeProps) {
  if (impact.totalSaved === 0) return null;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
      >
        <Leaf className="h-3 w-3" />
        <span>-{formatCO2(impact.totalSaved)} CO₂</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
          <Leaf className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-green-800">Eco-Friendly Order!</p>
          <p className="text-xs text-green-600">You&apos;re making a difference</p>
        </div>
      </div>

      {/* Savings breakdown */}
      <div className="mb-3 space-y-1">
        {impact.breakdown.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-green-700">{item.label}</span>
            <span className="font-medium text-green-800">-{formatCO2(item.amount)}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mb-3 flex items-center justify-between rounded-lg bg-green-100 p-2">
        <span className="text-sm font-medium text-green-800">Total CO₂ saved</span>
        <span className="text-lg font-bold text-green-700">{formatCO2(impact.totalSaved)}</span>
      </div>

      {/* Equivalents */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg bg-white/50 p-2">
          <TreePine className="mx-auto mb-1 h-4 w-4 text-green-600" />
          <p className="text-xs text-green-700">
            <span className="font-medium">{impact.treesEquivalent.toFixed(1)}</span> days of
          </p>
          <p className="text-[10px] text-green-600">tree absorption</p>
        </div>
        <div className="rounded-lg bg-white/50 p-2">
          <Car className="mx-auto mb-1 h-4 w-4 text-green-600" />
          <p className="text-xs text-green-700">
            <span className="font-medium">{impact.milesEquivalent.toFixed(1)}</span> miles
          </p>
          <p className="text-[10px] text-green-600">not driven</p>
        </div>
      </div>
    </motion.div>
  );
}
