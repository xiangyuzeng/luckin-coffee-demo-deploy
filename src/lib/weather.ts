export interface WeatherData {
  temp: number;
  tempF: number;
  condition: string;
  icon: string;
  suggestion: string;
}

const WEATHER_SCENARIOS: WeatherData[] = [
  { temp: 28, tempF: 82, condition: 'Sunny', icon: '☀️', suggestion: 'Perfect for Ice' },
  { temp: 32, tempF: 90, condition: 'Hot', icon: '🌡️', suggestion: 'Stay Cool with Iced' },
  { temp: 22, tempF: 72, condition: 'Pleasant', icon: '⛅', suggestion: 'Great for Any Drink' },
  { temp: 15, tempF: 59, condition: 'Cool', icon: '🌥️', suggestion: 'Warm Up with a Latte' },
  { temp: 8, tempF: 46, condition: 'Chilly', icon: '❄️', suggestion: 'Perfect for Hot Coffee' },
  { temp: 25, tempF: 77, condition: 'Partly Cloudy', icon: '⛅', suggestion: 'Try an Iced Signature' },
  { temp: 20, tempF: 68, condition: 'Breezy', icon: '🍃', suggestion: 'A Latte Kind of Day' },
];

export function getMockWeather(): WeatherData {
  // Use hour-based seed for consistency within the same hour
  const hour = new Date().getHours();
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const index = (hour + dayOfYear) % WEATHER_SCENARIOS.length;
  return WEATHER_SCENARIOS[index];
}

export function getWeatherDisplay(weather: WeatherData): string {
  return `${weather.temp}°C & ${weather.condition} · ${weather.suggestion}`;
}
