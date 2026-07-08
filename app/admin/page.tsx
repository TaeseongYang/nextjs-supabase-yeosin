import { Suspense } from "react";
import Link from "next/link";

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
  dummyCategories,
  dummyHospitals,
  dummyProducts,
} from "@/lib/dummy-data";

// 관리자 대시보드: 전체 시술 상품 목록과 상품별 관리 진입 링크를 보여준다.
// 여기서 조합하는 병원명/카테고리명 로직은 Task 014(Supabase 실연동)에서
// 쿼리로 대체될 예정이므로 과도한 추상화 없이 단순 find로 처리한다.
async function AdminDashboard() {
  const products = dummyProducts.map((product) => {
    const hospital = dummyHospitals.find((h) => h.id === product.hospitalId);
    const category = dummyCategories.find((c) => c.id === product.categoryId);

    return {
      id: product.id,
      name: product.name,
      hospitalName: hospital?.name ?? "",
      categoryName: category?.name ?? "",
    };
  });

  return (
    <div className="flex max-w-5xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">시술 상품 관리</h1>
        <Button asChild size="sm">
          <Link href="/admin/products/new">신규 상품 등록</Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          등록된 상품이 없습니다.
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>상품명</TableHead>
                <TableHead>병원</TableHead>
                <TableHead>카테고리</TableHead>
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
                  <TableCell className="text-muted-foreground">
                    {product.categoryName}
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
