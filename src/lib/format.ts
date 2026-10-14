const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const dateTime = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Ho_Chi_Minh',
});

export const formatPrice = (value: number) => currency.format(value);
export const formatDateTime = (value: string | Date) => dateTime.format(new Date(value));
