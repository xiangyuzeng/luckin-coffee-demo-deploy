import { ExtendedMenu } from '@/types/menu';

export interface DrinkAttributes {
  temperature: 'hot' | 'cold' | 'any';
  sweetness: 'low' | 'medium' | 'high';
  caffeine: 'none' | 'low' | 'medium' | 'high';
  flavor: string[];
  dietary: string[];
  mood: ('energy' | 'relax' | 'refresh' | 'indulge')[];
}

// Attribute definitions for drinks based on name/description patterns
const DRINK_ATTRIBUTE_MAP: Record<string, Partial<DrinkAttributes>> = {
  // Temperature patterns
  'iced': { temperature: 'cold' },
  'cold brew': { temperature: 'cold', caffeine: 'high' },
  'cold': { temperature: 'cold' },
  'refresher': { temperature: 'cold', caffeine: 'low', mood: ['refresh'] },
  'latte': { temperature: 'hot', caffeine: 'medium' },
  'cappuccino': { temperature: 'hot', caffeine: 'medium' },
  'americano': { temperature: 'hot', caffeine: 'high', sweetness: 'low' },
  'mocha': { temperature: 'hot', sweetness: 'high', mood: ['indulge'] },
  'espresso': { temperature: 'hot', caffeine: 'high' },

  // Flavor patterns
  'coconut': { flavor: ['coconut', 'tropical'], dietary: ['dairy-free-option'] },
  'oat': { dietary: ['dairy-free', 'vegan'] },
  'almond': { dietary: ['dairy-free', 'vegan'] },
  'vanilla': { flavor: ['vanilla', 'sweet'] },
  'caramel': { flavor: ['caramel', 'sweet'], sweetness: 'high' },
  'chocolate': { flavor: ['chocolate'], sweetness: 'high', mood: ['indulge'] },
  'matcha': { flavor: ['matcha', 'earthy'], caffeine: 'medium' },
  'mango': { flavor: ['mango', 'tropical', 'fruity'], mood: ['refresh'] },
  'berry': { flavor: ['berry', 'fruity'], mood: ['refresh'] },
  'ruby': { flavor: ['fruity', 'berry'], mood: ['refresh'] },
  'velvet': { sweetness: 'medium', mood: ['indulge'] },
  'dreamy': { sweetness: 'medium', mood: ['relax'] },

  // Mood patterns
  'energy': { mood: ['energy'], caffeine: 'high' },
  'boost': { mood: ['energy'], caffeine: 'high' },
};

// Allergen information
const ALLERGEN_MAP: Record<string, string[]> = {
  'coconut': ['tree nuts'],
  'almond': ['tree nuts'],
  'oat': ['gluten'],
  'mocha': ['dairy', 'soy'],
  'latte': ['dairy'],
  'cappuccino': ['dairy'],
  'caramel': ['dairy'],
};

export function getDrinkAttributes(menu: ExtendedMenu): DrinkAttributes {
  const name = menu.name.toLowerCase();
  const desc = (menu.description || '').toLowerCase();
  const combined = `${name} ${desc}`;

  const attrs: DrinkAttributes = {
    temperature: 'any',
    sweetness: 'medium',
    caffeine: 'medium',
    flavor: [],
    dietary: [],
    mood: [],
  };

  // Apply matching patterns
  for (const [pattern, attributes] of Object.entries(DRINK_ATTRIBUTE_MAP)) {
    if (combined.includes(pattern)) {
      if (attributes.temperature) attrs.temperature = attributes.temperature;
      if (attributes.sweetness) attrs.sweetness = attributes.sweetness;
      if (attributes.caffeine) attrs.caffeine = attributes.caffeine;
      if (attributes.flavor) attrs.flavor.push(...attributes.flavor);
      if (attributes.dietary) attrs.dietary.push(...attributes.dietary);
      if (attributes.mood) attrs.mood.push(...attributes.mood);
    }
  }

  // Dedupe arrays
  attrs.flavor = Array.from(new Set(attrs.flavor));
  attrs.dietary = Array.from(new Set(attrs.dietary));
  attrs.mood = Array.from(new Set(attrs.mood)) as DrinkAttributes['mood'];

  return attrs;
}

export function getAllergens(menu: ExtendedMenu): string[] {
  const name = menu.name.toLowerCase();
  const desc = (menu.description || '').toLowerCase();
  const combined = `${name} ${desc}`;

  const allergens: string[] = [];
  for (const [pattern, items] of Object.entries(ALLERGEN_MAP)) {
    if (combined.includes(pattern)) {
      allergens.push(...items);
    }
  }

  return Array.from(new Set(allergens));
}

export interface NaturalLanguageQuery {
  temperature?: 'hot' | 'cold';
  sweetness?: 'low' | 'medium' | 'high';
  caffeine?: 'none' | 'low' | 'high';
  flavors?: string[];
  dietary?: string[];
  mood?: string;
}

