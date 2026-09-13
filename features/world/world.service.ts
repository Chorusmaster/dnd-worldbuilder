import { createWorldSchema } from "./world.schema";
import { 
  createWorld as createWorldDB,
  deleteWorld as deleteWorldDB,
  getWorldById,
  getWorldsByUserId
 } from "./world.repository";
import { headers } from "next/headers";

export async function createWorld(input: unknown) {
  const data = createWorldSchema.parse(input);

  const userId = (await headers()).get("x-user-id");
  if(!userId) {
    throw new Error("Unauthorized");
  }

  return await createWorldDB({...data, owner: userId});
}

export async function getUserWorlds(userId: string) {
  return await getWorldsByUserId(userId);
}

export async function deleteWorld(id: string) {
  const userId = (await headers()).get("x-user-id");
  if(!userId) {
    throw new Error("Unauthorized");
  }

  const world = await getWorldById(id);
  if (!world) {
    throw new Error("This world doesn't exist");
  }

  if (userId !== world.owner) {
    throw new Error("You are not owner of this world");
  }

  await deleteWorldDB(id);
}