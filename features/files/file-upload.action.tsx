"use server";

import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

export async function uploadImageAction(
  file: File,
) {
  if (!(file instanceof File)) {
    throw new Error("No file provided");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  const uploadDir = path.join(process.cwd(), "public/uploads");

  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${crypto.randomUUID()}-${file.name}`;
  const filepath = path.join(
    uploadDir,
    filename,
  );

  await writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}

export async function deleteImageAction(url?: string) {
  if (!url) return;

  const pathname = url.startsWith("http")
    ? new URL(url).pathname
    : url;

  const filePath = path.join(process.cwd(), "public", pathname);

  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}