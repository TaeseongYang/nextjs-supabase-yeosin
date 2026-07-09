import { Suspense } from "react";

import { DeleteParticipantButton } from "@/components/admin/delete-participant-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getParticipantResponses } from "@/lib/queries/participants";
import {
  GENDER_OPTIONS,
  HAS_ONLINE_EXPERIENCE_OPTIONS,
} from "@/lib/validations/participant-schema";

// 코드값(gender/hasOnlineExperience)을 한국어 라벨로 변환하기 위한 조회용 맵.
// 라벨 원본은 participant-schema.ts의 옵션 상수를 그대로 재사용해 중복 정의를 피한다.
const genderLabelMap = new Map(
  GENDER_OPTIONS.map((option) => [option.value, option.label]),
);
const hasOnlineExperienceLabelMap = new Map(
  HAS_ONLINE_EXPERIENCE_OPTIONS.map((option) => [option.value, option.label]),
);

// 제출일시(UTC)를 한국 시간 기준으로 읽기 쉽게 표시한다.
function formatSubmittedAt(isoString: string): string {
  return new Date(isoString).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 실험 참여자 인적사항 응답 목록을 조회해 테이블로 보여준다. 조회와 개별 삭제만 가능하다.
async function ParticipantResponseTable() {
  const responses = await getParticipantResponses();

  if (responses.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        등록된 참여자 응답이 없습니다.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>제출일시</TableHead>
            <TableHead>성별</TableHead>
            <TableHead>나이</TableHead>
            <TableHead>온라인 시술 정보 검색/구매 경험</TableHead>
            <TableHead>관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map((response) => {
            const submittedAt = formatSubmittedAt(response.createdAt);
            return (
              <TableRow key={response.id}>
                <TableCell className="text-muted-foreground">
                  {submittedAt}
                </TableCell>
                <TableCell>{genderLabelMap.get(response.gender)}</TableCell>
                <TableCell>{response.age}</TableCell>
                <TableCell>
                  {hasOnlineExperienceLabelMap.get(
                    response.hasOnlineExperience,
                  )}
                </TableCell>
                <TableCell>
                  <DeleteParticipantButton
                    participantId={response.id}
                    submittedAt={submittedAt}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AdminParticipantsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <h1 className="text-lg font-semibold">실험 참여자 응답 관리</h1>
      <Suspense fallback={<div>로딩 중...</div>}>
        <ParticipantResponseTable />
      </Suspense>
    </div>
  );
}
