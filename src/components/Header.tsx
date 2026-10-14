'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/types';

const NAV: { href: string; label: string; auth?: boolean; roles?: UserRole[] }[] = [
  { href: '/', label: 'Sự kiện' },
  { href: '/bookings', label: 'Đơn đặt vé', auth: true },
  { href: '/tickets', label: 'Vé của tôi', auth: true },
  { href: '/admin/events', label: 'Quản trị', roles: ['ADMIN'] },
];

export function Header() {
  const { user, ready, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="text-lg font-bold text-brand-600">
          🎟 Tiketbox
        </Link>

        <nav className="flex gap-1 text-sm">
          {NAV.filter((item) =>
            item.roles ? !!user && item.roles.includes(user.role) : !item.auth || user,
          ).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 ${
                isActive(item.href)
                  ? 'bg-brand-50 font-medium text-brand-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 text-sm">
          {!ready ? null : user ? (
            <>
              <Link href="/profile" className="hidden text-slate-700 hover:underline sm:inline">
                {user.fullName}
              </Link>
              <button
                className="btn-secondary"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Đăng nhập
              </Link>
              <Link href="/register" className="btn-primary">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
