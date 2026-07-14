import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-4 pt-8 pb-8">
      <h1 className="text-lg font-semibold">관리자 로그인</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        관리자 계정으로 로그인하면 실험 참여자 정보 입력 없이 실험 환경과 관리자
        화면에 접근할 수 있습니다.
      </p>
      <div className="mt-6">
        <AdminLoginForm />
      </div>
    </div>
  );
}
