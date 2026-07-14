import Link from "next/link";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

// 관리자 화면 진입점 목록. 새 관리자 메뉴가 추가되면 이 배열에만 항목을 추가하면 된다.
const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "시술 상품 관리" },
  { href: "/admin/participants", label: "실험 참여자 응답 관리" },
] as const;

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="border-b px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium">소다랩 관리자</span>
          <div className="flex items-center gap-4">
            <nav className="flex gap-4">
              {ADMIN_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
