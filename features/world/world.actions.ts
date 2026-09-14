"use server";

import { z, ZodError } from "zod";
import { createWorld, deleteWorld, getUserWorlds } from "./world.service";
import { PublicWorldRecord } from "./world.repository";

export type WorldActionResult =
  | {
      success: true;
      result: PublicWorldRecord;
      errors: null;
    }
  | {
      success: false;
      errors: {
        name?: string[];
        description?: string[];
        general?: string[];
      };
    };

export async function createWorldAction(
  formData: FormData,
): Promise<WorldActionResult> {
  try {
    const name = formData.get("name");
    const description = formData.get("description");

    const world = await createWorld({
      name,
      ...(description ? {description: description} : {})
    });

    return {
      result: world,
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

export async function getUserWorldsAction(userId: string) {
  return await getUserWorlds(userId);
}

export async function deleteWorldAction(id: string) {
  return await deleteWorld(id);
}
