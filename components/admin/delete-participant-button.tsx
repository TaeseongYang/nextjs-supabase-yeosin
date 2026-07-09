"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { deleteParticipantResponse } from "@/lib/actions/participants";

interface DeleteParticipantButtonProps {
  participantId: string;
  // 삭제 대상을 실수 없이 특정할 수 있도록 confirm 문구에 포함할 제출일시(포맷된 문자열).
  submittedAt: string;
}

// 실험 데이터를 다루는 화면이므로, 삭제 확인 문구에 제출일시를 포함해 대상을 명확히 특정한다.
export function DeleteParticipantButton({
  participantId,
  submittedAt,
}: DeleteParticipantButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      !window.confirm(
        `${submittedAt}에 제출된 참여자 응답을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteParticipantResponse(participantId);
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
