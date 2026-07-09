"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/products";

interface DeleteProductButtonProps {
  productId: string;
}

// 상품 삭제 시 연결된 리뷰/리뷰 요약도 cascade로 함께 삭제되므로 사전에 명확히 경고한다.
export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      !window.confirm(
        "이 상품을 삭제하면 연결된 리뷰와 리뷰 요약도 함께 삭제됩니다. 계속하시겠습니까?",
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (!result.success) {
        alert(result.error);
      }
    });
  };

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      삭제
    </Button>
  );
}
