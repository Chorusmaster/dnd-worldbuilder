import { Character } from "@/models/Character";
import type {
  CreateCharacterInput,
  UpdateCharacterInput,
} from "./character.schema";
import { HydratedDocument } from "mongoose";

export type PublicCharacterRecord = Omit<
  Character,
  "_id" | "owner" | "world"
> & {
  _id: string;
  world?: string;
  owner?: string;
};

export function toPublicCharacterRecord(
  character: HydratedDocument<Character>,
): PublicCharacterRecord {
  const data = character.toObject();

  return {
    ...data,
    _id: data._id.toString(),
    world: data.world?.toString(),
    owner: data.owner?.toString(),
  };
}

export async function createCharacter(
  data: CreateCharacterInput & { owner?: string; world?: string },
) {
  const character = await Character.create(data);

  return toPublicCharacterRecord(character);
}

export async function findCharacterById(id: string) {
  return Character.findById(id);
}

export async function findCharactersByOwner(ownerId: string) {
  return Character.find({ owner: ownerId }).sort({
    createdAt: -1,
  });
}

export async function findCharactersByWorld(worldId: string) {
  const characters = await Character.find({ world: worldId }).sort({
    createdAt: -1,
  });

  return characters.map(toPublicCharacterRecord);
}

export async function updateCharacter(
  id: string,
  data: UpdateCharacterInput & { owner?: string; world?: string },
) {
  return Character.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteCharacter(id: string) {
  return Character.findByIdAndDelete(id);
}
