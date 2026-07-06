import Link from "next/link";
import type { Category } from "@/lib/types/domain";
import {
  CATEGORY_ICON_MAP,
  DEFAULT_CATEGORY_ICON,
} from "@/lib/constants/category-icons";

interface CategoryIconGridProps {
  categories: Category[];
}

/**
 * 카테고리 홈의 시술 카테고리 아이콘+라벨 그리드.
 * 클릭 시 Category.id 기준으로 /categories/[categoryId]로 이동한다(slug 아님).
 */
export function CategoryIconGrid({ categories }: CategoryIconGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {categories.map((category) => {
        const Icon =
          CATEGORY_ICON_MAP[category.iconKey] ?? DEFAULT_CATEGORY_ICON;
        return (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="flex flex-col items-center gap-2 rounded-lg p-2 text-center hover:bg-accent"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
              <Icon className="size-6 text-secondary-foreground" />
            </span>
            <span className="text-xs text-foreground">{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
