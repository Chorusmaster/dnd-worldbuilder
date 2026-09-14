"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/app/dashboard/dashboard-context";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { createEntityAction } from "@/features/entity/entity.actions";

type CreateEntityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityTypeId: string;
  entityTypeSlug: string;
};

export function CreateEntityDialog({
  open,
  onOpenChange,
  entityTypeId,
  entityTypeSlug,
}: CreateEntityDialogProps) {
  const router = useRouter();
  const dashboard = useDashboard();

  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    if (!dashboard.activeWorld?._id) {
      setError("No world is active.");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const entity = await createEntityAction({
        typeId: entityTypeId.toString(),
        name: trimmedName,
        worldId: dashboard.activeWorld._id.toString()
      });

      onOpenChange(false);
      setName("");

      router.push(`/dashboard/${entityTypeSlug}/${entity._id}`);
      router.refresh();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create entity.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  function handleOpenChange(value: boolean) {
    if (isCreating) return;

    onOpenChange(value);

    if (!value) {
      setName("");
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create entity</DialogTitle>
          <DialogDescription>Give your new entity a name.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="entity-name">Name</Label>

          <Input
            id="entity-name"
            placeholder="Enter name..."
            value={name}
            autoFocus
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleCreate();
              }
            }}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isCreating}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isCreating}
            onClick={() => void handleCreate()}
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
