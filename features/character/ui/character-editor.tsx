"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { CharacterBasicInfo } from "./character-basic-info";
import { Ability, CharacterAbilityScores } from "./character-ability-scores";
import { CharacterCombat } from "./character-combat";
import { RaceSelector } from "./race-selector";
import { ClassSelector } from "./class-selector";
import {
  CharacterSkillSelection,
  type Skill,
} from "./character-skill-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CharacterAppearance } from "./character-appearance";
import { CharacterPersonality } from "./character-personality";
import { CharacterFeatures } from "./character-features";
import { CharacterEquipment } from "./character-equipment";
import { CharacterAttacks } from "./character-attacks";

import { useDashboard } from "@/app/dashboard/dashboard-context";
import { createCharacterAction } from "../character.actions";

export type Feature = {
  name: string;
  description: string;
  source: string;
};

export type AbilityModifier = {
  source: "asi" | "feat" | "item" | "other";
  value: number;
};

export type AbilityScore = {
  base: number;
  modifiers: AbilityModifier[];
};

export type AbilityScores = {
  strength: AbilityScore;
  dexterity: AbilityScore;
  constitution: AbilityScore;
  intelligence: AbilityScore;
  wisdom: AbilityScore;
  charisma: AbilityScore;
};

export type Skills = {
  acrobatics: boolean;
  animalHandling: boolean;
  arcana: boolean;
  athletics: boolean;
  deception: boolean;
  history: boolean;
  insight: boolean;
  intimidation: boolean;
  investigation: boolean;
  medicine: boolean;
  nature: boolean;
  perception: boolean;
  performance: boolean;
  persuasion: boolean;
  religion: boolean;
  sleightOfHand: boolean;
  stealth: boolean;
  survival: boolean;
};

export type Personality = {
  traits: string;
  ideals: string;
  bonds: string;
  flaws: string;
};

export type Appearance = {
  age: string;
  height: string;
  weight: string;
  eyes: string;
  skin: string;
  hair: string;
};

export type EquipmentItem = {
  name: string;
  quantity: number;
  description: string;
};

export type Attack = {
  name: string;
  attackBonus?: number;
  damage: string;
  damageType: string;
  notes: string;
};

export type Character = {
  name: string;
  description: string;
  image: string;

  race: string;
  class: string;
  subclass: string;
  level: number;
  background: string;
  alignment: string;
  experiencePoints: number;

  abilityScores: AbilityScores;
  skills: Skills;
  personality: Personality;
  appearance: Appearance;

  features: Feature[];
  equipment: EquipmentItem[];
  attacks: Attack[];
};

const defaultCharacter: Character = {
  name: "",
  description: "",
  image: "",
  race: "human",
  class: "fighter",
  subclass: "",
  level: 1,
  background: "",
  alignment: "",
  experiencePoints: 0,

  abilityScores: {
    strength: {
      base: 8,
      modifiers: [],
    },
    dexterity: {
      base: 8,
      modifiers: [],
    },
    constitution: {
      base: 8,
      modifiers: [],
    },
    intelligence: {
      base: 8,
      modifiers: [],
    },
    wisdom: {
      base: 8,
      modifiers: [],
    },
    charisma: {
      base: 8,
      modifiers: [],
    },
  },

  skills: {
    acrobatics: false,
    animalHandling: false,
    arcana: false,
    athletics: false,
    deception: false,
    history: false,
    insight: false,
    intimidation: false,
    investigation: false,
    medicine: false,
    nature: false,
    perception: false,
    performance: false,
    persuasion: false,
    religion: false,
    sleightOfHand: false,
    stealth: false,
    survival: false,
  },

  personality: {
    traits: "",
    ideals: "",
    bonds: "",
    flaws: "",
  },

  appearance: {
    age: "",
    height: "",
    weight: "",
    eyes: "",
    skin: "",
    hair: "",
  },

  features: [],
  equipment: [],
  attacks: [],
};

