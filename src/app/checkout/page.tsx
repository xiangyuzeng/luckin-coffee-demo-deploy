'use client';

import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button, buttonVariants } from '@/components/ui/button';
import { CheckCircle, Loader2, Minus, Plus, X, XCircle, PartyPopper } from 'lucide-react';
import { useCartStore, DEFAULT_CUSTOMIZATION } from '@/lib/store';
import { cn, formatPrice } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { orderFormSchema } from '@/lib/validation/orderFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { useSearchParams } from 'next/navigation';
import { calculateItemPrice, type MilkType, type DrinkSize } from '@/lib/price-modifiers';
import { useTranslation } from '@/lib/i18n/LanguageContext';

type formType = z.infer<typeof orderFormSchema>;

const Checkout = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart
  } = useCartStore();

  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const orderId = searchParams.get('orderId');

  const form = useForm<formType>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      username: '',
      email: '',
      pickupName: '',
      phone: ''
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && success === 'true') {
      clearCart();
      setShowConfetti(true);
      // Trigger confetti
      import('canvas-confetti').then((confetti) => {
        const colors = ['#1A3C8B', '#2D5BB9', '#4A7ADE', '#FFFFFF', '#FFD700'];
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors
        });
        setTimeout(() => {
          confetti.default({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors
          });
          confetti.default({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors
          });
        }, 300);
      });
    }
  }, [mounted, success]);

  useEffect(() => {
    if (status !== 'loading' && status === 'authenticated') {
      form.setValue('username', session?.user.username);
      form.setValue('email', session?.user.email!);
      form.setValue('pickupName', session?.user.username || '');
      form.setValue('phone', session?.user.phone || '');
    }
  }, [status]);

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

  const onSubmit = async (data: z.infer<typeof orderFormSchema>) => {
    const toastId = toast.loading('Preparing your order...');
    try {
      setSubmitting(true);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cart,
          userId: session?.user.id,
          customerName: data.username,
          email: data.email,
          pickupName: data.pickupName,
          phone: data.phone
        })
      });

      const body: { stripeSessionUrl: string } = await response.json();

      if (response.ok) {
        setSubmitting(false);
        toast.success('Redirecting to payment', { id: toastId });
        window.location.href = `${body.stripeSessionUrl}`;
      } else {
        setSubmitting(false);
        toast.error('An unexpected error occurred', { id: toastId });
      }
    } catch (error) {
      setSubmitting(false);
      toast.error('An unexpected error occurred', { id: toastId });
    }
  };

  if (status === 'loading') {
    return (
      <div className="m-auto my-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col gap-3 pb-20">
      {success === 'true' || canceled === 'true' ? (
        <div className="my-5 flex flex-grow flex-col items-center justify-center gap-8">
          {success === 'true' && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-14 w-14 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold">{t('checkout.orderConfirmed')}</h1>
              <p className="mt-2 text-gray-500">
                {t('checkout.beingPrepared')}
              </p>
              {orderId && (
                <p className="mt-1 text-sm text-gray-400">
                  Order #{orderId.slice(-8)}
                </p>
              )}
              {estimatedPoints > 0 && (
                <p className="mt-3 text-sm font-medium text-[#1A3C8B]">
                  {t('checkout.pointsEarned', { points: String(estimatedPoints) })}
                </p>
              )}
              <div className="mt-6 flex flex-col gap-3">
                {orderId && (
                  <Link
                    href={`/track/${orderId}`}
                    className="rounded-full bg-[#1A3C8B] px-8 py-3 text-center font-medium text-white transition-colors hover:bg-[#2D5BB9]"
                  >
                    {t('checkout.trackOrder')}
                  </Link>
                )}
                <Link
                  href="/menu"
                  className="rounded-full border border-gray-300 px-8 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {t('checkout.orderMore')}
                </Link>
              </div>
            </div>
          )}
          {canceled === 'true' && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-14 w-14 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold">{t('checkout.paymentCancelled')}</h1>
              <p className="mt-2 text-gray-500">
                {t('checkout.notCompleted')}
              </p>
              <Link
                href="/checkout"
                className="mt-6 inline-block rounded-full bg-[#1A3C8B] px-8 py-3 font-medium text-white transition-colors hover:bg-[#2D5BB9]"
              >
                {t('checkout.tryAgain')}
              </Link>
            </div>
          )}
        </div>
      ) : cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 py-20">
          <p className="text-lg text-gray-500">{t('cart.empty')}</p>
          <Link
            href="/menu"
            className="rounded-full bg-[#1A3C8B] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2D5BB9]"
          >
            {t('cart.browseMenu')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:gap-10">
          <div className="my-5 flex-1">
            <h2 className="mb-4 text-xl font-bold">{t('cart.title')}</h2>
            <ScrollArea className={cn({ 'h-96': cart.length > 3 })}>
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
                      <div className="flex flex-row items-center justify-between gap-3">
                        <div className="flex flex-row items-center gap-3">
                          {item.menu.images?.[0] && (
                            <img
                              src={item.menu.images[0].url}
                              alt={item.menu.name}
                              className="h-16 w-16 rounded-xl object-cover"
                            />
                          )}
                          <div className="space-y-0.5">
                            <h3 className="font-medium">{item.menu.name}</h3>
                            <p className="text-xs text-gray-500">
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
                            </p>
                            <span className="text-sm font-medium text-[#1A3C8B]">
                              {formatPrice(itemPrice)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <div className="flex flex-row items-center gap-1">
                            <Button
                              disabled={isSubmitting || item.quantity === 1}
                              type="button"
                              size="icon"
                              className="h-7 w-7 rounded-full bg-[#1A3C8B] hover:bg-[#2D5BB9]"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  decreaseQuantity(item.menu.id, item.size, item.customization || DEFAULT_CUSTOMIZATION);
                                }
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              disabled={isSubmitting}
                              type="button"
                              size="icon"
                              className="h-7 w-7 rounded-full bg-[#1A3C8B] hover:bg-[#2D5BB9]"
                              onClick={() => increaseQuantity(item.menu.id, item.size, item.customization || DEFAULT_CUSTOMIZATION)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            disabled={isSubmitting}
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeFromCart(item.menu.id, item.size, item.customization || DEFAULT_CUSTOMIZATION)}
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
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('cart.subtotal')}</span>
                <span>{formatPrice(totalCartPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('cart.pickup')}</span>
                <span className="text-green-600">{t('cart.free')}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>{t('cart.total')}</span>
                <span className="text-[#1A3C8B]">{formatPrice(totalCartPrice)}</span>
              </div>
              {estimatedPoints > 0 && (
                <p className="text-center text-xs text-[#1A3C8B]">
                  {t('cart.earnPoints', { points: String(estimatedPoints) })}
                </p>
              )}
            </div>
          </div>

          {session?.user ? (
            <div className="flex flex-1 flex-col">
              <h2 className="my-5 text-xl font-bold">{t('checkout.pickupDetails')}</h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mb-8 flex flex-col gap-3"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('checkout.name')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Your name"
                            disabled={isSubmitting}
                            className="rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('checkout.email')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="email@example.com"
                            disabled={isSubmitting}
                            className="rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickupName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('checkout.pickupName')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Name for pickup"
                            disabled={isSubmitting}
                            className="rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('checkout.phone')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="+1 234 567 8900"
                            disabled={isSubmitting}
                            className="rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      type="submit"
                      className="w-full rounded-full bg-[#1A3C8B] py-6 text-base font-medium hover:bg-[#2D5BB9]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {t('checkout.pay', { amount: formatPrice(totalCartPrice) })}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          ) : (
            <div className="mb-10 mt-5 text-center">
              <p className="text-gray-500">{t('checkout.signInToContinue')}</p>
              <Link
                href="/auth/login?redirect=checkout"
                className="mt-3 inline-block rounded-full bg-[#1A3C8B] px-8 py-3 font-medium text-white transition-colors hover:bg-[#2D5BB9]"
              >
                {t('checkout.signInBtn')}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout;
