'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, DEFAULT_CUSTOMIZATION } from '@/lib/store';
import { ExtendedMenu } from '@/types/menu';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Sparkles, Zap, Heart, Coffee, Sun, Moon, RefreshCw } from 'lucide-react';

type Mood = 'energized' | 'relaxed' | 'focused' | 'treat';

interface MoodConfig {
  id: Mood;
  emoji: string;
  icon: React.ReactNode;
  keywords: string[];
}

const MOOD_CONFIGS: MoodConfig[] = [
  { id: 'energized', emoji: '⚡', icon: <Zap className="h-4 w-4" />, keywords: ['espresso', 'cold brew', 'americano', 'double shot'] },
  { id: 'relaxed', emoji: '🌿', icon: <Sun className="h-4 w-4" />, keywords: ['vanilla', 'latte', 'matcha', 'oat'] },
  { id: 'focused', emoji: '🎯', icon: <Coffee className="h-4 w-4" />, keywords: ['americano', 'black', 'drip', 'cold brew'] },
  { id: 'treat', emoji: '🍰', icon: <Heart className="h-4 w-4" />, keywords: ['caramel', 'mocha', 'chocolate', 'frappe', 'cream'] },
];

export default function EmoChannel() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [menus, setMenus] = useState<ExtendedMenu[]>([]);
  const [recommendations, setRecommendations] = useState<ExtendedMenu[]>([]);
  const addToCart = useCartStore((state) => state.addToCart);
  const { t, locale } = useTranslation();

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.ok ? r.json() : [])
      .then(data => setMenus(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedMood || menus.length === 0) {
      setRecommendations([]);
      return;
    }

    const config = MOOD_CONFIGS.find(m => m.id === selectedMood);
    if (!config) return;

    const matched = menus.filter(menu => {
      const searchText = `${menu.name} ${menu.description || ''}`.toLowerCase();
      return config.keywords.some(keyword => searchText.includes(keyword));
    });

    // If not enough matches, add some signature items
    let results = matched.slice(0, 3);
    if (results.length < 3) {
      const signatures = menus.filter(m => m.isSignature && !results.includes(m));
      results = [...results, ...signatures.slice(0, 3 - results.length)];
    }

    setRecommendations(results);
  }, [selectedMood, menus]);

  const handleAddToCart = (item: ExtendedMenu) => {
    addToCart(item, 'MEDIUM', 1, DEFAULT_CUSTOMIZATION);
    toast.success(t('quickOrder.addedToCart', { name: item.name }));
  };

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(selectedMood === mood ? null : mood);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="w-full"
    >
      <div className="luckin-card overflow-hidden p-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#6366F1]" />
            <h3 className="text-sm font-bold text-[#1A3C8B]">
              {t('emoChannel.title')}
            </h3>
          </div>
          {selectedMood && (
            <button
              onClick={() => setSelectedMood(null)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#1A3C8B]"
            >
              <RefreshCw className="h-3 w-3" />
              {t('emoChannel.reset')}
            </button>
          )}
        </div>

        {/* Mood Selection */}
        <div className="mb-4">
          <p className="mb-3 text-xs text-gray-500">{t('emoChannel.howFeeling')}</p>
          <div className="flex gap-2">
            {MOOD_CONFIGS.map((mood) => (
              <motion.button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-3 py-3 transition-all ${
                  selectedMood === mood.id
                    ? 'bg-[#1A3C8B] text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{mood.emoji}</span>
                <span className="text-[10px] font-medium">
                  {t(`emoChannel.mood.${mood.id}`)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <AnimatePresence mode="wait">
          {selectedMood && recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="border-t border-gray-100 pt-4">
                <p className="mb-3 text-xs font-medium text-[#1A3C8B]">
                  {t('emoChannel.perfectFor')} {t(`emoChannel.mood.${selectedMood}`)}
                </p>
                <div className="space-y-2">
                  {recommendations.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-2"
                    >
                      {item.images?.[0] && (
                        <img
                          src={item.images[0].url}
                          alt={item.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-500">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A3C8B] text-white transition-colors hover:bg-[#2D5BB9]"
                      >
                        +
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state when mood selected but no recommendations */}
        {selectedMood && recommendations.length === 0 && menus.length > 0 && (
          <div className="border-t border-gray-100 pt-4 text-center text-sm text-gray-500">
            {t('emoChannel.noMatches')}
          </div>
        )}
      </div>
    </motion.div>
  );
}
