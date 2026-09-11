"use server";

import { redirect } from "next/navigation";
import { registerUser, loginUser } from "./auth.service";
import { logout } from "@/lib/auth";
import { z, ZodError } from "zod";

type AuthErrors = {
  username?: string[];
  password?: string[];
  general?: string[];
};

type AuthActionResult =
  | {
      success: true;
      errors: null;
    }
  | {
      success: false;
      errors: AuthErrors;
    };

export async function registerAction(
  formData: FormData,
): Promise<AuthActionResult> {
  try {
    await registerUser({
      username: formData.get("username"),
      password: formData.get("password"),
    });

    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const { fieldErrors } = z.flattenError(error);

      return {
        success: false,
        errors: fieldErrors,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        errors: { general: [error.message] },
      };
    }

    return {
      success: false,
      errors: { general: ["Something went wrong. Please try again."] },
    };
  }
}

export async function loginAction(
  formData: FormData,
): Promise<AuthActionResult> {
  try {
    await loginUser({
      username: formData.get("username"),
      password: formData.get("password"),
    });

    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const { fieldErrors } = z.flattenError(error);

      return {
        success: false,
        errors: fieldErrors,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        errors: { general: ["The username or password is incorrect."] },
      };
    }

    return {
      success: false,
      errors: { general: ["Something went wrong. Please try again."] },
    };
  }
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
