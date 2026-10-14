'use client';

import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { ErrorMessage } from '@/components/ErrorMessage';
import { RequireAuth } from '@/components/RequireAuth';
import { Spinner } from '@/components/Spinner';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDateTime } from '@/lib/format';
import { useEventMap, useTickets } from '@/lib/queries';

function TicketList() {
  const { data: tickets, isLoading, error } = useTickets();
  const events = useEventMap();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!tickets?.length) {
    return (
      <div className="card p-10 text-center text-slate-500">
        Bạn chưa có vé nào.{' '}
        <Link href="/" className="text-brand-600 hover:underline">Đặt vé ngay</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {tickets.map((t) => {
        const event = events.get(t.eventId);
        const active = t.status === 'ACTIVE';
        return (
          <div key={t.id} className={`card flex flex-col items-center gap-3 p-6 ${active ? '' : 'opacity-60'}`}>
            <div className="w-full text-center">
              <p className="truncate font-semibold">{event?.title ?? 'Sự kiện'}</p>
              {event && <p className="text-sm text-slate-500">{formatDateTime(event.startTime)}</p>}
            </div>
            <QRCodeSVG value={t.code} size={160} />
            <p className="font-mono text-sm tracking-wider">{t.code}</p>
            <StatusBadge status={t.status} />
            {t.usedAt && <p className="text-xs text-slate-500">Check-in lúc {formatDateTime(t.usedAt)}</p>}
          </div>
        );
      })}
    </div>
  );
}

export default function TicketsPage() {
  return (
    <RequireAuth>
      <h1 className="mb-2 text-2xl font-bold">Vé của tôi</h1>
      <p className="mb-6 text-slate-500">Đưa mã QR cho nhân viên soát vé khi vào cổng.</p>
      <TicketList />
    </RequireAuth>
  );
}
