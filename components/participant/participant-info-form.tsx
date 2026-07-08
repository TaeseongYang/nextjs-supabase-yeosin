"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  GENDER_OPTIONS,
  participantSchema,
} from "@/lib/validations/participant-schema";
import type { ParticipantFormViewModel } from "@/lib/types/view-models";

// 성별/온라인 경험 선택지를 카드형 토글 버튼으로 보여주기 위한 공통 스타일.
// RadioGroupItem은 접근성을 위해 sr-only로 숨기고, 형제 span을 peer-data-[state=checked]:로 스타일링한다.
const toggleOptionClassName =
  "flex items-center justify-center rounded-lg border border-input px-4 py-3 text-sm font-medium cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50";

const emptyForm: ParticipantFormViewModel = {
  gender: "",
  age: "",
  hasOnlineExperience: "",
};

// 저장 로직 없이 UI만 구현 — 추후 Supabase 연동 등으로 실험 참여자 데이터를 저장할 예정.
export function ParticipantInfoForm() {
  const router = useRouter();
  const [form, setForm] = useState<ParticipantFormViewModel>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateField = <K extends keyof ParticipantFormViewModel>(
    key: K,
    value: ParticipantFormViewModel[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    const result = participantSchema.safeParse({
      gender: form.gender,
      age: Number(form.age),
      hasOnlineExperience: form.hasOnlineExperience,
    });
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }

    setFieldErrors({});
    setSubmitSuccess(true);
    setTimeout(() => {
      router.push("/categories");
    }, 500);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label>성별</Label>
            <RadioGroup
              value={form.gender}
              onValueChange={(value) =>
                updateField(
                  "gender",
                  value as ParticipantFormViewModel["gender"],
                )
              }
              className="grid grid-cols-2 gap-3"
            >
              {GENDER_OPTIONS.map((option) => (
                <label key={option.value} htmlFor={`gender-${option.value}`}>
                  <RadioGroupItem
                    value={option.value}
                    id={`gender-${option.value}`}
                    className="peer sr-only"
                  />
                  <span className={toggleOptionClassName}>{option.label}</span>
                </label>
              ))}
            </RadioGroup>
            {fieldErrors.gender && (
              <p className="text-sm text-destructive">
                {fieldErrors.gender[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="age">나이</Label>
            <Input
              id="age"
              type="number"
              className="h-11 text-base"
              placeholder="예: 28"
              value={form.age}
              onChange={(e) => updateField("age", e.target.value)}
            />
            {fieldErrors.age && (
              <p className="text-sm text-destructive">{fieldErrors.age[0]}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>온라인에서 시술 정보를 검색/구매해본 경험이 있나요?</Label>
            <RadioGroup
              value={form.hasOnlineExperience}
              onValueChange={(value) =>
                updateField(
                  "hasOnlineExperience",
                  value as ParticipantFormViewModel["hasOnlineExperience"],
                )
              }
              className="grid grid-cols-2 gap-3"
            >
              <label htmlFor="experience-yes">
                <RadioGroupItem
                  value="yes"
                  id="experience-yes"
                  className="peer sr-only"
                />
                <span className={toggleOptionClassName}>예</span>
              </label>
              <label htmlFor="experience-no">
                <RadioGroupItem
                  value="no"
                  id="experience-no"
                  className="peer sr-only"
                />
                <span className={toggleOptionClassName}>아니오</span>
              </label>
            </RadioGroup>
            {fieldErrors.hasOnlineExperience && (
              <p className="text-sm text-destructive">
                {fieldErrors.hasOnlineExperience[0]}
              </p>
            )}
          </div>

          {submitSuccess && (
            <p className="text-sm text-green-600">
              입력이 완료되었습니다. 잠시 후 이동합니다.
            </p>
          )}

          <Button type="submit" className="w-full">
            시작하기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
