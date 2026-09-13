import { z } from "zod";

export const registerSchema = z.object({
  nickname: z
    .string({ error: "Please enter a nickname." })
    .max(30, { error: "Username must be 30 characters or fewer." }),
  username: z
    .string({ error: "Please enter a username." })
    .min(3, { error: "Username must be at least 3 characters long." })
    .max(30, { error: "Username must be 30 characters or fewer." })
    .regex(/^[a-zA-Z0-9_]+$/, "Username can contain only letters, numbers and underscores"),
  password: z
    .string({ error: "Please enter a password." })
    .min(8, { error: "Password must be at least 8 characters long." }),
});

export const loginSchema = z.object({
  username: z
    .string({ error: "Please enter a username." }),
  password: z
    .string({ error: "Please enter a password." })
});

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
