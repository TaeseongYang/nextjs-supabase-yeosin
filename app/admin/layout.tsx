export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="border-b px-6 py-4">소다랩 관리자</header>
      <main className="p-6">{children}</main>
    </div>
  );
}
