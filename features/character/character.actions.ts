"use server";

import { headers } from "next/headers";

import {
  createCharacter as createCharacterService,
  updateCharacter as updateCharacterService,
  deleteCharacter as deleteCharacterService,
  getCharactersByWorld as getCharactersByWorldService,
} from "./character.service";

async function getOwnerId() {
  const userId = (await headers()).get("x-user-id");

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export async function createCharacterAction(
  data: unknown,
  options?: {
    worldId?: string;
    withOwnership?: boolean;
  },
) {
  const ownerId =
    options?.withOwnership !== false ? await getOwnerId() : undefined;

  return createCharacterService(data, options?.worldId, ownerId);
}

export async function updateCharacterAction(id: string, input: unknown) {
  const ownerId = await getOwnerId();

  return updateCharacterService(id, input, ownerId);
}

export async function deleteCharacterAction(id: string) {
  const ownerId = await getOwnerId();

  return deleteCharacterService(id, ownerId);
}

export async function getCharactersByWorldAction(worldId: string) {
  await getOwnerId();

  return getCharactersByWorldService(worldId);
}
