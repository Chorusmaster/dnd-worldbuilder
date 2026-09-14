"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "./dashboard-context";
import { useState, useTransition } from "react";

type WorldDialogErrors = {
  name?: string;
  description?: string;
  general?: string;
};

type WorldDialogProps = {
  createWorld: (formData: FormData) => Promise<WorldDialogErrors | null>
};

const WorldDialog = ({createWorld}: WorldDialogProps) => {
  const dashboardContext = useDashboard();
  const [errors, setErrors] = useState<WorldDialogErrors>({});
  const [isLoading, startTransition] = useTransition();

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createWorld(formData);

      if (result === null) {
        dashboardContext.setCreateWorldOpen(false);
        return;
      } 

      setErrors({
        name: result.name,
        general: result.general,
      });
    });
  }

  return (
    <Dialog
      open={dashboardContext.createWorldOpen}
      onOpenChange={(value) => {
        dashboardContext.setCreateWorldOpen(value);
        setErrors({});
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new world</DialogTitle>
            <DialogDescription>
              Create a new world to organize your D&D campaign, characters,
              lore, and other content in one place.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="my-4">
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="New World"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.name}
                </p>
              )}
            </Field>
            <Field>
              <Label htmlFor="description-1">Short description</Label>
              <Textarea
                id="description-1"
                name="description"
                placeholder="Tell more about your world"
                className="max-h-56"
                maxLength={500}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.description}
                </p>
              )}
            </Field>
            {errors.general && (
              <p className="text-sm text-destructive" role="alert">
                {errors.general}
              </p>
            )}
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorldDialog;
