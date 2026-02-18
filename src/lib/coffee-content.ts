interface CoffeeQuote {
  en: string;
  zh: string;
}

// ~20 motivational coffee quotes
const QUOTES: CoffeeQuote[] = [
  { en: "Life begins after coffee.", zh: "生活从咖啡开始。" },
  { en: "But first, coffee.", zh: "但首先，咖啡。" },
  { en: "Coffee: because adulting is hard.", zh: "咖啡：因为成年人不容易。" },
  { en: "Today's good mood is sponsored by coffee.", zh: "今日好心情由咖啡赞助。" },
  { en: "A yawn is a silent scream for coffee.", zh: "打哈欠是对咖啡的无声呐喊。" },
  { en: "Behind every successful person is a substantial amount of coffee.", zh: "每个成功人士的背后都有大量的咖啡。" },
  { en: "Coffee is always a good idea.", zh: "喝咖啡永远是个好主意。" },
  { en: "Rise and grind.", zh: "早起，磨豆。" },
  { en: "Espresso yourself.", zh: "用咖啡表达自己。" },
  { en: "Stay grounded.", zh: "保持脚踏实地。" },
  { en: "Where there is coffee, there is hope.", zh: "有咖啡的地方就有希望。" },
  { en: "Coffee makes everything possible.", zh: "咖啡让一切成为可能。" },
  { en: "Brew-tiful day ahead.", zh: "美好的一天从冲泡开始。" },
  { en: "May your coffee be strong and your Monday be short.", zh: "愿你的咖啡浓烈，周一短暂。" },
  { en: "Good days start with coffee and you.", zh: "美好的一天从咖啡和你开始。" },
  { en: "Sip happens.", zh: "啜饮人生。" },
  { en: "First I drink the coffee, then I do the things.", zh: "先喝咖啡，再做事情。" },
  { en: "Keep calm and drink coffee.", zh: "保持冷静，喝杯咖啡。" },
  { en: "Coffee: a hug in a mug.", zh: "咖啡：杯中的温暖拥抱。" },
  { en: "The best time for coffee is now.", zh: "喝咖啡最好的时间就是现在。" },
];

// ~12 fun coffee facts
const FACTS: CoffeeQuote[] = [
  { en: "Coffee is the world's second-most traded commodity after oil.", zh: "咖啡是仅次于石油的世界第二大贸易商品。" },
  { en: "Finland drinks the most coffee per capita in the world.", zh: "芬兰是世界上人均咖啡消费量最高的国家。" },
  { en: "The word 'coffee' comes from the Arabic word 'qahwah'.", zh: "'咖啡'一词源于阿拉伯语'qahwah'。" },
  { en: "A coffee bean is actually the seed of a coffee cherry.", zh: "咖啡豆其实是咖啡樱桃的种子。" },
  { en: "Beethoven counted exactly 60 beans per cup of coffee.", zh: "贝多芬每杯咖啡都要数正好60颗豆子。" },
  { en: "It takes about 70 coffee beans to make one cup of coffee.", zh: "大约需要70颗咖啡豆才能制作一杯咖啡。" },
  { en: "The most expensive coffee in the world can cost over $600 per pound.", zh: "世界上最贵的咖啡每磅可超过600美元。" },
  { en: "Coffee was originally chewed, not brewed.", zh: "咖啡最初是咀嚼食用的，而非冲泡。" },
  { en: "Espresso has less caffeine than drip coffee per serving.", zh: "每份浓缩咖啡的咖啡因含量低于滴滤咖啡。" },
  { en: "The world drinks about 2.25 billion cups of coffee daily.", zh: "全世界每天大约喝掉22.5亿杯咖啡。" },
  { en: "Coffee grounds can be used as a natural fertilizer.", zh: "咖啡渣可以用作天然肥料。" },
  { en: "Cold brew coffee has 67% less acidity than hot coffee.", zh: "冷萃咖啡的酸度比热咖啡低67%。" },
];

export type Locale = 'en' | 'zh';

export function getDailyQuote(locale: Locale): string {
  const index = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[index][locale];
}

export function getDailyFact(locale: Locale): string {
  const index = Math.floor(Math.random() * FACTS.length);
  return FACTS[index][locale];
}
