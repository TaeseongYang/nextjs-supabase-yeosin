"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitParticipantInfo } from "@/lib/actions/participant";
import type { ExperimentGroup } from "@/lib/constants/participant";
import {
  GENDER_OPTIONS,
  HAS_ONLINE_EXPERIENCE_OPTIONS,
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

// 참여자 정보 입력 완료 여부는 서버(Server Action)가 httpOnly 쿠키에 기록하며,
// proxy.ts가 이 쿠키를 기준으로 실험 환경 접근을 서버 사이드에서 가드한다.
// (이름 등 개인식별 정보는 수집하지 않는다.)
export function ParticipantInfoForm() {
  const [isPending, startTransition] = useTransition();
  const [pendingGroup, setPendingGroup] = useState<ExperimentGroup | null>(
    null,
  );
  const [form, setForm] = useState<ParticipantFormViewModel>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateField = <K extends keyof ParticipantFormViewModel>(
    key: K,
    value: ParticipantFormViewModel[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (group: ExperimentGroup) => {
    setSubmitSuccess(false);

    // 클라이언트 측 검증은 즉각적인 사용자 피드백(UX)용이며,
    // 실제 신뢰 기준은 submitParticipantInfo 내부의 서버 측 재검증이다.
    const result = participantSchema.safeParse({
      gender: form.gender,
      age: Number(form.age),
      hasOnlineExperience: form.hasOnlineExperience,
      experimentGroup: group,
    });
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }

    setFieldErrors({});
    setSubmitSuccess(true);
    setPendingGroup(group);

    const formData = new FormData();
    formData.set("gender", result.data.gender);
    formData.set("age", String(result.data.age));
    formData.set("hasOnlineExperience", result.data.hasOnlineExperience);
    formData.set("experimentGroup", result.data.experimentGroup);

    startTransition(async () => {
      const response = await submitParticipantInfo(formData);
      // submitParticipantInfo는 성공 시 redirect()를 던지므로 여기 도달하면 실패한 경우다.
      if (response && !response.success) {
        setSubmitSuccess(false);
        setPendingGroup(null);
        setFieldErrors(response.fieldErrors);
      }
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-6"
        >
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
              {HAS_ONLINE_EXPERIENCE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  htmlFor={`experience-${option.value}`}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`experience-${option.value}`}
                    className="peer sr-only"
                  />
                  <span className={toggleOptionClassName}>{option.label}</span>
                </label>
              ))}
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

          {fieldErrors._form && (
            <p className="text-sm text-destructive">{fieldErrors._form[0]}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              disabled={isPending}
              onClick={() => handleSubmit("a")}
            >
              {isPending && pendingGroup === "a"
                ? "이동 중..."
                : "환경 A로 시작"}
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={() => handleSubmit("b")}
            >
              {isPending && pendingGroup === "b"
                ? "이동 중..."
                : "환경 B로 시작"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
