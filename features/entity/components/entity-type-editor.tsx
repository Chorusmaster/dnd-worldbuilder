"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateEntityTypeAction } from "../entity.actions";
import { useDashboard } from "@/app/dashboard/dashboard-context";

export enum FieldType {
  TEXT = "text",
  TEXTAREA = "textarea",
  NUMBER = "number",
  BOOLEAN = "boolean",
  IMAGE = "image",
  SELECT = "select",
  REFERENCE = "reference",
  LIST = "list",
}

type EntityField = {
  uiId?: string;
  key: string;
  label: string;
  referenceTypes?: string[] | null;
  options?: string[] | null;
  type: FieldType;
  renderer: string;
  required?: boolean;
};

type EntityCard = {
  uiId?: string;
  key: string;
  label: string;
  fields: EntityField[];
};

type EntityType = {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  cards: EntityCard[];
};

type EntityTypeEditorProps = {
  entityType: EntityType;
};

/**
* These fields are built into every entity.
* They are not part of the entity type configuration.
*/
const defaultFields: EntityField[] = [
  {
    key: "name",
    label: "Name",
    type: FieldType.TEXT,
    renderer: "default",
    required: true,
  },
  {
    key: "description",
    label: "Description",
    type: FieldType.TEXTAREA,
    renderer: "default",
  },
  {
    key: "image",
    label: "Image",
    type: FieldType.IMAGE,
    renderer: "default",
  },
];

const rendererOptions = [
  {
    value: "default",
    label: "Default",
  },
  {
    value: "gallery",
    label: "Gallery",
  },
  {
    value: "race-select",
    label: "Race selector",
  },
  {
    value: "name-picker",
    label: "Name picker",
  },
];

function createUiId() {
  return crypto.randomUUID();
}

function stripUiIds(cards: EntityCard[]): EntityCard[] {
  return cards.map(({ uiId, ...card }) => ({
    ...card,
    fields: card.fields.map(({ uiId, ...field }) => field),
  }));
}

