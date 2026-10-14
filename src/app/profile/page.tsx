'use client';

import { useState } from 'react';
import { ErrorMessage } from '@/components/ErrorMessage';
import { RequireAuth } from '@/components/RequireAuth';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { User } from '@/lib/types';

function ProfileForm({ user }: { user: User }) {
  const { refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user.fullName);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<unknown>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      await api('/users/me', { method: 'PATCH', body: { fullName, ...(password ? { password } : {}) } });
      await refreshUser();
      setPassword('');
      setSaved(true);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-lg space-y-4 p-8">
      <h1 className="text-2xl font-bold">Hồ sơ</h1>
      <div>
        <label className="label">Email</label>
        <input className="input bg-slate-100" value={user.email} disabled />
      </div>
      <div>
        <label htmlFor="fullName" className="label">Họ và tên</label>
        <input id="fullName" className="input" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password" className="label">Mật khẩu mới (để trống nếu không đổi)</label>
        <input
          id="password"
          type="password"
          className="input"
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <ErrorMessage error={error} />
      {saved && <p className="text-sm text-emerald-600">Đã lưu thay đổi.</p>}

      <button type="submit" className="btn-primary w-full" disabled={saving}>
        {saving ? 'Đang lưu…' : 'Lưu'}
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  return <RequireAuth>{user && <ProfileForm user={user} />}</RequireAuth>;
}
