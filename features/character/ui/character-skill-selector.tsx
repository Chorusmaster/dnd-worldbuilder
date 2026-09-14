import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const skills = [
  "acrobatics",
  "animalHandling",
  "arcana",
  "athletics",
  "deception",
  "history",
  "insight",
  "intimidation",
  "investigation",
  "medicine",
  "nature",
  "perception",
  "performance",
  "persuasion",
  "religion",
  "sleightOfHand",
  "stealth",
  "survival",
] as const;

export type Skill = (typeof skills)[number];

const labels: Record<Skill, string> = {
  acrobatics: "Acrobatics",
  animalHandling: "Animal Handling",
  arcana: "Arcana",
  athletics: "Athletics",
  deception: "Deception",
  history: "History",
  insight: "Insight",
  intimidation: "Intimidation",
  investigation: "Investigation",
  medicine: "Medicine",
  nature: "Nature",
  perception: "Perception",
  performance: "Performance",
  persuasion: "Persuasion",
  religion: "Religion",
  sleightOfHand: "Sleight of Hand",
  stealth: "Stealth",
  survival: "Survival",
};

type SkillSelection = Record<Skill, boolean>;

type Props = {
  value: SkillSelection;
  max: number;
  onChange: (skill: Skill, selected: boolean) => void;
};

export function CharacterSkillSelection({
  value,
  max,
  onChange,
}: Props) {
  const selectedCount = Object.values(value).filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Skills</CardTitle>

          <span className="text-sm text-muted-foreground">
            {selectedCount} / {max}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill) => {
            const selected = value[skill];
            const disabled = !selected && selectedCount >= max;

            return (
              <button
                key={skill}
                type="button"
                disabled={disabled}
                onClick={() => onChange(skill, !selected)}
                className={`rounded-lg border p-4 text-left transition ${
                  selected
                    ? "border-primary bg-primary/10"
                    : "hover:bg-muted"
                } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <p className="text-sm font-medium">
                  {labels[skill]}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {selected ? "Selected" : "Not selected"}
                </p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}