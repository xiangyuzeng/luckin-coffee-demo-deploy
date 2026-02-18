'use client';

import { useEffect, useState } from 'react';
import { Category } from '@prisma/client';
import { toast } from 'sonner';
import CategoryCreate from '@/components/category/CategoryCreate';
import CategoryItem from '@/components/category/CategoryItem';
import Loading from '@/components/Loading';

type ListProps = {
  categoryList: Category[];
};

const CategoryTab = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [isRefetch, setIsRefetch] = useState(true);
  const [editId, setEditId] = useState('');

  const fetchData = async () => {
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
        const data: ListProps = await response.json();
        setCategoryList(data.categoryList || []);
      } else {
        setIsError(true);
        toast.error('An unexpected error occurred');
      }
      setIsRefetch(false);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      setIsRefetch(false);
      toast.error('An unexpected error is occured');
    }
  };

  useEffect(() => {
    if (isRefetch) {
      fetchData();
    }
  }, [isRefetch]);

  const handleCategoryRefetch = () => {
    setIsRefetch(true);
  };

  const handleCategoryEdit = (id: string) => {
    setEditId(id);
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
      <CategoryCreate handleCategoryRefetch={handleCategoryRefetch} />
      <div className="my-5">
        <h1 className="text-top my-5 text-lg font-medium">
          Existing categories
        </h1>
        {categoryList.length === 0 ? (
          <p className="m-auto my-5 text-lg">
            There is still no any category
          </p>
        ) : !isError ? (
          categoryList.map((category) => (
            <div key={category.id}>
              <CategoryItem
                category={category}
                editId={editId}
                handleCategoryRefetch={handleCategoryRefetch}
                handleCategoryEdit={handleCategoryEdit}
              />
            </div>
          ))
        ) : (
          <p className="m-auto text-lg">Something went wrong</p>
        )}
      </div>
    </div>
  );
};

export default CategoryTab;
