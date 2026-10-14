'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/types';
import { Spinner } from './Spinner';

/** Redirects to /login (and back afterwards) when there is no session; optionally restricts by role. */
export function RequireAuth({ children, roles }: { children: React.ReactNode; roles?: UserRole[] }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, router, pathname]);

  if (!ready || !user) return <Spinner />;
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="card p-10 text-center text-slate-500">
        Bạn không có quyền truy cập trang này.{' '}
        <Link href="/" className="text-brand-600 hover:underline">Về trang chủ</Link>
      </div>
    );
  }
  return <>{children}</>;
}
