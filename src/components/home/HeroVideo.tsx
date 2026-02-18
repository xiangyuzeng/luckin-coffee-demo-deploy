'use client';

import { motion } from 'framer-motion';

export default function HeroVideo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="w-full"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A3C8B] to-[#2D5BB9]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-48 w-full object-cover opacity-60 md:h-64"
          poster="/luckin-logo-blue.svg"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-2xl font-bold md:text-3xl">Crafted with Precision</h2>
          <p className="mt-2 text-sm opacity-80">Every cup tells a story</p>
        </div>
      </div>
    </motion.div>
  );
}
