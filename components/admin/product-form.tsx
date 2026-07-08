"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dummyCategories, dummyHospitals } from "@/lib/dummy-data";
import { productSchema } from "@/lib/validations/product-schema";
import type { TreatmentProduct } from "@/lib/types/domain";
import type { ProductFormViewModel } from "@/lib/types/admin";

interface ProductFormProps {
  initialProduct?: TreatmentProduct;
}

const emptyForm: ProductFormViewModel = {
  name: "",
  categoryId: "",
  hospitalId: "",
  originalPrice: 0,
  discountPrice: 0,
  includesVat: false,
  includesAnesthesia: false,
  includesAftercare: false,
  sideEffectNotice: "",
  thumbnailUrl: "",
  detailImageUrls: [],
};

// 시술 상품 등록/수정 폼. 실제 INSERT/UPDATE는 Task 014(Server Action)에서
// 구현될 예정이며, 이 단계에서는 zod 검증 후 성공 안내만 노출하고 저장은 하지 않는다.
export function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormViewModel>(
    initialProduct
      ? {
          name: initialProduct.name,
          categoryId: initialProduct.categoryId,
          hospitalId: initialProduct.hospitalId,
          originalPrice: initialProduct.originalPrice,
          discountPrice: initialProduct.discountPrice,
          includesVat: initialProduct.includesVat,
          includesAnesthesia: initialProduct.includesAnesthesia,
          includesAftercare: initialProduct.includesAftercare,
          sideEffectNotice: initialProduct.sideEffectNotice,
          thumbnailUrl: initialProduct.thumbnailUrl,
          detailImageUrls: initialProduct.detailImageUrls,
        }
      : emptyForm,
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateField = <K extends keyof ProductFormViewModel>(
    key: K,
    value: ProductFormViewModel[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    const result = productSchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }

    setFieldErrors({});
    // 실제 영속화 없이 더미 성공 처리 (Task 014에서 Server Action으로 대체 예정)
    setSubmitSuccess(true);
    setTimeout(() => {
      router.push("/admin");
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="name">상품명</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        {fieldErrors.name && (
          <p className="text-sm text-destructive">{fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="categoryId">카테고리</Label>
          <Select
            value={form.categoryId}
            onValueChange={(value) => updateField("categoryId", value)}
          >
            <SelectTrigger id="categoryId" className="w-full">
              <SelectValue placeholder="카테고리를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {dummyCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.categoryId && (
            <p className="text-sm text-destructive">
              {fieldErrors.categoryId[0]}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hospitalId">병원</Label>
          <Select
            value={form.hospitalId}
            onValueChange={(value) => updateField("hospitalId", value)}
          >
            <SelectTrigger id="hospitalId" className="w-full">
              <SelectValue placeholder="병원을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {dummyHospitals.map((hospital) => (
                <SelectItem key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.hospitalId && (
            <p className="text-sm text-destructive">
              {fieldErrors.hospitalId[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="originalPrice">정가</Label>
          <Input
            id="originalPrice"
            type="number"
            value={form.originalPrice}
            onChange={(e) =>
              updateField("originalPrice", Number(e.target.value))
            }
          />
          {fieldErrors.originalPrice && (
            <p className="text-sm text-destructive">
              {fieldErrors.originalPrice[0]}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="discountPrice">할인가</Label>
          <Input
            id="discountPrice"
            type="number"
            value={form.discountPrice}
            onChange={(e) =>
              updateField("discountPrice", Number(e.target.value))
            }
          />
          {fieldErrors.discountPrice && (
            <p className="text-sm text-destructive">
              {fieldErrors.discountPrice[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="includesVat"
            checked={form.includesVat}
            onCheckedChange={(checked) =>
              updateField("includesVat", checked === true)
            }
          />
          <Label htmlFor="includesVat">부가세 포함</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="includesAnesthesia"
            checked={form.includesAnesthesia}
            onCheckedChange={(checked) =>
              updateField("includesAnesthesia", checked === true)
            }
          />
          <Label htmlFor="includesAnesthesia">마취 포함</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="includesAftercare"
            checked={form.includesAftercare}
            onCheckedChange={(checked) =>
              updateField("includesAftercare", checked === true)
            }
          />
          <Label htmlFor="includesAftercare">애프터케어 포함</Label>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sideEffectNotice">부작용 안내</Label>
        <Textarea
          id="sideEffectNotice"
          value={form.sideEffectNotice}
          onChange={(e) => updateField("sideEffectNotice", e.target.value)}
        />
        {fieldErrors.sideEffectNotice && (
          <p className="text-sm text-destructive">
            {fieldErrors.sideEffectNotice[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="thumbnailUrl">썸네일 이미지 URL</Label>
        <Input
          id="thumbnailUrl"
          value={form.thumbnailUrl}
          onChange={(e) => updateField("thumbnailUrl", e.target.value)}
          placeholder="/placeholder-product-1.jpg"
        />
        {fieldErrors.thumbnailUrl && (
          <p className="text-sm text-destructive">
            {fieldErrors.thumbnailUrl[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="detailImageUrls">상세 이미지 URL (콤마로 구분)</Label>
        <Input
          id="detailImageUrls"
          value={form.detailImageUrls.join(", ")}
          onChange={(e) =>
            updateField(
              "detailImageUrls",
              e.target.value
                .split(",")
                .map((url) => url.trim())
                .filter((url) => url.length > 0),
            )
          }
          placeholder="/detail-1.jpg, /detail-2.jpg"
        />
      </div>

      {submitSuccess && (
        <p className="text-sm text-green-600">
          저장되었습니다. (더미 처리, 실제 저장은 Task 014에서 구현 예정)
        </p>
      )}

      <Button type="submit" className="w-full">
        저장
      </Button>
    </form>
  );
}
