'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, Crown, Leaf, Gift } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      href: '/group-order',
      icon: Users,
      title: 'Group Order',
      description: 'Order with friends',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      href: '/subscription',
      icon: Crown,
      title: 'Luckin Pass',
      description: 'Unlimited coffee',
      color: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="grid w-full grid-cols-2 gap-4"
    >
      {actions.map((action, index) => (
        <Link
          key={action.href}
          href={action.href}
          className={`luckin-card flex items-center gap-3 p-4 transition-shadow hover:shadow-md ${action.color}`}
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-white ${action.iconColor}`}>
            <action.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{action.title}</p>
            <p className="text-xs text-gray-500">{action.description}</p>
          </div>
        </Link>
      ))}
    </motion.div>
  );
}
