import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function getUserById(id: string) {
  await connectDB();

  return User.findById(id);
}

export async function getUserByUsername(username: string) {
  await connectDB();

  return User.findOne({username});
}

export async function createUser(data: {
  username: string;
  passwordHash: string;
}) {
  return User.create(data);
}