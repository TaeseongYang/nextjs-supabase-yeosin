export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background shadow-sm">
      <main className="flex-1">{children}</main>
    </div>
  );
}
