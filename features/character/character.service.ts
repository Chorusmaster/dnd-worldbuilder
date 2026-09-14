import { connectDB } from "@/lib/mongodb";

import {
  createCharacter as createCharacterDB,
  findCharacterById,
  findCharactersByOwner,
  findCharactersByWorld,
  updateCharacter as updateCharacterDB,
  deleteCharacter as deleteCharacterDB,
} from "./character.repository";

import {
  createCharacterSchema,
  updateCharacterSchema,
} from "./character.schema";

export async function createCharacter(
  input: unknown,
  worldId?: string,
  ownerId?: string,
) {
  if (!ownerId && !worldId) {
    throw new Error("Character must belong to a user or a world");
  }

  await connectDB();

  const data = createCharacterSchema.parse(input);

  return createCharacterDB({
    ...data,
    ...(ownerId ? { owner: ownerId } : {}),
    ...(worldId ? { world: worldId } : {}),
  });
}

export async function getCharacter(id: string) {
  await connectDB();

  return findCharacterById(id);
}

export async function getCharacters(ownerId: string) {
  await connectDB();

  return findCharactersByOwner(ownerId);
}

export async function getCharactersByWorld(worldId: string) {
  await connectDB();

  return findCharactersByWorld(worldId);
}

export async function updateCharacter(
  id: string,
  input: unknown,
  ownerId: string,
) {
  await connectDB();

  const data = updateCharacterSchema.parse(input);

  const character = await findCharacterById(id);

  if (!character) {
    return null;
  }

  if (character.owner?._id.toString() !== ownerId) {
    throw new Error("Forbidden");
  }

  return updateCharacterDB(id, data);
}

export async function deleteCharacter(id: string, ownerId: string) {
  await connectDB();

  const character = await findCharacterById(id);

  if (!character) {
    return null;
  }

  if (character.owner?._id.toString() !== ownerId) {
    throw new Error("Forbidden");
  }

  return deleteCharacterDB(id);
}
