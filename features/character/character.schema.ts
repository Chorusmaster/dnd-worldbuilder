import { z } from "zod";

const abilityScoreSchema = z.object({
  base: z.number().min(1).max(30).default(10),
  modifiers: z
    .array(
      z.object({
        source: z.enum(["asi", "feat", "item", "other"]),
        value: z.number(),
      }),
    )
    .default([]),
});

const abilityScoresSchema = z.object({
  strength: abilityScoreSchema,
  dexterity: abilityScoreSchema,
  constitution: abilityScoreSchema,
  intelligence: abilityScoreSchema,
  wisdom: abilityScoreSchema,
  charisma: abilityScoreSchema,
});

const savingThrowsSchema = z.object({
  strength: z.boolean().default(false),
  dexterity: z.boolean().default(false),
  constitution: z.boolean().default(false),
  intelligence: z.boolean().default(false),
  wisdom: z.boolean().default(false),
  charisma: z.boolean().default(false),
});

const skillsSchema = z.object({
  acrobatics: z.boolean().default(false),
  animalHandling: z.boolean().default(false),
  arcana: z.boolean().default(false),
  athletics: z.boolean().default(false),
  deception: z.boolean().default(false),
  history: z.boolean().default(false),
  insight: z.boolean().default(false),
  intimidation: z.boolean().default(false),
  investigation: z.boolean().default(false),
  medicine: z.boolean().default(false),
  nature: z.boolean().default(false),
  perception: z.boolean().default(false),
  performance: z.boolean().default(false),
  persuasion: z.boolean().default(false),
  religion: z.boolean().default(false),
  sleightOfHand: z.boolean().default(false),
  stealth: z.boolean().default(false),
  survival: z.boolean().default(false),
});

export const createCharacterSchema = z.object({
  name: z.string().min(1).max(100).trim(),

  description: z.string().optional(),
  image: z.string().optional(),

  race: z.string().min(1),
  class: z.string().min(1),
  subclass: z.string().optional(),

  level: z.number().int().min(1).max(20).default(1),

  background: z.string().optional(),
  alignment: z.string().optional(),

  experiencePoints: z.number().int().min(0).default(0),

  abilityScores: abilityScoresSchema.default({
    strength: { base: 10, modifiers: [] },
    dexterity: { base: 10, modifiers: [] },
    constitution: { base: 10, modifiers: [] },
    intelligence: { base: 10, modifiers: [] },
    wisdom: { base: 10, modifiers: [] },
    charisma: { base: 10, modifiers: [] },
  }),

  savingThrows: savingThrowsSchema.default({
    strength: false,
    dexterity: false,
    constitution: false,
    intelligence: false,
    wisdom: false,
    charisma: false,
  }),

  skills: skillsSchema.default({
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
  }),

  personality: z
    .object({
      traits: z.string().optional(),
      ideals: z.string().optional(),
      bonds: z.string().optional(),
      flaws: z.string().optional(),
    })
    .optional(),

  appearance: z
    .object({
      age: z.string().optional(),
      height: z.string().optional(),
      weight: z.string().optional(),
      eyes: z.string().optional(),
      skin: z.string().optional(),
      hair: z.string().optional(),
    })
    .optional(),

  features: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        source: z.string().optional(),
      }),
    )
    .default([]),

  equipment: z
    .array(
      z.object({
        name: z.string().min(1),
        quantity: z.number().int().min(1).default(1),
        description: z.string().optional(),
      }),
    )
    .default([]),

  attacks: z
    .array(
      z.object({
        name: z.string().min(1),
        attackBonus: z.number().optional(),
        damage: z.string().optional(),
        damageType: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .default([]),
});

export const updateCharacterSchema = createCharacterSchema.partial();

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterInput = z.infer<typeof updateCharacterSchema>;
