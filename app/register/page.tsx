"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@base-ui/react";
import Link from "next/link";
import { registerAction } from "@/features/auth/auth.actions";
import { useRouter } from "next/navigation";

export default function Register() {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{
    nickname?: string;
    username?: string;
    password?: string;
    general?: string;
  }>({});
  const router = useRouter();

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await registerAction(formData);
      if (result.success) router.push("/dashboard");
      else
        setErrors({
          nickname: result.errors.nickname?.[0],
          username: result.errors.username?.[0],
          password: result.errors.password?.[0],
          general: result.errors.general?.[0],
        });
    });
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="p-6 block">
        <h1 className="font-medium text-xl mb-6">Create an account</h1>

        <form className="mt-4" onSubmit={handleSubmit}>
          <Field className="pb-4">
            <FieldLabel htmlFor="nickname">Nickname</FieldLabel>
            <Input
              className="min-w-72"
              id="nickname"
              name="nickname"
              type="text"
              placeholder="Dungeon master"
              disabled={isPending}
            />
            {errors.nickname && (
              <p className="text-sm text-destructive" role="alert">
                {errors.nickname}
              </p>
            )}
          </Field>

          <Field className="pb-4">
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              className="min-w-72"
              id="username"
              name="username"
              type="text"
              placeholder="dungeon_master123"
              disabled={isPending}
            />
            {errors.username && (
              <p className="text-sm text-destructive" role="alert">
                {errors.username}
              </p>
            )}
          </Field>

          <Field className="pb-4">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              className="min-w-72"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              disabled={isPending}
            />
            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password}
              </p>
            )}
          </Field>

          {errors.general && (
            <p className="text-sm text-destructive pb-4" role="alert">
              {errors.general}
            </p>
          )}

          <div className="pb-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary cursor-pointer">
              Log in
            </Link>
          </div>

          <div className="w-full flex justify-end">
            <Button
              className="bg-secondary-foreground text-secondary py-1 px-2 rounded-md cursor-pointer font-medium"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Submit"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
