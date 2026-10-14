import type { BookingStatus, EventStatus, TicketStatus } from '@/lib/types';

type Status = BookingStatus | TicketStatus | EventStatus;

const STYLES: Record<Status, { label: string; className: string }> = {
  PENDING: { label: 'Chờ thanh toán', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  CONFIRMED: { label: 'Đã xác nhận', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  CANCELLED: { label: 'Đã huỷ', className: 'bg-slate-100 text-slate-500 ring-slate-200' },
  ACTIVE: { label: 'Còn hiệu lực', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  USED: { label: 'Đã sử dụng', className: 'bg-slate-100 text-slate-500 ring-slate-200' },
  DRAFT: { label: 'Nháp', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  PUBLISHED: { label: 'Đang mở bán', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, className } = STYLES[status];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}
