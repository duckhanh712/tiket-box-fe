'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/lib/format';
import { queryKeys } from '@/lib/queries';
import type { Booking, TicketEvent } from '@/lib/types';
import { ErrorMessage } from './ErrorMessage';

const MAX_PER_BOOKING = 10;

export function BookingForm({ event }: { event: TicketEvent }) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const max = Math.min(MAX_PER_BOOKING, event.availableTickets);
  const [quantity, setQuantity] = useState(1);

  const createBooking = useMutation({
    mutationFn: () =>
      api<Booking>('/bookings', { method: 'POST', body: { eventId: event.id, quantity } }),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
      router.push(`/bookings/${booking.id}`);
    },
  });

  if (max < 1) {
    return <button className="btn-secondary w-full" disabled>Đã hết vé</button>;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?next=/events/${event.id}`);
      return;
    }
    createBooking.mutate();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="quantity" className="label">
          Số lượng (tối đa {max})
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary px-3"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            −
          </button>
          <input
            id="quantity"
            type="number"
            min={1}
            max={max}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(max, Math.max(1, Number(e.target.value) || 1)))}
            className="input text-center"
          />
          <button
            type="button"
            className="btn-secondary px-3"
            onClick={() => setQuantity((q) => Math.min(max, q + 1))}
            disabled={quantity >= max}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-between border-t border-slate-100 pt-4 font-medium">
        <span>Tạm tính</span>
        <span>{formatPrice(event.price * quantity)}</span>
      </div>

      <ErrorMessage error={createBooking.error} />

      <button type="submit" className="btn-primary w-full" disabled={createBooking.isPending}>
        {createBooking.isPending ? 'Đang giữ vé…' : user ? 'Đặt vé' : 'Đăng nhập để đặt vé'}
      </button>
    </form>
  );
}
