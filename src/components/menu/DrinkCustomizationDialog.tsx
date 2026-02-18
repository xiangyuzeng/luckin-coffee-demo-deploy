'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExtendedMenu } from '@/types/menu';
import { useCartStore } from '@/lib/store';
import { calculateItemPrice, type MilkType, type DrinkSize } from '@/lib/price-modifiers';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { Minus, Plus } from 'lucide-react';

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
  const addToCart = useCartStore((state) => state.addToCart);

  if (!menu) return null;

  const itemPrice = calculateItemPrice(menu.price, size, milkType, shots);
  const totalPrice = itemPrice * quantity;

  const handleAddToCart = () => {
    addToCart(menu, size, quantity, { milkType, sugarLevel, shots });
    toast.success(`${menu.name} added to cart!`);
    onClose();
    // Reset state
    setSize('MEDIUM');
    setMilkType('REGULAR');
    setSugarLevel('NORMAL');
    setShots(1);
    setQuantity(1);
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
          </div>
        )}

        <div className="space-y-6 p-6">
          <div>
            <DialogHeader>
              <DialogTitle className="text-xl">{menu.name}</DialogTitle>
            </DialogHeader>
            <p className="mt-1 text-sm text-gray-500">{menu.description}</p>
            {menu.calories && (
              <p className="mt-1 text-xs text-gray-400">{menu.calories} cal</p>
            )}
          </div>

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

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full rounded-full bg-[#1A3C8B] py-4 text-base font-medium text-white transition-colors hover:bg-[#2D5BB9]"
          >
            Add to Cart · {formatPrice(totalPrice)}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
