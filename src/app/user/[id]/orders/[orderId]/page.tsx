'use client';

import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import Loading from '@/components/Loading';
import { useSession } from 'next-auth/react';
import { ExtendedOrder } from '@/types/order';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

type OrderProps = {
  orderItem: ExtendedOrder;
};

const OrderId = ({ params }: { params: { orderId: string } }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<ExtendedOrder>();
  const [isError, setIsError] = useState(false);

  const { orderId } = params;
  const { status, data: session } = useSession();

  const calcTotalPrice = () => {
    const totalCartPrice = order!.cartItems.reduce((total, item) => {
      const itemPrice = item.menu.price * item.quantity;
      return total + itemPrice;
    }, 0);

    return formatPrice(totalCartPrice);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/user/${session?.user.id}/orders/${orderId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-cache'
        }
      );

      if (response.ok) {
        const data: OrderProps = await response.json();
        setOrder(data.orderItem);
      } else {
        setIsError(true);
        toast.error('An unexpected error occurred');
      }
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      toast.error('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (status === 'loading' || isLoading) {
    return (
      <div className="m-auto my-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="pb-20">
      {isError ? (
        <p className="m-auto my-10 text-center text-lg">
          Order{' '}
          <span className="text-gray-400">{orderId}</span>{' '}
          does not exist
        </p>
      ) : (
        <div className="mt-5 flex flex-row gap-3">
          <Link
            href={`/user/${order?.userId}/orders`}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'icon' }),
              'h-8 w-8 rounded-full'
            )}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="font-medium">
                Order #{orderId.slice(-8)}
              </h1>
              <div
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium text-white',
                  {
                    'bg-red-500': !order?.paid,
                    'bg-green-500': order?.paid
                  }
                )}
              >
                {order?.paid ? 'Paid' : 'Not Paid'}
              </div>
            </div>
            <div className="flex flex-col gap-6 md:flex-row md:gap-10">
              <div className="flex-1">
                <ScrollArea className={cn({ 'h-96': order?.cartItems.length! > 3 })}>
                  <div className="space-y-2">
                    {order?.cartItems.map((item) => (
                      <div key={item.id}>
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
                              <p className="text-xs text-gray-500">{item.size}</p>
                              <span className="text-sm font-medium text-[#1A3C8B]">
                                {formatPrice(item.menu.price)}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            x{item.quantity}
                          </span>
                        </div>
                        <Separator className="mt-2" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-4 space-y-2 rounded-xl bg-gray-50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pickup</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-[#1A3C8B]">{calcTotalPrice()}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="mb-3 text-lg font-bold">Pickup Details</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="w-20 text-gray-500">Name</span>
                    <span className="font-medium">{order?.customerName}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-20 text-gray-500">Email</span>
                    <span className="font-medium">{order?.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-20 text-gray-500">Pickup</span>
                    <span className="font-medium">{order?.pickupName || order?.customerName}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-20 text-gray-500">Phone</span>
                    <span className="font-medium">{order?.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderId;
