'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ExtendedMenu } from '@/types/menu';
import MenuCard from '@/components/menu/MenuCard';
import CategoryTabs from '@/components/menu/CategoryTabs';
import DrinkCustomizationDialog from '@/components/menu/DrinkCustomizationDialog';
import Loading from '@/components/Loading';
import { Search } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface Category {
  id: string;
  name: string;
}

export default function MenuPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [menus, setMenus] = useState<ExtendedMenu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<ExtendedMenu | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [menuRes, categoryRes] = await Promise.all([
          fetch('/api/menu'),
          fetch('/api/category'),
        ]);

        if (menuRes.ok) {
          const menuData = await menuRes.json();
          setMenus(menuData.menuList || menuData);
        }
        if (categoryRes.ok) {
          const categoryData = await categoryRes.json();
          setCategories(categoryData.categoryList || categoryData);
        }
      } catch (error) {
        console.error('Failed to fetch menu data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredMenus = menus.filter((menu) => {
    const matchesCategory = !selectedCategory || menu.categoryIDs?.includes(selectedCategory);
    const matchesSearch = !searchQuery ||
      menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleMenuClick = (menu: ExtendedMenu) => {
    setSelectedMenu(menu);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-20 pt-4">
      <h1 className="text-2xl font-bold">{t('menu.title')}</h1>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={t('menu.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#1A3C8B] focus:ring-1 focus:ring-[#1A3C8B]"
        />
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Menu Grid */}
      <div className="grid gap-3">
        {filteredMenus.map((menu, index) => (
          <MenuCard
            key={menu.id}
            menu={menu}
            onClick={() => handleMenuClick(menu)}
            index={index}
          />
        ))}
        {filteredMenus.length === 0 && (
          <p className="py-10 text-center text-gray-500">
            {t('menu.noItems')}
          </p>
        )}
      </div>

      {/* Customization Dialog */}
      <DrinkCustomizationDialog
        menu={selectedMenu}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedMenu(null);
        }}
      />
    </div>
  );
}
