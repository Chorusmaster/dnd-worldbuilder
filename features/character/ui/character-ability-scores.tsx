import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const abilities = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
] as const;

export type Ability = (typeof abilities)[number];

export type AbilityModifier = {
  source: "asi" | "feat" | "item" | "other";
  value: number;
};

export type AbilityScore = {
  base: number;
  modifiers: AbilityModifier[];
};

export type AbilityScores = Record<Ability, AbilityScore>;

type Props = {
  value: AbilityScores;
  onChange: (ability: Ability, value: number) => void;
  pointsLimit: number;
};

const labels: Record<Ability, string> = {
  strength: "Strength",
  dexterity: "Dexterity",
  constitution: "Constitution",
  intelligence: "Intelligence",
  wisdom: "Wisdom",
  charisma: "Charisma",
};

const pointCosts: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

function getScoreModifier(score: number) {
  return Math.floor((score - 10) / 2);
}

function getTotalScore(ability: AbilityScore) {
  const modifiersTotal =
    ability.modifiers?.reduce(
      (total, modifier) => total + modifier.value,
      0,
    ) ?? 0;

  return ability.base + modifiersTotal;
}

export function CharacterAbilityScores({
  value,
  onChange,
  pointsLimit,
}: Props) {
  const pointsUsed = abilities.reduce((total, ability) => {
    const base = value[ability].base;

    return total + (pointCosts[base] ?? 0);
  }, 0);

  function handleScoreChange(
    ability: Ability,
    newBase: number,
  ) {
    if (!Number.isInteger(newBase)) return;
    if (newBase < 8 || newBase > 15) return;
    if (!(newBase in pointCosts)) return;

    const currentBase = value[ability].base;

    const currentCost = pointCosts[currentBase];
    const newCost = pointCosts[newBase];

    const newPointsUsed =
      pointsUsed - currentCost + newCost;

    if (newPointsUsed > pointsLimit) return;

    onChange(ability, newBase);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ability scores</CardTitle>

        <span className="text-sm text-muted-foreground">
          {pointsUsed} / {pointsLimit} points used
        </span>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {abilities.map((ability) => {
            const abilityScore = value[ability];

            const totalScore =
              getTotalScore(abilityScore);

            const modifier =
              getScoreModifier(totalScore);

            return (
              <div
                key={ability}
                className="rounded-lg border p-4 text-center"
              >
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {labels[ability]}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleScoreChange(
                        ability,
                        abilityScore.base - 1,
                      )
                    }
                    disabled={abilityScore.base <= 8}
                  >
                    -
                  </Button>

                  <div className="min-w-10 text-2xl font-semibold select-none">
                    {totalScore}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleScoreChange(
                        ability,
                        abilityScore.base + 1,
                      )
                    }
                    disabled={
                      abilityScore.base >= 15 ||
                      pointsUsed >= pointsLimit
                    }
                  >
                    +
                  </Button>
                </div>

                <p className="mt-2 text-xs text-muted-foreground select-none">
                  {modifier >= 0 ? "+" : ""}
                  {modifier} modifier
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}