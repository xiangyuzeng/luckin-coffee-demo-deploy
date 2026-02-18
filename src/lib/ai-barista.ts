import { ExtendedMenu } from '@/types/menu';

export interface Recommendation {
  menu: ExtendedMenu;
  matchPercentage: number;
  reason: string;
  zeroSugarAvailable: boolean;
}

interface OrderHistoryItem {
  menuId: string;
  menuName: string;
  count: number;
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getSeasonalPreference(): 'hot' | 'cold' | 'any' {
  const month = new Date().getMonth();
  if (month >= 5 && month <= 8) return 'cold';
  if (month >= 11 || month <= 1) return 'hot';
  return 'any';
}

export function getAIRecommendation(
  allMenus: ExtendedMenu[],
  orderHistory: OrderHistoryItem[] = [],
  weatherTemp: number = 72
): Recommendation | null {
  if (allMenus.length === 0) return null;

  const timeOfDay = getTimeOfDay();
  const isHotWeather = weatherTemp > 75;
  const isColdWeather = weatherTemp < 55;
  const season = getSeasonalPreference();

  // Score each menu item
  const scored = allMenus.map((menu) => {
    let score = 50; // Base score
    const name = menu.name.toLowerCase();
    const desc = menu.description?.toLowerCase() || '';
    const tags = menu.tags || [];

    // Time of day preference
    if (timeOfDay === 'morning') {
      if (name.includes('latte') || name.includes('cappuccino')) score += 15;
      if (menu.isSignature) score += 10;
    } else if (timeOfDay === 'afternoon') {
      if (name.includes('cold brew') || name.includes('iced') || name.includes('refresher')) score += 15;
      if (name.includes('ruby') || name.includes('pink') || name.includes('mango')) score += 10;
    } else {
      if (name.includes('mocha') || name.includes('velvet') || name.includes('dreamy')) score += 15;
    }

    // Weather preference
    if (isHotWeather) {
      if (name.includes('iced') || name.includes('cold') || name.includes('refresher')) score += 20;
      if (name.includes('hot')) score -= 10;
    } else if (isColdWeather) {
      if (name.includes('latte') || name.includes('mocha') || name.includes('cappuccino')) score += 20;
      if (name.includes('iced') || name.includes('cold')) score -= 10;
    }

    // Seasonal boost
    if (season === 'cold' && (name.includes('iced') || name.includes('cold'))) score += 10;
    if (season === 'hot' && !name.includes('iced') && !name.includes('cold')) score += 10;

    // Signature items get a boost
    if (menu.isSignature) score += 10;

    // Popular tags boost
    if (tags.includes('popular')) score += 8;
    if (tags.includes('new')) score += 5;

    // Order history: boost items in same category as favorites
    if (orderHistory.length > 0) {
      const topItem = orderHistory.sort((a, b) => b.count - a.count)[0];
      if (menu.id === topItem?.menuId) score += 25;
      if (name.includes('coconut') && topItem?.menuName.toLowerCase().includes('coconut')) score += 15;
      if (name.includes('latte') && topItem?.menuName.toLowerCase().includes('latte')) score += 10;
    }

    // Don't recommend food items as primary
    if (menu.price > 5) score -= 20;

    return { menu, score };
  });

  // Sort by score and get top
  scored.sort((a, b) => b.score - a.score);
  const top = scored[0];

  // Calculate match percentage (map score range to 85-99)
  const matchPercentage = Math.min(99, Math.max(85, Math.round(70 + (top.score / 5))));

  // Generate reason
  let reason = '';
  const topName = top.menu.name.toLowerCase();
  if (isHotWeather && (topName.includes('iced') || topName.includes('cold'))) {
    reason = "Perfect for today's warm weather";
  } else if (isColdWeather && !topName.includes('iced')) {
    reason = 'A cozy pick for cooler weather';
  } else if (timeOfDay === 'morning') {
    reason = 'A great way to start your morning';
  } else if (timeOfDay === 'afternoon') {
    reason = 'An afternoon pick-me-up';
  } else {
    reason = 'A perfect evening treat';
  }

  if (orderHistory.length > 0) {
    reason = 'Based on your taste preferences';
  }

  const zeroSugarAvailable = topName.includes('latte') || topName.includes('cold brew') || topName.includes('americano');

  return {
    menu: top.menu,
    matchPercentage,
    reason,
    zeroSugarAvailable,
  };
}
