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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await registerAction(formData);
      if (result.success) router.push("/");
      else {
        if (result.errors?.username) setError(result.errors.username[0]);
        if (result.errors?.password) setError(result.errors.password[0]);
        if (result.errors?.general) setError(result.errors.general[0]);
      }
    });
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="p-6 block">
        <h1 className="font-medium text-xl mb-6">Create an account</h1>

        <form className="mt-4" onSubmit={handleSubmit}>
          <Field className="pb-4">
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              className="min-w-72"
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              disabled={isPending}
            />
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
          </Field>

          {error && <p className="text-sm text-destructive pb-4">{error}</p>}

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
