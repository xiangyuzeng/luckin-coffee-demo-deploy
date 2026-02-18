'use client';

import { motion } from 'framer-motion';
import { ExtendedMenu } from '@/types/menu';
import { formatPrice } from '@/lib/utils';

interface MenuCardProps {
  menu: ExtendedMenu;
  onClick: () => void;
  index: number;
}

export default function MenuCard({ menu, onClick, index }: MenuCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className={`luckin-card overflow-hidden transition-shadow hover:shadow-md ${menu.isSignature ? 'ring-2 ring-[#FFD700]/50' : ''}`}>
        <div className="flex gap-4 p-4">
          {menu.images?.[0] && (
            <img
              src={menu.images[0].url}
              alt={menu.name}
              className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
            />
          )}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="font-medium leading-tight">{menu.name}</h3>
                {menu.isSignature && (
                  <span className="ml-2 flex-shrink-0 rounded-full bg-[#FFD700]/20 px-2 py-0.5 text-xs font-medium text-yellow-700">
                    Signature
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                {menu.description}
              </p>
              {menu.tags && menu.tags.length > 0 && (
                <div className="mt-1 flex gap-1">
                  {menu.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#1A3C8B]/10 px-2 py-0.5 text-xs text-[#1A3C8B]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-2 text-base font-bold text-[#1A3C8B]">
              {formatPrice(menu.price)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
