import { Suspense } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-16 shadow-sm">
      <main className="flex-1">{children}</main>
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
    </div>
  );
}
