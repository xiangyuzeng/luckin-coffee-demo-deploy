'use client';

import { useEffect } from 'react';

interface ConfettiEffectProps {
  trigger: boolean;
}

export default function ConfettiEffect({ trigger }: ConfettiEffectProps) {
  useEffect(() => {
    if (!trigger) return;

    import('canvas-confetti').then((confetti) => {
      const colors = ['#1A3C8B', '#2D5BB9', '#4A7ADE', '#FFFFFF', '#FFD700'];
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors
      });
      setTimeout(() => {
        confetti.default({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti.default({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });
      }, 300);
    });
  }, [trigger]);

  return null;
}
