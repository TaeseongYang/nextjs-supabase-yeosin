"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BulletListInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}

// bullet 문자열 배열을 한 줄씩 입력/삭제할 수 있는 리스트 입력기.
// 긍정/부정 bullet 목록 입력에 공통으로 재사용한다.
export function BulletListInput({
  label,
  values,
  onChange,
}: BulletListInputProps) {
  const updateBullet = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  const removeBullet = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const addBullet = () => {
    onChange([...values, ""]);
  };

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="flex flex-col gap-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => updateBullet(index, e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeBullet(index)}
            >
              삭제
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addBullet}>
        항목 추가
      </Button>
    </div>
  );
}