type CharacterEditorProps = {
  characterId?: string;
};

export default function CharacterEditor({ characterId }: CharacterEditorProps) {
  const [character, setCharacter] = useState(defaultCharacter);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dashboardContext = useDashboard();
  const router = useRouter();

  const isEditing = !!characterId;

  function updateField(field: keyof typeof character, value: string | number) {
    setCharacter((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateAbilityScore(ability: Ability, update: Partial<AbilityScore>) {
    setCharacter((current) => ({
      ...current,
      abilityScores: {
        ...current.abilityScores,
        [ability]: {
          ...current.abilityScores[ability],
          ...update,
        },
      },
    }));
  }

  function updateSkill(skill: Skill, selected: boolean) {
    setCharacter((current) => ({
      ...current,
      skills: {
        ...current.skills,
        [skill]: selected,
      },
    }));
  }

  function updatePersonality(
    field: keyof typeof character.personality,
    value: string,
  ) {
    setCharacter((current) => ({
      ...current,
      personality: {
        ...current.personality,
        [field]: value,
      },
    }));
  }

  function updateAppearance(
    field: keyof typeof character.appearance,
    value: string,
  ) {
    setCharacter((current) => ({
      ...current,
      appearance: {
        ...current.appearance,
        [field]: value,
      },
    }));
  }

  function updateFeatures(value: Feature[]) {
    setCharacter((current) => ({
      ...current,
      features: [...value],
    }));
  }

  function updateEquipment(value: EquipmentItem[]) {
    setCharacter((current) => ({
      ...current,
      equipment: [...value],
    }));
  }

  function updateAttacks(value: Attack[]) {
    setCharacter((current) => ({
      ...current,
      attacks: [...value],
    }));
  }

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();

    if (!dashboardContext.activeWorld) {
      setError("Select a world before creating a character.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createCharacterAction(character, {
        worldId: dashboardContext.activeWorld._id,
      });
      router.push("/dashboard/characters");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to create character.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-6xl space-y-6"
    >
      <h1 className="text-3xl font-semibold tracking-tight">
        {character.name || "New character"}
      </h1>

      <CharacterBasicInfo value={character} onChange={updateField} />

      <CharacterAbilityScores
        value={character.abilityScores}
        pointsLimit={27}
        onChange={(ability, value) =>
          updateAbilityScore(ability, { base: value })
        }
      />

      <CharacterSkillSelection
        value={character.skills}
        max={4}
        onChange={updateSkill}
      />

      <CharacterFeatures value={character.features} onChange={updateFeatures} />

      <RaceSelector
        value={character.race}
        onChange={(value) => updateField("race", value)}
      />

      <ClassSelector
        value={character.class}
        subclass={character.subclass}
        onClassChange={(value) => updateField("class", value)}
        onSubclassChange={(value) => updateField("subclass", value)}
      />

      <CharacterPersonality
        value={character.personality}
        onChange={updatePersonality}
      />

      <CharacterAppearance
        value={character.appearance}
        onChange={updateAppearance}
      />

      <CharacterEquipment
        value={character.equipment}
        onChange={updateEquipment}
      />

      <CharacterCombat />

      <CharacterAttacks value={character.attacks} onChange={updateAttacks} />

      {/* Backstory */}
      <Card>
        <CardHeader>
          <CardTitle>Backstory</CardTitle>
        </CardHeader>

        <CardContent>
          <Textarea
            placeholder="Character backstory..."
            className="min-h-32 resize-y"
          />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>

        <CardContent>
          <Textarea
            placeholder="Additional information..."
            className="min-h-32 resize-y"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {error ? (
          <p className="mr-auto text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isEditing}>
          {isSubmitting ? "Creating..." : null}
          {!isSubmitting && (isEditing ? "Save changes" : "Create character")}
        </Button>
      </div>
    </form>
  );
}
