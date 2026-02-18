'use client';

import Loading from '@/components/Loading';
import OrderItem from '@/components/order/OrderItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExtendedOrder } from '@/types/order';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import OrderTableContentWrapper from '@/components/order/OrderTableContentWrapper';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

type ListOrderProps = {
  orderList: ExtendedOrder[];
};

const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderList, setOrderList] = useState<ExtendedOrder[]>([]);
  const [isError, setIsError] = useState(false);

  const { data: session, status } = useSession();

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `/api/user/${session?.user.id}/orders`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          cache: 'no-cache'
        }
      );

      if (response.ok) {
        const data: ListOrderProps = await response.json();
        setOrderList(data.orderList || []);
        setIsLoading(false);
      } else {
        setIsError(true);
        setIsLoading(false);
        toast.error('An unexpected error occurred');
      }
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      toast.error('An unexpected error is occured');
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrder();
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="m-auto my-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="py-5">
      <h1 className="text-top my-5 text-4xl font-bold">Orders</h1>
      {!isError ? (
        orderList.length == 0 ? (
          <p className="m-auto my-10 text-center text-lg">
            There is still no any orders.
          </p>
        ) : (
          <div className="rounded-md border pb-3">
            <div className="hidden flex-row gap-3 px-6 pt-3 md:flex">
              <OrderTableContentWrapper className="font-bold text-primary">
                ID
              </OrderTableContentWrapper>
              <OrderTableContentWrapper className="font-bold text-primary md:w-[200px]">
                Date
              </OrderTableContentWrapper>
              <OrderTableContentWrapper className="font-bold text-primary md:w-24">
                Price
              </OrderTableContentWrapper>
              <OrderTableContentWrapper className="font-bold text-primary md:w-20">
                Status
              </OrderTableContentWrapper>
            </div>
            <ScrollArea
              className={cn('px-3', {
                'h-[400px]': orderList.length > 4
              })}
            >
              <div className="mt-3 space-y-2">
                {orderList.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-sm bg-muted-foreground/15 px-3 py-2"
                  >
                    <OrderItem order={order} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )
      ) : (
        <p className="m-auto mt-10 text-lg">Something went wrong</p>
      )}
    </div>
  );
};

export default Orders;
