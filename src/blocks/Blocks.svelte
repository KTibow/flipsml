<script lang="ts">
  import { type BazaarItem } from "../common";
  export let bazaar: Record<string, BazaarItem>;
  export let items: Record<string, any>;
  export let settings: {
    buyPricing: string;
    sellPricing: string;
    sort: string;
    tax: number;
  };

  const getName = (id: string) => {
    const i = items[id];
    return i ? i.name : id;
  };

  let getPrice: (id: string) => number, getSellPrice: (id: string) => number;
  $: settings,
    (getPrice = (id: string) => {
      const b = bazaar[id];
      if (!b) console.info("No bazaar data for", id);
      const buyPrice = b.sell_summary[0]?.pricePerUnit;
      const instantBuyPrice = b.buy_summary[0]?.pricePerUnit;
      return (
        ((100 + settings.tax) / 100) *
        (instantBuyPrice * +settings.buyPricing + buyPrice * (1 - +settings.buyPricing))
      );
    });
  $: settings,
    (getSellPrice = (id: string) => {
      const b = bazaar[id];
      const sellPrice = b.buy_summary[0]?.pricePerUnit;
      const instantSellPrice = b.sell_summary[0]?.pricePerUnit;
      return (
        ((100 + settings.tax) / 100) *
        (instantSellPrice * +settings.sellPricing + sellPrice * (1 - +settings.sellPricing))
      );
    });

  const localeSettings = [
    undefined,
    {
      maximumFractionDigits: 1,
    },
  ] as const;

  const relationships = [
    { input: "COAL", inputCount: 160, output: "ENCHANTED_COAL" },
    { input: "ENCHANTED_COAL", inputCount: 160, output: "ENCHANTED_COAL_BLOCK" },
    { input: "COBBLESTONE", inputCount: 160, output: "ENCHANTED_COBBLESTONE" },
    { input: "DIAMOND", inputCount: 160, output: "ENCHANTED_DIAMOND" },
    { input: "ENCHANTED_DIAMOND", inputCount: 160, output: "ENCHANTED_DIAMOND_BLOCK" },
    { input: "EMERALD", inputCount: 160, output: "ENCHANTED_EMERALD" },
    { input: "ENCHANTED_EMERALD", inputCount: 160, output: "ENCHANTED_EMERALD_BLOCK" },
    {
      input: "ENCHANTMENT_ULTIMATE_WISDOM_1",
      inputCount: 16,
      output: "ENCHANTMENT_ULTIMATE_WISDOM_5",
    },
    { input: "ENDER_STONE", inputCount: 160, output: "ENCHANTED_ENDSTONE" },
    { input: "FLINT", inputCount: 160, output: "ENCHANTED_FLINT" },
    { input: "GLOWSTONE_DUST", inputCount: 160, output: "ENCHANTED_GLOWSTONE_DUST" },
    { input: "ENCHANTED_GLOWSTONE_DUST", inputCount: 160, output: "ENCHANTED_GLOWSTONE" },
    { input: "ENCHANTED_GOLD", inputCount: 160, output: "ENCHANTED_GOLD_BLOCK" },
    { input: "GOLD_INGOT", inputCount: 160, output: "ENCHANTED_GOLD" },
    { input: "ICE", inputCount: 160, output: "ENCHANTED_ICE" },
    { input: "ENCHANTED_ICE", inputCount: 160, output: "ENCHANTED_PACKED_ICE" },
    { input: "INK_SACK", inputCount: 80, output: "ENCHANTED_INK_SACK" },
    { input: "INK_SACK:4", inputCount: 160, output: "ENCHANTED_LAPIS_LAZULI" },
    { input: "ENCHANTED_IRON", inputCount: 160, output: "ENCHANTED_IRON_BLOCK" },
    { input: "IRON_INGOT", inputCount: 160, output: "ENCHANTED_IRON" },
    { input: "ENCHANTED_LAPIS_LAZULI", inputCount: 160, output: "ENCHANTED_LAPIS_LAZULI_BLOCK" },
    { input: "MITHRIL_ORE", inputCount: 160, output: "ENCHANTED_MITHRIL" },
    { input: "NETHERRACK", inputCount: 160, output: "ENCHANTED_NETHERRACK" },
    { input: "OBSIDIAN", inputCount: 160, output: "ENCHANTED_OBSIDIAN" },
    { input: "QUARTZ", inputCount: 160, output: "ENCHANTED_QUARTZ" },
    { input: "REDSTONE", inputCount: 160, output: "ENCHANTED_REDSTONE" },
    { input: "ENCHANTED_REDSTONE", inputCount: 160, output: "ENCHANTED_REDSTONE_BLOCK" },
    { input: "SAND", inputCount: 160, output: "ENCHANTED_SAND" },
    { input: "SAND:1", inputCount: 160, output: "ENCHANTED_RED_SAND" },
  ];
  $: relationshipsExt = relationships
    .map((r) => {
      const inputBuy = getPrice(r.input) * r.inputCount;
      const inputSell = getSellPrice(r.input) * r.inputCount;
      const outputBuy = getPrice(r.output);
      const outputSell = getSellPrice(r.output);
      return {
        ...r,
        inputBuy,
        inputSell,
        outputBuy,
        outputSell,
      };
    })
    .sort(
      settings.sort === "flip"
        ? (a, b) => b.outputSell - b.inputBuy - (a.outputSell - a.inputBuy)
        : (a, b) => b.inputSell - b.outputBuy - (a.inputSell - a.outputBuy),
    );
</script>

<div class="wrapper gap-4">
  {#each relationshipsExt as { input, inputCount, output, inputBuy: buyInput, inputSell: sellInput, outputBuy: buyOutput, outputSell: sellOutput } (output)}
    <div class="flex flex-col gap-1 rounded-2xl bg-theme-700 p-4 shadow-md">
      <div class="flex-1 rounded-md rounded-t-xl bg-theme-600 p-2">
        <p class="font-bold">{getName(input)} x{inputCount}</p>
        <p class="text-orange-200">Buy: {buyInput.toLocaleString(...localeSettings)}c</p>
        <p class="text-purple-100">Sell: {sellInput.toLocaleString(...localeSettings)}c</p>
      </div>

      <div class="flex-1 rounded-md bg-theme-600 p-2">
        <p class="font-bold">{getName(output)}</p>
        <p class="text-purple-100">Buy: {buyOutput.toLocaleString(...localeSettings)}c</p>
        <p class="text-orange-200">Sell: {sellOutput.toLocaleString(...localeSettings)}c</p>
      </div>

      <div class="flex-1 rounded-md bg-theme-600 p-2">
        <p class="font-bold">
          Profit from using the market instead of <span class="text-purple-100">crafting</span>
        </p>
        <p>{(sellInput - buyOutput).toLocaleString(...localeSettings)}c</p>
      </div>

      <div class="flex-1 rounded-md rounded-b-xl bg-theme-600 p-2">
        <p class="font-bold">Profit from the craft <span class="text-orange-200">flip</span></p>
        <p>{(-buyInput + sellOutput).toLocaleString(...localeSettings)}c</p>
      </div>
    </div>
  {/each}
</div>

<style>
  .wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  }
</style>
