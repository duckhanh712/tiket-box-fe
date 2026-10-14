'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import type { Booking, TicketEvent, Ticket } from './types';

export const queryKeys = {
  events: ['events'] as const,
  bookings: ['bookings'] as const,
  booking: (id: string) => ['bookings', id] as const,
  tickets: ['tickets'] as const,
};

export const useEvents = () =>
  useQuery({ queryKey: queryKeys.events, queryFn: () => api<TicketEvent[]>('/events') });

export const useEvent = (id: string) =>
  useQuery({ queryKey: [...queryKeys.events, id], queryFn: () => api<TicketEvent>(`/events/${id}`) });

/** Lookup map eventId -> event, for showing titles next to bookings/tickets. */
export function useEventMap() {
  const { data } = useEvents();
  return new Map((data ?? []).map((e) => [e.id, e]));
}

export const useBookings = () =>
  useQuery({ queryKey: queryKeys.bookings, queryFn: () => api<Booking[]>('/bookings') });

export const useBooking = (id: string) =>
  useQuery({ queryKey: queryKeys.booking(id), queryFn: () => api<Booking>(`/bookings/${id}`) });

export const useTickets = () =>
  useQuery({ queryKey: queryKeys.tickets, queryFn: () => api<Ticket[]>('/tickets') });
