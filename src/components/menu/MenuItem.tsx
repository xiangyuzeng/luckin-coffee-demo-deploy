'use client';

import { ExtendedMenu } from '@/types/menu';
import Image from 'next/image';
import Link from 'next/link';
import noImageUrl from '../../../public/no-image.png';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Pencil } from 'lucide-react';
import DeleteMenuModal from './DeleteMenuModal';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface MenuItemProps {
  menu: ExtendedMenu;
  handleMenuRefetch: () => void;
}

const MenuItem = ({ menu, handleMenuRefetch }: MenuItemProps) => {
  const imageList = menu.images;

  return (
    <div className="flex flex-row items-center justify-between gap-3">
      <div className="flex flex-row items-center gap-3">
        {imageList.length === 0 ? (
          <div>
            <Image
              src={noImageUrl}
              alt="No image"
              width="50"
              height="50"
              placeholder="blur"
              blurDataURL={`${noImageUrl}`}
              loading="lazy"
            />
          </div>
        ) : (
          <div key={imageList[0].id}>
            <Image
              src={`${imageList[0].url}` || noImageUrl}
              alt={`${imageList[0].id}`}
              width="50"
              height="50"
              placeholder="blur"
              blurDataURL={imageList[0].url}
              loading="lazy"
            />
          </div>
        )}
        <div className="line-clamp-1 w-44">
          <h1 className="text-lg">{menu.name}</h1>
        </div>
      </div>
      <div className="flex flex-row gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/menu/${menu.id}/update`}
                className={cn(
                  buttonVariants({
                    variant: 'outline',
                    size: 'icon'
                  })
                )}
              >
                <Pencil />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DeleteMenuModal
          menu={menu}
          handleMenuRefetch={handleMenuRefetch}
        />
      </div>
    </div>
  );
};

export default MenuItem;
