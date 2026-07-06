export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background shadow-sm">
      <header className="border-b p-4">소다랩 관리자</header>
      <main className="p-4">{children}</main>
    </div>
  );
}
