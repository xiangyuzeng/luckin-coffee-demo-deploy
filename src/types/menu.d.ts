import { Menu } from '@prisma/client';

export interface ExtendedMenu extends Menu {
  images: {
    id: string;
    url: string;
  }[];
  isSignature: boolean;
  calories: number | null;
  tags: string[];
}
