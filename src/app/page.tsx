import { EventCard } from '@/components/EventCard';
import { getPublishedEvents } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const events = await getPublishedEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sự kiện sắp diễn ra</h1>
        <p className="text-slate-500">Chọn sự kiện và đặt vé chỉ trong vài bước.</p>
      </div>

      {events.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Chưa có sự kiện nào đang mở bán.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
