import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

const OrderTableContentWrapper = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        'line-clamp-1 w-[300px] text-center md:w-[240px] md:text-start',
        className
      )}
    >
      {children}
    </div>
  );
};

export default OrderTableContentWrapper;
