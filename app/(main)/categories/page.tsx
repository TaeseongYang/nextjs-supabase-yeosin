import { CategoryIconGrid } from "@/components/category/category-icon-grid";
import { getCategories } from "@/lib/queries/categories";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="px-4 pt-4 text-lg font-semibold">카테고리</h1>
      <CategoryIconGrid categories={categories} />
    </div>
  );
}
