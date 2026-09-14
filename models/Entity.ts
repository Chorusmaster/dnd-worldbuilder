import { InferSchemaType, Schema, model, models } from "mongoose";

const entitySchema = new Schema(
  {
    worldId: {
      type: Schema.Types.ObjectId,
      ref: "World",
      required: true,
    },

    typeId: {
      type: Schema.Types.ObjectId,
      ref: "EntityType",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,
    image: String,

    data: {
      type: Schema.Types.Mixed,
      default: {},
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    visibility: {
      type: String,
      enum: ["private", "world", "public"],
      default: "private",
    },

    notes: String,
  },
  {
    timestamps: true,
  },
);

export const Entity = models.Entity || model("Entity", entitySchema);
export type Entity = InferSchemaType<typeof entitySchema>;