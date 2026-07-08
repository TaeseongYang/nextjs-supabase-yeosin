import { ParticipantInfoForm } from "@/components/participant/participant-info-form";

export default function HomePage() {
  return (
    <div className="min-h-screen px-4 pb-8 pt-8">
      <h1 className="text-lg font-semibold">실험 참여자 정보 입력</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        서비스 이용 전, 실험 참여를 위해 아래 정보를 입력해주세요. 이름 등
        개인식별 정보는 수집하지 않습니다.
      </p>
      <div className="mt-6">
        <ParticipantInfoForm />
      </div>
    </div>
  );
}
