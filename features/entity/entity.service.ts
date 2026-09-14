import { HydratedDocument } from "mongoose";

import { Entity } from "@/models/Entity";
import { EntityType } from "@/models/EntityType";

import {
  CreateEntityInput,
  UpdateEntityInput,
  CreateEntityTypeInput,
  UpdateEntityTypeInput,
  EntityFieldInput,
  EntityCardInput,
} from "./entity.schema";

import {
  createEntity as createEntityRepository,
  updateEntity as updateEntityRepository,
  getEntities as getEntitiesRepository,
  getEntityById as getEntityByIdRepository,
  deleteEntity as deleteEntityRepository,

  createEntityType as createEntityTypeRepository,
  updateEntityType as updateEntityTypeRepository,
  getEntityTypes as getEntityTypesRepository,
  getEntityTypeById as getEntityTypeByIdRepository,
  deleteEntityType as deleteEntityTypeRepository,
} from "./entity.repository";

export type PublicEntityRecord =
  Omit<Entity, "worldId" | "typeId" | "createdBy"> & {
    _id: string;
    worldId: string;
    typeId: string;
    createdBy: string;
  };

export type PublicEntityTypeRecord =
  Omit<EntityType, "worldId"> & {
    _id: string;
    worldId: string;
  };

function toPublicEntityRecord(
  entity: HydratedDocument<Entity>,
): PublicEntityRecord {
  const object = entity.toObject();

  return {
    ...object,
    _id: entity._id.toString(),
    worldId: entity.worldId.toString(),
    typeId: entity.typeId.toString(),
    createdBy: entity.createdBy.toString(),
  };
}

function toPublicEntityTypeRecord(
  entityType: HydratedDocument<EntityType>,
): PublicEntityTypeRecord {
  const object = entityType.toObject();

  return {
    ...object,
    _id: entityType._id.toString(),
    worldId: entityType.worldId.toString(),
  };
}

// Entity

export async function createEntity(
  data: CreateEntityInput,
) {
  const entity = await createEntityRepository(data);

  return toPublicEntityRecord(entity);
}

export async function updateEntity(
  id: string,
  data: UpdateEntityInput,
) {
  const entity = await updateEntityRepository(id, data);

  if (!entity) {
    throw new Error("Entity not found");
  }

  return toPublicEntityRecord(entity);
}

export async function getEntities(
  userId: string,
  worldId: string,
) {
  const entities = await getEntitiesRepository({
    userId,
    worldId,
  });

  return entities.map(toPublicEntityRecord);
}

export async function getEntityById(id: string) {
  const entity = await getEntityByIdRepository(id);

  if (!entity) {
    throw new Error("Entity not found");
  }

  return toPublicEntityRecord(entity);
}

export async function deleteEntity(id: string) {
  const result = await deleteEntityRepository(id);

  if (result.deletedCount === 0) {
    throw new Error("Entity not found");
  }
}

// EntityType

export async function createEntityType(
  data: CreateEntityTypeInput,
) {
  const entityType = await createEntityTypeRepository(data);

  return toPublicEntityTypeRecord(entityType);
}

export async function updateEntityType(
  id: string,
  data: UpdateEntityTypeInput,
) {
  const entityType = await updateEntityTypeRepository(
    id,
    data,
  );

  if (!entityType) {
    throw new Error("Entity type not found");
  }

  return toPublicEntityTypeRecord(entityType);
}

export async function getEntityTypes(worldId: string) {
  const entityTypes =
    await getEntityTypesRepository(worldId);

  return entityTypes.map(toPublicEntityTypeRecord);
}

export async function getEntityTypeById(id: string) {
  const entityType =
    await getEntityTypeByIdRepository(id);

  if (!entityType) {
    throw new Error("Entity type not found");
  }

  return toPublicEntityTypeRecord(entityType);
}

export async function deleteEntityType(id: string) {
  const result = await deleteEntityTypeRepository(id);

  if (result.deletedCount === 0) {
    throw new Error("Entity type not found");
  }
}