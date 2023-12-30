<script lang="ts">
  export let bazaar: Record<string, any>;
  export let items: Record<string, any>;

  let unstable: {
    name: string;

    instasell_volume: number;
    normal_buy_volume: number;
    underpaid_buy_volume: number;
    instabuy_ratio: number;

    instabuy_volume: number;
    normal_sell_volume: number;
    pricey_sell_volume: number;
    instasell_ratio: number;

    more: {
      buy_order_price: number;
      sell_order_price: number;
      underpaid_threshold: number;
      pricey_threshold: number;
    };
  }[];
  $: {
    unstable = [];
    for (const [id, product] of Object.entries(bazaar)) {
      const item = items[id];

      const buy_order_price = product.sell_summary[0]?.pricePerUnit;
      const sell_order_price = product.buy_summary[0]?.pricePerUnit;

      const instasell_volume = product["quick_status"]["sellMovingWeek"] / (7 * 24);
      const instabuy_volume = product["quick_status"]["buyMovingWeek"] / (7 * 24);

      let underpaid_threshold = Math.min(
        ...[item?.npc_sell_price / 5, buy_order_price / 5].filter((p) => !isNaN(p)),
      );
      if (buy_order_price && buy_order_price - 1 < underpaid_threshold) {
        underpaid_threshold = buy_order_price - 1;
      }
      let pricey_threshold = Math.max(
        ...[item?.npc_sell_price * 2, sell_order_price * 2].filter((p) => !isNaN(p)),
      );

      let normal_buy_volume = 0;
      let underpaid_buy_volume = 0;
      for (const buy_order of product.sell_summary) {
        if (buy_order["pricePerUnit"] >= underpaid_threshold) {
          normal_buy_volume += buy_order["amount"];
        } else {
          underpaid_buy_volume += buy_order["amount"];
        }
      }

      let normal_sell_volume = 0;
      let pricey_sell_volume = 0;
      for (const sell_order of product.buy_summary) {
        if (sell_order["pricePerUnit"] < pricey_threshold) {
          normal_sell_volume += sell_order["amount"];
        } else {
          pricey_sell_volume += sell_order["amount"];
        }
      }

      unstable.push({
        name: item ? item.name : id,

        instasell_volume,
        normal_buy_volume,
        underpaid_buy_volume,
        instabuy_ratio: instasell_volume / normal_buy_volume,

        instabuy_volume,
        normal_sell_volume,
        pricey_sell_volume,
        instasell_ratio: instabuy_volume / normal_sell_volume,

        more: {
          buy_order_price,
          sell_order_price,
          underpaid_threshold,
          pricey_threshold,
        },
      });
    }
  }
</script>

<div class="grid gap-8 lg:grid-cols-2">
  <div>
    <h2 class="mb-2 text-2xl font-bold">Low buy orders</h2>
    <div class="mb-8 grid grid-cols-3 gap-2">
      <div>
        <p class="font-bold">1</p>
        <p>Mass instasell</p>
      </div>
      <div>
        <p class="font-bold">2</p>
        <p>Buy orders are fulfilled</p>
      </div>
      <div>
        <p class="font-bold">3</p>
        <p>Not enough buy orders. Price goes down.</p>
      </div>
    </div>
    <div class="wrapper gap-4">
      {#each unstable
        .filter((item) => Number.isFinite(item.instabuy_ratio) && item.instabuy_ratio > 1)
        .toSorted((a, b) => b.instabuy_ratio - a.instabuy_ratio) as item (item.name)}
        <div class="flex flex-col rounded-2xl bg-theme-700 p-4 shadow-md">
          <h2 class="break-words text-2xl font-bold">{item.name}</h2>
          <div class="mt-auto flex flex-col gap-1 pt-4">
            <div class="flex-1 rounded-md rounded-t-xl bg-theme-600 p-2">
              <p class="text-theme-50">Items in buy orders</p>
              <p>
                {item.normal_buy_volume.toLocaleString()}
                {#if item.underpaid_buy_volume}
                  <span class="opacity-80">reasonably priced</span>
                {/if}
              </p>
            </div>
            <div class="flex-1 rounded-md bg-theme-600 p-2">
              <p class="text-theme-50">Instasells/hr</p>
              <p>
                {Math.round(item.instasell_volume).toLocaleString()}
                <span class="opacity-80">average</span>
              </p>
            </div>
            <div class="flex-1 rounded-md rounded-b-xl bg-theme-600 p-2">
              <p class="text-theme-50">More</p>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p>
                    {item.more.buy_order_price.toLocaleString(undefined, {
                      maximumFractionDigits: 1,
                    })}c
                  </p>
                  <p class="opacity-80">Best paying buy offer</p>
                </div>
                <div>
                  {#if item.underpaid_buy_volume}
                    <p>
                      {item.underpaid_buy_volume.toLocaleString()}
                    </p>
                    <p>
                      paying under {item.more.underpaid_threshold.toLocaleString(undefined, {
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
  </div>
  <div>
    <h2 class="mb-2 text-2xl font-bold">Low sell orders</h2>
    <div class="mb-8 grid grid-cols-3 gap-2">
      <div>
        <p class="font-bold">1</p>
        <p>Mass instabuy</p>
      </div>
      <div>
        <p class="font-bold">2</p>
        <p>Sell orders are fulfilled</p>
      </div>
      <div>
        <p class="font-bold">3</p>
        <p>Not enough sell orders. Price goes up.</p>
      </div>
    </div>
    <div class="wrapper gap-4">
      {#each unstable
        .filter((item) => Number.isFinite(item.instasell_ratio) && item.instasell_ratio > 1)
        .toSorted((a, b) => b.instasell_ratio - a.instasell_ratio) as item (item.name)}
        <div class="flex flex-col rounded-2xl bg-theme-700 p-4 shadow-md">
          <h2 class="break-words text-2xl font-bold">{item.name}</h2>
          <div class="mt-auto flex flex-col gap-1 pt-4">
            <div class="flex-1 rounded-md rounded-t-xl bg-theme-600 p-2">
              <p class="text-theme-50">Items in sell orders</p>
              <p>
                {item.normal_sell_volume.toLocaleString()}
                {#if item.pricey_sell_volume}
                  <span class="opacity-80">reasonably priced</span>
                {/if}
              </p>
            </div>
            <div class="flex-1 rounded-md bg-theme-600 p-2">
              <p class="text-theme-50">Instabuys/hr</p>
              <p>
                {Math.round(item.instabuy_volume).toLocaleString()}
                <span class="opacity-80">average</span>
              </p>
            </div>
            <div class="flex-1 rounded-md rounded-b-xl bg-theme-600 p-2">
              <p class="text-theme-50">More</p>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p>
                    {item.more.sell_order_price.toLocaleString(undefined, {
                      maximumFractionDigits: 1,
                    })}c
                  </p>
                  <p class="opacity-80">Cheapest sell offer</p>
                </div>
                <div>
                  {#if item.pricey_sell_volume}
                    <p>
                      {item.pricey_sell_volume.toLocaleString()}
                    </p>
                    <p>
                      requesting over {item.more.pricey_threshold.toLocaleString(undefined, {
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
  </div>
</div>

<style>
  .wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  }
</style>
