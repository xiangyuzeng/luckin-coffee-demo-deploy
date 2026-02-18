'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button, buttonVariants } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useCartStore, DEFAULT_CUSTOMIZATION } from '@/lib/store';
import Loading from '@/components/Loading';
import { cn, formatPrice } from '@/lib/utils';
import { calculateItemPrice, type MilkType, type DrinkSize } from '@/lib/price-modifiers';

const Cart = () => {
  const [mounted, setMounted] = useState(false);

  const {
    cart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartItems = cart.reduce(
    (total, currentValue) => total + currentValue.quantity,
    0
  );

  const totalCartPrice = cart.reduce((total, item) => {
    const itemPrice = calculateItemPrice(
      item.menu.price,
      (item.size || 'MEDIUM') as DrinkSize,
      (item.customization?.milkType || 'REGULAR') as MilkType,
      item.customization?.shots || 1
    );
    return total + itemPrice * item.quantity;
  }, 0);

  const estimatedPoints = Math.floor(totalCartPrice * 10);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative text-white hover:bg-white/10"
        >
          <ShoppingCart className="h-5 w-5" />
          {mounted && cart.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {totalCartItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Your Order</SheetTitle>
        </SheetHeader>
        <div className="space-y-3">
          {mounted ? (
            cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-1">
                <ShoppingCart className="mt-10 h-16 w-16 text-gray-300" />
                <p className="m-auto my-3 text-lg text-gray-500">Cart is empty</p>
                <SheetClose asChild>
                  <Link
                    href="/menu"
                    className="rounded-full bg-[#1A3C8B] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2D5BB9]"
                  >
                    Browse Menu
                  </Link>
                </SheetClose>
              </div>
            ) : (
              <div className="my-5">
                <ScrollArea className={cn({ 'h-96': cart.length > 4 })}>
                  <div className="space-y-2">
                    {cart.map((item, index) => {
                      const itemPrice = calculateItemPrice(
                        item.menu.price,
                        (item.size || 'MEDIUM') as DrinkSize,
                        (item.customization?.milkType || 'REGULAR') as MilkType,
                        item.customization?.shots || 1
                      );
                      return (
                        <div key={`${item.menu.id}-${item.size}-${index}`}>
                          <div className="flex flex-row items-center justify-between gap-1">
                            <div className="flex flex-row items-center gap-2">
                              {item.menu.images?.[0] && (
                                <div className="h-[50px] w-[50px] flex-shrink-0">
                                  <img
                                    src={item.menu.images[0].url}
                                    alt={item.menu.name}
                                    className="h-full w-full rounded-lg object-cover"
                                  />
                                </div>
                              )}
                              <div className="space-y-0.5">
                                <div className="w-28 sm:w-32">
                                  <h1 className="line-clamp-1 text-sm font-medium">
                                    {item.menu.name}
                                  </h1>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.size}
                                  {item.customization?.milkType && item.customization.milkType !== 'REGULAR' && (
                                    <> · {item.customization.milkType.toLowerCase()} milk</>
                                  )}
                                  {item.customization?.sugarLevel && item.customization.sugarLevel !== 'NORMAL' && (
                                    <> · {item.customization.sugarLevel.toLowerCase()} sugar</>
                                  )}
                                  {item.customization?.shots && item.customization.shots > 1 && (
                                    <> · {item.customization.shots} shots</>
                                  )}
                                </div>
                                <span className="text-sm font-medium text-[#1A3C8B]">
                                  {formatPrice(itemPrice)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-row gap-1">
                              <div className="flex flex-row items-center gap-1">
                                <Button
                                  disabled={item.quantity === 1}
                                  type="button"
                                  size="icon"
                                  className="h-6 w-6 rounded-full bg-[#1A3C8B] hover:bg-[#2D5BB9]"
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      decreaseQuantity(item.menu.id, item.size, item.customization || DEFAULT_CUSTOMIZATION);
                                    }
                                  }}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center text-sm">
                                  {item.quantity}
                                </span>
                                <Button
                                  type="button"
                                  size="icon"
                                  className="h-6 w-6 rounded-full bg-[#1A3C8B] hover:bg-[#2D5BB9]"
                                  onClick={() =>
                                    increaseQuantity(item.menu.id, item.size, item.customization || DEFAULT_CUSTOMIZATION)
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="mr-1 h-6 w-6"
                                onClick={() =>
                                  removeFromCart(item.menu.id, item.size, item.customization || DEFAULT_CUSTOMIZATION)
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Separator className="mt-2" />
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                <div className="mt-4 space-y-2 rounded-xl bg-gray-50 p-4">
                  <div className="flex flex-row justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatPrice(totalCartPrice)}</span>
                  </div>
                  <div className="flex flex-row justify-between text-sm">
                    <span className="text-gray-500">Pickup</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex flex-row justify-between font-bold">
                    <span>Total</span>
                    <span className="text-[#1A3C8B]">{formatPrice(totalCartPrice)}</span>
                  </div>
                  {estimatedPoints > 0 && (
                    <p className="text-center text-xs text-[#1A3C8B]">
                      You&apos;ll earn {estimatedPoints} points with this order!
                    </p>
                  )}
                </div>

                <SheetFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                  <SheetClose asChild>
                    <Link
                      href="/checkout"
                      className="flex-1 rounded-full bg-[#1A3C8B] px-6 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#2D5BB9]"
                    >
                      Checkout · {formatPrice(totalCartPrice)}
                    </Link>
                  </SheetClose>
                </SheetFooter>
              </div>
            )
          ) : (
            <Loading />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
