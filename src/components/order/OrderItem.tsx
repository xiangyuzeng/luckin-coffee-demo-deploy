'use client';

import { cn, formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import OrderTableContentWrapper from '@/components/order/OrderTableContentWrapper';
import { ExtendedOrder } from '@/types/order';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

interface OrderItemProps {
  order: ExtendedOrder;
}

const OrderItem = ({ order }: OrderItemProps) => {
  const totalCartPrice = order.cartItems.reduce((total, item) => {
    const itemPrice = item.menu.price * item.quantity;
    return total + itemPrice;
  }, 0);

  const formattedTotalCartPrice = formatPrice(totalCartPrice);

  return (
    <div className="flex flex-col items-center gap-3 md:flex-row md:justify-center">
      <OrderTableContentWrapper>{order.id}</OrderTableContentWrapper>
      <OrderTableContentWrapper className="md:w-[200px]">
        {format(new Date(order.createdAt), 'hh:mmaaa MMM do, yyyy')}
      </OrderTableContentWrapper>
      <OrderTableContentWrapper className="md:w-24">
        {formattedTotalCartPrice}
      </OrderTableContentWrapper>
      <OrderTableContentWrapper className="flex flex-row justify-center md:w-20">
        <div
          className={cn(
            'w-20 rounded-sm p-1 text-center text-sm text-white',
            {
              'bg-red-600': !order.paid,
              'bg-green-600': order.paid
            }
          )}
        >
          {order.paid ? 'Paid' : 'Not Paid'}
        </div>
      </OrderTableContentWrapper>
      <OrderTableContentWrapper className="flex flex-row justify-center md:w-24">
        <Link
          href={`/user/${order.userId}/orders/${order.id}`}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'rounded-xl'
          )}
        >
          Details
        </Link>
      </OrderTableContentWrapper>
    </div>
  );
};

export default OrderItem;
