import 'server-only';
import type { TicketEvent } from './types';

const API_URL = process.env.API_URL ?? 'http://localhost:3000/api';

/** Public endpoints fetched from server components. Returns null on 404. */
async function get<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`API ${path} failed with ${res.status}`);
  return res.json();
}

export async function getPublishedEvents(): Promise<TicketEvent[]> {
  const events = (await get<TicketEvent[]>('/events')) ?? [];
  return events.filter((e) => e.status === 'PUBLISHED');
}

export function getEvent(id: string) {
  return get<TicketEvent>(`/events/${id}`);
}
