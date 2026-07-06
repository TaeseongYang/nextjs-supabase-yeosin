import { Construction, type LucideIcon } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

/**
 * 병원/이벤트/마이페이지 등 아직 구현되지 않은 하단 탭 페이지에서
 * 공통으로 사용하는 "준비 중" 안내 화면.
 */
export function ComingSoon({
  title,
  description,
  icon: Icon = Construction,
}: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <Icon className="size-10 text-muted-foreground" />
      <p className="text-base font-medium text-foreground">{title}</p>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
