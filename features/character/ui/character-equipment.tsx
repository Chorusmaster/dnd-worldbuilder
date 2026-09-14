import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

type EquipmentItem = {
  name: string;
  quantity: number;
  description: string;
};

type EquipmentProps = {
  value: EquipmentItem[];
  onChange: (value: EquipmentItem[]) => void;
};

export function CharacterEquipment({
  value,
  onChange,
}: EquipmentProps) {
  const addItem = () => {
    onChange([
      ...value,
      {
        name: "",
        quantity: 1,
        description: "",
      },
    ]);
  };

  const updateItem = (
    index: number,
    field: keyof EquipmentItem,
    fieldValue: string | number
  ) => {
    onChange(
      value.map((item, i) =>
        i === index
          ? { ...item, [field]: fieldValue }
          : item
      )
    );
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Equipment</CardTitle>

        <Button variant="outline" onClick={addItem} size="sm">
          <Plus />
          Add item
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {value.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No equipment added yet.
          </p>
        ) : (
          value.map((item, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_100px_auto]"
            >
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      updateItem(index, "name", e.target.value)
                    }
                    placeholder="Longsword"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    value={item.description}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="A versatile melee weapon..."
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Quantity
                </label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "quantity",
                      Math.max(1, Number(e.target.value))
                    )
                  }
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="self-start"
                onClick={() => removeItem(index)}
              >
                <Trash2 />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}