import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

export type Attack = {
  name: string;
  attackBonus?: number;
  damage: string;
  damageType: string;
  notes: string;
};

type AttacksProps = {
  value: Attack[];
  onChange: (value: Attack[]) => void;
};

export function CharacterAttacks({
  value,
  onChange,
}: AttacksProps) {
  const addAttack = () => {
    onChange([
      ...value,
      {
        name: "",
        attackBonus: 0,
        damage: "",
        damageType: "",
        notes: "",
      },
    ]);
  };

  const updateAttack = (
    index: number,
    field: keyof Attack,
    fieldValue: string | number
  ) => {
    onChange(
      value.map((attack, i) =>
        i === index
          ? { ...attack, [field]: fieldValue }
          : attack
      )
    );
  };

  const removeAttack = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Attacks</CardTitle>

        <Button onClick={addAttack} size="sm">
          <Plus />
          Add attack
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {value.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No attacks added yet.
          </p>
        ) : (
          value.map((attack, index) => (
            <div
              key={index}
              className="space-y-4 rounded-lg border p-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    value={attack.name}
                    onChange={(e) =>
                      updateAttack(index, "name", e.target.value)
                    }
                    placeholder="Longsword"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Attack Bonus
                  </label>
                  <Input
                    type="number"
                    value={attack.attackBonus ?? 0}
                    onChange={(e) =>
                      updateAttack(
                        index,
                        "attackBonus",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Damage
                  </label>
                  <Input
                    value={attack.damage}
                    onChange={(e) =>
                      updateAttack(index, "damage", e.target.value)
                    }
                    placeholder="1d8 + 3"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Damage Type
                  </label>
                  <Input
                    value={attack.damageType}
                    onChange={(e) =>
                      updateAttack(
                        index,
                        "damageType",
                        e.target.value
                      )
                    }
                    placeholder="Slashing"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Notes
                </label>
                <Textarea
                  value={attack.notes}
                  onChange={(e) =>
                    updateAttack(index, "notes", e.target.value)
                  }
                  placeholder="Versatile (1d10)"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttack(index)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}