import { CategoryIconGrid } from "@/components/category/category-icon-grid";
import { dummyCategories } from "@/lib/dummy-data";

export default function HomePage() {
  return (
    <div>
      <h1 className="px-4 pt-4 text-lg font-semibold">카테고리</h1>
      <CategoryIconGrid categories={dummyCategories} />
    </div>
  );
}
