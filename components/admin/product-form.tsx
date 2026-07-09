"use client";

import { useRef, useState, useTransition } from "react";
import { ImageIcon, Loader2Icon, XIcon } from "lucide-react";

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
import { createProduct, updateProduct } from "@/lib/actions/products";
import { uploadProductImage } from "@/lib/actions/product-images";
import { productSchema } from "@/lib/validations/product-schema";
import type { Category, Hospital, TreatmentProduct } from "@/lib/types/domain";
import type { ProductFormViewModel } from "@/lib/types/admin";

interface ProductFormProps {
  categories: Category[];
  hospitals: Hospital[];
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

// 시술 상품 등록/수정 폼. 클라이언트 zod 검증은 즉각적인 사용자 피드백용이며,
// 실제 신뢰 기준은 createProduct/updateProduct 내부의 서버 측 재검증이다.
export function ProductForm({
  categories,
  hospitals,
  initialProduct,
}: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
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
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingDetailImages, setIsUploadingDetailImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // 실제 파일이 없는 깨진 이미지(시드 placeholder 등)를 감지해 미리보기를
  // 아이콘 플레이스홀더로 대체하기 위한 URL 집합. 새 파일을 선택하면 해당 URL이
  // 교체되므로 이 집합에서 자연히 제외된다.
  const [brokenImageUrls, setBrokenImageUrls] = useState<Set<string>>(
    new Set(),
  );
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const detailImagesInputRef = useRef<HTMLInputElement>(null);

  const markImageBroken = (url: string) => {
    setBrokenImageUrls((prev) => new Set(prev).add(url));
  };

  const updateField = <K extends keyof ProductFormViewModel>(
    key: K,
    value: ProductFormViewModel[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 썸네일 파일을 선택하는 즉시 Storage에 업로드하고, 반환된 공개 URL로 폼 상태를 교체한다.
  // 기존 값(수정 화면의 placeholder URL 포함)은 새 파일을 선택하기 전까지 그대로 유지된다.
  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploadingThumbnail(true);
    try {
      const result = await uploadProductImage(file);
      if (!result.success) {
        setUploadError(result.error);
        return;
      }
      updateField("thumbnailUrl", result.url);
    } finally {
      setIsUploadingThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  };

  // 상세 이미지는 여러 장을 한 번에 선택할 수 있으며, 업로드 완료된 이미지는 기존 목록 뒤에 이어붙인다.
  const handleDetailImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploadError(null);
    setIsUploadingDetailImages(true);
    try {
      const results = await Promise.all(
        files.map((file) => uploadProductImage(file)),
      );
      const failed = results.find((result) => !result.success);
      if (failed && !failed.success) {
        setUploadError(failed.error);
      }
      const uploadedUrls = results
        .filter(
          (result): result is { success: true; url: string } => result.success,
        )
        .map((result) => result.url);
      if (uploadedUrls.length > 0) {
        updateField("detailImageUrls", [
          ...form.detailImageUrls,
          ...uploadedUrls,
        ]);
      }
    } finally {
      setIsUploadingDetailImages(false);
      if (detailImagesInputRef.current) detailImagesInputRef.current.value = "";
    }
  };

  const removeDetailImage = (index: number) => {
    updateField(
      "detailImageUrls",
      form.detailImageUrls.filter((_, i) => i !== index),
    );
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
    setSubmitSuccess(true);

    const formData = new FormData();
    formData.set("name", result.data.name);
    formData.set("categoryId", result.data.categoryId);
    formData.set("hospitalId", result.data.hospitalId);
    formData.set("originalPrice", String(result.data.originalPrice));
    formData.set("discountPrice", String(result.data.discountPrice));
    formData.set("includesVat", String(result.data.includesVat));
    formData.set("includesAnesthesia", String(result.data.includesAnesthesia));
    formData.set("includesAftercare", String(result.data.includesAftercare));
    formData.set("sideEffectNotice", result.data.sideEffectNotice);
    formData.set("thumbnailUrl", result.data.thumbnailUrl);
    formData.set(
      "detailImageUrls",
      JSON.stringify(result.data.detailImageUrls),
    );

    startTransition(async () => {
      const response = initialProduct
        ? await updateProduct(
            initialProduct.id,
            initialProduct.categoryId,
            formData,
          )
        : await createProduct(formData);
      // createProduct/updateProduct는 성공 시 redirect()를 던지므로 여기 도달하면 실패한 경우다.
      if (response && !response.success) {
        setSubmitSuccess(false);
        setFieldErrors(response.fieldErrors);
      }
    });
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
              {categories.map((category) => (
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
              {hospitals.map((hospital) => (
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
        <Label htmlFor="thumbnailFile">썸네일 이미지</Label>
        <div className="flex items-center gap-4">
          {form.thumbnailUrl &&
            (brokenImageUrls.has(form.thumbnailUrl) ? (
              <div className="flex size-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed bg-muted text-muted-foreground">
                <ImageIcon className="size-6" />
                <span className="text-[10px]">미리보기 없음</span>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- 프로젝트 전반이 next/image 대신 <img>를 사용(components/product/product-card.tsx 참고)
              <img
                src={form.thumbnailUrl}
                alt="썸네일 미리보기"
                className="size-24 rounded-md border object-cover"
                onError={() => markImageBroken(form.thumbnailUrl)}
              />
            ))}
          <div className="flex flex-col gap-2">
            <Input
              id="thumbnailFile"
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              disabled={isUploadingThumbnail}
            />
            {isUploadingThumbnail && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Loader2Icon className="size-3.5 animate-spin" />
                업로드 중...
              </p>
            )}
          </div>
        </div>
        {fieldErrors.thumbnailUrl && (
          <p className="text-sm text-destructive">
            {fieldErrors.thumbnailUrl[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="detailImagesFile">
          상세 이미지 (여러 장 선택 가능)
        </Label>
        <Input
          id="detailImagesFile"
          ref={detailImagesInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleDetailImagesChange}
          disabled={isUploadingDetailImages}
        />
        {isUploadingDetailImages && (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Loader2Icon className="size-3.5 animate-spin" />
            업로드 중...
          </p>
        )}
        {form.detailImageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {form.detailImageUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="group relative">
                {brokenImageUrls.has(url) ? (
                  <div className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed bg-muted text-muted-foreground">
                    <ImageIcon className="size-6" />
                    <span className="text-[10px]">미리보기 없음</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- 프로젝트 전반이 next/image 대신 <img>를 사용
                  <img
                    src={url}
                    alt={`상세 이미지 ${index + 1}`}
                    className="aspect-square w-full rounded-md border object-cover"
                    onError={() => markImageBroken(url)}
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeDetailImage(index)}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={`상세 이미지 ${index + 1} 삭제`}
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        {fieldErrors.detailImageUrls && (
          <p className="text-sm text-destructive">
            {fieldErrors.detailImageUrls[0]}
          </p>
        )}
      </div>

      {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

      {submitSuccess && (
        <p className="text-sm text-green-600">저장 중입니다...</p>
      )}

      {fieldErrors._form && (
        <p className="text-sm text-destructive">{fieldErrors._form[0]}</p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || isUploadingThumbnail || isUploadingDetailImages}
      >
        {isPending ? "저장 중..." : "저장"}
      </Button>
    </form>
  );
}
