import { Suspense } from "react";
import Link from "next/link";

import { DeleteProductButton } from "@/components/admin/delete-product-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAdminProductsByCategory,
  type AdminCategoryGroup,
} from "@/lib/queries/products";

// 카테고리 하나에 속한 상품들을 테이블로 보여준다. 상품이 없으면 안내 문구만 표시한다.
function CategoryProductTable({
  products,
}: {
  products: AdminCategoryGroup["products"];
}) {
  if (products.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        등록된 상품이 없습니다.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>상품명</TableHead>
            <TableHead>병원</TableHead>
            <TableHead className="text-right">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {product.hospitalName}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/products/${product.id}`}>수정</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/products/${product.id}/summaries`}>
                      리뷰 요약
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/products/${product.id}/reviews`}>
                      개별 리뷰
                    </Link>
                  </Button>
                  <DeleteProductButton productId={product.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// 관리자 대시보드: 카테고리별로 시술 상품 목록을 그룹화해 보여주고 상품별 관리 진입 링크를 제공한다.
async function AdminDashboard() {
  const categoryGroups = await getAdminProductsByCategory();
  const totalProductCount = categoryGroups.reduce(
    (sum, group) => sum + group.products.length,
    0,
  );
  // 상품이 있는 카테고리는 기본으로 펼쳐서 바로 보이게 하고, 비어 있는 카테고리는 접어 스크롤을 줄인다.
  const defaultOpenValues = categoryGroups
    .filter((group) => group.products.length > 0)
    .map((group) => group.categoryId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">시술 상품 관리</h1>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/categories">실험 환경 보기</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/products/new">신규 상품 등록</Link>
          </Button>
        </div>
      </div>

      {totalProductCount === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          등록된 상품이 없습니다.
        </p>
      ) : (
        <Accordion type="multiple" defaultValue={defaultOpenValues}>
          {categoryGroups.map((group) => (
            <AccordionItem key={group.categoryId} value={group.categoryId}>
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  {group.categoryName}
                  <Badge
                    variant={
                      group.products.length > 0 ? "default" : "secondary"
                    }
                  >
                    {group.products.length}개
                  </Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <CategoryProductTable products={group.products} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
