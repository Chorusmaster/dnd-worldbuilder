import { Schema, model, models } from "mongoose";
import { InferSchemaType } from "mongoose";

const characterSchema = new Schema(
  {
    // Basic information

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: false,
      trim: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    world: {
      type: Schema.Types.ObjectId,
      ref: "World",
      required: false,
    },

    race: {
      type: String,
      required: true,
    },

    class: {
      type: String,
      required: true,
    },

    subclass: String,

    level: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
      default: 1,
    },

    background: String,

    alignment: String,

    experiencePoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Ability Scores 

    abilityScores: {
      strength: {
        base: {
          type: Number,
          required: true,
          default: 10,
          min: 0,
          max: 30,
        },
        modifiers: {
          type: [
            {
              source: {
                type: String,
                required: true,
                enum: ["asi", "feat", "item", "other"],
              },
              value: {
                type: Number,
                required: true,
              },
            },
          ],
          default: [],
        },
      },

      dexterity: {
        base: {
          type: Number,
          required: true,
          default: 10,
          min: 0,
          max: 30,
        },
        modifiers: {
          type: [
            {
              source: {
                type: String,
                required: true,
                enum: ["asi", "feat", "item", "other"],
              },
              value: {
                type: Number,
                required: true,
              },
            },
          ],
          default: [],
        },
      },

      constitution: {
        base: {
          type: Number,
          required: true,
          default: 10,
          min: 0,
          max: 30,
        },
        modifiers: {
          type: [
            {
              source: {
                type: String,
                required: true,
                enum: ["asi", "feat", "item", "other"],
              },
              value: {
                type: Number,
                required: true,
              },
            },
          ],
          default: [],
        },
      },

      intelligence: {
        base: {
          type: Number,
          required: true,
          default: 10,
          min: 0,
          max: 30,
        },
        modifiers: {
          type: [
            {
              source: {
                type: String,
                required: true,
                enum: ["asi", "feat", "item", "other"],
              },
              value: {
                type: Number,
                required: true,
              },
            },
          ],
          default: [],
        },
      },

      wisdom: {
        base: {
          type: Number,
          required: true,
          default: 10,
          min: 0,
          max: 30,
        },
        modifiers: {
          type: [
            {
              source: {
                type: String,
                required: true,
                enum: ["asi", "feat", "item", "other"],
              },
              value: {
                type: Number,
                required: true,
              },
            },
          ],
          default: [],
        },
      },

      charisma: {
        base: {
          type: Number,
          required: true,
          default: 10,
          min: 0,
          max: 30,
        },
        modifiers: {
          type: [
            {
              source: {
                type: String,
                required: true,
                enum: ["asi", "feat", "item", "other"],
              },
              value: {
                type: Number,
                required: true,
              },
            },
          ],
          default: [],
        },
      },
    },

    // Saving Throws 

    savingThrows: {
      strength: {
        type: Boolean,
        default: false,
      },

      dexterity: {
        type: Boolean,
        default: false,
      },

      constitution: {
        type: Boolean,
        default: false,
      },

      intelligence: {
        type: Boolean,
        default: false,
      },

      wisdom: {
        type: Boolean,
        default: false,
      },

      charisma: {
        type: Boolean,
        default: false,
      },
    },

    // Skills 

    skills: {
      acrobatics: { type: Boolean, default: false },
      animalHandling: { type: Boolean, default: false },
      arcana: { type: Boolean, default: false },
      athletics: { type: Boolean, default: false },
      deception: { type: Boolean, default: false },
      history: { type: Boolean, default: false },
      insight: { type: Boolean, default: false },
      intimidation: { type: Boolean, default: false },
      investigation: { type: Boolean, default: false },
      medicine: { type: Boolean, default: false },
      nature: { type: Boolean, default: false },
      perception: { type: Boolean, default: false },
      performance: { type: Boolean, default: false },
      persuasion: { type: Boolean, default: false },
      religion: { type: Boolean, default: false },
      sleightOfHand: { type: Boolean, default: false },
      stealth: { type: Boolean, default: false },
      survival: { type: Boolean, default: false },
    },

    // Proficiency 

    proficiencyBonus: {
      type: Number,
      default: 2,
    },

    // Combat 

    armorClass: {
      type: Number,
      default: 10,
    },

    initiative: {
      type: Number,
      default: 0,
    },

    speed: {
      type: Number,
      default: 30,
    },

    hitPoints: {
      current: {
        type: Number,
        default: 1,
      },

      maximum: {
        type: Number,
        default: 1,
      },

      temporary: {
        type: Number,
        default: 0,
      },
    },

    hitDice: {
      total: Number,
      type: String,
    },

    deathSaves: {
      successes: {
        type: Number,
        default: 0,
        min: 0,
        max: 3,
      },

      failures: {
        type: Number,
        default: 0,
        min: 0,
        max: 3,
      },
    },

    // Attacks 

    attacks: [
      {
        name: {
          type: String,
          required: true,
        },

        attackBonus: Number,

        damage: String,

        damageType: String,

        notes: String,
      },
    ],

    // Spellcasting 

    spellcasting: {
      ability: String,

      spellSaveDC: Number,

      spellAttackBonus: Number,

      cantrips: [String],

      spells: [String],

      spellSlots: {
        level1: { type: Number, default: 0 },
        level2: { type: Number, default: 0 },
        level3: { type: Number, default: 0 },
        level4: { type: Number, default: 0 },
        level5: { type: Number, default: 0 },
        level6: { type: Number, default: 0 },
        level7: { type: Number, default: 0 },
        level8: { type: Number, default: 0 },
        level9: { type: Number, default: 0 },
      },
    },

    // Proficiencies 

    proficiencies: {
      armor: [String],
      weapons: [String],
      tools: [String],
      languages: [String],
    },

    // Equipment 

    equipment: [
      {
        name: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
        },

        description: String,
      },
    ],

    // Character features 

    features: [
      {
        name: {
          type: String,
          required: true,
        },

        description: String,

        source: String,
      },
    ],

    // Personality 

    personality: {
      traits: String,

      ideals: String,

      bonds: String,

      flaws: String,
    },

    // Appearance 

    appearance: {
      age: String,
      height: String,
      weight: String,
      eyes: String,
      skin: String,
      hair: String,
    },

    // Backstory 

    backstory: String,

    // Notes 

    notes: String,
  },
  {
    timestamps: true,
  }
);

export const Character =
  models.Character || model("Character", characterSchema);

export type Character = InferSchemaType<typeof characterSchema>;