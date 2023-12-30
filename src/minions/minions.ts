type Minion = {
  produces: Record<string, number>;
  oneAction?: boolean;
  tiers: Record<
    number,
    {
      resources: Record<string, number>;
      speed: number;
      storage?: number;
    }
  >;
};
export const storageProgression: Record<string, number> = {
  1: 64,
  2: 192,
  3: 192,
  4: 384,
  5: 384,
  6: 576,
  7: 576,
  8: 768,
  9: 768,
  10: 960,
  11: 960,
};
export const minions: Record<string, Minion> = {
  Jungle: {
    produces: { "LOG:3": 4 },
    tiers: {
      1: {
        resources: { "LOG:3": 80 },
        speed: 48,
      },
      2: {
        resources: { "LOG:3": 240 },
        speed: 48,
      },
      3: {
        resources: { "LOG:3": 560 },
        speed: 45,
      },
      4: {
        resources: { "LOG:3": 1072 },
        speed: 45,
      },
      5: {
        resources: { "LOG:3": 1072, ENCHANTED_JUNGLE_LOG: 8 },
        speed: 42,
      },
      6: {
        resources: { "LOG:3": 1072, ENCHANTED_JUNGLE_LOG: 24 },
        speed: 42,
      },
      7: {
        resources: { "LOG:3": 1072, ENCHANTED_JUNGLE_LOG: 56 },
        speed: 38,
      },
      8: {
        resources: { "LOG:3": 1072, ENCHANTED_JUNGLE_LOG: 120 },
        speed: 38,
      },
      9: {
        resources: { "LOG:3": 1072, ENCHANTED_JUNGLE_LOG: 248 },
        speed: 33,
      },
      10: {
        resources: { "LOG:3": 1072, ENCHANTED_JUNGLE_LOG: 504 },
        speed: 33,
      },
      11: {
        resources: { "LOG:3": 1072, ENCHANTED_JUNGLE_LOG: 1016 },
        speed: 27,
      },
    },
  },
  Clay: {
    produces: { CLAY_BALL: 1 },
    tiers: {
      1: {
        resources: { CLAY_BALL: 80 },
        speed: 32,
      },
      2: {
        resources: { CLAY_BALL: 240 },
        speed: 32,
      },
      3: {
        resources: { CLAY_BALL: 560 },
        speed: 30,
      },
      4: {
        resources: { CLAY_BALL: 1072 },
        speed: 30,
      },
      5: {
        resources: { CLAY_BALL: 1072, ENCHANTED_CLAY_BALL: 8 },
        speed: 27.5,
      },
      6: {
        resources: { CLAY_BALL: 1072, ENCHANTED_CLAY_BALL: 24 },
        speed: 27.5,
      },
      7: {
        resources: { CLAY_BALL: 1072, ENCHANTED_CLAY_BALL: 56 },
        speed: 24,
      },
      8: {
        resources: { CLAY_BALL: 1072, ENCHANTED_CLAY_BALL: 120 },
        speed: 24,
      },
      9: {
        resources: { CLAY_BALL: 1072, ENCHANTED_CLAY_BALL: 248 },
        speed: 20,
      },
      10: {
        resources: { CLAY_BALL: 1072, ENCHANTED_CLAY_BALL: 504 },
        speed: 20,
      },
      11: {
        resources: { CLAY_BALL: 1072, ENCHANTED_CLAY_BALL: 1016 },
        speed: 16,
      },
    },
  },
  Snow: {
    produces: { SNOW_BALL: 4 },
    tiers: {
      1: {
        resources: { MONEY: 800000 },
        speed: 13,
      },
      2: {
        resources: { MONEY: 800000, SNOW_BLOCK: 32 },
        speed: 13,
      },
      3: {
        resources: { MONEY: 800000, SNOW_BLOCK: 96 },
        speed: 12,
      },
      4: {
        resources: { MONEY: 800000, SNOW_BLOCK: 224 },
        speed: 12,
      },
      5: {
        resources: { MONEY: 800000, SNOW_BLOCK: 480 },
        speed: 11,
      },
      6: {
        resources: { MONEY: 800000, SNOW_BLOCK: 992 },
        speed: 11,
      },
      7: {
        resources: { MONEY: 800000, SNOW_BLOCK: 992, ENCHANTED_SNOW_BLOCK: 8 },
        speed: 9.5,
      },
      8: {
        resources: { MONEY: 800000, SNOW_BLOCK: 992, ENCHANTED_SNOW_BLOCK: 24 },
        speed: 9.5,
      },
      9: {
        resources: { MONEY: 800000, SNOW_BLOCK: 992, ENCHANTED_SNOW_BLOCK: 56 },
        speed: 8,
      },
      10: {
        resources: { MONEY: 800000, SNOW_BLOCK: 992, ENCHANTED_SNOW_BLOCK: 120 },
        speed: 8,
      },
      11: {
        resources: { MONEY: 800000, SNOW_BLOCK: 992, ENCHANTED_SNOW_BLOCK: 248 },
        speed: 6.5,
      },
    },
  },
  Sand: {
    produces: { SAND: 1 },
    tiers: {
      1: {
        resources: { SAND: 80 },
        speed: 26,
      },
      2: {
        resources: { SAND: 240 },
        speed: 26,
      },
      3: {
        resources: { SAND: 560 },
        speed: 24,
      },
      4: {
        resources: { SAND: 1072 },
        speed: 24,
      },
      5: {
        resources: { SAND: 1072, ENCHANTED_SAND: 8 },
        speed: 22,
      },
      6: {
        resources: { SAND: 1072, ENCHANTED_SAND: 24 },
        speed: 22,
      },
      7: {
        resources: { SAND: 1072, ENCHANTED_SAND: 56 },
        speed: 19,
      },
      8: {
        resources: { SAND: 1072, ENCHANTED_SAND: 120 },
        speed: 19,
      },
      9: {
        resources: { SAND: 1072, ENCHANTED_SAND: 248 },
        speed: 16,
      },
      10: {
        resources: { SAND: 1072, ENCHANTED_SAND: 504 },
        speed: 16,
      },
      11: {
        resources: { SAND: 1072, ENCHANTED_SAND: 1016 },
        speed: 13,
      },
    },
  },
  Gravel: {
    produces: { GRAVEL: 1 },
    tiers: {
      1: {
        resources: { GRAVEL: 80 },
        speed: 26,
      },
      2: {
        resources: { GRAVEL: 240 },
        speed: 26,
      },
      3: {
        resources: { GRAVEL: 560 },
        speed: 24,
      },
      4: {
        resources: { GRAVEL: 1072 },
        speed: 24,
      },
      5: {
        resources: { GRAVEL: 1072, ENCHANTED_FLINT: 8 },
        speed: 22,
      },
      6: {
        resources: { GRAVEL: 1072, ENCHANTED_FLINT: 24 },
        speed: 22,
      },
      7: {
        resources: { GRAVEL: 1072, ENCHANTED_FLINT: 56 },
        speed: 19,
      },
      8: {
        resources: { GRAVEL: 1072, ENCHANTED_FLINT: 120 },
        speed: 19,
      },
      9: {
        resources: { GRAVEL: 1072, ENCHANTED_FLINT: 248 },
        speed: 16,
      },
      10: {
        resources: { GRAVEL: 1072, ENCHANTED_FLINT: 504 },
        speed: 16,
      },
      11: {
        resources: { GRAVEL: 1072, ENCHANTED_FLINT: 1016 },
        speed: 13,
      },
    },
  },
  Gold: {
    produces: { GOLD_INGOT: 1 },
    tiers: {
      1: {
        resources: { GOLD_INGOT: 80 },
        speed: 22,
      },
      2: {
        resources: { GOLD_INGOT: 240 },
        speed: 22,
      },
      3: {
        resources: { GOLD_INGOT: 560 },
        speed: 20,
      },
      4: {
        resources: { GOLD_INGOT: 1072 },
        speed: 20,
      },
      5: {
        resources: { GOLD_INGOT: 1072, ENCHANTED_GOLD: 8 },
        speed: 18,
      },
      6: {
        resources: { GOLD_INGOT: 1072, ENCHANTED_GOLD: 32 },
        speed: 18,
      },
      7: {
        resources: { GOLD_INGOT: 1072, ENCHANTED_GOLD: 96 },
        speed: 16,
      },
      8: {
        resources: { GOLD_INGOT: 1072, ENCHANTED_GOLD: 224 },
        speed: 16,
      },
      9: {
        resources: { GOLD_INGOT: 1072, ENCHANTED_GOLD: 480 },
        speed: 14,
      },
      10: {
        resources: { GOLD_INGOT: 1072, ENCHANTED_GOLD: 992 },
        speed: 14,
      },
      11: {
        resources: { GOLD_INGOT: 1072, ENCHANTED_GOLD: 992, ENCHANTED_GOLD_BLOCK: 8 },
        speed: 11,
      },
    },
  },
  Diamond: {
    produces: { DIAMOND: 1 },
    tiers: {
      1: {
        resources: { DIAMOND: 80 },
        speed: 29,
      },
      2: {
        resources: { DIAMOND: 240 },
        speed: 29,
      },
      3: {
        resources: { DIAMOND: 560 },
        speed: 27,
      },
      4: {
        resources: { DIAMOND: 1072 },
        speed: 27,
      },
      5: {
        resources: { DIAMOND: 1072, ENCHANTED_DIAMOND: 8 },
        speed: 25,
      },
      6: {
        resources: { DIAMOND: 1072, ENCHANTED_DIAMOND: 32 },
        speed: 25,
      },
      7: {
        resources: { DIAMOND: 1072, ENCHANTED_DIAMOND: 96 },
        speed: 22,
      },
      8: {
        resources: { DIAMOND: 1072, ENCHANTED_DIAMOND: 224 },
        speed: 22,
      },
      9: {
        resources: {
          DIAMOND: 1072,
          ENCHANTED_DIAMOND: 480,
        },
        speed: 19,
      },
      10: {
        resources: {
          DIAMOND: 1072,
          ENCHANTED_DIAMOND: 992,
        },
        speed: 19,
      },
      11: {
        resources: {
          DIAMOND: 1072,
          ENCHANTED_DIAMOND: 992,
          ENCHANTED_DIAMOND_BLOCK: 8,
        },
        speed: 15,
      },
    },
  },
  Lapis: {
    produces: { "INK_SACK:4": 6 },
    tiers: {
      1: {
        resources: { "INK_SACK:4": 256 },
        speed: 29,
      },
      2: {
        resources: { "INK_SACK:4": 768 },
        speed: 29,
      },
      3: {
        resources: { "INK_SACK:4": 768, ENCHANTED_LAPIS_LAZULI: 8 },
        speed: 27,
      },
      4: {
        resources: { "INK_SACK:4": 768, ENCHANTED_LAPIS_LAZULI: 32 },
        speed: 27,
      },
      5: {
        resources: { "INK_SACK:4": 768, ENCHANTED_LAPIS_LAZULI: 96 },
        speed: 25,
      },
      6: {
        resources: { "INK_SACK:4": 768, ENCHANTED_LAPIS_LAZULI: 224 },
        speed: 25,
      },
      7: {
        resources: { "INK_SACK:4": 768, ENCHANTED_LAPIS_LAZULI: 480 },
        speed: 23,
      },
      8: {
        resources: { "INK_SACK:4": 768, ENCHANTED_LAPIS_LAZULI: 992 },
        speed: 23,
      },
      9: {
        resources: {
          "INK_SACK:4": 768,
          ENCHANTED_LAPIS_LAZULI: 992,
          ENCHANTED_LAPIS_LAZULI_BLOCK: 8,
        },
        speed: 21,
      },
      10: {
        resources: {
          "INK_SACK:4": 768,
          ENCHANTED_LAPIS_LAZULI: 992,
          ENCHANTED_LAPIS_LAZULI_BLOCK: 24,
        },
        speed: 21,
      },
      11: {
        resources: {
          "INK_SACK:4": 768,
          ENCHANTED_LAPIS_LAZULI: 992,
          ENCHANTED_LAPIS_LAZULI_BLOCK: 56,
        },
        speed: 18,
      },
    },
  },
  Emerald: {
    produces: { EMERALD: 1 },
    tiers: {
      1: {
        resources: { EMERALD: 80 },
        speed: 28,
      },
      2: {
        resources: { EMERALD: 240 },
        speed: 28,
      },
      3: {
        resources: { EMERALD: 560 },
        speed: 26,
      },
      4: {
        resources: { EMERALD: 1072 },
        speed: 26,
      },
      5: {
        resources: { EMERALD: 1072, ENCHANTED_EMERALD: 8 },
        speed: 24,
      },
      6: {
        resources: { EMERALD: 1072, ENCHANTED_EMERALD: 32 },
        speed: 24,
      },
      7: {
        resources: { EMERALD: 1072, ENCHANTED_EMERALD: 96 },
        speed: 21,
      },
      8: {
        resources: { EMERALD: 1072, ENCHANTED_EMERALD: 224 },
        speed: 21,
      },
      9: {
        resources: { EMERALD: 1072, ENCHANTED_EMERALD: 480 },
        speed: 18,
      },
      10: {
        resources: { EMERALD: 1072, ENCHANTED_EMERALD: 992 },
        speed: 18,
      },
      11: {
        resources: { EMERALD: 1072, ENCHANTED_EMERALD: 992, ENCHANTED_EMERALD_BLOCK: 8 },
        speed: 14,
      },
    },
  },
};
const COMPACTOR = {
  CLAY_BALL: { count: 4, output: "CLAY" },
  DIAMOND: { count: 9, output: "DIAMOND_BLOCK" },
  EMERALD: { count: 9, output: "EMERALD_BLOCK" },
  GOLD_INGOT: { count: 9, output: "GOLD_BLOCK" },
  "INK_SACK:4": { count: 9, output: "LAPIS_BLOCK" },
  SNOW_BALL: { count: 4, output: "SNOW_BLOCK" },
};
const SUPER_COMPACTOR = {
  CLAY_BALL: { count: 160, output: "ENCHANTED_CLAY_BALL" },
  DIAMOND: { count: 160, output: "ENCHANTED_DIAMOND" },
  EMERALD: { count: 160, output: "ENCHANTED_EMERALD" },
  ENCHANTED_DIAMOND: { count: 160, output: "ENCHANTED_DIAMOND_BLOCK" },
  ENCHANTED_EMERALD: { count: 160, output: "ENCHANTED_EMERALD_BLOCK" },
  ENCHANTED_GOLD: { count: 160, output: "ENCHANTED_GOLD_BLOCK" },
  ENCHANTED_LAPIS_LAZULI: { count: 160, output: "ENCHANTED_LAPIS_LAZULI_BLOCK" },
  GOLD_INGOT: { count: 160, output: "ENCHANTED_GOLD" },
  "INK_SACK:4": { count: 160, output: "ENCHANTED_LAPIS_LAZULI" },
  "LOG:3": { count: 160, output: "ENCHANTED_JUNGLE_WOOD" },
  SAND: { count: 160, output: "ENCHANTED_SAND" },
  SNOW_BALL: { count: 640, output: "ENCHANTED_SNOW_BLOCK" },
};

