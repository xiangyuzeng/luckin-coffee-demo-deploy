'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExtendedMenu } from '@/types/menu';
import { useCartStore } from '@/lib/store';
import { calculateItemPrice, type MilkType, type DrinkSize } from '@/lib/price-modifiers';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { Minus, Plus, ChevronDown, ChevronUp, Flame, Zap, Leaf, Info, Star, MessageSquare, Coffee } from 'lucide-react';
import { getNutritionForDrink, getCaffeineLevel } from '@/lib/fake-data/nutrition';
import { getReviewsForDrink, getAverageRating } from '@/lib/fake-data/reviews';
import { getBeanOrigin } from '@/lib/fake-data/bean-origins';
import { calculateOrderCarbonSavings } from '@/lib/sustainability';
import StarRating from './StarRating';
import ReviewsList from './ReviewsList';
import BeanOriginCard from './BeanOriginCard';
import CarbonBadge from '@/components/sustainability/CarbonBadge';

interface DrinkCustomizationDialogProps {
  menu: ExtendedMenu | null;
  open: boolean;
  onClose: () => void;
}

type SugarLevel = 'NONE' | 'LIGHT' | 'NORMAL' | 'EXTRA';

export default function DrinkCustomizationDialog({ menu, open, onClose }: DrinkCustomizationDialogProps) {
  const [size, setSize] = useState<DrinkSize>('MEDIUM');
  const [milkType, setMilkType] = useState<MilkType>('REGULAR');
  const [sugarLevel, setSugarLevel] = useState<SugarLevel>('NORMAL');
  const [shots, setShots] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [showNutrition, setShowNutrition] = useState(false);
  const [hasReusableCup, setHasReusableCup] = useState(false);
  const [activeTab, setActiveTab] = useState('customize');
  const addToCart = useCartStore((state) => state.addToCart);

  if (!menu) return null;

  const itemPrice = calculateItemPrice(menu.price, size, milkType, shots);
  const reusableCupDiscount = hasReusableCup ? 0.25 : 0;
  const totalPrice = (itemPrice - reusableCupDiscount) * quantity;
  const nutrition = getNutritionForDrink(menu.name, size, milkType);
  const caffeineLevel = getCaffeineLevel(nutrition.caffeine);
  const reviews = getReviewsForDrink(menu.name);
  const rating = getAverageRating(menu.name);
  const beanOrigin = getBeanOrigin(menu.name);
  const carbonImpact = calculateOrderCarbonSavings(milkType, hasReusableCup, quantity);

  const handleAddToCart = () => {
    addToCart(menu, size, quantity, { milkType, sugarLevel, shots });
    const message = hasReusableCup
      ? `${menu.name} added to cart! Thanks for being eco-friendly! 🌱`
      : `${menu.name} added to cart!`;
    toast.success(message);
    onClose();
    // Reset state
    setSize('MEDIUM');
    setMilkType('REGULAR');
    setSugarLevel('NORMAL');
    setShots(1);
    setQuantity(1);
    setHasReusableCup(false);
    setActiveTab('customize');
  };

  const OptionButton = ({ label, active, onClick, extra }: { label: string; active: boolean; onClick: () => void; extra?: string }) => (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active
          ? 'bg-[#1A3C8B] text-white shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
      {extra && <span className="ml-1 text-xs opacity-75">{extra}</span>}
    </button>
  );

  const NutritionRow = ({ label, value, unit, highlight }: { label: string; value: number; unit: string; highlight?: boolean }) => (
    <div className={`flex justify-between py-1.5 ${highlight ? 'font-medium' : ''}`}>
      <span className="text-gray-600">{label}</span>
      <span className={highlight ? 'text-[#1A3C8B]' : ''}>{value}{unit}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto rounded-2xl p-0">
        {menu.images?.[0] && (
          <div className="relative h-48 w-full">
            <img
              src={menu.images[0].url}
              alt={menu.name}
              className="h-full w-full rounded-t-2xl object-cover"
            />
            {menu.isSignature && (
              <span className="absolute left-3 top-3 rounded-full bg-[#FFD700] px-3 py-1 text-xs font-bold text-gray-900">
                Signature
              </span>
            )}
            {/* Quick nutrition overlay */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              <div className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                <Flame className="h-3 w-3 text-orange-400" />
                <span>{nutrition.calories} cal</span>
              </div>
              {nutrition.caffeine > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                  <Zap className={`h-3 w-3 ${caffeineLevel === 'high' ? 'text-purple-400' : 'text-blue-400'}`} />
                  <span>{nutrition.caffeine}mg</span>
                </div>
              )}
            </div>
            {/* Rating overlay */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{rating.average}</span>
              <span className="opacity-70">({rating.count})</span>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="mb-4">
            <DialogHeader>
              <DialogTitle className="text-xl">{menu.name}</DialogTitle>
            </DialogHeader>
            <p className="mt-1 text-sm text-gray-500">{menu.description}</p>
            <div className="mt-2">
              <StarRating rating={rating.average} size="sm" showValue count={rating.count} />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="customize" className="text-xs">
                Customize
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-1 text-xs">
                <MessageSquare className="h-3 w-3" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="origin" className="flex items-center gap-1 text-xs">
                <Coffee className="h-3 w-3" />
                Bean Story
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customize" className="space-y-6">
              {/* Size */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">Size</h4>
                <div className="flex gap-2">
                  <OptionButton label="Small" extra="-$0.50" active={size === 'SMALL'} onClick={() => setSize('SMALL')} />
                  <OptionButton label="Medium" active={size === 'MEDIUM'} onClick={() => setSize('MEDIUM')} />
                  <OptionButton label="Large" extra="+$0.75" active={size === 'LARGE'} onClick={() => setSize('LARGE')} />
                </div>
              </div>

              {/* Milk Type */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">Milk</h4>
                <div className="flex flex-wrap gap-2">
                  <OptionButton label="Regular" active={milkType === 'REGULAR'} onClick={() => setMilkType('REGULAR')} />
                  <OptionButton label="Oat" extra="+$0.70" active={milkType === 'OAT'} onClick={() => setMilkType('OAT')} />
                  <OptionButton label="Almond" extra="+$0.70" active={milkType === 'ALMOND'} onClick={() => setMilkType('ALMOND')} />
                  <OptionButton label="Coconut" extra="+$0.70" active={milkType === 'COCONUT'} onClick={() => setMilkType('COCONUT')} />
                </div>
                {milkType !== 'REGULAR' && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-green-600">
                    <Leaf className="h-3 w-3" />
                    Plant-based milk - dairy-free & eco-friendly!
                  </p>
                )}
              </div>

              {/* Sugar Level */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">Sugar Level</h4>
                <div className="flex gap-2">
                  <OptionButton label="None" active={sugarLevel === 'NONE'} onClick={() => setSugarLevel('NONE')} />
                  <OptionButton label="Light" active={sugarLevel === 'LIGHT'} onClick={() => setSugarLevel('LIGHT')} />
                  <OptionButton label="Normal" active={sugarLevel === 'NORMAL'} onClick={() => setSugarLevel('NORMAL')} />
                  <OptionButton label="Extra" active={sugarLevel === 'EXTRA'} onClick={() => setSugarLevel('EXTRA')} />
                </div>
              </div>

              {/* Espresso Shots */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">Espresso Shots</h4>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShots(Math.max(1, shots - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-4 text-center font-medium">{shots}</span>
                  <button
                    onClick={() => setShots(Math.min(3, shots + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  {shots > 1 && (
                    <span className="text-xs text-gray-500">+{formatPrice((shots - 1) * 0.5)}</span>
                  )}
                </div>
              </div>

              {/* Reusable Cup Option */}
              <div className="rounded-xl bg-green-50 p-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={hasReusableCup}
                    onChange={(e) => setHasReusableCup(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-green-800">I have a reusable cup</span>
                    <p className="text-xs text-green-600">Save $0.25 and reduce CO₂!</p>
                  </div>
                  <Leaf className="h-5 w-5 text-green-600" />
                </label>
              </div>

              {/* Carbon Impact Badge */}
              {carbonImpact.totalSaved > 0 && (
                <CarbonBadge impact={carbonImpact} />
              )}

              {/* Nutrition Facts - Collapsible */}
              <div className="rounded-xl border border-gray-200">
                <button
                  onClick={() => setShowNutrition(!showNutrition)}
                  className="flex w-full items-center justify-between p-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Nutrition Facts</span>
                  </div>
                  {showNutrition ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                <AnimatePresence>
                  {showNutrition && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-200 px-3 pb-3 pt-2 text-sm">
                        <p className="mb-2 text-xs text-gray-500">Per serving ({size.toLowerCase()} size)</p>
                        <NutritionRow label="Calories" value={nutrition.calories} unit="" highlight />
                        <div className="my-1 border-t border-gray-100" />
                        <NutritionRow label="Total Fat" value={nutrition.fat} unit="g" />
                        <NutritionRow label="Total Carbs" value={nutrition.carbs} unit="g" />
                        <NutritionRow label="Sugars" value={nutrition.sugar} unit="g" />
                        <NutritionRow label="Protein" value={nutrition.protein} unit="g" />
                        <NutritionRow label="Fiber" value={nutrition.fiber} unit="g" />
                        <div className="my-1 border-t border-gray-100" />
                        <NutritionRow label="Caffeine" value={nutrition.caffeine} unit="mg" highlight />
                        <p className="mt-2 text-[10px] text-gray-400">
                          * Values are estimates and may vary based on preparation.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quantity */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">Quantity</h4>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-4 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsList reviews={reviews} drinkName={menu.name} />
            </TabsContent>

            <TabsContent value="origin">
              <BeanOriginCard origin={beanOrigin} />
            </TabsContent>
          </Tabs>

          {/* Add to Cart Button - Always visible */}
          <button
            onClick={handleAddToCart}
            className="mt-6 w-full rounded-full bg-[#1A3C8B] py-4 text-base font-medium text-white transition-colors hover:bg-[#2D5BB9]"
          >
            Add to Cart · {formatPrice(totalPrice)}
            {hasReusableCup && (
              <span className="ml-2 text-xs opacity-75">(incl. $0.25 eco discount)</span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
