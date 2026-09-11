import { authSchema } from "./auth.schema";
import { createUser, getUserByUsername } from "./auth.repository";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/auth";

export async function registerUser(input: unknown) {
  const data = authSchema.parse(input);

  await connectDB();

  const existingUser = await getUserByUsername(data.username);

  if (existingUser) {
    throw new Error("This username was already taken");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await createUser({
    username: data.username,
    passwordHash,
  });

  await createToken(user._id);
}

export async function loginUser(input: unknown) {
  const data = authSchema.parse(input);

  await connectDB();

  const user = await getUserByUsername(data.username);

  if (!user) {
    throw new Error("User with this username does not exist");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  await createToken(user._id);
}