import { getMockWeather } from './weather';

export type ChatIntent =
  | 'GREETING'
  | 'MENU_QUESTION'
  | 'RECOMMEND_DRINK'
  | 'ORDER_STATUS'
  | 'LOYALTY_POINTS'
  | 'COFFEE_FACT'
  | 'HOURS_LOCATION'
  | 'CUSTOMIZATION_HELP'
  | 'NATURAL_ORDER'
  | 'DIETARY_FILTER'
  | 'MOOD_BASED'
  | 'HELP_ME_CHOOSE'
  | 'ALLERGY_CHECK'
  | 'UNKNOWN';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  action?: 'START_QUIZ' | 'SHOW_RECOMMENDATIONS';
  recommendations?: { name: string; reason: string }[];
}

export interface ChatContext {
  userName?: string;
  activeOrder?: { status: string; items: string[] } | null;
  loyaltyPoints?: number;
  locale: 'en' | 'zh';
  quizAnswers?: {
    temperature?: 'hot' | 'cold';
    sweetness?: 'low' | 'medium' | 'high';
    mood?: 'energy' | 'relax' | 'refresh' | 'indulge';
  };
}

const INTENT_PATTERNS: Record<ChatIntent, RegExp[]> = {
  GREETING: [/^(hi|hello|hey|yo|sup|good\s*(morning|afternoon|evening))/i, /^(你好|嗨|哈喽|早上好|下午好|晚上好)/],
  MENU_QUESTION: [/menu|drink|food|what.*(have|serve|offer)|popular|best.*seller/i, /菜单|饮品|有什么|热门/],
  RECOMMEND_DRINK: [/recommend|suggest|what should|pick for me|best|try|what.*good/i, /推荐|建议|喝什么|试试/],
  ORDER_STATUS: [/order|status|track|where.*my|ready|pickup/i, /订单|状态|追踪|取餐/],
  LOYALTY_POINTS: [/points|reward|loyalty|redeem|tier|bronze|silver|gold/i, /积分|奖励|兑换|等级/],
  COFFEE_FACT: [/fact|trivia|tell me.*about|fun|random|interesting|did you know/i, /趣闻|知识|有趣|你知道/],
  HOURS_LOCATION: [/hour|open|close|location|where|address|store/i, /营业|地址|在哪|门店/],
  CUSTOMIZATION_HELP: [/custom|milk|sugar|size|oat|almond|coconut|shots|espresso|how.*order/i, /定制|牛奶|糖|大小|燕麦|杏仁|椰/],
  // New intents
  NATURAL_ORDER: [
    /i want.*(something|drink)|looking for|craving|in the mood for|give me/i,
    /想要|想喝|来一杯/
  ],
  DIETARY_FILTER: [
    /dairy.?free|vegan|lactose|gluten|allergy|allergic|without|no dairy/i,
    /无乳|素食|过敏|不含/
  ],
  MOOD_BASED: [
    /need.*(energy|wake|boost|focus)|want to.*(relax|chill|unwind)|feeling.*(tired|sleepy|stressed)/i,
    /需要能量|想放松|提神|解压/
  ],
  HELP_ME_CHOOSE: [
    /help.*choose|can't decide|not sure|what do you|quiz|surprise me|dealer'?s choice/i,
    /帮我选|不知道|选择困难|推荐一个/
  ],
  ALLERGY_CHECK: [
    /contain|have|allergen|nut|peanut|soy|gluten|dairy in|is there/i,
    /含有|过敏原|坚果|大豆|麸质/
  ],
  UNKNOWN: [],
};

export function detectIntent(message: string): ChatIntent {
  // Check for natural language ordering patterns first (more specific)
  const naturalPatterns = [
    /something.*(cold|hot|icy|warm|sweet|not.*sweet|fruity|creamy|strong|light)/i,
    /i('?m| am).*(hot|cold|tired|need)/i,
    /(cold|hot|icy|sweet|fruity|creamy|strong).*(drink|something|coffee)/i,
  ];
  for (const pattern of naturalPatterns) {
    if (pattern.test(message.trim())) return 'NATURAL_ORDER';
  }

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (intent === 'UNKNOWN') continue;
    for (const pattern of patterns) {
      if (pattern.test(message.trim())) return intent as ChatIntent;
    }
  }
  return 'UNKNOWN';
}

