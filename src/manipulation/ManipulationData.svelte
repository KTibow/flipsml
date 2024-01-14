<script lang="ts">
  export let bazaar: Record<string, any>;
  export let settings: {
    budget: number;
    tax: number;
  };

  $: tax = (100 + settings.tax) / 100;

  const calculateProfit = (item: string) => {
    const itemData = bazaar[item];
    const instaBuy = itemData.buy_summary[0]?.pricePerUnit;
    const goalLow = instaBuy * 1.5;
    const goalHigh = Math.min(goalLow + 10, goalLow * 1.1);
    if (!isFinite(goalLow)) return;

    const initialBuy = { cost: 0, volume: 0, excludedVolume: 0 };
    for (const order of itemData.buy_summary) {
      if (order.pricePerUnit > goalHigh) {
        initialBuy.excludedVolume += order.amount;
      } else {
        initialBuy.volume += order.amount;
        initialBuy.cost += order.pricePerUnit * tax * order.amount;
      }
    }

    const instaboughtDaily = itemData.quick_status.buyMovingWeek / 7;
    const instasoldDaily = itemData.quick_status.sellMovingWeek / 7;
    let coins = -initialBuy.cost;
    let items = initialBuy.volume;
    let totalIn = 0;
    let totalOut = 0;

    for (const time of ["6h", "12h", "18h", "24h"]) {
      const soldIn6h = Math.floor(Math.min(items, instaboughtDaily / 4));
      totalOut += soldIn6h;
      const intakeIn6h = Math.floor(instasoldDaily / 4);
      totalIn += intakeIn6h;
      items -= soldIn6h;
      coins += soldIn6h * goalHigh;
      items += intakeIn6h;
      coins -= intakeIn6h * goalLow * tax;
    }

    const instabuyPrice = itemData.buy_summary[0]?.pricePerUnit;
    const instasellPrice = itemData.sell_summary[0]?.pricePerUnit;
    const averagePrice = (instabuyPrice + instasellPrice) / 2;
    const liquidated = Math.floor(items);
    const liquidatedProfit = liquidated * averagePrice;
    coins += liquidatedProfit;
    items = 0;

    return {
      initialBuy,
      coins,
      liquidated,
      liquidatedProfit,
      instabuyPrice,
      instasellPrice,
      goalLow,
      goalHigh,
      totalIn,
      totalOut,
    };
  };

  let data: Record<string, NonNullable<ReturnType<typeof calculateProfit>>> = {};
  $: {
    data = {};
    for (const item of Object.keys(bazaar)) {
      const result = calculateProfit(item);
      if (!result) continue;
      if (result.initialBuy.cost < settings.budget && result.coins > 0) data[item] = result;
    }
  }
</script>

<div class="wrapper gap-4">
  {#each Object.entries(data) as [item, { initialBuy, coins, liquidated, liquidatedProfit, instabuyPrice, goalLow, goalHigh, totalIn, totalOut }]}
    <div class="flex flex-col rounded-2xl bg-theme-700 p-4 shadow-md">
      <h2 class="break-words text-2xl font-bold">{item}</h2>
      <div class="mt-auto flex flex-col gap-1 pt-4">
        <div class="flex-1 rounded-md rounded-t-xl bg-theme-600 p-2">
          <p class="text-red-100">Bump up the instabuy price</p>
          <div class="flex items-center justify-between gap-1">
            <span>{instabuyPrice.toLocaleString(undefined, { maximumFractionDigits: 1 })}c</span>
            <span>→</span>
            <span>{goalHigh.toLocaleString(undefined, { maximumFractionDigits: 1 })}c</span>
          </div>
          <p class="mt-1 opacity-80">
            buy {initialBuy.volume} items worth {initialBuy.cost.toLocaleString(undefined, {
              maximumFractionDigits: 1,
            })}c from sell orders
          </p>
        </div>
        <div class="flex-1 rounded-md bg-theme-600 p-2">
          <p class="text-blue-200">Keep trading for 24h</p>
          <p>
            ☑️ Create a buy order at {goalLow.toLocaleString(undefined, {
              maximumFractionDigits: 1,
            })}c to keep it from dropping
            <span class="opacity-80">taking in {totalIn.toLocaleString()}x</span>
          </p>
          <p>
            ☑️ Continously sell out your items to instabuyers at {goalHigh.toLocaleString(
              undefined,
              { maximumFractionDigits: 1 },
            )}c
            <span class="opacity-80">selling {totalOut.toLocaleString()}x</span>
          </p>
        </div>
        <div class="flex-1 rounded-md bg-theme-600 p-2">
          <p class="text-green-100">Liquidate what's left</p>
          <p>{liquidatedProfit.toLocaleString(undefined, { maximumFractionDigits: 1 })}c</p>
          <p class="opacity-80">
            From selling your remaining {liquidated.toLocaleString()}
            {liquidated == 1 ? "item" : "items"}
          </p>
        </div>
        <div class="flex-1 rounded-md rounded-b-xl bg-theme-600 p-2">
          <p class="text-theme-50">Profit</p>
          <p>{coins.toLocaleString(undefined, { maximumFractionDigits: 1 })}c</p>
        </div>
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
