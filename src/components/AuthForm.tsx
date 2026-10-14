'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ErrorMessage } from './ErrorMessage';

/** Only allow redirecting to internal paths. */
const safeNext = (next: string | null) => (next?.startsWith('/') && !next.startsWith('//') ? next : '/');

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { user, login, register } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState<unknown>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.fullName, form.email, form.password);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const isLogin = mode === 'login';
  const otherHref = `${isLogin ? '/register' : '/login'}${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`;

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={onSubmit} className="card space-y-4 p-8">
        <h1 className="text-2xl font-bold">{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</h1>

        {!isLogin && (
          <div>
            <label htmlFor="fullName" className="label">Họ và tên</label>
            <input id="fullName" className="input" required value={form.fullName} onChange={update('fullName')} />
          </div>
        )}
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" className="input" required autoComplete="email" value={form.email} onChange={update('email')} />
        </div>
        <div>
          <label htmlFor="password" className="label">Mật khẩu</label>
          <input
            id="password"
            type="password"
            className="input"
            required
            minLength={isLogin ? undefined : 6}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            value={form.password}
            onChange={update('password')}
          />
        </div>

        <ErrorMessage error={error} />

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Đang xử lý…' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </button>

        <p className="text-center text-sm text-slate-500">
          {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <Link href={otherHref} className="font-medium text-brand-600 hover:underline">
            {isLogin ? 'Đăng ký' : 'Đăng nhập'}
          </Link>
        </p>
      </form>
    </div>
  );
}
