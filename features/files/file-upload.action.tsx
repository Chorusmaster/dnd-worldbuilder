"use server";

import { mkdir, writeFile } from "fs/promises";
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