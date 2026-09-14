import mongoose, { Schema, InferSchemaType } from "mongoose";

const WorldSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    required: false
  }
});

export const World =
  mongoose.models.World || mongoose.model("World", WorldSchema);

export type World = InferSchemaType<typeof WorldSchema>;