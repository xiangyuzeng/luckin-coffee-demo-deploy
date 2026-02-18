'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Send, Sparkles } from 'lucide-react';
import { detectIntent, generateResponse, ChatMessage, ChatContext } from '@/lib/chat-engine';

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession();
  const { locale, t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState<ChatContext>({ locale });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const intent = detectIntent(text);
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
      {/* Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-[#1A3C8B] to-[#2D5BB9] px-4 py-3 text-white shadow-md">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <Sparkles className="h-4 w-4" />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{t('chat.title')}</p>
          <p className="text-xs opacity-70">{t('chat.subtitle')}</p>
        </div>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-white/20">
          <span className="text-xs">✕</span>
        </button>
      </div>

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
              {msg.content}
            </div>
          </div>
        ))}
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
            placeholder={t('chat.placeholder')}
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
