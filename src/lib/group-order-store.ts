import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ExtendedMenu } from '@/types/menu';
import { DrinkCustomization, DEFAULT_CUSTOMIZATION } from './store';

export interface GroupOrderParticipant {
  id: string;
  name: string;
  isHost: boolean;
  items: GroupOrderItem[];
  joinedAt: Date;
}

export interface GroupOrderItem {
  menu: ExtendedMenu;
  size: string;
  quantity: number;
  customization: DrinkCustomization;
}

export interface GroupOrder {
  id: string;
  code: string;
  hostId: string;
  hostName: string;
  participants: GroupOrderParticipant[];
  createdAt: Date;
  expiresAt: Date;
  status: 'active' | 'locked' | 'completed';
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

interface GroupOrderState {
  currentOrder: GroupOrder | null;
  currentParticipantId: string | null;
}

interface GroupOrderActions {
  createGroupOrder: (hostName: string) => GroupOrder;
  joinGroupOrder: (code: string, participantName: string) => boolean;
  addItemToOrder: (item: GroupOrderItem) => void;
  removeItemFromOrder: (menuId: string, size: string) => void;
  lockOrder: () => void;
  clearGroupOrder: () => void;
  getParticipantItems: () => GroupOrderItem[];
  getTotalItems: () => GroupOrderItem[];
  isHost: () => boolean;
}

export const useGroupOrderStore = create<GroupOrderState & GroupOrderActions>()(
  persist(
    (set, get) => ({
      currentOrder: null,
      currentParticipantId: null,

      createGroupOrder: (hostName: string) => {
        const hostId = generateId();
        const order: GroupOrder = {
          id: generateId(),
          code: generateCode(),
          hostId,
          hostName,
          participants: [
            {
              id: hostId,
              name: hostName,
              isHost: true,
              items: [],
              joinedAt: new Date(),
            },
          ],
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
          status: 'active',
        };
        set({ currentOrder: order, currentParticipantId: hostId });
        return order;
      },

      joinGroupOrder: (code: string, participantName: string) => {
        const { currentOrder } = get();

        // For demo, we'll simulate joining by checking if code matches
        // In real app, this would be a server call
        if (currentOrder && currentOrder.code === code && currentOrder.status === 'active') {
          const participantId = generateId();
          const newParticipant: GroupOrderParticipant = {
            id: participantId,
            name: participantName,
            isHost: false,
            items: [],
            joinedAt: new Date(),
          };

          set({
            currentOrder: {
              ...currentOrder,
              participants: [...currentOrder.participants, newParticipant],
            },
            currentParticipantId: participantId,
          });
          return true;
        }
        return false;
      },

      addItemToOrder: (item: GroupOrderItem) => {
        const { currentOrder, currentParticipantId } = get();
        if (!currentOrder || !currentParticipantId || currentOrder.status !== 'active') return;

        set({
          currentOrder: {
            ...currentOrder,
            participants: currentOrder.participants.map((p) =>
              p.id === currentParticipantId
                ? { ...p, items: [...p.items, item] }
                : p
            ),
          },
        });
      },

      removeItemFromOrder: (menuId: string, size: string) => {
        const { currentOrder, currentParticipantId } = get();
        if (!currentOrder || !currentParticipantId) return;

        set({
          currentOrder: {
            ...currentOrder,
            participants: currentOrder.participants.map((p) =>
              p.id === currentParticipantId
                ? {
                    ...p,
                    items: p.items.filter(
                      (item) => !(item.menu.id === menuId && item.size === size)
                    ),
                  }
                : p
            ),
          },
        });
      },

      lockOrder: () => {
        const { currentOrder } = get();
        if (!currentOrder) return;

        set({
          currentOrder: {
            ...currentOrder,
            status: 'locked',
          },
        });
      },

      clearGroupOrder: () => {
        set({ currentOrder: null, currentParticipantId: null });
      },

      getParticipantItems: () => {
        const { currentOrder, currentParticipantId } = get();
        if (!currentOrder || !currentParticipantId) return [];

        const participant = currentOrder.participants.find(
          (p) => p.id === currentParticipantId
        );
        return participant?.items || [];
      },

      getTotalItems: () => {
        const { currentOrder } = get();
        if (!currentOrder) return [];

        return currentOrder.participants.flatMap((p) => p.items);
      },

      isHost: () => {
        const { currentOrder, currentParticipantId } = get();
        if (!currentOrder || !currentParticipantId) return false;
        return currentOrder.hostId === currentParticipantId;
      },
    }),
    {
      name: 'luckin-group-order',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
