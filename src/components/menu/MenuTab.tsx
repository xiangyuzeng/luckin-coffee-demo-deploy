'use client';

import { useEffect, useState } from 'react';
import { Category } from '@prisma/client';
import { toast } from 'sonner';
import MenuCreate from '@/components/menu/MenuCreate';
import MenuItem from '@/components/menu/MenuItem';
import Loading from '@/components/Loading';
import { ExtendedMenu } from '@/types/menu';

type ListMenuProps = {
  menuList: ExtendedMenu[];
};

type ListCategoryProps = {
  categoryList: Category[];
};

const MenuTab = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuList, setMenuList] = useState<ExtendedMenu[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [isRefetch, setIsRefetch] = useState(true);

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/category`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-cache'
      });

      if (response.ok) {
        const data: ListCategoryProps = await response.json();
        setCategoryList(data.categoryList);
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

  const fetchMenu = async () => {
    try {
      const response = await fetch(`/api/menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-cache'
      });

      if (response.ok) {
        const data: ListMenuProps = await response.json();
        setMenuList(data.menuList || []);
        setIsLoading(false);
      } else {
        setIsError(true);
        setIsLoading(false);
        toast.error('An unexpected error occurred');
      }
      setIsRefetch(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      setIsRefetch(false);
      toast.error('An unexpected error is occured');
    }
  };

  useEffect(() => {
    if (isRefetch) {
      fetchCategory();
      if (!isError) {
        fetchMenu();
      }
    }
  }, [isRefetch]);

  const handleMenuRefetch = () => {
    setIsRefetch(true);
  };

  if (isLoading) {
    return (
      <div className="m-auto mt-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="my-5">
      {categoryList.length === 0 ? (
        <p className="m-auto my-5 text-lg">
          There is still no any category. First create a category.
        </p>
      ) : (
        <>
          <h1 className="text-top my-5 text-lg font-medium">
            New Menu
          </h1>
          <MenuCreate
            handleMenuRefetch={handleMenuRefetch}
            categoryList={categoryList}
          />

          <div className="my-5">
            <h1 className="text-top my-5 text-lg font-medium">
              Existing Menu
            </h1>
            {menuList.length === 0 ? (
              <p className="m-auto my-5 text-lg">
                There is still no any menu.
              </p>
            ) : !isError ? (
              <div className="flex flex-col gap-3">
                {menuList.map((menu) => (
                  <div key={menu.id}>
                    {
                      <MenuItem
                        menu={menu}
                        handleMenuRefetch={handleMenuRefetch}
                      />
                    }
                  </div>
                ))}
              </div>
            ) : (
              <p className="m-auto text-lg">Something went wrong</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MenuTab;
