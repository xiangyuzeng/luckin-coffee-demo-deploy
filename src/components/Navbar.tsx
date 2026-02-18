'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LogOut, Home, Coffee, ClipboardList, Award, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import Loading from './Loading';
import Cart from './Cart';
import { usePathname } from 'next/navigation';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from '@/lib/i18n/LanguageContext';

const Navbar = () => {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/menu', label: t('nav.menu'), icon: Coffee },
    { href: session?.user ? `/user/${session.user.id}/orders` : '/auth/login', label: t('nav.orders'), icon: ClipboardList },
    { href: '/loyalty', label: t('nav.rewards'), icon: Award },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <nav className="flex flex-row items-center justify-between gap-2 bg-[#1A3C8B] px-4 py-3 text-white">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">luckin coffee</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden flex-row items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10',
                pathname === item.href && 'bg-white/20'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side: Auth + Cart */}
        <div className="flex flex-row items-center gap-2">
          {status === 'loading' ? (
            <Loading className="h-5 w-5" />
          ) : session?.user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{session.user.username}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={12} className="min-w-[8rem]">
                  <DropdownMenuItem asChild className="hover:cursor-pointer">
                    <Link className="w-full" href={`/user/${session.user.id}/profile`}>
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:cursor-pointer">
                    <Link className="w-full" href={`/user/${session.user.id}/orders`}>
                      {t('nav.orders')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:cursor-pointer">
                    <Link className="w-full" href="/loyalty">
                      {t('nav.rewards')}
                    </Link>
                  </DropdownMenuItem>
                  {session.user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild className="hover:cursor-pointer">
                      <Link className="w-full" href={`/user/${session.user.id}/admin`}>
                        {t('nav.admin')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {(session.user.role === 'STAFF' || session.user.role === 'ADMIN') && (
                    <DropdownMenuItem asChild className="hover:cursor-pointer">
                      <Link className="w-full" href="/staff/queue">
                        {t('nav.staffQueue')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={async () => {
                  await signOut({ redirect: true, callbackUrl: '/' });
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#1A3C8B] transition-colors hover:bg-white/90"
            >
              {t('common.signIn')}
            </Link>
          )}
          <LanguageToggle />
          <Cart />
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors',
                  isActive ? 'text-[#1A3C8B]' : 'text-gray-400'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive && 'text-[#1A3C8B]')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
