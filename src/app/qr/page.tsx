'use client';

import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function QRPage() {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-8 py-10">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        <Image
          src="/luckin-logo-blue.svg"
          alt="Luckin Coffee"
          width={80}
          height={80}
        />
        <h1 className="text-3xl font-bold text-[#1A3C8B]">luckin coffee</h1>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="rounded-2xl border-2 border-[#1A3C8B]/10 bg-white p-6 shadow-lg">
          <QRCodeSVG
            value={typeof window !== 'undefined' ? window.location.origin : 'https://luckincoffee.us'}
            size={200}
            fgColor="#1A3C8B"
            level="M"
          />
        </div>
        <p className="text-lg text-gray-500">Scan to Order</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="rounded-full bg-[#1A3C8B]/5 px-4 py-2 text-sm text-[#1A3C8B]">
          📍 Store #1042 · Downtown Manhattan
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'rounded-full bg-[#1A3C8B] px-8 py-6 text-lg hover:bg-[#2D5BB9]'
            )}
          >
            Start Ordering
          </Link>
          <Link
            href="/auth/login"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'rounded-full border-[#1A3C8B] px-8 py-6 text-lg text-[#1A3C8B] hover:bg-[#1A3C8B]/5'
            )}
          >
            Sign In for Rewards
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
