import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const appearanceFields = [
  "age",
  "height",
  "weight",
  "eyes",
  "skin",
  "hair",
] as const;

type AppearanceField = (typeof appearanceFields)[number];

const labels: Record<AppearanceField, string> = {
  age: "Age",
  height: "Height",
  weight: "Weight",
  eyes: "Eyes",
  skin: "Skin",
  hair: "Hair",
};

type Appearance = Record<AppearanceField, string>;

type Props = {
  value: Appearance;
  onChange: (
    field: AppearanceField,
    value: string,
  ) => void;
};

export function CharacterAppearance({
  value,
  onChange,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {appearanceFields.map((field) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium">
                {labels[field]}
              </label>

              <Input
                value={value[field]}
                onChange={(e) =>
                  onChange(field, e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}