export const calculatePrice = (
  minion: Minion,
  data: {
    minutes: number;
    tier: number;
    compactor: "none" | "block" | "super";
    diamond_spreading: boolean;
    bazaar: Record<string, any>;
    items: Record<string, any>;
    tax: number;
  },
) => {
  const tier = minion.tiers[data.tier];

  let price = 0;
  for (const [id, amount] of Object.entries(tier.resources)) {
    if (id == "MONEY") {
      price += amount;
      continue;
    }
    const b = data.bazaar[id];
    const instabuy_price = b.buy_summary[0].pricePerUnit; // TODO: catch these
    price += instabuy_price * data.tax * amount;
  }
  if (data.compactor == "block") {
    const b = data.bazaar["COMPACTOR"];
    const instabuy_price = b.buy_summary[0].pricePerUnit;
    price += instabuy_price * data.tax;
  }
  if (data.compactor == "super") {
    const b = data.bazaar["SUPER_COMPACTOR_3000"];
    const instabuy_price = b.buy_summary[0].pricePerUnit;
    price += instabuy_price * data.tax;
  }
  if (data.diamond_spreading) {
    const b = data.bazaar["DIAMOND_SPREADING"];
    const instabuy_price = b.buy_summary[0].pricePerUnit;
    price += instabuy_price * data.tax;
  }
  return price;
};
export const calculateOutput = (
  minion: Minion,
  data: {
    minutes: number;
    tier: number;
    compactor: "none" | "block" | "super";
    diamond_spreading: boolean;
  },
) => {
  const tier = minion.tiers[data.tier];
  const speed = minion.oneAction ? tier.speed : tier.speed * 2;

  let time = data.minutes * 60;

  const resources: Record<string, number> = {};

  while (true) {
    if (time - speed < 0) {
      break;
    }
    time -= speed;

    let added = 0;
    for (let [id, amount] of Object.entries(minion.produces)) {
      resources[id] = (resources[id] || 0) + amount;
      added += amount;
    }
    if (data.diamond_spreading) {
      resources["DIAMOND"] = (resources["DIAMOND"] || 0) + 0.1 * added;
    }
  }

  if (data.compactor != "none") {
    let compacted = false;
    do {
      compacted = false;
      for (let [id, amount] of Object.entries(
        data.compactor == "block" ? COMPACTOR : SUPER_COMPACTOR,
      )) {
        if (!resources[id]) continue;
        const amountCompacted = Math.floor(resources[id] / amount.count);
        if (amountCompacted > 0) {
          resources[id] -= amountCompacted * amount.count;
          resources[amount.output] = (resources[amount.output] || 0) + amountCompacted;
          compacted = true;
        }
      }
    } while (compacted);
  }

  return resources;
};
