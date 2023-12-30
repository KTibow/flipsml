<script lang="ts">
  export let bazaar: Record<string, any>;
  export let items: Record<string, any>;
  export let settings: {
    buyPricing: string;
    budgetPrice: number;
    budgetSlots: number;
    budgetTax: number;
  };

  let flips: {
    usable: number;
    budgetProfit: number;
    id: string;
    name: any;
    buyPrice: number;
    sellPrice: any;
  }[];

  const stackSizes: Record<string, number> = {
    SALMON_OPAL: 1,
    CANDY_CORN: 1,
    ENDER_PEARL: 16,
    ENCHANTED_ENDER_PEARL: 16,
  };

  const calcUsable = (price: number, id: string, s: typeof settings) => {
    const count = Math.floor(settings.budgetPrice / price);
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
        if (profit && profit > 0 && b.quick_status.sellMovingWeek > 1400) {
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
    flips = flipsList.map((flip) => {
      let usable = calcUsable(flip.buyPrice, flip.id, settings);
      if (usable > flip.supply) usable = flip.supply;
      usable = Math.floor(usable);

      const profit = flip.sellPrice - flip.buyPrice;
      return {
        ...flip,
        usable,
        budgetProfit: profit * usable,
      };
    });
    flips.sort((a, b) => b.budgetProfit - a.budgetProfit);
  }
</script>

<div class="wrapper gap-4">
  {#each flips as flip}
    <div class="flex flex-col rounded-2xl bg-theme-700 p-4 shadow-md">
      <h2 class="break-words text-2xl font-bold">{flip.name}</h2>
      <div class="mt-auto flex flex-col gap-1 pt-4">
        <div class="flex-1 rounded-md rounded-t-xl bg-theme-600 p-2">
          <p class="text-red-100">Buy</p>
          <p>{flip.buyPrice.toLocaleString()}c</p>
        </div>
        <div class="flex-1 rounded-md bg-theme-600 p-2">
          <p class="text-green-100">Sell</p>
          <p>{flip.sellPrice.toLocaleString()}c</p>
        </div>
        <div class="flex-1 rounded-md rounded-b-xl bg-theme-600 p-2">
          <p class="text-theme-50">Flip</p>
          <div class="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p>
                {(flip.usable * flip.buyPrice).toLocaleString(undefined, {
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

<style>
  .wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  }
</style>
