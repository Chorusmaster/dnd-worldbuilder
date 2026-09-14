import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

const SECRET = new TextEncoder().encode(jwtSecret);

const TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 7;

export async function createToken(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRATION_TIME}s`)
    .sign(SECRET);

  const cookieStore = await cookies();

  cookieStore.set("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_EXPIRATION_TIME,
  });
}

export async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);

    if (!payload.sub) {
      return null;
    }

    return payload.sub;
  } catch(error) {
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
}