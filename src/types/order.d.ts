import { CartItem } from '@/lib/store';
import { Order, User } from '@prisma/client';
import { CartItem as CartItemModel } from '@prisma/client';
import { ExtendedMenu } from './menu';

export type OrderSchema = {
  cart: CartItem[];
  userId: string;
  customerName: string;
  email: string;
  pickupName: string;
  phone: string;
};

interface ExtendedCartItemModel extends CartItemModel {
  menu: ExtendedMenu;
}

export interface ExtendedOrder extends Order {
  cartItems: ExtendedCartItemModel[];
  user: User;
}
