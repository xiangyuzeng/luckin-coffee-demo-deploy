import { ExtendedMenu } from '@/types/menu';
import { DrinkCustomization } from './store';

export interface PredictiveOrder {
  menu: ExtendedMenu;
  size: string;
  customization: DrinkCustomization;
  confidence: number;
  reason: string;
}

interface OrderHistoryItem {
  menuId: string;
  menuName: string;
  size: string;
  milkType: string;
  sugarLevel: string;
  dayOfWeek: number;
  hour: number;
  count: number;
}

function getTimeSlot(hour: number): 'morning' | 'afternoon' | 'evening' {
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function getPredictiveOrder(
  orderHistory: OrderHistoryItem[],
  allMenus: ExtendedMenu[]
): PredictiveOrder | null {
  if (orderHistory.length === 0) return null;

  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentTimeSlot = getTimeSlot(currentHour);

  // Score each historical order based on pattern matching
  const scored = orderHistory.map(order => {
    let score = order.count * 10; // Base score from frequency
    let reason = '';

    // Same day of week bonus
    if (order.dayOfWeek === currentDay) {
      score += 20;
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      reason = `Your ${days[currentDay]} favorite`;
    }

    // Same time slot bonus
    const orderTimeSlot = getTimeSlot(order.hour);
    if (orderTimeSlot === currentTimeSlot) {
      score += 25;
      if (!reason) {
        reason = currentTimeSlot === 'morning'
          ? 'Your morning go-to'
          : currentTimeSlot === 'afternoon'
          ? 'Your afternoon pick-me-up'
          : 'Your evening treat';
      }
    }

    // Exact hour match (within 1 hour)
    if (Math.abs(order.hour - currentHour) <= 1) {
      score += 15;
    }

    // High frequency bonus
    if (order.count >= 5) {
      score += 15;
      if (!reason) reason = 'Your most ordered drink';
    } else if (order.count >= 3) {
      score += 10;
      if (!reason) reason = 'One of your favorites';
    }

    return { order, score, reason: reason || 'Based on your history' };
  });

  // Sort by score and get top
  scored.sort((a, b) => b.score - a.score);
  const top = scored[0];

  if (!top || top.score < 30) return null;

  // Find the menu item
  const menu = allMenus.find(m => m.id === top.order.menuId);
  if (!menu) return null;

  // Calculate confidence (map score to 70-95%)
  const confidence = Math.min(95, Math.max(70, 60 + top.score / 2));

  return {
    menu,
    size: top.order.size,
    customization: {
      milkType: top.order.milkType as any,
      sugarLevel: top.order.sugarLevel as any,
      shots: 1,
    },
    confidence,
    reason: top.reason,
  };
}

// Fake order history for demo purposes
export function generateFakeOrderHistory(): OrderHistoryItem[] {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  // Generate patterns that will match current time
  return [
    {
      menuId: 'coconut-latte',
      menuName: 'Coconut Latte',
      size: 'MEDIUM',
      milkType: 'COCONUT',
      sugarLevel: 'LIGHT',
      dayOfWeek: currentDay,
      hour: currentHour,
      count: 8,
    },
    {
      menuId: 'cold-brew',
      menuName: 'Classic Cold Brew',
      size: 'LARGE',
      milkType: 'REGULAR',
      sugarLevel: 'NONE',
      dayOfWeek: currentDay,
      hour: 14,
      count: 5,
    },
    {
      menuId: 'velvet-latte',
      menuName: 'Velvet Latte',
      size: 'MEDIUM',
      milkType: 'OAT',
      sugarLevel: 'NORMAL',
      dayOfWeek: (currentDay + 1) % 7,
      hour: 9,
      count: 3,
    },
  ];
}