const COFFEE_FACTS = {
  en: [
    "Coffee is the world's second-most traded commodity after oil! ☕",
    "A coffee bean is actually the seed of a coffee cherry 🍒",
    "Finland drinks the most coffee per capita — about 12kg per person per year! 🇫🇮",
    "Espresso actually has less caffeine than drip coffee per serving 🤔",
    "The world drinks about 2.25 billion cups of coffee every single day! 🌍",
    "Coffee was originally eaten, not brewed — mixed with animal fat as energy balls 💪",
    "Beethoven was so particular, he counted exactly 60 beans per cup 🎵",
    "Cold brew has 67% less acidity than hot coffee — easier on the stomach! 🧊",
  ],
  zh: [
    "咖啡是仅次于石油的世界第二大贸易商品！☕",
    "咖啡豆其实是咖啡樱桃的种子 🍒",
    "芬兰是世界上人均咖啡消费量最高的国家——每人每年约12公斤！🇫🇮",
    "每份浓缩咖啡的咖啡因含量实际上低于滴滤咖啡 🤔",
    "全世界每天大约喝掉22.5亿杯咖啡！🌍",
    "咖啡最初是咀嚼食用的——与动物脂肪混合制成能量球 💪",
    "贝多芬非常讲究，每杯咖啡都要数正好60颗豆子 🎵",
    "冷萃咖啡的酸度比热咖啡低67%——对胃更温和！🧊",
  ],
};

// Allergen database for drinks
const DRINK_ALLERGENS: Record<string, string[]> = {
  'latte': ['dairy'],
  'cappuccino': ['dairy'],
  'mocha': ['dairy', 'soy'],
  'coconut': ['tree nuts'],
  'almond': ['tree nuts'],
  'caramel': ['dairy'],
  'oat': ['gluten'],
};

type ResponseFn = (ctx: ChatContext) => { content: string; suggestions: string[]; action?: ChatMessage['action'] };

