import { z } from "zod";

export const createWorldSchema = z.object({
  name: z
    .string({ error: "Please enter a name." })
    .max(30, { error: "Name must be 30 characters or fewer." }),
  description: z
    .optional( z
      .string({ error: "Invalid Description type" })
      .max(500, { error: "Description must be 500 characters or fewer." })
    )
});

export type WorldSchema = z.infer<typeof createWorldSchema>;