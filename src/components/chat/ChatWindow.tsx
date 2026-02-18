'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Send, Sparkles, Zap, Bot, X } from 'lucide-react';
import { detectIntent, generateResponse, ChatMessage, ChatContext, getQuizQuestion } from '@/lib/chat-engine';
import { parseNaturalLanguage, matchDrinksToQuery, QuizAnswers, getQuizRecommendations } from '@/lib/drink-attributes';
import { ExtendedMenu } from '@/types/menu';

interface QuizState {
  active: boolean;
  step: number;
  answers: Partial<QuizAnswers>;
}

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession();
  const { locale, t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState<ChatContext>({ locale });
  const [menus, setMenus] = useState<ExtendedMenu[]>([]);
  const [quiz, setQuiz] = useState<QuizState>({ active: false, step: 0, answers: {} });
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch menus for recommendations
    fetch('/api/menu')
      .then(r => r.ok ? r.json() : [])
      .then(data => setMenus(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx: ChatContext = { locale, userName: session?.user?.username };

    const fetches: Promise<void>[] = [];
    if (session?.user) {
      fetches.push(
        fetch('/api/loyalty').then(r => r.ok ? r.json() : null).then(l => { if (l) ctx.loyaltyPoints = l.points; }).catch(() => {}),
        fetch('/api/tracking').then(r => r.ok ? r.json() : null).then(o => {
          if (o?.tracking) ctx.activeOrder = { status: o.tracking.status, items: o.cartItems?.map((i: any) => i.menu?.name) || [] };
        }).catch(() => {}),
      );
    }

    Promise.allSettled(fetches).then(() => {
      setContext(ctx);
      const greeting = generateResponse('GREETING', ctx);
      setMessages([{
        id: '1',
        role: 'assistant',
        content: greeting.content,
        timestamp: new Date(),
        suggestions: greeting.suggestions,
      }]);
    });
  }, [session, locale]);

  const addAssistantMessage = (content: string, suggestions?: string[], recommendations?: ChatMessage['recommendations']) => {
    setIsTyping(true);
    setTimeout(() => {
      const msg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        timestamp: new Date(),
        suggestions,
        recommendations,
      };
      setMessages(prev => [...prev, msg]);
      setIsTyping(false);
    }, 500);
  };

  const handleQuizAnswer = (answer: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: answer,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    const newAnswers = { ...quiz.answers };

    // Parse answer based on step
    if (quiz.step === 0) {
      newAnswers.temperature = answer.toLowerCase().includes('hot') ? 'hot' : 'cold';
    } else if (quiz.step === 1) {
      if (answer.toLowerCase().includes('not') || answer.includes('不')) {
        newAnswers.sweetness = 'low';
      } else if (answer.toLowerCase().includes('little') || answer.includes('微')) {
        newAnswers.sweetness = 'medium';
      } else {
        newAnswers.sweetness = 'high';
      }
    } else if (quiz.step === 2) {
      if (answer.toLowerCase().includes('energy') || answer.includes('能量')) {
        newAnswers.mood = 'energy';
      } else if (answer.toLowerCase().includes('relax') || answer.includes('放松')) {
        newAnswers.mood = 'relax';
      } else if (answer.toLowerCase().includes('refresh') || answer.includes('清爽')) {
        newAnswers.mood = 'refresh';
      } else {
        newAnswers.mood = 'indulge';
      }
    }

    if (quiz.step < 2) {
      // Next question
      const nextStep = quiz.step + 1;
      setQuiz({ active: true, step: nextStep, answers: newAnswers });
      const question = getQuizQuestion(nextStep, locale);
      setTimeout(() => addAssistantMessage(question.content, question.suggestions), 300);
    } else {
      // Quiz complete - show recommendations
      setQuiz({ active: false, step: 0, answers: {} });
      const recommendations = getQuizRecommendations(menus, newAnswers as QuizAnswers);

      if (recommendations.length > 0) {
        const recList = recommendations.slice(0, 3).map((r, i) => {
          const emoji = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
          return `${emoji} **${r.menu.name}** - ${r.matchReasons[0] || 'Great match!'}`;
        }).join('\n');

        const content = locale === 'en'
          ? `Based on your preferences, here are my top picks! 🎯\n\n${recList}\n\nTap any drink name in the menu to order!`
          : `根据你的喜好，这是我的推荐！🎯\n\n${recList}\n\n点击菜单中的饮品名称即可下单！`;

        setTimeout(() => addAssistantMessage(
          content,
          [locale === 'en' ? 'Browse menu' : '浏览菜单', locale === 'en' ? 'Try again' : '再试一次']
        ), 300);
      } else {
        const content = locale === 'en'
          ? "Hmm, I couldn't find a perfect match. Let me show you our popular drinks instead!"
          : '嗯，没找到完美匹配。让我给你看看我们的热门饮品吧！';
        setTimeout(() => addAssistantMessage(content, [locale === 'en' ? 'Browse menu' : '浏览菜单']), 300);
      }
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    // If quiz is active, handle as quiz answer
    if (quiz.active) {
      handleQuizAnswer(text);
      setInput('');
      inputRef.current?.focus();
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const intent = detectIntent(text);

    // Handle natural language ordering
    if (intent === 'NATURAL_ORDER' && menus.length > 0) {
      const query = parseNaturalLanguage(text);
      const matches = matchDrinksToQuery(menus, query);

      if (matches.length > 0) {
        const topMatches = matches.slice(0, 3);
        const recList = topMatches.map((m, i) => {
          const emoji = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
          return `${emoji} **${m.menu.name}** - ${m.matchReasons[0] || 'Great match!'}`;
        }).join('\n');

        const content = locale === 'en'
          ? `I found some great matches for you! 🎯\n\n${recList}\n\nWant me to tell you more about any of these?`
          : `我为你找到了一些好选择！🎯\n\n${recList}\n\n想了解更多吗？`;

        setMessages(prev => [...prev, userMsg]);
        setTimeout(() => addAssistantMessage(
          content,
          [locale === 'en' ? 'Browse menu' : '浏览菜单', locale === 'en' ? 'Help me choose' : '帮我选择']
        ), 300);
        setInput('');
        inputRef.current?.focus();
        return;
      }
    }

    // Handle help me choose - start quiz
    if (intent === 'HELP_ME_CHOOSE') {
      setQuiz({ active: true, step: 0, answers: {} });
      const response = generateResponse(intent, { ...context, locale });
      setMessages(prev => [...prev, userMsg]);
      setTimeout(() => addAssistantMessage(response.content, response.suggestions), 300);
      setInput('');
      inputRef.current?.focus();
      return;
    }

    const response = generateResponse(intent, { ...context, locale });

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-36 right-4 z-40 flex h-[28rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl md:bottom-22"
    >
      {/* Enhanced Header */}
      <div className="relative flex items-center gap-3 px-4 py-3 text-white shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #1A3C8B 0%, #6366F1 100%)',
        }}
      >
        {/* Sparkle decorations */}
        <div className="absolute right-12 top-2 opacity-30">
          <Sparkles className="h-3 w-3" />
        </div>
        <div className="absolute right-20 top-4 opacity-20">
          <Sparkles className="h-2 w-2" />
        </div>

        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <Bot className="h-5 w-5" />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">{locale === 'zh' ? t('chat.aiAssistant') : t('chat.aiBarista')}</p>
          <p className="flex items-center gap-1 text-xs opacity-80">
            <Sparkles className="h-3 w-3" />
            {t('chat.poweredByAI')}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 transition-colors hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Quiz Progress Indicator */}
      {quiz.active && (
        <div className="flex items-center gap-2 border-b border-gray-100 bg-blue-50 px-4 py-2">
          <Zap className="h-4 w-4 text-[#1A3C8B]" />
          <span className="text-xs font-medium text-[#1A3C8B]">
            {locale === 'en' ? `Finding your perfect drink... (${quiz.step + 1}/3)` : `寻找你的完美饮品... (${quiz.step + 1}/3)`}
          </span>
          <div className="ml-auto flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full ${i <= quiz.step ? 'bg-[#1A3C8B]' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'rounded-br-md bg-[#1A3C8B] text-white'
                  : 'rounded-bl-md bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </div>
          </div>
        ))}
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">
              <motion.span
                className="h-2 w-2 rounded-full bg-gray-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.span
                className="h-2 w-2 rounded-full bg-gray-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.span
                className="h-2 w-2 rounded-full bg-gray-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        )}
        {/* Quick reply suggestions */}
        {messages.length > 0 && messages[messages.length - 1].suggestions && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {messages[messages.length - 1].suggestions!.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="rounded-full border border-[#1A3C8B]/30 bg-white px-3 py-1.5 text-xs text-[#1A3C8B] transition-colors hover:bg-[#1A3C8B]/5"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={quiz.active
              ? (locale === 'en' ? 'Or type your answer...' : '或输入你的答案...')
              : t('chat.placeholder')
            }
            className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#1A3C8B]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A3C8B] text-white transition-opacity disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
