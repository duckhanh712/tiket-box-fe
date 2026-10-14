'use client';

import Link from 'next/link';
import { ErrorMessage } from '@/components/ErrorMessage';
import { RequireAuth } from '@/components/RequireAuth';
import { Spinner } from '@/components/Spinner';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDateTime, formatPrice } from '@/lib/format';
import { useBookings, useEventMap } from '@/lib/queries';

function BookingList() {
  const { data: bookings, isLoading, error } = useBookings();
  const events = useEventMap();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!bookings?.length) {
    return (
      <div className="card p-10 text-center text-slate-500">
        Bạn chưa có đơn đặt vé nào.{' '}
        <Link href="/" className="text-brand-600 hover:underline">Khám phá sự kiện</Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {bookings.map((b) => (
        <li key={b.id}>
          <Link href={`/bookings/${b.id}`} className="card flex flex-wrap items-center gap-4 p-4 hover:shadow-md">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{events.get(b.eventId)?.title ?? 'Sự kiện'}</p>
              <p className="text-sm text-slate-500">
                {b.quantity} vé · đặt lúc {formatDateTime(b.createdAt)}
              </p>
            </div>
            <span className="font-semibold">{formatPrice(b.totalAmount)}</span>
            <StatusBadge status={b.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function BookingsPage() {
  return (
    <RequireAuth>
      <h1 className="mb-6 text-2xl font-bold">Đơn đặt vé</h1>
      <BookingList />
    </RequireAuth>
  );
}
