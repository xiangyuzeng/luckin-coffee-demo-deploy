'use client';

import { motion } from 'framer-motion';
import { User, Crown, Coffee } from 'lucide-react';
import { GroupOrderParticipant } from '@/lib/group-order-store';
import { formatPrice } from '@/lib/utils';
import { calculateItemPrice, type MilkType, type DrinkSize } from '@/lib/price-modifiers';

interface ParticipantsListProps {
  participants: GroupOrderParticipant[];
  currentParticipantId: string | null;
}

export default function ParticipantsList({ participants, currentParticipantId }: ParticipantsListProps) {
  const getParticipantTotal = (participant: GroupOrderParticipant): number => {
    return participant.items.reduce((total, item) => {
      const price = calculateItemPrice(
        item.menu.price,
        item.size as DrinkSize,
        (item.customization?.milkType || 'REGULAR') as MilkType,
        item.customization?.shots || 1
      );
      return total + price * item.quantity;
    }, 0);
  };

  const grandTotal = participants.reduce((total, p) => total + getParticipantTotal(p), 0);
  const totalItems = participants.reduce((total, p) => total + p.items.length, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between rounded-xl bg-[#1A3C8B]/5 p-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-[#1A3C8B]" />
          <span className="font-medium">{participants.length} people</span>
        </div>
        <div className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-[#1A3C8B]" />
          <span className="font-medium">{totalItems} items</span>
        </div>
        <div className="font-bold text-[#1A3C8B]">{formatPrice(grandTotal)}</div>
      </div>

      {/* Participants */}
      <div className="space-y-3">
        {participants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl border p-4 ${
              participant.id === currentParticipantId
                ? 'border-[#1A3C8B] bg-[#1A3C8B]/5'
                : 'border-gray-200 bg-white'
            }`}
          >
            {/* Participant header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  participant.isHost ? 'bg-[#FFD700]' : 'bg-gray-200'
                }`}>
                  {participant.isHost ? (
                    <Crown className="h-4 w-4 text-yellow-800" />
                  ) : (
                    <User className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {participant.name}
                    {participant.id === currentParticipantId && (
                      <span className="ml-2 text-xs text-gray-500">(You)</span>
                    )}
                  </p>
                  {participant.isHost && (
                    <p className="text-xs text-[#1A3C8B]">Host</p>
                  )}
                </div>
              </div>
              <span className="font-medium text-[#1A3C8B]">
                {formatPrice(getParticipantTotal(participant))}
              </span>
            </div>

            {/* Items */}
            {participant.items.length > 0 ? (
              <div className="space-y-2">
                {participant.items.map((item, itemIndex) => (
                  <div
                    key={`${item.menu.id}-${itemIndex}`}
                    className="flex items-center gap-3 rounded-lg bg-white p-2"
                  >
                    {item.menu.images?.[0] && (
                      <img
                        src={item.menu.images[0].url}
                        alt={item.menu.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.menu.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.size}
                        {item.customization?.milkType !== 'REGULAR' && (
                          <> · {item.customization.milkType.toLowerCase()} milk</>
                        )}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">×{item.quantity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-400">No items yet</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
