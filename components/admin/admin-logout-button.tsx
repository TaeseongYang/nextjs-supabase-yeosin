import { Button } from "@/components/ui/button";
import { signOutAdmin } from "@/lib/actions/admin-auth";

export function AdminLogoutButton() {
  return (
    <form action={signOutAdmin}>
      <Button type="submit" size="sm" variant="outline">
        로그아웃
      </Button>
    </form>
  );
}
