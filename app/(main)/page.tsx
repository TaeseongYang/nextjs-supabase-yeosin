import Link from "next/link";
import { Suspense } from "react";

import { ParticipantInfoForm } from "@/components/participant/participant-info-form";

interface HomePageProps {
  searchParams: Promise<{ error?: string }>;
}

async function AccessDeniedBanner({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (error !== "access_denied") return null;

  return (
    <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
      접근 권한이 없습니다. 정보를 입력하거나{" "}
      <Link href="/admin/login" className="font-medium underline">
        관리자로 로그인
      </Link>
      해주세요.
    </div>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <div className="min-h-screen px-4 pt-8 pb-8">
      <Suspense>
        <AccessDeniedBanner searchParams={searchParams} />
      </Suspense>
      <h1 className="text-lg font-semibold">실험 참여자 정보 입력</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        서비스 이용 전, 실험 참여를 위해 아래 정보를 입력해주세요. 이름 등
        개인식별 정보는 수집하지 않습니다.
      </p>
      <div className="mt-6">
        <ParticipantInfoForm />
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        관리자이신가요?{" "}
        <Link href="/admin/login" className="underline">
          관리자 로그인
        </Link>
      </p>
    </div>
  );
}
