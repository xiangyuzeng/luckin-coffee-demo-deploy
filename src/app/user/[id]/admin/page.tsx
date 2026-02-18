'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import CategoryTab from '@/components/category/CategoryTab';
import MenuTab from '@/components/menu/MenuTab';
import Loading from '@/components/Loading';

const Admin = () => {
  const router = useRouter();
  const { status, data: session } = useSession();

  if (status === 'unauthenticated') {
    return router.push('/login');
  }

  if (status === 'loading') {
    return <Loading />;
  }

  if (session?.user.role !== 'ADMIN') {
    return (
      <p className="text-base opacity-50">
        You do not have <b>ADMIN</b> permission do view this page
      </p>
    );
  }

  return (
    <div className="flex flex-grow flex-col">
      <h1 className="text-top my-5 text-4xl font-bold">Admin</h1>
      <Tabs defaultValue="category" className="w-[320px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="category">Category</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>
        <TabsContent value="category">
          <CategoryTab />
        </TabsContent>
        <TabsContent value="menu">
          <MenuTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
