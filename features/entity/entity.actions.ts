"use server";

import { headers } from "next/headers";

import {
  createEntitySchema,
  updateEntitySchema,
  createEntityTypeSchema,
  updateEntityTypeSchema,
} from "./entity.schema";

import {
  createEntity,
  updateEntity,
  getEntities,
  getEntityById,
  deleteEntity,
  createEntityType,
  updateEntityType,
  getEntityTypes,
  getEntityTypeById,
  deleteEntityType,
  PublicEntityRecord,
} from "./entity.service";
import { UserShieldIcon } from "lucide-react";

import { deleteImageAction } from "../files/file-upload.action";

import { FieldType } from "@/models/EntityType";

// Entity

export async function deleteEntityImagesAction(entity: PublicEntityRecord) {
  const entityType = await getEntityTypeById(entity.typeId);

  if (entity.image) await deleteImageAction(entity.image);

  const imageKeys = entityType.cards.flatMap((card) =>
    card.fields
      .filter((field) => field.type === FieldType.IMAGE)
      .map((field) => field.key),
  );

  for (const key of imageKeys) {
    const value = entity.data?.[key];

    if (typeof value === "string" && value) {
      await deleteImageAction(value);
    }
  }
}

export async function createEntityAction(input: unknown) {
  const userId = (await headers()).get("x-user-id");

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const extendedInput = {
    ...(typeof input === "object" && input !== null ? input : {}),
    createdBy: userId,
  };

  const data = createEntitySchema.parse(extendedInput);

  return createEntity(data);
}

export async function updateEntityAction(id: string, input: unknown) {
  const userId = (await headers()).get("x-user-id");

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const data = updateEntitySchema.parse(input);
  const entity = await getEntityById(id);

  if (entity.createdBy !== userId) {
    throw new Error("Forbidden");
  }

  return updateEntity(id, data);
}

export async function getEntitiesAction(
  worldId: string,
  entityTypeId?: string,
) {
  const userId = (await headers()).get("x-user-id");

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return getEntities(userId, worldId, entityTypeId);
}

export async function getEntityByIdAction(id: string) {
  const userId = (await headers()).get("x-user-id");

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const entity = await getEntityById(id);

  if (entity.createdBy !== userId && entity.visibility === "private") {
    throw new Error("Forbidden");
  }

  return entity;
}

export async function deleteEntityAction(id: string) {
  const userId = (await headers()).get("x-user-id");

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const entity = await getEntityById(id);
  await deleteEntityImagesAction(entity);

  if (entity.createdBy !== userId) {
    throw new Error("Forbidden");
  }

  await deleteEntity(id);
}

// EntityType

export async function createEntityTypeAction(input: unknown) {
  const userId = (await headers()).get("x-user-id");

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const data = createEntityTypeSchema.parse(input);

  return createEntityType(data);
}

export async function updateEntityTypeAction(id: string, input: unknown) {
  const userId = (await headers()).get("x-user-id");

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const data = updateEntityTypeSchema.parse(input);
  const entityType = await getEntityTypeById(id);

  // TODO: check ownership

  return updateEntityType(entityType._id, data);
}

export async function getEntityTypesAction(worldId: string) {
  const userId = (await headers()).get("x-user-id");

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return getEntityTypes(worldId);
}

export async function getEntityTypeByIdAction(id: string) {
  const userId = (await headers()).get("x-user-id");

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return getEntityTypeById(id);
}

export async function deleteEntityTypeAction(id: string) {
  const userId = (await headers()).get("x-user-id");

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const entityType = await getEntityTypeById(id);
  const linkedEntities = await getEntitiesAction(
    entityType.worldId,
    entityType._id,
  );

  for (const entity of linkedEntities ?? []) {
    await deleteEntityImagesAction(entity);
    await deleteEntity(entity._id);
  }

  await deleteEntityType(id);
}
