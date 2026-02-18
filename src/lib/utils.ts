import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR';
    notation?: Intl.NumberFormatOptions['notation'];
  } = {}
) {
  const { currency = 'USD', notation = 'compact' } = options;

  const numericPrice =
    typeof price === 'string' ? parseFloat(price) : price;

  let locales = '';

  switch (currency) {
    case 'USD':
      locales = 'en-US';
      break;
    case 'EUR':
      locales = 'de-DE';
      break;
    default:
      locales = 'de-DE';
      break;
  }

  return new Intl.NumberFormat(locales, {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2
  }).format(numericPrice);
}
