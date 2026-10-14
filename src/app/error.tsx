'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card mx-auto max-w-md space-y-4 p-10 text-center">
      <h1 className="text-2xl font-bold">Đã có lỗi xảy ra</h1>
      <p className="text-slate-500">Không kết nối được tới máy chủ. Vui lòng thử lại.</p>
      <button className="btn-primary" onClick={reset}>Thử lại</button>
    </div>
  );
}
