'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EventForm } from '@/components/EventForm';
import { RequireAuth } from '@/components/RequireAuth';
import { Spinner } from '@/components/Spinner';
import { api } from '@/lib/api';
import { queryKeys, useEvent } from '@/lib/queries';
import type { TicketEvent } from '@/lib/types';

function EditEvent({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: event, isLoading, error } = useEvent(id);

  if (isLoading) return <Spinner />;
  if (error || !event) return <ErrorMessage error={error ?? new Error('Không tìm thấy sự kiện')} />;

  return (
    <EventForm
      initial={event}
      submitLabel="Lưu thay đổi"
      onSubmit={async (input) => {
        await api<TicketEvent>(`/events/${id}`, { method: 'PATCH', body: input });
        await queryClient.invalidateQueries({ queryKey: queryKeys.events });
        router.push('/admin/events');
      }}
    />
  );
}

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <RequireAuth roles={['ADMIN']}>
      <div className="mx-auto max-w-2xl space-y-4">
        <Link href="/admin/events" className="text-sm text-slate-500 hover:underline">
          ← Quản lý sự kiện
        </Link>
        <h1 className="text-2xl font-bold">Sửa sự kiện</h1>
        <EditEvent id={id} />
      </div>
    </RequireAuth>
  );
}
