import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md space-y-4 p-10 text-center">
      <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
      <p className="text-slate-500">Trang hoặc sự kiện bạn tìm không tồn tại.</p>
      <Link href="/" className="btn-primary">Về trang chủ</Link>
    </div>
  );
}
