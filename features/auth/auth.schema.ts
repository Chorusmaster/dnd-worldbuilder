import { z } from "zod";

export const authSchema = z.object({
  username: z
    .string({ error: "Please enter a username." })
    .min(3, { error: "Username must be at least 3 characters long." })
    .max(30, { error: "Username must be 30 characters or fewer." }),
  password: z
    .string({ error: "Please enter a password." })
    .min(8, { error: "Password must be at least 8 characters long." }),
});

export type AuthData = z.infer<typeof authSchema>;
