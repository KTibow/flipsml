<script lang="ts">
  import { type BazaarItem } from "../common";

  type Settings = {
    buyPricing: string;
    budgetPrice: number;
    minCoinsUsed: number;
    budgetSlots: number;
    budgetTax: number;
  };

  type Flip = {
    id: string;
    name: any;
    buyPrice: number;
    sellPrice: number;
    supply: number;
    usable: number;
    coinsUsed: number;
    budgetProfit: number;
  };

  export let bazaar: Record<string, BazaarItem>;
  export let items: Record<string, any>;
  export let settings: Settings;

  let flips: Flip[];

  const stackSizes: Record<string, number> = {
    SALMON_OPAL: 1,
    CANDY_CORN: 1,
    ENDER_PEARL: 16,
    ENCHANTED_ENDER_PEARL: 16,
  };

  const calcUsable = (price: number, id: string, s: Settings) => {
    const count = Math.floor(s.budgetPrice / price);
    const stacks = count / (stackSizes[id] || 64);
    if (stacks > s.budgetSlots) return s.budgetSlots * (stackSizes[id] || 64);
    return count;
  };
  const getPrice = (id: string) => {
    const b = bazaar[id];
    const buyPrice = b.sell_summary[0]?.pricePerUnit;
    const instantBuyPrice = b.buy_summary[0]?.pricePerUnit;
    return (
      ((100 + settings.budgetTax) / 100) *
      (instantBuyPrice * +settings.buyPricing + buyPrice * (1 - +settings.buyPricing))
    );
  };

  $: {
    const flipsList = [];
    const ids = new Set([...Object.keys(items), ...Object.keys(bazaar)]);
    for (const id of ids) {
      const item = items[id];
      const b = bazaar[id];
      if (item && b) {
        const buy = getPrice(id);

        const profit = item.npc_sell_price - buy;
        if (profit && profit > 0 && b.quick_status.sellMovingWeek > 7 * 8 * 25) {
          flipsList.push({
            id: id,
            name: item.name,
            buyPrice: buy,
            sellPrice: item.npc_sell_price,
            supply: b.quick_status.sellMovingWeek / (7 * 8),
          });
        }
      }
    }
    flips = flipsList
      .map((flip) => {
        let usable = calcUsable(flip.buyPrice, flip.id, settings);
        if (usable > flip.supply) usable = flip.supply;
        const maxByNpcSell = Math.floor(500_000_000 / flip.sellPrice);
        usable = Math.min(usable, maxByNpcSell);
        usable = Math.floor(usable);

        const profit = flip.sellPrice - flip.buyPrice;
        const coinsUsed = usable * flip.buyPrice;

        return {
          ...flip,
          usable,
          coinsUsed,
          budgetProfit: profit * usable,
        };
      })
      .filter((flip) => flip.coinsUsed >= settings.minCoinsUsed);
    flips.sort((a, b) => b.budgetProfit - a.budgetProfit);
  }
</script>

{#if flips.length > 0}
  <div class="wrapper gap-4">
    {#each flips as flip}
      <div class="bg-theme-700 flex flex-col rounded-2xl p-4 shadow-md">
        <h2 class="text-2xl font-bold break-words">{flip.name}</h2>
        <div class="mt-auto flex flex-col gap-1 pt-4">
          <div class="bg-theme-600 flex-1 rounded-md rounded-t-xl p-2">
            <p class="text-red-100">Buy</p>
            <p>{flip.buyPrice.toLocaleString()}c</p>
          </div>
          <div class="bg-theme-600 flex-1 rounded-md p-2">
            <p class="text-green-100">Sell</p>
            <p>{flip.sellPrice.toLocaleString()}c</p>
          </div>
          <div class="bg-theme-600 flex-1 rounded-md rounded-b-xl p-2">
            <p class="text-theme-50">Flip</p>
            <div class="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p>
                  {flip.coinsUsed.toLocaleString(undefined, {
                    maximumFractionDigits: 1,
                  })}
                </p>
                <p class="opacity-80">Cost</p>
              </div>
              <div>
                <p>
                  {flip.usable.toLocaleString()}
                </p>
                <p class="opacity-80">Count</p>
              </div>
              <div>
                <p>{(flip.usable * flip.sellPrice).toLocaleString()}</p>
                <p class="opacity-80">Sold</p>
              </div>
              <div>
                <p class="text-theme-50">{flip.budgetProfit.toLocaleString()}</p>
                <p class="opacity-80">Profit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <p class="bg-theme-700 rounded-2xl p-4">
    No flips match the current max budget, slot limit, and minimum coins used.
  </p>
{/if}

<style>
  .wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  }
</style>
