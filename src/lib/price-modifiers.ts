export type MilkType = 'REGULAR' | 'OAT' | 'ALMOND' | 'COCONUT';
export type DrinkSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export const MILK_PRICES: Record<MilkType, number> = {
  REGULAR: 0,
  OAT: 0.70,
  ALMOND: 0.70,
  COCONUT: 0.70,
};

export const SIZE_MODIFIERS: Record<DrinkSize, number> = {
  SMALL: -0.50,
  MEDIUM: 0,
  LARGE: 0.75,
};

export const EXTRA_SHOT_PRICE = 0.50;

export function calculateItemPrice(
  basePrice: number,
  size: DrinkSize,
  milkType: MilkType,
  shots: number
): number {
  let price = basePrice;
  price += SIZE_MODIFIERS[size] || 0;
  price += MILK_PRICES[milkType] || 0;
  if (shots > 1) price += (shots - 1) * EXTRA_SHOT_PRICE;
  return Math.max(price, 0);
}

export function formatModifiers(
  size: string,
  milkType: string,
  sugarLevel: string,
  shots: number
): string {
  const parts: string[] = [];
  if (size !== 'MEDIUM') parts.push(size.charAt(0) + size.slice(1).toLowerCase());
  if (milkType !== 'REGULAR') parts.push(milkType.charAt(0) + milkType.slice(1).toLowerCase() + ' Milk');
  if (sugarLevel !== 'NORMAL') {
    const labels: Record<string, string> = { NONE: 'No Sugar', LIGHT: 'Light Sugar', EXTRA: 'Extra Sugar' };
    parts.push(labels[sugarLevel] || sugarLevel);
  }
  if (shots > 1) parts.push(`${shots} Shots`);
  return parts.length > 0 ? parts.join(' · ') : 'Standard';
}
