import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookingForm } from '@/components/BookingForm';
import { formatDateTime, formatPrice } from '@/lib/format';
import { getEvent } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent((await params).id);
  return { title: event?.title ?? 'Sự kiện' };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEvent((await params).id);
  if (!event || event.status !== 'PUBLISHED') notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <article className="space-y-6">
        <div className="h-56 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-slate-600">📍 {event.venue}</p>
          <p className="text-slate-600">
            🕒 {formatDateTime(event.startTime)} – {formatDateTime(event.endTime)}
          </p>
        </div>
        {event.description && (
          <section className="card p-6">
            <h2 className="mb-2 font-semibold">Giới thiệu</h2>
            <p className="whitespace-pre-line text-slate-700">{event.description}</p>
          </section>
        )}
      </article>

      <aside className="card h-fit space-y-4 p-6 lg:sticky lg:top-24">
        <div>
          <p className="text-sm text-slate-500">Giá vé</p>
          <p className="text-2xl font-bold text-brand-700">{formatPrice(event.price)}</p>
          <p className="text-sm text-slate-500">
            Còn {event.availableTickets}/{event.totalTickets} vé
          </p>
        </div>
        <BookingForm event={event} />
      </aside>
    </div>
  );
}