const RESPONSES: Record<ChatIntent, Record<'en' | 'zh', ResponseFn>> = {
  GREETING: {
    en: (ctx) => ({
      content: `Hey${ctx.userName ? ` ${ctx.userName}` : ''}! ☕ I'm your Luckin Coffee assistant. What can I help you with today?`,
      suggestions: ['Recommend a drink', 'Check my order', 'My points'],
    }),
    zh: (ctx) => ({
      content: `嗨${ctx.userName ? ` ${ctx.userName}` : ''}！☕ 我是你的瑞幸咖啡助手。今天有什么可以帮你的？`,
      suggestions: ['推荐饮品', '查看订单', '我的积分'],
    }),
  },
  RECOMMEND_DRINK: {
    en: (ctx) => {
      const weather = getMockWeather();
      const isHot = weather.tempF > 75;
      const drink = isHot ? 'our Coconut Cold Brew or Ruby Ocean Refresher' : 'a warm Coconut Latte or Velvet Latte';
      return {
        content: `Based on today's weather (${weather.temp}°C, ${weather.condition}), I'd suggest ${drink}! 🥤 Check out the AI Barista card on the homepage for a personalized pick just for you.`,
        suggestions: ['Show me the menu', 'What\'s popular?', 'Help me choose'],
      };
    },
    zh: (ctx) => {
      const weather = getMockWeather();
      const isHot = weather.tempF > 75;
      const drink = isHot ? '我们的椰子冷萃或红宝石海洋冰饮' : '温暖的椰子拿铁或丝绒拿铁';
      return {
        content: `根据今天的天气（${weather.temp}°C，${weather.condition}），我推荐${drink}！🥤 首页的AI咖啡师会为你推荐最适合的饮品哦。`,
        suggestions: ['看看菜单', '什么最热门？', '帮我选择'],
      };
    },
  },
  ORDER_STATUS: {
    en: (ctx) => {
      if (ctx.activeOrder) {
        const labels: Record<string, string> = {
          PLACED: '📋 Your order has been placed and is in the queue!',
          PREPARING: '☕ Your barista is crafting your drink right now!',
          READY: '✅ Your order is READY for pickup! Head to the counter!',
        };
        return {
          content: labels[ctx.activeOrder.status] || 'Checking on your order...',
          suggestions: ['Track my order', 'Order more'],
        };
      }
      return {
        content: "I don't see any active orders right now. Would you like to browse the menu? 📋",
        suggestions: ['Browse menu', 'My past orders'],
      };
    },
    zh: (ctx) => {
      if (ctx.activeOrder) {
        const labels: Record<string, string> = {
          PLACED: '📋 你的订单已下单，排队中！',
          PREPARING: '☕ 咖啡师正在为你制作！',
          READY: '✅ 你的订单已准备好，请到柜台取餐！',
        };
        return {
          content: labels[ctx.activeOrder.status] || '正在查询你的订单...',
          suggestions: ['追踪订单', '继续点单'],
        };
      }
      return {
        content: '目前没有进行中的订单。想浏览菜单吗？📋',
        suggestions: ['浏览菜单', '历史订单'],
      };
    },
  },
  LOYALTY_POINTS: {
    en: (ctx) => {
      if (ctx.loyaltyPoints !== undefined) {
        return {
          content: `You have ${ctx.loyaltyPoints} loyalty points! 🌟 Every $1 spent earns 10 points. You can redeem 200 pts for $1 off, or save up 800 pts for a free classic drink!`,
          suggestions: ['View rewards', 'How to earn more?'],
        };
      }
      return {
        content: 'Sign in to check your loyalty points and unlock amazing rewards! 🎁',
        suggestions: ['Sign in', 'How do points work?'],
      };
    },
    zh: (ctx) => {
      if (ctx.loyaltyPoints !== undefined) {
        return {
          content: `你有 ${ctx.loyaltyPoints} 积分！🌟 每消费1美元可获得10积分。200积分可抵扣1美元，攒到800积分可兑换免费经典饮品！`,
          suggestions: ['查看奖励', '如何赚更多？'],
        };
      }
      return {
        content: '登录查看你的积分，解锁丰厚奖励！🎁',
        suggestions: ['登录', '积分如何运作？'],
      };
    },
  },
  MENU_QUESTION: {
    en: () => ({
      content: "We have 5 amazing categories! ✨ Signatures (our famous Coconut Latte!), ☕ Classics, 🧊 Cold Brew, 🍹 Refreshers, and 🥐 Food. Head to the Menu tab to see everything!",
      suggestions: ['Recommend a drink', 'What\'s a Signature?', 'Show prices'],
    }),
    zh: () => ({
      content: '我们有5大精彩类别！✨ 招牌（人气椰子拿铁！）、☕ 经典、🧊 冷萃、🍹 清爽饮品和 🥐 食品。去菜单栏看看吧！',
      suggestions: ['推荐饮品', '什么是招牌？', '查看价格'],
    }),
  },
  COFFEE_FACT: {
    en: (ctx) => {
      const facts = COFFEE_FACTS.en;
      const index = Math.floor(Math.random() * facts.length);
      return {
        content: `Did you know? ${facts[index]}`,
        suggestions: ['Tell me another!', 'Recommend a drink', 'Back to menu'],
      };
    },
    zh: (ctx) => {
      const facts = COFFEE_FACTS.zh;
      const index = Math.floor(Math.random() * facts.length);
      return {
        content: `你知道吗？${facts[index]}`,
        suggestions: ['再来一个！', '推荐饮品', '回到菜单'],
      };
    },
  },
  HOURS_LOCATION: {
    en: () => ({
      content: "We're open daily from 7:00 AM to 9:00 PM! 🕐 Use the QR code at any Luckin Coffee store to order ahead and skip the line. Your order will be ready when you arrive!",
      suggestions: ['Start ordering', 'How to scan QR?'],
    }),
    zh: () => ({
      content: '我们每天营业时间：早7:00 - 晚9:00！🕐 在任意瑞幸咖啡门店扫描二维码即可提前下单，免排队。到店即取！',
      suggestions: ['开始点单', '如何扫码？'],
    }),
  },
  CUSTOMIZATION_HELP: {
    en: () => ({
      content: "You can customize your drink! 🎨\n\n☕ Size: Small (-$0.50), Medium, Large (+$0.75)\n🥛 Milk: Regular, Oat, Almond, Coconut (+$0.70)\n🍬 Sugar: None, Light, Normal, Extra\n💪 Extra shot: +$0.50 each\n\nJust tap any drink on the menu to customize it!",
      suggestions: ['What\'s oat milk?', 'Recommend a drink', 'Browse menu'],
    }),
    zh: () => ({
      content: '你可以自定义你的饮品！🎨\n\n☕ 杯型：小杯(-$0.50)、中杯、大杯(+$0.75)\n🥛 奶类：普通牛奶、燕麦奶、杏仁奶、椰奶(+$0.70)\n🍬 糖度：无糖、微糖、正常、加糖\n💪 加浓：每份+$0.50\n\n点击菜单中的任意饮品即可自定义！',
      suggestions: ['什么是燕麦奶？', '推荐饮品', '浏览菜单'],
    }),
  },
  // New intent responses
  NATURAL_ORDER: {
    en: () => ({
      content: "I can help you find the perfect drink! 🎯 Tell me more about what you're looking for:\n\n• Temperature: hot or cold?\n• Sweetness: sweet, not too sweet, or no sugar?\n• Flavor: fruity, creamy, chocolatey?\n\nOr just say something like \"something cold and not too sweet\" and I'll find matches!",
      suggestions: ['Something cold & fruity', 'Hot & creamy', 'Help me choose'],
    }),
    zh: () => ({
      content: '我可以帮你找到完美的饮品！🎯 告诉我更多你想要的：\n\n• 温度：热的还是冷的？\n• 甜度：甜、微甜还是无糖？\n• 口味：果味、奶香还是巧克力？\n\n或者直接说"来杯冰的不太甜的"，我来帮你匹配！',
      suggestions: ['冰的果味', '热的奶香', '帮我选择'],
    }),
  },
  DIETARY_FILTER: {
    en: () => ({
      content: "We've got you covered! 🌱\n\n🥛 Dairy-free options: Oat, Almond, or Coconut milk (+$0.70)\n🌿 Vegan-friendly: Most drinks can be made vegan with alt milk\n🚫 Sugar-free: Choose \"None\" for sugar level\n\nJust customize any drink to fit your needs! Our Refreshers are naturally dairy-free too.",
      suggestions: ['Show dairy-free drinks', 'Vegan options', 'Browse menu'],
    }),
    zh: () => ({
      content: '我们为你准备好了！🌱\n\n🥛 无乳选项：燕麦奶、杏仁奶或椰奶（+$0.70）\n🌿 纯素友好：大多数饮品可用植物奶制作\n🚫 无糖：选择"无糖"糖度\n\n任何饮品都可以根据你的需求定制！我们的清爽系列天然无乳。',
      suggestions: ['无乳饮品', '纯素选项', '浏览菜单'],
    }),
  },
  MOOD_BASED: {
    en: () => {
      const hour = new Date().getHours();
      let suggestion = '';
      if (hour < 12) {
        suggestion = "For a morning energy boost, try our Cold Brew or Americano — high caffeine to kickstart your day! ⚡";
      } else if (hour < 17) {
        suggestion = "For an afternoon pick-me-up, our Coconut Latte or Velvet Latte are perfect — smooth energy without the jitters! 🌟";
      } else {
        suggestion = "For evening relaxation, try our Dreamy Latte or a Refresher (lower caffeine) — unwind without staying up all night! 🌙";
      }
      return {
        content: suggestion,
        suggestions: ['Need more energy', 'Want to relax', 'Something refreshing'],
      };
    },
    zh: () => {
      const hour = new Date().getHours();
      let suggestion = '';
      if (hour < 12) {
        suggestion = '早晨提神，试试我们的冷萃或美式——高咖啡因开启活力一天！⚡';
      } else if (hour < 17) {
        suggestion = '下午提神，椰子拿铁或丝绒拿铁最合适——顺滑能量不心慌！🌟';
      } else {
        suggestion = '晚间放松，试试梦幻拿铁或清爽系列（低咖啡因）——放松不失眠！🌙';
      }
      return {
        content: suggestion,
        suggestions: ['需要能量', '想放松', '来点清爽的'],
      };
    },
  },
  HELP_ME_CHOOSE: {
    en: () => ({
      content: "Let's find your perfect drink! 🎯 I'll ask you 3 quick questions:\n\n**Question 1 of 3:**\nDo you want something **hot** or **cold**?",
      suggestions: ['Hot ☕', 'Cold 🧊'],
      action: 'START_QUIZ',
    }),
    zh: () => ({
      content: '让我帮你找到完美饮品！🎯 我会问你3个简单问题：\n\n**问题 1/3：**\n你想要**热的**还是**冷的**？',
      suggestions: ['热的 ☕', '冷的 🧊'],
      action: 'START_QUIZ',
    }),
  },
  ALLERGY_CHECK: {
    en: () => ({
      content: "I can help with allergen info! 🔍\n\n**Common allergens in our drinks:**\n• 🥛 Dairy: Lattes, Cappuccinos, Mochas (use alt milk to avoid)\n• 🥜 Tree nuts: Coconut & Almond milk options\n• 🌾 Gluten: Oat milk contains gluten\n\nAsk me about a specific drink and I'll check its ingredients!",
      suggestions: ['Is Coconut Latte nut-free?', 'Dairy-free options', 'Browse menu'],
    }),
    zh: () => ({
      content: '我可以帮你查过敏原信息！🔍\n\n**我们饮品中常见的过敏原：**\n• 🥛 乳制品：拿铁、卡布奇诺、摩卡（可用植物奶替代）\n• 🥜 坚果：椰奶和杏仁奶选项\n• 🌾 麸质：燕麦奶含麸质\n\n问我具体饮品，我来帮你查成分！',
      suggestions: ['椰子拿铁有坚果吗？', '无乳选项', '浏览菜单'],
    }),
  },
  UNKNOWN: {
    en: () => ({
      content: "I'm not sure I understood that, but I'm here to help! ☕ I can help with menu questions, drink recommendations, order tracking, loyalty points, and fun coffee facts!",
      suggestions: ['Recommend a drink', 'View menu', 'Help me choose', 'Coffee fact'],
    }),
    zh: () => ({
      content: '我不太确定你的意思，但我很乐意帮忙！☕ 我可以帮你了解菜单、推荐饮品、查询订单、查看积分和分享咖啡趣闻！',
      suggestions: ['推荐饮品', '查看菜单', '帮我选择', '咖啡趣闻'],
    }),
  },
};

