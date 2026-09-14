import { z } from "zod";
import { FieldType } from "@/models/EntityType";
import { entityIconNames } from "./entity.icons";

export const objectIdSchema = z.string().regex(
  /^[0-9a-fA-F]{24}$/,
  "Invalid ObjectId",
);

export const createEntitySchema = z.object({
  worldId: objectIdSchema,

  typeId: objectIdSchema,

  name: z
    .string()
    .trim()
    .min(1, "Name is required"),

  description: z
    .string()
    .trim()
    .optional(),

  image: z
    .string()
    .trim()
    .optional(),

  data: z
    .record(z.string(), z.unknown())
    .default({}),

  createdBy: objectIdSchema,

  visibility: z
    .enum(["private", "world", "public"])
    .default("private"),

  notes: z
    .string()
    .optional(),
});

const entityFieldSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, "Field key is required"),

  label: z
    .string()
    .trim()
    .min(1, "Field label is required"),

  referenceTypes: z
    .array(z.string().trim().min(1))
    .optional(),

  options: z
    .array(z.string().trim().min(1))
    .optional(),

  type: z.enum(FieldType),

  renderer: z
    .string()
    .trim()
    .min(1, "Field renderer is required"),

  required: z
    .boolean()
    .default(false),
});

const entityCardSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, "Card key is required"),

  label: z
    .string()
    .trim()
    .min(1, "Card label is required"),

  fields: z
    .array(entityFieldSchema)
    .default([]),
});

export const createEntityTypeSchema = z.object({
  worldId: objectIdSchema,

  name: z
    .string()
    .trim()
    .min(1, "Name is required"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Invalid slug",
    ),

  icon: z
    .enum(entityIconNames)
    .default("Circle"),

  cards: z
    .array(entityCardSchema)
    .default([]),
});

export const updateEntitySchema = createEntitySchema
  .omit({
    worldId: true,
    createdBy: true,
  })
  .partial();

export const updateEntityTypeSchema = createEntityTypeSchema
  .omit({
    worldId: true,
    icon: true,
  })
  .partial();

export type EntityFieldInput = z.infer<
  typeof entityFieldSchema
>;

export type EntityCardInput = z.infer<
  typeof entityCardSchema
>;

export type CreateEntityTypeInput = z.infer<
  typeof createEntityTypeSchema
>;

export type CreateEntityInput = z.infer<
  typeof createEntitySchema
>;

export type UpdateEntityTypeInput = z.infer<
  typeof updateEntityTypeSchema
>;

export type UpdateEntityInput = z.infer<
  typeof updateEntitySchema
>;