export function EntityTypeEditor({ entityType }: EntityTypeEditorProps) {
  const router = useRouter();
  const { setEntityTypes } = useDashboard();

  const [cards, setCards] = useState<EntityCard[]>(
    entityType.cards.map((card) => ({
      ...card,
      uiId: createUiId(),
      fields: card.fields.map((field) => ({
        ...field,
        uiId: createUiId(),
      })),
    })),
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addCard() {
    setCards((prev) => [
      ...prev,
      {
        uiId: createUiId(),
        key: `card-${prev.length + 1}`,
        label: "New card",
        fields: [],
      },
    ]);
  }

  function updateCard(index: number, updates: Partial<EntityCard>) {
    setCards((prev) =>
      prev.map((card, cardIndex) =>
        cardIndex === index ? { ...card, ...updates } : card,
      ),
    );
  }

  function removeCard(index: number) {
    setCards((prev) => prev.filter((_, cardIndex) => cardIndex !== index));
  }

  function addField(cardIndex: number) {
    setCards((prev) =>
      prev.map((card, index) => {
        if (index !== cardIndex) {
          return card;
        }

        return {
          ...card,
          fields: [
            ...card.fields,
            {
              uiId: createUiId(),
              key: `field-${card.fields.length + 1}`,
              label: "New field",
              type: FieldType.TEXT,
              renderer: "default",
              required: false,
            },
          ],
        };
      }),
    );
  }

  function updateField(
    cardIndex: number,
    fieldIndex: number,
    updates: Partial<EntityField>,
  ) {
    setCards((prev) =>
      prev.map((card, index) => {
        if (index !== cardIndex) {
          return card;
        }

        return {
          ...card,
          fields: card.fields.map((field, currentFieldIndex) =>
            currentFieldIndex === fieldIndex ? { ...field, ...updates } : field,
          ),
        };
      }),
    );
  }

  function removeField(cardIndex: number, fieldIndex: number) {
    setCards((prev) =>
      prev.map((card, index) => {
        if (index !== cardIndex) {
          return card;
        }

        return {
          ...card,
          fields: card.fields.filter(
            (_, currentFieldIndex) => currentFieldIndex !== fieldIndex,
          ),
        };
      }),
    );
  }

  async function save() {
    setIsSaving(true);
    setError(null);

    try {
      const updatedEntityType = await updateEntityTypeAction(entityType._id, {
        cards: stripUiIds(cards),
      });

      setEntityTypes((current) =>
        current.map((currentEntityType) =>
          currentEntityType._id === updatedEntityType._id
            ? updatedEntityType
            : currentEntityType,
        ),
      );

      router.push(`/dashboard/${updatedEntityType.slug}`);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save entity type.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      {" "}
      <Card>
        {" "}
        <CardHeader>
          {" "}
          <CardTitle>Default fields</CardTitle>
          <p className="text-sm text-muted-foreground">
            Every entity automatically contains these fields.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {defaultFields.map((field) => (
            <div
              key={field.key}
              className="grid grid-cols-[1fr_160px] items-center gap-4 rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{field.label}</p>

                <p className="text-sm text-muted-foreground">
                  {field.key}
                  {field.required && " · required"}
                </p>
              </div>

              <div className="text-end text-sm text-muted-foreground">
                {field.type}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Cards</h2>

          <p className="text-sm text-muted-foreground">
            Organize fields into separate cards.
          </p>
        </div>

        <Button type="button" variant="outline" onClick={addCard}>
          <Plus />
          Add card
        </Button>
      </div>
      {cards.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No cards yet.
        </div>
      ) : (
        cards.map((card, cardIndex) => (
          <Card key={card.uiId}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="grid flex-1 grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label</Label>

                    <Input
                      value={card.label}
                      onChange={(event) =>
                        updateCard(cardIndex, {
                          label: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Key</Label>

                    <Input
                      value={card.key}
                      onChange={(event) =>
                        updateCard(cardIndex, {
                          key: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCard(cardIndex)}
                >
                  <Trash2 />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {card.fields.length === 0 && (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No fields yet.
                </div>
              )}

              {card.fields.map((field, fieldIndex) => (
                <div
                  key={field.uiId}
                  className="grid gap-4 rounded-lg border p-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Label</Label>

                      <Input
                        value={field.label}
                        onChange={(event) =>
                          updateField(cardIndex, fieldIndex, {
                            label: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Key</Label>

                      <Input
                        value={field.key}
                        onChange={(event) =>
                          updateField(cardIndex, fieldIndex, {
                            key: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Field type</Label>

                      <select
                        className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                        value={field.type}
                        onChange={(event) =>
                          updateField(cardIndex, fieldIndex, {
                            type: event.target.value as FieldType,
                          })
                        }
                      >
                        {Object.values(FieldType).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Renderer</Label>

                      <select
                        className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                        value={field.renderer}
                        onChange={(event) =>
                          updateField(cardIndex, fieldIndex, {
                            renderer: event.target.value,
                          })
                        }
                      >
                        {rendererOptions.map((renderer) => (
                          <option key={renderer.value} value={renderer.value}>
                            {renderer.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {field.type === FieldType.REFERENCE && (
                    <div className="space-y-2">
                      <Label>Reference types</Label>

                      <Input
                        placeholder="character, monster, location"
                        value={field.referenceTypes?.join(", ") ?? ""}
                        onChange={(event) => {
                          const referenceTypes = event.target.value
                            .split(",")
                            .map((value) => value.trim())
                            .filter(Boolean);

                          updateField(cardIndex, fieldIndex, {
                            referenceTypes,
                          });
                        }}
                      />

                      <p className="text-xs text-muted-foreground">
                        Comma-separated entity type keys.
                      </p>
                    </div>
                  )}

                  {field.type === FieldType.SELECT && (
                    <div className="space-y-2">
                      <Label>Select options</Label>

                      <Input
                        placeholder="Option one, Option two, Option three"
                        value={field.options?.join(", ") ?? ""}
                        onChange={(event) => {
                          const options = event.target.value
                            .split(",")
                            .map((value) => value.trim())
                            .filter(Boolean);

                          updateField(cardIndex, fieldIndex, { options });
                        }}
                      />

                      <p className="text-xs text-muted-foreground">
                        Comma-separated values shown in the select.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(cardIndex, fieldIndex)}
                    >
                      <Trash2 />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => addField(cardIndex)}
              >
                <Plus />
                Add field
              </Button>
            </CardContent>
          </Card>
        ))
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={() => router.push(`/dashboard/${entityType.slug}`)}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
