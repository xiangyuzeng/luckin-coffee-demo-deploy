'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const { t } = useTranslation();

  const handleToggle = () => {
    if (!isOpen && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-center md:bottom-6">
        <motion.button
          onClick={handleToggle}
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-[#1A3C8B] text-white shadow-lg transition-colors hover:bg-[#2D5BB9] ${!isOpen ? 'animate-pulse-glow' : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open chat"
        >
          {/* Notification dot */}
          {!hasBeenOpened && !isOpen && (
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
          )}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <span className="text-xl font-bold">瑞</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        {!isOpen && (
          <span className="mt-1 text-xs font-medium text-[#1A3C8B]">
            {t('chat.bubbleLabel')}
          </span>
        )}
      </div>
    </>
  );
}
