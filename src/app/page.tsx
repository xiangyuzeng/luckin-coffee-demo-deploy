import GreetingHeader from '@/components/home/GreetingHeader';
import CoffeeInsight from '@/components/home/CoffeeInsight';
import WeatherWidget from '@/components/home/WeatherWidget';
import ActiveOrderBanner from '@/components/home/ActiveOrderBanner';
import AIBaristaCard from '@/components/home/AIBaristaCard';
import QuickOrderCards from '@/components/home/QuickOrderCards';
import QuickActions from '@/components/home/QuickActions';
import ExploreSection from '@/components/home/ExploreSection';
import HeroCarousel from '@/components/home/HeroCarousel';
import QuickCategories from '@/components/home/QuickCategories';

export default function Home() {
  return (
    <div className="w-full space-y-6 pb-20">
      <GreetingHeader />
      <CoffeeInsight />
      <WeatherWidget />
      <ActiveOrderBanner />
      <AIBaristaCard />
      <QuickOrderCards />
      <QuickActions />
      <ExploreSection />
      <HeroCarousel />
      <QuickCategories />
    </div>
  );
}
