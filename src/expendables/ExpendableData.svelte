<script lang="ts">
  import { type BazaarItem } from "../common";
  export let bazaar: Record<string, BazaarItem>;
  export let auction: Record<string, number>;
  export let settings: {
    buyPricing: string;
    sellPricing: string;
    tax: number;
  };

  const getPrice = (id: string) => {
    const b = bazaar[id];
    const buyPrice = b.sell_summary[0]?.pricePerUnit;
    const instantBuyPrice = b.buy_summary[0]?.pricePerUnit;
    return (
      ((100 + settings.tax) / 100) *
      (instantBuyPrice * +settings.buyPricing + buyPrice * (1 - +settings.buyPricing))
    );
  };
  const getSellPrice = (id: string) => {
    const b = bazaar[id];
    const sellPrice = b.buy_summary[0]?.pricePerUnit;
    const instantSellPrice = b.sell_summary[0]?.pricePerUnit;
    return (
      ((100 + settings.tax) / 100) *
      (instantSellPrice * +settings.sellPricing + sellPrice * (1 - +settings.sellPricing))
    );
  };
  const getAuction = (id: string) => auction[id] || 0;

  let items: Record<
    string,
    { price: number; coins: number; data: Record<string, string | number> }
  >;
  $: {
    items = {};
    bazaar;
    settings;

    addHBoots();
    addJGreen();
    addJBlue();
    addJPurple();
    addJGolden();
  }
  const addHBoots = () => {
    const ID = "HOLY_DRAGON_BOOTS";
    items[ID] = {
      price: getPrice("HOLY_FRAGMENT") * 40,
      coins:
        30 * getSellPrice("ESSENCE_DRAGON") +
        (68 / 83) * 17.5 * getSellPrice("HOLY_FRAGMENT") +
        (9 / 83) * getSellPrice("RITUAL_RESIDUE") +
        (2 / 83) * getSellPrice("DRAGON_HORN") +
        (4 / 83) * getSellPrice("SUMMONING_EYE"),
      data: {
        How: "Draconic Altar",
        Warning: "Catacombs 20 required",
      },
    };
  };
  const addJGreen = () => {
    const ID = "JERRY_BOX_GREEN";
    items[ID] = {
      price: getPrice(ID),
      coins:
        (100 / 227) * 20000 +
        (15 / 227) * getAuction("JERRY_CANDY") +
        (15 / 227) * getAuction("JERRY_TALISMAN_GREEN") +
        (3 / 227) * getAuction("JERRY_STAFF") +
        (2 / 227) * getSellPrice("JERRY_STONE") +
        (1 / 227) * getSellPrice("PET_ITEM_TOY_JERRY"),
      data: {
        "Average XP per skill": (30 / 227) * 2500,
      },
    };
  };
  const addJBlue = () => {
    const ID = "JERRY_BOX_BLUE";
    items[ID] = {
      price: getPrice(ID),
      coins:
        (100 / 227) * 50000 +
        (15 / 227) * getAuction("JERRY_CANDY") +
        (15 / 227) * getAuction("JERRY_TALISMAN_GREEN") +
        (3 / 227) * getAuction("JERRY_STAFF") +
        (2 / 227) * getSellPrice("JERRY_STONE") +
        (1 / 227) * getSellPrice("PET_ITEM_TOY_JERRY"),
      data: {
        "Average XP per skill": (30 / 227) * 5000,
      },
    };
  };
  const addJPurple = () => {
    const ID = "JERRY_BOX_PURPLE";
    items[ID] = {
      price: getPrice(ID),
      coins:
        (100 / 232) * 150000 +
        (5 / 232) * 300000 +
        (15 / 232) * getAuction("JERRY_CANDY") +
        (15 / 232) * getAuction("JERRY_TALISMAN_GREEN") +
        (3 / 232) * getAuction("JERRY_STAFF") +
        (2 / 232) * getSellPrice("JERRY_STONE") +
        (1 / 232) * getSellPrice("PET_ITEM_TOY_JERRY"),
      data: {
        "Average XP per skill": (30 / 232) * 20000,
      },
    };
  };
  const addJGolden = () => {
    const ID = "JERRY_BOX_GOLDEN";
    items[ID] = {
      price: getPrice(ID),
      coins:
        (100 / 124) * 500000 +
        (10 / 124) * 1000000 +
        (1 / 124) * 10000000 +
        (3 / 124) * getAuction("JERRY_STAFF") +
        (2 / 124) * getSellPrice("JERRY_STONE") +
        (1 / 124) * getSellPrice("PET_ITEM_TOY_JERRY"),
      data: {
        "Average XP per skill": (2 / 124) * 100000,
      },
    };
  };
</script>

<div class="flex flex-col gap-4">
  {#each Object.entries(items) as [id, { price, coins, data }]}
    <div class="flex flex-col rounded-2xl bg-theme-700 p-4 shadow-md">
      <h2 class="break-words text-2xl font-bold">{id}</h2>
      <p class="mt-4">
        Rewards for 1 item <span class="text-red-100"
          >({price.toLocaleString(undefined, { maximumFractionDigits: 1 })}c)</span
        >
      </p>
      <div class="mt-2 flex gap-4">
        <div class="flex h-32 w-32 flex-col rounded-2xl bg-theme-600 p-4">
          <p>Coins</p>
          <p class="mt-auto">+{coins.toLocaleString(undefined, { maximumFractionDigits: 1 })}c</p>
        </div>
        {#each Object.entries(data) as [key, value]}
          <div class="flex h-32 w-32 flex-col rounded-2xl bg-theme-600 p-4">
            <p>{key}</p>
            <p class="mt-auto">
              {typeof value == "number"
                ? value.toLocaleString(undefined, { maximumFractionDigits: 1 })
                : value}
            </p>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
