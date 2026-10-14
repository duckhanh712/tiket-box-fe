// Mirrors the response shapes of the tiketbox API gateway.

export type UserRole = 'USER' | 'STAFF' | 'ADMIN';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type PaymentMethod = 'CARD' | 'BANK_TRANSFER' | 'E_WALLET';
export type TicketStatus = 'ACTIVE' | 'USED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface TicketEvent {
  id: string;
  title: string;
  description: string | null;
  venue: string;
  startTime: string;
  endTime: string;
  totalTickets: number;
  availableTickets: number;
  price: number;
  status: EventStatus;
}

/** Body of POST /events and PATCH /events/:id (admin only). */
export interface EventInput {
  title: string;
  description?: string;
  venue: string;
  startTime: string;
  endTime: string;
  totalTickets: number;
  price: number;
  status?: EventStatus;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  quantity: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string | null;
  createdAt: string;
}

export interface Ticket {
  id: string;
  code: string;
  bookingId: string;
  eventId: string;
  status: TicketStatus;
  usedAt: string | null;
  createdAt: string;
}
