'use client';

import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

export default function CategoryTabs({ categories, selectedCategory, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
          selectedCategory === null
            ? 'bg-[#1A3C8B] text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
            selectedCategory === category.id
              ? 'bg-[#1A3C8B] text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
