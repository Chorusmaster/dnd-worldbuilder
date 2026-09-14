import { connectDB } from "@/lib/mongodb";

import { Entity } from "@/models/Entity";
import { EntityType } from "@/models/EntityType";

import {
  CreateEntityInput,
  UpdateEntityInput,
  CreateEntityTypeInput,
  UpdateEntityTypeInput,
} from "./entity.schema";

// Entity

export async function createEntity(data: CreateEntityInput) {
  await connectDB();

  return Entity.create(data);
}

export async function updateEntity(
  id: string,
  data: UpdateEntityInput,
) {
  await connectDB();

  return Entity.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    },
  );
}

export async function getEntities({
  userId,
  worldId,
}: {
  userId: string;
  worldId: string;
}) {
  await connectDB();

  return Entity.find({
    createdBy: userId,
    worldId,
  });
}

export async function getEntityById(id: string) {
  await connectDB();

  return Entity.findById(id);
}

export async function deleteEntity(id: string) {
  await connectDB();

  return Entity.deleteOne({
    _id: id,
  });
}

// EntityType

export async function createEntityType(
  data: CreateEntityTypeInput,
) {
  await connectDB();

  return EntityType.create(data);
}

export async function updateEntityType(
  id: string,
  data: UpdateEntityTypeInput,
) {
  await connectDB();

  return EntityType.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    },
  );
}

export async function getEntityTypes(worldId: string) {
  await connectDB();

  return EntityType.find({
    worldId,
  });
}

export async function getEntityTypeById(id: string) {
  await connectDB();

  return EntityType.findById(id);
}

export async function deleteEntityType(id: string) {
  await connectDB();

  return EntityType.deleteOne({
    _id: id,
  });
}