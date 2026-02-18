import { ExtendedMenu } from '@/types/menu';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type DrinkCustomization = {
  milkType: 'REGULAR' | 'OAT' | 'ALMOND' | 'COCONUT';
  sugarLevel: 'NONE' | 'LIGHT' | 'NORMAL' | 'EXTRA';
  shots: number;
};

export const DEFAULT_CUSTOMIZATION: DrinkCustomization = {
  milkType: 'REGULAR',
  sugarLevel: 'NORMAL',
  shots: 1,
};

export type CartItem = {
  menu: ExtendedMenu;
  size: string;
  quantity: number;
  customization: DrinkCustomization;
};

function customizationKey(c: DrinkCustomization): string {
  return `${c.milkType}-${c.sugarLevel}-${c.shots}`;
}

function itemKey(menuId: string, size: string, customization: DrinkCustomization): string {
  return `${menuId}-${size}-${customizationKey(customization)}`;
}

type CartState = {
  cart: CartItem[];
};

type CartAction = {
  addToCart: (menu: ExtendedMenu, size: string, quantity: number, customization?: DrinkCustomization) => void;
  removeFromCart: (menuId: string, size: string, customization: DrinkCustomization) => void;
  increaseQuantity: (menuId: string, size: string, customization: DrinkCustomization) => void;
  decreaseQuantity: (menuId: string, size: string, customization: DrinkCustomization) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState & CartAction>()(
  persist(
    (set) => ({
      cart: [] as CartItem[],
      addToCart: (menu, size, quantity, customization = DEFAULT_CUSTOMIZATION) =>
        set((state) => {
          const key = itemKey(menu.id, size, customization);
          const existing = state.cart.find(
            (item) => itemKey(item.menu.id, item.size, item.customization) === key
          );
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                itemKey(item.menu.id, item.size, item.customization) === key
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, { menu, size, quantity, customization }],
          };
        }),
      removeFromCart: (menuId, size, customization) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => itemKey(item.menu.id, item.size, item.customization) !== itemKey(menuId, size, customization)
          ),
        })),
      increaseQuantity: (menuId, size, customization) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            itemKey(item.menu.id, item.size, item.customization) === itemKey(menuId, size, customization)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),
      decreaseQuantity: (menuId, size, customization) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            itemKey(item.menu.id, item.size, item.customization) === itemKey(menuId, size, customization) &&
            item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'luckin-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
