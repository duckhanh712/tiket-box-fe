'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EventForm } from '@/components/EventForm';
import { RequireAuth } from '@/components/RequireAuth';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queries';
import type { TicketEvent } from '@/lib/types';

export default function NewEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <RequireAuth roles={['ADMIN']}>
      <div className="mx-auto max-w-2xl space-y-4">
        <Link href="/admin/events" className="text-sm text-slate-500 hover:underline">
          ← Quản lý sự kiện
        </Link>
        <h1 className="text-2xl font-bold">Tạo sự kiện</h1>
        <EventForm
          submitLabel="Tạo sự kiện"
          onSubmit={async (input) => {
            await api<TicketEvent>('/events', { method: 'POST', body: input });
            await queryClient.invalidateQueries({ queryKey: queryKeys.events });
            router.push('/admin/events');
          }}
        />
      </div>
    </RequireAuth>
  );
}
