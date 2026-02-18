'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Sparkles } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const { t, locale } = useTranslation();

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
        {/* Floating label */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 rounded-full bg-white px-3 py-1.5 shadow-lg"
          >
            <span className="text-xs font-medium text-[#1A3C8B]">
              {locale === 'zh' ? t('chat.aiAssistant') : t('chat.aiBarista')}
            </span>
          </motion.div>
        )}

        {/* Main bubble */}
        <motion.button
          onClick={handleToggle}
          className={`relative flex h-[72px] w-[72px] items-center justify-center rounded-full shadow-xl transition-all ${
            !isOpen ? 'animate-ai-glow' : ''
          }`}
          style={{
            background: isOpen
              ? '#1A3C8B'
              : 'linear-gradient(135deg, #1A3C8B 0%, #6366F1 100%)',
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? 'Close chat' : 'Open AI Barista chat'}
        >
          {/* Outer glow ring */}
          {!isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #1A3C8B 0%, #6366F1 100%)',
                filter: 'blur(12px)',
                opacity: 0.5,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Notification dot */}
          {!hasBeenOpened && !isOpen && (
            <span className="absolute -right-0.5 -top-0.5 z-10 h-4 w-4 rounded-full border-2 border-white bg-green-500">
              <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-75" />
            </span>
          )}

          {/* AI badge */}
          {!isOpen && (
            <div className="absolute -bottom-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md">
              <Sparkles className="h-3.5 w-3.5 text-[#6366F1]" />
            </div>
          )}

          {/* Icon content */}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                className="relative z-10"
              >
                <X className="h-7 w-7 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="relative z-10"
              >
                <Bot className="h-8 w-8 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
