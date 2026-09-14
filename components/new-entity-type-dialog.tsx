"use client";

import { useState } from "react";

import { Check, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { entityIcons } from "@/features/entity/entity.icons";
import { Label } from "./ui/label";
import { Field, FieldLabel } from "./ui/field";

type Props = {
  onSubmit: (data: {name: string, slug: string, icon: keyof typeof entityIcons}) => void;
}

export function NewEntityTypeDialog({onSubmit}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState<keyof typeof entityIcons>("Circle");

  const handleSubmit = () => {
    onSubmit({name, slug, icon});
    setName("");
    setSlug("");
    setIcon("Circle");
    setOpen(false);
  }

  return (
    <>
      <SidebarMenuItem className="w-full">
        <SidebarMenuButton onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          New type
        </SidebarMenuButton>
      </SidebarMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New entity type</DialogTitle>
            <DialogDescription>
              Add new type of entity to your world
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Characters"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input
                id="slug"
                name="slug"
                type="text"
                placeholder="characters"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
            </Field>

            <div>
              <p className="mb-2 text-sm font-medium">
                Icon
              </p>

              <div className="grid grid-cols-6 gap-2">
                {Object.entries(entityIcons).map(
                  ([name, Icon]) => {
                    const isSelected = icon === name;

                    return (
                      <button
                        key={name}
                        type="button"
                        title={name}
                        onClick={() =>
                          setIcon(
                            name as keyof typeof entityIcons,
                          )
                        }
                        className={`relative flex aspect-square items-center justify-center rounded-md border transition-colors hover:bg-accent ${
                          isSelected
                            ? "border-primary bg-accent"
                            : "border-border"
                        }`}
                      >
                        <Icon className="size-5" />

                        {isSelected && (
                          <Check className="absolute right-1 top-1 size-3" />
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={!name.trim()}
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}