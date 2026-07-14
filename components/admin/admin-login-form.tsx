"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAdmin } from "@/lib/actions/admin-auth";
import { adminAuthSchema } from "@/lib/validations/admin-auth-schema";

export function AdminLoginForm() {
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = adminAuthSchema.safeParse({ username, password });
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }

    setFieldErrors({});

    const formData = new FormData();
    formData.set("username", result.data.username);
    formData.set("password", result.data.password);

    startTransition(async () => {
      const response = await signInAdmin(formData);
      // signInAdmin은 성공 시 redirect()를 던지므로 여기 도달하면 실패한 경우다.
      if (response && !response.success) {
        setFieldErrors(response.fieldErrors);
      }
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">아이디</Label>
            <Input
              id="username"
              type="text"
              className="h-11 text-base"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {fieldErrors.username && (
              <p className="text-sm text-destructive">
                {fieldErrors.username[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              className="h-11 text-base"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && (
              <p className="text-sm text-destructive">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {fieldErrors._form && (
            <p className="text-sm text-destructive">{fieldErrors._form[0]}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
