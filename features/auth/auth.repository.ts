import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Types } from "mongoose";

export type PublicUserRecord = {
  _id: string;
  nickname: string;
  username: string;
  avatar?: string;
};

function toPublicUserRecord(user: {
  _id: Types.ObjectId;
  nickname: string;
  username: string;
  avatar?: string | null;
}): PublicUserRecord {
  return {
    _id: user._id.toString(),
    nickname: user.nickname,
    username: user.username,
    ...(user.avatar ? { avatar: user.avatar } : {}),
  };
}

export async function getUserById(id: string) {
  await connectDB();

  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const user = await User.findById(new Types.ObjectId(id)).lean();

  return user ? toPublicUserRecord(user) : null;
}

export async function getUserByUsername(username: string) {
  await connectDB();

  return User.findOne({ username });
}

export async function createUser(data: {
  nickname: string;
  username: string;
  passwordHash: string;
}) {
  return User.create(data);
}