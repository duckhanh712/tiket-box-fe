export function Spinner() {
  return (
    <div className="flex justify-center py-16" role="status" aria-label="Đang tải">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
    </div>
  );
}
