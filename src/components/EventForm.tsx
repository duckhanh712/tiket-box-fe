'use client';

import { useState } from 'react';
import type { EventInput, EventStatus, TicketEvent } from '@/lib/types';
import { ErrorMessage } from './ErrorMessage';

/** ISO string -> value for <input type="datetime-local"> in the browser's local time. */
function toLocalInput(iso: string) {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

interface Props {
  initial?: TicketEvent;
  submitLabel: string;
  onSubmit: (input: EventInput) => Promise<void>;
}

export function EventForm({ initial, submitLabel, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [venue, setVenue] = useState(initial?.venue ?? '');
  const [startTime, setStartTime] = useState(initial ? toLocalInput(initial.startTime) : '');
  const [endTime, setEndTime] = useState(initial ? toLocalInput(initial.endTime) : '');
  const [totalTickets, setTotalTickets] = useState(String(initial?.totalTickets ?? 100));
  const [price, setPrice] = useState(String(initial?.price ?? 0));
  const [status, setStatus] = useState<EventStatus>(initial?.status ?? 'DRAFT');
  const [error, setError] = useState<unknown>(null);
  const [saving, setSaving] = useState(false);

  const sold = initial ? initial.totalTickets - initial.availableTickets : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (new Date(endTime) <= new Date(startTime)) {
      setError(new Error('Thời gian kết thúc phải sau thời gian bắt đầu'));
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        venue: venue.trim(),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        totalTickets: Number(totalTickets),
        price: Number(price),
        status,
      });
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <div>
        <label htmlFor="title" className="label">Tên sự kiện</label>
        <input id="title" className="input" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="description" className="label">Mô tả</label>
        <textarea
          id="description"
          className="input min-h-28"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="venue" className="label">Địa điểm</label>
        <input id="venue" className="input" required value={venue} onChange={(e) => setVenue(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startTime" className="label">Bắt đầu</label>
          <input
            id="startTime"
            type="datetime-local"
            className="input"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endTime" className="label">Kết thúc</label>
          <input
            id="endTime"
            type="datetime-local"
            className="input"
            required
            min={startTime || undefined}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="totalTickets" className="label">Tổng số vé</label>
          <input
            id="totalTickets"
            type="number"
            className="input"
            required
            min={Math.max(1, sold)}
            step={1}
            value={totalTickets}
            onChange={(e) => setTotalTickets(e.target.value)}
          />
          {sold > 0 && <p className="mt-1 text-xs text-slate-500">Đã bán {sold} vé</p>}
        </div>
        <div>
          <label htmlFor="price" className="label">Giá vé (VND)</label>
          <input
            id="price"
            type="number"
            className="input"
            required
            min={0}
            step={1000}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="status" className="label">Trạng thái</label>
          <select
            id="status"
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as EventStatus)}
          >
            <option value="DRAFT">Nháp</option>
            <option value="PUBLISHED">Mở bán</option>
            <option value="CANCELLED">Huỷ</option>
          </select>
        </div>
      </div>

      <ErrorMessage error={error} />

      <button type="submit" className="btn-primary w-full" disabled={saving}>
        {saving ? 'Đang lưu…' : submitLabel}
      </button>
    </form>
  );
}
