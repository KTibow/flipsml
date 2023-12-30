<script lang="ts">
  export let bazaar: Record<string, any>;
  export let items: Record<string, any>;

  let crash: {
    name: string;
    insta_buy_volume: number;
    normal_sell_volume: number;
    underpaid_sell_volume: number;
    more: {
      sell_price: number;
      volume_ratio: number;
      threshold: number;
    };
  }[];
  $: {
    crash = [];
    for (const [id, product] of Object.entries(bazaar)) {
      const item = items[id];
      if (!item) continue;

      const sell_price: number = product.buy_summary[0]?.pricePerUnit;
      const insta_buy_volume = product["quick_status"]["buyMovingWeek"] / (7 * 24);
      let threshold = Math.max(
        ...[item.npc_sell_price * 2, sell_price * 2].filter((p) => !isNaN(p)),
      );
      // if (sell_price && sell_price - 1 < threshold) threshold = sell_price - 1;
      if (threshold < 0) threshold = 0;

      let normal_sell_volume = 0;
      let underpaid_sell_volume = 0;

      for (const sell_order of product.buy_summary) {
        if (sell_order["pricePerUnit"] < threshold) {
          normal_sell_volume += sell_order["amount"];
        } else {
          underpaid_sell_volume += sell_order["amount"];
        }
      }

      if (normal_sell_volume === 0) {
        continue;
      }

      const volume_ratio = insta_buy_volume / normal_sell_volume;
      if (volume_ratio > 1) {
        const data = {
          name: item.name,
          insta_buy_volume,
          normal_sell_volume,
          underpaid_sell_volume,
          more: {
            sell_price,
            volume_ratio,
            threshold,
          },
        };
        crash.push(data);
      }
    }

    crash.sort((a, b) => b.more.volume_ratio - a.more.volume_ratio);
  }
</script>

<div class="wrapper gap-4">
  {#each crash as item}
    <div class="flex flex-col rounded-2xl bg-theme-700 p-4 shadow-md">
      <h2 class="break-words text-2xl font-bold">{item.name}</h2>
      <div class="mt-auto flex flex-col gap-1 pt-4">
        <div class="flex-1 rounded-md rounded-t-xl bg-theme-600 p-2">
          <p class="text-theme-50">Items in sell orders</p>
          <p>
            {item.normal_sell_volume.toLocaleString()}
            {#if item.underpaid_sell_volume}
              <span class="opacity-80">reasonably priced</span>
            {/if}
          </p>
        </div>
        <div class="flex-1 rounded-md rounded-t-xl bg-theme-600 p-2">
          <p class="text-theme-50">Instabuys/hr</p>
          <p>
            {item.insta_buy_volume.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })} <span class="opacity-80">average</span>
          </p>
        </div>
        <div class="flex-1 rounded-md rounded-t-xl bg-theme-600 p-2">
          <p class="text-theme-50">More</p>
          <div class="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p>
                {item.more.sell_price.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}c
              </p>
              <p class="opacity-80">Cheapest sell offer</p>
            </div>
            <div>
              {#if item.underpaid_sell_volume}
                <p>
                  {item.underpaid_sell_volume.toLocaleString()}
                </p>
                <p>
                  requesting over {item.more.threshold.toLocaleString(undefined, {
                    maximumFractionDigits: 1,
                  })}c
                </p>
              {:else}
                <p>No items</p>
              {/if}
              <p class="opacity-80">Excluded</p>
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
