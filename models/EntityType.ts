import { InferSchemaType, Schema, model, models } from "mongoose";

export enum FieldType {
  TEXT = "text",
  TEXTAREA = "textarea",
  NUMBER = "number",
  BOOLEAN = "boolean",
  IMAGE = "image",
  SELECT = "select",
  REFERENCE = "reference",
  LIST = "list",
}

export type EntityField = {
  key: string;
  label: string;
  referenceTypes?: string[] | null;
  options?: string[] | null;
  type: FieldType;
  renderer: string;
  required?: boolean;
};

export type EntityCard = {
  key: string;
  label: string;
  fields: EntityField[];
};

const entityFieldSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    referenceTypes: {
      type: [String],
      default: undefined,
    },

    options: {
      type: [String],
      default: undefined,
    },

    type: {
      type: String,
      enum: Object.values(FieldType),
      required: true,
    },

    renderer: {
      type: String,
      required: true,
    },

    required: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const entityCardSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    fields: {
      type: [entityFieldSchema],
      default: [],
    },
  },
  { _id: false },
);

const entityTypeSchema = new Schema(
  {
    worldId: {
      type: Schema.Types.ObjectId,
      ref: "World",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "Circle",
    },

    cards: {
      type: [entityCardSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const EntityType =
  models.EntityType || model("EntityType", entityTypeSchema);

export type EntityType = InferSchemaType<typeof entityTypeSchema>;