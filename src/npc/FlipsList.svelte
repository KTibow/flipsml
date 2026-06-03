<script lang="ts">
  import { type BazaarItem } from "../common";

  type Settings = {
    buyPricing: string;
    budgetPrice: number;
    minCoinsUsed: number;
    budgetSlots: number;
    budgetTax: number;
    hideLowVolume: number;
    capNpcSell: boolean;
  };

  type Flip = {
    id: string;
    name: any;
    buyPrice: number;
    sellPrice: number;
    usable: number;
    coinsUsed: number;
    budgetProfit: number;
    limitReason: string;
    expectedTime: string;
  };

  const formatTime = (hours: number) => {
    if (!isFinite(hours) || hours <= 0) return "N/A";
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
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
        if (
          profit &&
          profit > 0 &&
          (settings.hideLowVolume === 0 ||
            b.quick_status.sellMovingWeek > 7 * 8 * settings.hideLowVolume)
        ) {
          flipsList.push({
            id: id,
            name: item.name,
            buyPrice: buy,
            sellPrice: item.npc_sell_price,
            sellVolume: b.quick_status.sellMovingWeek,
            buyVolume: b.quick_status.buyMovingWeek,
          });
        }
      }
    }
    flips = flipsList
      .map((flip) => {
        const count = Math.floor(settings.budgetPrice / flip.buyPrice);
        const stacks = count / (stackSizes[flip.id] || 64);
        let usable = count;
        let limitReason = "budget";
        if (stacks > settings.budgetSlots) {
          usable = settings.budgetSlots * (stackSizes[flip.id] || 64);
          limitReason = "slots";
        }

        const pricingWeight = +settings.buyPricing;
        const volume = pricingWeight * flip.sellVolume + (1 - pricingWeight) * flip.buyVolume;
        const supply = volume / 56;
        if (usable > supply) {
          usable = supply;
          limitReason = "supply";
        }
        if (settings.capNpcSell) {
          const maxByNpcSell = Math.floor(500_000_000 / flip.sellPrice);
          if (maxByNpcSell < usable) {
            usable = maxByNpcSell;
            limitReason = "npc sell cap";
          }
        }
        usable = Math.floor(usable);

        const profit = flip.sellPrice - flip.buyPrice;
        const coinsUsed = usable * flip.buyPrice;
        const hours = usable / (volume / (7 * 24));
        const expectedTime = formatTime(hours);

        console.log(
          `%c${flip.name}`,
          "font-weight:bold",
          `budget=${count}`,
          `slots=${Math.floor(settings.budgetSlots * (stackSizes[flip.id] || 64))}`,
          `supply=${Math.floor(supply)}`,
          settings.capNpcSell && `npcCap=${Math.floor(500_000_000 / flip.sellPrice)}`,
          `→ ${usable} (${limitReason})`,
        );

        return {
          ...flip,
          usable,
          coinsUsed,
          budgetProfit: profit * usable,
          limitReason,
          expectedTime,
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
          <p class="text-red-100">
            Buy <abbr
              class="text-sm opacity-60"
              title="{flip.usable.toLocaleString()} &bull; {flip.expectedTime} &bull; {flip.limitReason}"
            >
              {flip.coinsUsed.toLocaleString(undefined, {
                maximumFractionDigits: 1,
              })} total
            </abbr>
          </p>
            <p>{flip.buyPrice.toLocaleString()}c</p>
          </div>
          <div class="bg-theme-600 flex-1 rounded-md p-2">
            <p class="text-green-100">
              Sell <span class="text-sm opacity-60">
                {(flip.usable * flip.sellPrice).toLocaleString()} total
              </span>
            </p>
            <p>{flip.sellPrice.toLocaleString()}c</p>
          </div>
          <div class="bg-theme-600 flex-1 rounded-md rounded-b-xl p-2">
            <p class="text-theme-50">Profit</p>
            <p class="text-theme-50 font-bold">{flip.budgetProfit.toLocaleString()}</p>
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
