"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, Calendar, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/hospitals", label: "병원", icon: Building2 },
  { href: "/events", label: "이벤트", icon: Calendar },
  { href: "/mypage", label: "마이페이지", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 flex h-16 w-full max-w-md -translate-x-1/2 border-t bg-background">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-xs ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
