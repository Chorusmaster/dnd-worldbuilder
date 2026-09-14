"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageInput } from "@/components/ui/image-input";

import {
  updateEntityAction,
  deleteEntityAction,
} from "@/features/entity/entity.actions";

type ClientEntityRecord = {
  _id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  data: Record<string, unknown>;
};

export type EntityField = {
  key: string;
  label: string;
  referenceTypes?: string[] | null;
  options?: string[] | null;
  type: FieldType;
  renderer: string;
  required?: boolean;
};

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

type EntityViewerProps = {
  initialEntity: ClientEntityRecord;
  fields: EntityField[];
  slug: string;
};

interface EditableFieldProps {
  label: string;
  value: unknown;
  fieldType: FieldType;
  onSave: (value: unknown) => Promise<void>;
  required?: boolean;
  options?: string[] | null;
}

function EditableField({
  label,
  value,
  fieldType,
  onSave,
  required = false,
  options = [],
}: EditableFieldProps) {
  const displayValue =
    value === undefined || value === null || value === "" ? "" : String(value);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayValue);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (required && !draft.trim()) return;

    let parsedValue: unknown = draft;

    if (fieldType === FieldType.NUMBER) {
      parsedValue = draft === "" ? undefined : Number(draft);
    }

    if (fieldType === FieldType.BOOLEAN) {
      parsedValue = draft === "true";
    }

    setSaving(true);

    try {
      await onSave(parsedValue);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setDraft(displayValue);
    setEditing(false);
  }

  return (
    <div className="group space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </label>

        {!editing && (
          <button
            type="button"
            onClick={() => {
              setDraft(displayValue);
              setEditing(true);
            }}
            className="opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="size-3.5" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          {fieldType === FieldType.TEXTAREA ? (
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              rows={4}
              className="resize-none"
            />
          ) : fieldType === FieldType.SELECT ? (
            <select
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              autoFocus
            >
              <option value="">Select...</option>
              {(options ?? []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : fieldType === FieldType.BOOLEAN ? (
            <select
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : (
            <Input
              type={fieldType === FieldType.NUMBER ? "number" : "text"}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
          )}

          <div className="flex gap-1.5">
            <Button
              size="sm"
              className="h-7 px-2.5"
              disabled={saving || (required && !draft.trim())}
              onClick={handleSave}
            >
              {saving ? "Saving…" : "Save"}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2.5"
              disabled={saving}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="min-h-6">
          {displayValue || (
            <span className="italic text-muted-foreground">—</span>
          )}
        </p>
      )}
    </div>
  );
}

function DeleteButton({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Delete this entity?
        </span>

        <Button
          size="sm"
          variant="destructive"
          className="h-8"
          disabled={deleting}
          onClick={handleDelete}
        >
          {deleting ? "Deleting…" : "Yes, delete"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="h-8"
          disabled={deleting}
          onClick={() => setConfirming(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
      onClick={() => setConfirming(true)}
    >
      <Trash2 className="mr-1.5 size-3.5" />
      Delete entity
    </Button>
  );
}

export function EntityViewer({
  initialEntity,
  fields,
  slug,
}: EntityViewerProps) {
  const router = useRouter();

  const [entity, setEntity] = useState(initialEntity);
  const [image, setImage] = useState(entity.image ?? "");
  const [savingImage, setSavingImage] = useState(false);

  async function updateField(key: string, value: unknown) {
    const nextData = {
      ...entity.data,
      [key]: value,
    };

    await updateEntityAction(entity._id, {
      data: nextData,
    });

    setEntity((prev) => ({
      ...prev,
      data: nextData,
    }));
  }

  async function updateBasicField(
    field: "name" | "description",
    value: string,
  ) {
    await updateEntityAction(entity._id, {
      [field]: value,
    });

    setEntity((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleImageChange(value: string) {
    setImage(value);
    setSavingImage(true);

    try {
      await updateEntityAction(entity._id, {
        image: value,
      });

      setEntity((prev) => ({
        ...prev,
        image: value,
      }));
    } finally {
      setSavingImage(false);
    }
  }

  async function handleDelete() {
    await deleteEntityAction(entity._id);
    router.push(`/dashboard/${slug}`);
  }

  return (
    <div className="space-y-4 w-full h-full xl:px-32">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{entity.name}</h1>
      </div>

      {/* Editor + Preview */}
      <div className="flex flex-col gap-4">
        {/* Basic info */}
        <Card>
          <CardContent className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-4">
                <CardTitle className="text-base">Basic info</CardTitle>

                <EditableField
                  label="Name"
                  value={entity.name}
                  fieldType={FieldType.TEXT}
                  required
                  onSave={(value) => updateBasicField("name", String(value))}
                />

                <EditableField
                  label="Description"
                  value={entity.description ?? ""}
                  fieldType={FieldType.TEXTAREA}
                  onSave={(value) =>
                    updateBasicField("description", String(value))
                  }
                />
              </div>

              <div className="relative shrink-0">
                <ImageInput
                  accept="image/*"
                  className="size-40"
                  value={image}
                  onChange={handleImageChange}
                />

                {savingImage && (
                  <span className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted-foreground">
                    Saving…
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic fields */}
        {fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fields</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <EditableField
                    key={field.key}
                    label={field.label}
                    value={entity.data?.[field.key]}
                    fieldType={field.type}
                    required={field.required}
                    options={field.options}
                    onSave={(value) => updateField(field.key, value)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="flex w-full items-center justify-between">
        <DeleteButton onConfirm={handleDelete} />

        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/${slug}`)}
        >
          Back to list
        </Button>
      </div>
    </div>
  );
}
