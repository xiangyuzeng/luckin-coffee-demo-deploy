'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Coffee, Package } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface OrderEventData {
  id: string;
  status: string;
  label: string;
  createdAt: string;
}

interface OrderTrackerProps {
  status: 'PLACED' | 'PREPARING' | 'READY' | 'PICKED_UP';
  placedAt: string;
  preparingAt: string | null;
  readyAt: string | null;
  events?: OrderEventData[];
}

const STEP_KEYS = ['PLACED', 'PREPARING', 'READY'] as const;

function getStepIndex(status: string): number {
  return STEP_KEYS.findIndex((s) => s === status);
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getEventIcon(status: string) {
  switch (status) {
    case 'PLACED':
      return Package;
    case 'PREPARING':
      return Coffee;
    case 'READY':
      return Check;
    case 'PICKED_UP':
      return Check;
    default:
      return Clock;
  }
}

export default function OrderTracker({ status, placedAt, preparingAt, readyAt, events }: OrderTrackerProps) {
  const { t } = useTranslation();
  const currentStep = getStepIndex(status);
  const timestamps = [placedAt, preparingAt, readyAt];

  const steps = [
    { key: 'PLACED', label: t('tracking.placed'), icon: Package },
    { key: 'PREPARING', label: t('tracking.preparing'), icon: Coffee },
    { key: 'READY', label: t('tracking.ready'), icon: Check },
  ];

  // ETA countdown
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);

  useEffect(() => {
    function calculateEta() {
      if (status === 'READY' || status === 'PICKED_UP') {
        setRemainingMinutes(null);
        return;
      }

      let targetTime: number;

      if (status === 'PLACED') {
        // ETA = 7 min from placedAt
        targetTime = new Date(placedAt).getTime() + 7 * 60 * 1000;
      } else if (status === 'PREPARING' && preparingAt) {
        // ETA = 5 min from preparingAt
        targetTime = new Date(preparingAt).getTime() + 5 * 60 * 1000;
      } else {
        setRemainingMinutes(null);
        return;
      }

      const remaining = Math.max(0, Math.ceil((targetTime - Date.now()) / 60000));
      setRemainingMinutes(remaining);
    }

    calculateEta();
    const interval = setInterval(calculateEta, 10000);
    return () => clearInterval(interval);
  }, [status, placedAt, preparingAt]);

  // ETA config per status
  const etaConfig = status === 'PLACED'
    ? { total: 7, min: 3, max: 7 }
    : status === 'PREPARING'
    ? { total: 5, min: 2, max: 5 }
    : null;

  // Progress for the confidence band
  const etaProgress = etaConfig && remainingMinutes !== null
    ? Math.min(1, Math.max(0, 1 - remainingMinutes / etaConfig.total))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="luckin-card p-6 space-y-6"
    >
      {/* Step Progress */}
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200">
          <motion.div
            className="h-full bg-[#1A3C8B]"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isActive = index === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * index, type: 'spring' }}
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  isCompleted
                    ? 'border-[#1A3C8B] bg-[#1A3C8B] text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                } ${isActive ? 'animate-pulse-blue ring-4 ring-[#1A3C8B]/20' : ''}`}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              <p className={`mt-2 text-center text-xs font-medium ${
                isCompleted ? 'text-[#1A3C8B]' : 'text-gray-400'
              }`}>
                {step.label}
              </p>
              {timestamps[index] && (
                <p className="text-xs text-gray-400">
                  {formatTime(timestamps[index])}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ETA Countdown */}
      {etaConfig && remainingMinutes !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">{t('tracking.estimated')}</span>
          </div>
          <p className="text-3xl font-bold text-[#1A3C8B]">
            ~{remainingMinutes} min
          </p>
          <p className="text-xs text-gray-400">
            {t('tracking.etaRange', { min: etaConfig.min, max: etaConfig.max })}
          </p>
          {/* Confidence band */}
          <div className="mt-1 h-1.5 w-48 rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#1A3C8B]"
              initial={{ width: '0%' }}
              animate={{ width: `${etaProgress * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}

      {/* Event Timeline */}
      {events && events.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="mb-3 text-sm font-medium text-gray-700">{t('tracking.timeline')}</h4>
          <div className="relative ml-2">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200" />

            <div className="space-y-3">
              {events.map((event, index) => {
                const EventIcon = getEventIcon(event.status);

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="relative flex items-start gap-3 pl-6"
                  >
                    {/* Dot */}
                    <div className="absolute left-0 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1A3C8B]">
                      <EventIcon className="h-2.5 w-2.5 text-white" />
                    </div>

                    <div className="flex flex-1 items-center justify-between">
                      <p className="text-sm text-gray-700">{event.label}</p>
                      <p className="text-xs text-gray-400">{formatTime(event.createdAt)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
