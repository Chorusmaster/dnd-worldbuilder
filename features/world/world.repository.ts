import { World } from "@/models/World";
import { connectDB } from "@/lib/mongodb";

export type PublicWorldRecord = {
  _id: string;
  name: string;
  owner: string;
  image?: string | null;
};

function toPublicWorldRecord(world: {
  _id: string;
  name: string;
  owner: string;
  image?: string;
}): PublicWorldRecord {
  return {
    _id: world._id.toString(),
    name: world.name,
    owner: world.owner.toString(),
    ...(world.image ? { image: world.image } : {}),
  };
}

export async function createWorld(data: { name: string; owner: string }) {
  await connectDB();

  return toPublicWorldRecord(await World.create(data));
}

export async function getWorldsByUserId(userId: string) {
  await connectDB();

  const worlds = await World.find({ owner: userId });
  const worldsProcessed = worlds.map((world) => toPublicWorldRecord(world));

  return worldsProcessed;
}

export async function getWorldById(id: string) {
  await connectDB();

  const world = await World.findById(id);

  return toPublicWorldRecord(world);
}

export async function deleteWorld(id: string) {
  await connectDB();

  await World.deleteOne({ _id: id });
}