export function generateResponse(intent: ChatIntent, context: ChatContext): { content: string; suggestions: string[]; action?: ChatMessage['action'] } {
  const handler = RESPONSES[intent]?.[context.locale] || RESPONSES.UNKNOWN[context.locale];
  return handler(context);
}

// Quiz flow helpers
export function getQuizQuestion(step: number, locale: 'en' | 'zh'): { content: string; suggestions: string[] } {
  const questions = {
    en: [
      {
        content: "**Question 1 of 3:**\nDo you want something **hot** or **cold**?",
        suggestions: ['Hot ☕', 'Cold 🧊'],
      },
      {
        content: "**Question 2 of 3:**\nHow sweet do you like it?",
        suggestions: ['Not sweet', 'A little sweet', 'Sweet!'],
      },
      {
        content: "**Question 3 of 3:**\nWhat's your mood right now?",
        suggestions: ['Need energy ⚡', 'Want to relax 🌙', 'Feeling refreshed 🌊', 'Treat myself 🍫'],
      },
    ],
    zh: [
      {
        content: '**问题 1/3：**\n你想要**热的**还是**冷的**？',
        suggestions: ['热的 ☕', '冷的 🧊'],
      },
      {
        content: '**问题 2/3：**\n你喜欢多甜？',
        suggestions: ['不甜', '微甜', '甜甜的！'],
      },
      {
        content: '**问题 3/3：**\n你现在的心情是？',
        suggestions: ['需要能量 ⚡', '想放松 🌙', '清爽一下 🌊', '犒劳自己 🍫'],
      },
    ],
  };

  return questions[locale][step] || questions[locale][0];
}
