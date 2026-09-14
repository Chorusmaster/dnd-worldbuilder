import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const fields = [
  ["armorClass", "Armor Class"],
  ["initiative", "Initiative"],
  ["speed", "Speed"],
  ["proficiencyBonus", "Proficiency Bonus"],
] as const;

export function CharacterCombat() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Combat</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map(([key, label]) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium">
              {label}
            </label>

            <Input type="number" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}