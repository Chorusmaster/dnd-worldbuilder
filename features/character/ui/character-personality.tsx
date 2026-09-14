import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const personalityFields = [
  "traits",
  "ideals",
  "bonds",
  "flaws",
] as const;

type PersonalityField = (typeof personalityFields)[number];

const labels: Record<PersonalityField, string> = {
  traits: "Personality Traits",
  ideals: "Ideals",
  bonds: "Bonds",
  flaws: "Flaws",
};

type Personality = Record<PersonalityField, string>;

type Props = {
  value: Personality;
  onChange: (
    field: PersonalityField,
    value: string,
  ) => void;
};

export function CharacterPersonality({
  value,
  onChange,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personality</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {personalityFields.map((field) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium">
                {labels[field]}
              </label>

              <Textarea
                value={value[field]}
                onChange={(e) =>
                  onChange(field, e.target.value)
                }
                rows={4}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}