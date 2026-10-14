import Link from 'next/link';
import { formatDateTime, formatPrice } from '@/lib/format';
import type { TicketEvent } from '@/lib/types';

export function EventCard({ event }: { event: TicketEvent }) {
  const soldOut = event.availableTickets === 0;

  return (
    <Link
      href={`/events/${event.id}`}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-32 items-end bg-gradient-to-br from-brand-500 to-brand-700 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-100">
          {formatDateTime(event.startTime)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="line-clamp-2 font-semibold group-hover:text-brand-700">{event.title}</h2>
        <p className="text-sm text-slate-500">📍 {event.venue}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="font-semibold text-brand-700">{formatPrice(event.price)}</span>
          <span className={soldOut ? 'text-red-600' : 'text-slate-500'}>
            {soldOut ? 'Hết vé' : `Còn ${event.availableTickets} vé`}
          </span>
        </div>
      </div>
    </Link>
  );
}
