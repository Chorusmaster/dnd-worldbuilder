import mongoose, { Schema, InferSchemaType } from "mongoose";

const UserSchema = new Schema({
  nickname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false
  }
});

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

export type User = InferSchemaType<typeof UserSchema>;