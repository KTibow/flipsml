<script lang="ts">
  import VirtualList from "@sveltejs/svelte-virtual-list";
  import { tick } from "svelte";
  import { calculatePrice, calculateOutput, minions, storageProgression } from "./minions";

  export let bazaar: Record<string, any>;
  export let items: Record<string, any>;
  export let settings: {
    budget: number;
    tax: number;
    afkHours: number;
    afkDivisor: number;
  };

  let presets: {
    name: string;
    tier: string;
    storage: "none" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
    hopper: "none" | "budget" | "enchanted";
    diamond_spreading: boolean;
    compactor: "none" | "block" | "super";
    resources: Record<string, number>;
    price: number;
    revenue: number;
    profit: number;
  }[] = [];
  let state: "empty" | "updating" | "full" = "empty";
  const updatePresets = async () => {
    state = "updating";
    presets = [];
    await new Promise((r) => setTimeout(r));

    const tax = (100 + settings.tax) / 100;
    const baseConfig = {
      bazaar,
      items,
      tax,
      minutes: (settings.afkHours / settings.afkDivisor) * 60,
    };
    for (const [name, minion] of Object.entries(minions)) {
      for (const tier in minion.tiers)
        for (const compactor of ["none", "block", "super"] as const)
          for (const diamond_spreading of [false, true]) {
            const config = {
              ...baseConfig,
              tier: +tier,
              diamond_spreading,
              compactor,
            } as const;
            const price = calculatePrice(minion, config);
            if (price > settings.budget) continue;

            const resources = calculateOutput(minion, config);
            for (const id in resources) {
              resources[id] *= settings.afkDivisor;
            }

            let baseRevenue = 0;
            for (const [id, amount] of Object.entries(resources)) {
              const b = bazaar[id];
              const item = items[id];
              const instasell_price = b?.sell_summary[0]?.pricePerUnit;
              if (b && !instasell_price) console.warn("No instasell price for", id);
              const npc_price = item?.npc_sell_price;
              const best_price = Math.max(instasell_price || 0, npc_price || 0);
              baseRevenue += best_price * amount;
            }
            if (baseRevenue - price < 0) continue;

            for (const hopper of ["none", "budget", "enchanted"] as const) {
              for (const storage of [
                "none",
                "small",
                "medium",
                "large",
                "xlarge",
                "xxlarge",
              ] as const) {
                let priceAddon = 0;
                let slots = storageProgression[tier] / 64;
                if (storage == "small") {
                  const b = bazaar["SMALL_ENCHANTED_CHEST"];
                  const instabuy_price = b.buy_summary[0].pricePerUnit;
                  priceAddon += instabuy_price * tax;
                  slots += 3;
                }
                if (storage == "medium") {
                  const b = bazaar["MEDIUM_ENCHANTED_CHEST"];
                  const instabuy_price = b.buy_summary[0].pricePerUnit;
                  priceAddon += instabuy_price * tax;
                  slots += 9;
                }
                if (storage == "large") {
                  const b = bazaar["LARGE_ENCHANTED_CHEST"];
                  const instabuy_price = b.buy_summary[0].pricePerUnit;
                  priceAddon += instabuy_price * tax;
                  slots += 15;
                }
                if (storage == "xlarge") {
                  const b = bazaar["XLARGE_ENCHANTED_CHEST"];
                  const instabuy_price = b.buy_summary[0].pricePerUnit;
                  priceAddon += instabuy_price * tax;
                  slots += 21;
                }
                if (storage == "xxlarge") {
                  const b = bazaar["XXLARGE_ENCHANTED_CHEST"];
                  const instabuy_price = b.buy_summary[0].pricePerUnit;
                  priceAddon += instabuy_price * tax;
                  slots += 27;
                }
                if (hopper == "budget") {
                  const b = bazaar["BUDGET_HOPPER"];
                  const instabuy_price = b.buy_summary[0].pricePerUnit;
                  priceAddon += instabuy_price * tax;
                }
                if (hopper == "enchanted") {
                  const b = bazaar["ENCHANTED_HOPPER"];
                  const instabuy_price = b.buy_summary[0].pricePerUnit;
                  priceAddon += instabuy_price * tax;
                }
                if (price + priceAddon > settings.budget) continue;

                const item_count = Object.values(resources).reduce((a, b) => a + b, 0);
                const fraction_stored = slots * 64 < item_count ? (slots * 64) / item_count : 1;
                const price_multiplier =
                  fraction_stored +
                  (1 - fraction_stored) *
                    (hopper == "enchanted" ? 0.9 : hopper == "budget" ? 0.5 : 0);
                const revenue = baseRevenue * price_multiplier;

                const profit = revenue - (price + priceAddon);
                if (profit < 0) continue;

                const item = {
                  name,
                  tier,
                  storage,
                  hopper,
                  diamond_spreading,
                  compactor,
                  resources,
                  price: price + priceAddon,
                  revenue,
                  profit,
                };
                presets.push(item);
              }
            }
          }
      presets.sort((a, b) => b.profit - a.profit);
      presets = presets;
      await tick();
    }
    state = "full";
  };

  let filter = "";
  $: filtered = presets.filter((p) => (filter ? filter == `${p.name} ${p.tier}` : true));
