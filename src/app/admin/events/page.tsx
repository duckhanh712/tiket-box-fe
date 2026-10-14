'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ErrorMessage } from '@/components/ErrorMessage';
import { RequireAuth } from '@/components/RequireAuth';
import { Spinner } from '@/components/Spinner';
import { StatusBadge } from '@/components/StatusBadge';
import { api } from '@/lib/api';
import { formatDateTime, formatPrice } from '@/lib/format';
import { queryKeys, useEvents } from '@/lib/queries';
import type { EventStatus, TicketEvent } from '@/lib/types';

function AdminEventList() {
  const queryClient = useQueryClient();
  const { data: events, isLoading, error } = useEvents();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.events });
  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EventStatus }) =>
      api<TicketEvent>(`/events/${id}`, { method: 'PATCH', body: { status } }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/events/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!events?.length) {
    return (
      <div className="card p-10 text-center text-slate-500">
        Chưa có sự kiện nào.{' '}
        <Link href="/admin/events/new" className="text-brand-600 hover:underline">Tạo sự kiện đầu tiên</Link>
      </div>
    );
  }

  const busy = setStatus.isPending || remove.isPending;

  return (
    <div className="space-y-3">
      <ErrorMessage error={setStatus.error ?? remove.error} />
      <ul className="space-y-3">
        {events.map((e) => (
          <li key={e.id} className="card flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{e.title}</p>
                <StatusBadge status={e.status} />
              </div>
              <p className="text-sm text-slate-500">
                {formatDateTime(e.startTime)} · {e.venue}
              </p>
              <p className="text-sm text-slate-500">
                {formatPrice(e.price)} · còn {e.availableTickets}/{e.totalTickets} vé
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {e.status !== 'PUBLISHED' && (
                <button
                  className="btn-secondary"
                  disabled={busy}
                  onClick={() => setStatus.mutate({ id: e.id, status: 'PUBLISHED' })}
                >
                  Mở bán
                </button>
              )}
              {e.status === 'PUBLISHED' && (
                <button
                  className="btn-secondary"
                  disabled={busy}
                  onClick={() => setStatus.mutate({ id: e.id, status: 'DRAFT' })}
                >
                  Ngừng bán
                </button>
              )}
              <Link href={`/admin/events/${e.id}`} className="btn-secondary">
                Sửa
              </Link>
              <button
                className="btn-danger"
                disabled={busy}
                onClick={() => {
                  if (confirm(`Xoá sự kiện "${e.title}"?`)) remove.mutate(e.id);
                }}
              >
                Xoá
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminEventsPage() {
  return (
    <RequireAuth roles={['ADMIN']}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Quản lý sự kiện</h1>
        <Link href="/admin/events/new" className="btn-primary">
          + Tạo sự kiện
        </Link>
      </div>
      <AdminEventList />
    </RequireAuth>
  );
}
