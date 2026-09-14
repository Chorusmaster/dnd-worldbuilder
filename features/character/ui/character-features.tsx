"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export type Feature = {
  name: string;
  description: string;
  source: string;
};

type FeaturesProps = {
  value: Feature[];
  onChange: (value: Feature[]) => void;
};

const emptyFeature: Feature = {
  name: "",
  description: "",
  source: "",
};

export function CharacterFeatures({ value, onChange }: FeaturesProps) {
  const addFeature = () => {
    onChange([...value, { ...emptyFeature }]);
  };

  const updateFeature = (
    index: number,
    field: keyof Feature,
    fieldValue: string,
  ) => {
    const updated = [...value];

    updated[index] = {
      ...updated[index],
      [field]: fieldValue,
    };

    onChange(updated);
  };

  const removeFeature = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Features</CardTitle>

        <Button type="button" variant="outline" size="sm" onClick={addFeature}>
          <Plus />
          Add feature
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {value.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No features added yet.
          </p>
        ) : (
          value.map((feature, index) => (
            <div
              key={index}
              className="space-y-4 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  Feature {index + 1}
                </h3>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 />
                </Button>
              </div>

              <Input
                placeholder="Feature name"
                value={feature.name}
                onChange={(e) =>
                  updateFeature(index, "name", e.target.value)
                }
              />

              <Textarea
                placeholder="Description"
                value={feature.description}
                onChange={(e) =>
                  updateFeature(index, "description", e.target.value)
                }
              />

              <Input
                placeholder="Source"
                value={feature.source}
                onChange={(e) =>
                  updateFeature(index, "source", e.target.value)
                }
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}