</script>

{#if state != "updating"}
  <div class="mb-6 flex gap-4">
    <button class="rounded-full bg-theme-700 px-3 py-2" on:click={updatePresets}>
      Recalculate
    </button>
    <select bind:value={filter} placeholder="Search" class="rounded-md bg-theme-700 px-3 py-2">
      <option value="">All minions</option>
      {#each Object.entries(minions) as [name, minion]}
        {#each Object.keys(minion.tiers) as tier}
          <option value="{name} {tier}">{name} {tier}</option>
        {/each}
      {/each}
    </select>
  </div>
{/if}
{#if state == "empty"}
  <p>Press Recalculate to view minions.</p>
{:else if state == "updating"}
  <p class="mb-6 py-2">recalculating...</p>
{:else if filtered.length == 0}
  <p>
    That type of minion isn't showing up here. Try increasing your budget or AFK time to make it
    more profitable.
  </p>
{/if}
<VirtualList items={filtered} let:item height="20rem">
  {@const describer = [
    `tier ${item.tier}`,
    item.storage != "none" ? `${item.storage} storage` : undefined,
    item.hopper != "none" ? `${item.hopper} hopper` : undefined,
    item.diamond_spreading ? "diamond spreading" : undefined,
    item.compactor != "none" ? `${item.compactor} compactor` : undefined,
  ]
    .filter(Boolean)
    .join(", ")}
  <div class="flex flex-col rounded-2xl bg-theme-700 p-4 shadow-md">
    <h2 class="mb-2 flex items-center">
      <span class="mr-6 break-words text-2xl font-bold">{item.name}</span>
      <div class="mr-2 rounded-full bg-indigo-500/20 px-3 py-2">
        {item.profit.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        <span class="opacity-80">profit</span>
      </div>
      <div class="mr-2 rounded-full bg-red-500/20 px-3 py-2">
        {item.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        <span class="opacity-80">buy</span>
      </div>
      <div class="rounded-full bg-green-500/20 px-3 py-2">
        {item.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        <span class="mr-2 opacity-80">revenue</span>
        {#each Object.entries(item.resources) as [id, amount]}
          {amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          <span class="mr-2 opacity-80">{id}</span>
        {/each}
      </div>
    </h2>
    <p>{describer}</p>
  </div>
</VirtualList>

<style>
  :global(svelte-virtual-list-viewport) {
    height: max(20rem, 1000dvh) !important;
  }
  :global(svelte-virtual-list-contents) {
    display: flex !important;
    flex-direction: column;
    gap: 1rem;
  }
</style>