export function parseNaturalLanguage(input: string): NaturalLanguageQuery {
  const lower = input.toLowerCase();
  const query: NaturalLanguageQuery = {};

  // Temperature
  if (/\b(iced?|cold|cool|frozen|chilled)\b/.test(lower)) {
    query.temperature = 'cold';
  } else if (/\b(hot|warm|steaming)\b/.test(lower)) {
    query.temperature = 'hot';
  }

  // Sweetness
  if (/\b(not.*sweet|less.*sweet|low.*sugar|no.*sugar|unsweetened|light)\b/.test(lower)) {
    query.sweetness = 'low';
  } else if (/\b(sweet|sugary|dessert)\b/.test(lower)) {
    query.sweetness = 'high';
  }

  // Caffeine
  if (/\b(decaf|no.*caffeine|caffeine.*free)\b/.test(lower)) {
    query.caffeine = 'none';
  } else if (/\b(strong|extra.*caffeine|wake.*up|energy|boost)\b/.test(lower)) {
    query.caffeine = 'high';
  } else if (/\b(light.*caffeine|mild)\b/.test(lower)) {
    query.caffeine = 'low';
  }

  // Flavors
  const flavorPatterns = [
    'coconut', 'vanilla', 'caramel', 'chocolate', 'mocha',
    'matcha', 'mango', 'berry', 'fruity', 'tropical', 'nutty'
  ];
  query.flavors = flavorPatterns.filter(f => lower.includes(f));

  // Dietary
  const dietaryPatterns: [RegExp, string][] = [
    [/\b(dairy.*free|no.*dairy|non.*dairy|vegan)\b/, 'dairy-free'],
    [/\b(oat|oat.*milk)\b/, 'oat'],
    [/\b(almond)\b/, 'almond'],
    [/\b(coconut)\b/, 'coconut'],
    [/\b(vegan)\b/, 'vegan'],
  ];
  query.dietary = Array.from(new Set(dietaryPatterns
    .filter(([pattern]) => pattern.test(lower))
    .map(([, label]) => label)));

  // Mood
  if (/\b(energy|wake|alert|focus|productive)\b/.test(lower)) {
    query.mood = 'energy';
  } else if (/\b(relax|calm|chill|unwind|cozy)\b/.test(lower)) {
    query.mood = 'relax';
  } else if (/\b(refresh|cool.*down|summer|light)\b/.test(lower)) {
    query.mood = 'refresh';
  } else if (/\b(treat|indulge|dessert|rich)\b/.test(lower)) {
    query.mood = 'indulge';
  }

  return query;
}

export interface ScoredDrink {
  menu: ExtendedMenu;
  score: number;
  matchReasons: string[];
}

export function matchDrinksToQuery(
  menus: ExtendedMenu[],
  query: NaturalLanguageQuery
): ScoredDrink[] {
  return menus
    .map(menu => {
      const attrs = getDrinkAttributes(menu);
      let score = 50;
      const matchReasons: string[] = [];

      // Temperature match
      if (query.temperature) {
        if (attrs.temperature === query.temperature) {
          score += 25;
          matchReasons.push(query.temperature === 'cold' ? 'Refreshingly cold' : 'Warm & cozy');
        } else if (attrs.temperature !== 'any') {
          score -= 20;
        }
      }

      // Sweetness match
      if (query.sweetness) {
        if (attrs.sweetness === query.sweetness) {
          score += 15;
          if (query.sweetness === 'low') matchReasons.push('Low sweetness');
          else if (query.sweetness === 'high') matchReasons.push('Sweet treat');
        } else if (
          (query.sweetness === 'low' && attrs.sweetness === 'high') ||
          (query.sweetness === 'high' && attrs.sweetness === 'low')
        ) {
          score -= 15;
        }
      }

      // Caffeine match
      if (query.caffeine) {
        if (attrs.caffeine === query.caffeine) {
          score += 15;
          if (query.caffeine === 'high') matchReasons.push('High caffeine kick');
          else if (query.caffeine === 'none') matchReasons.push('Caffeine-free');
        } else if (
          (query.caffeine === 'none' && attrs.caffeine === 'high') ||
          (query.caffeine === 'high' && attrs.caffeine === 'none')
        ) {
          score -= 20;
        }
      }

      // Flavor match
      if (query.flavors && query.flavors.length > 0) {
        const flavorMatches = query.flavors.filter(f => attrs.flavor.includes(f));
        score += flavorMatches.length * 10;
        if (flavorMatches.length > 0) {
          matchReasons.push(`${flavorMatches.join(', ')} flavor`);
        }
      }

      // Dietary match
      if (query.dietary && query.dietary.length > 0) {
        const dietaryMatches = query.dietary.filter(d =>
          attrs.dietary.some(ad => ad.includes(d) || d.includes(ad))
        );
        score += dietaryMatches.length * 15;
        if (dietaryMatches.length > 0) {
          matchReasons.push('Fits your dietary needs');
        }
      }

      // Mood match
      if (query.mood && attrs.mood.includes(query.mood as any)) {
        score += 20;
        const moodLabels: Record<string, string> = {
          energy: 'Perfect for energy',
          relax: 'Great for relaxing',
          refresh: 'Refreshing choice',
          indulge: 'Indulgent treat',
        };
        matchReasons.push(moodLabels[query.mood] || '');
      }

      // Signature boost
      if (menu.isSignature) {
        score += 5;
      }

      return { menu, score, matchReasons };
    })
    .filter(d => d.score > 40)
    .sort((a, b) => b.score - a.score);
}

// Quiz-based recommendation
export interface QuizAnswers {
  temperature: 'hot' | 'cold';
  sweetness: 'low' | 'medium' | 'high';
  mood: 'energy' | 'relax' | 'refresh' | 'indulge';
}

export function getQuizRecommendations(
  menus: ExtendedMenu[],
  answers: QuizAnswers
): ScoredDrink[] {
  const query: NaturalLanguageQuery = {
    temperature: answers.temperature,
    sweetness: answers.sweetness,
    mood: answers.mood,
  };

  return matchDrinksToQuery(menus, query).slice(0, 3);
}
