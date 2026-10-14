'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ErrorMessage } from '@/components/ErrorMessage';
import { RequireAuth } from '@/components/RequireAuth';
import { Spinner } from '@/components/Spinner';
import { StatusBadge } from '@/components/StatusBadge';
import { api } from '@/lib/api';
import { formatDateTime, formatPrice } from '@/lib/format';
import { queryKeys, useBooking, useEventMap } from '@/lib/queries';
import type { Booking, PaymentMethod } from '@/lib/types';

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'CARD', label: '💳 Thẻ ngân hàng' },
  { value: 'BANK_TRANSFER', label: '🏦 Chuyển khoản' },
  { value: 'E_WALLET', label: '📱 Ví điện tử' },
];

function BookingDetail({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: booking, isLoading, error } = useBooking(id);
  const event = useEventMap().get(booking?.eventId ?? '');
  const [method, setMethod] = useState<PaymentMethod>('CARD');

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
    queryClient.invalidateQueries({ queryKey: queryKeys.events });
  };

  const pay = useMutation({
    mutationFn: () => api('/payments', { method: 'POST', body: { bookingId: id, method } }),
    onSuccess: () => {
      refresh();
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
      router.push('/tickets');
    },
  });

  const cancel = useMutation({
    mutationFn: () => api<Booking>(`/bookings/${id}/cancel`, { method: 'PATCH' }),
    onSuccess: refresh,
  });

  if (isLoading) return <Spinner />;
  if (error || !booking) return <ErrorMessage error={error ?? new Error('Không tìm thấy đơn')} />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/bookings" className="text-sm text-slate-500 hover:underline">← Đơn đặt vé</Link>

      <section className="card space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">{event?.title ?? 'Sự kiện'}</h1>
            {event && (
              <p className="text-sm text-slate-500">
                {event.venue} · {formatDateTime(event.startTime)}
              </p>
            )}
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <dl className="grid grid-cols-2 gap-y-2 border-t border-slate-100 pt-4 text-sm">
          <dt className="text-slate-500">Mã đơn</dt>
          <dd className="text-right font-mono text-xs">{booking.id}</dd>
          <dt className="text-slate-500">Số lượng</dt>
          <dd className="text-right">{booking.quantity} vé</dd>
          <dt className="text-slate-500">Ngày đặt</dt>
          <dd className="text-right">{formatDateTime(booking.createdAt)}</dd>
          <dt className="font-medium">Tổng tiền</dt>
          <dd className="text-right text-lg font-bold text-brand-700">{formatPrice(booking.totalAmount)}</dd>
        </dl>
      </section>

      {booking.status === 'PENDING' && (
        <section className="card space-y-4 p-6">
          <h2 className="font-semibold">Thanh toán</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {METHODS.map((m) => (
              <label
                key={m.value}
                className={`cursor-pointer rounded-lg border p-3 text-sm ${
                  method === m.value ? 'border-brand-500 bg-brand-50 font-medium' : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={m.value}
                  checked={method === m.value}
                  onChange={() => setMethod(m.value)}
                  className="sr-only"
                />
                {m.label}
              </label>
            ))}
          </div>

          <ErrorMessage error={pay.error ?? cancel.error} />

          <div className="flex flex-wrap justify-end gap-2">
            <button
              className="btn-danger"
              disabled={cancel.isPending || pay.isPending}
              onClick={() => confirm('Huỷ đơn đặt vé này?') && cancel.mutate()}
            >
              Huỷ đơn
            </button>
            <button className="btn-primary" disabled={pay.isPending || cancel.isPending} onClick={() => pay.mutate()}>
              {pay.isPending ? 'Đang thanh toán…' : `Thanh toán ${formatPrice(booking.totalAmount)}`}
            </button>
          </div>
        </section>
      )}

      {booking.status === 'CONFIRMED' && (
        <Link href="/tickets" className="btn-primary w-full">Xem vé của tôi</Link>
      )}
    </div>
  );
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <RequireAuth>
      <BookingDetail id={id} />
    </RequireAuth>
  );
}
