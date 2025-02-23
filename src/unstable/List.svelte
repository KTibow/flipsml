<script lang="ts">
  export let bazaar: Record<string, any>;
  export let items: Record<string, any>;

  let reverse = false;

  type Signal =
    | "orderToAverageRatio"
    | "spreadPercentage"
    | "buySellImbalance"
    | "liquidityBuffer"
    | "topOrderConcentration"
    | "priceImpactScore";

  type AnomalyType = "none" | "willLikelyIncreasePrice" | "willLikelyDecreasePrice";

  interface MarketData {
    product_id: string;
    sell_summary: { amount: number; pricePerUnit: number; orders: number }[];
    buy_summary: { amount: number; pricePerUnit: number; orders: number }[];
    quick_status: {
      productId: string;
      sellPrice: number;
      sellVolume: number;
      sellMovingWeek: number;
      sellOrders: number;
      buyPrice: number;
      buyVolume: number;
      buyMovingWeek: number;
      buyOrders: number;
    };
  }

  function getName(id: string) {
    const item = items[id];
    return item ? item.name : id;
  }

  function formatPrice(n: number) {
    return n ? n.toLocaleString("en-US", { maximumFractionDigits: 1 }) : "none";
  }

  function analyzeMarket(
    data: MarketData,
  ): Record<Signal, { value: number; anomaly: AnomalyType }> {
    const result: Record<Signal, { value: number; anomaly: AnomalyType }> = {} as Record<
      Signal,
      { value: number; anomaly: AnomalyType }
    >;
    const totalSellVolume = data.sell_summary.reduce((sum, order) => sum + order.amount, 0);
    const totalBuyVolume = data.buy_summary.reduce((sum, order) => sum + order.amount, 0);

    // 1. Order-to-Average Ratio
    const avgHourlySellVolume = data.quick_status.sellMovingWeek / (7 * 24);
    const avgHourlyBuyVolume = data.quick_status.buyMovingWeek / (7 * 24);
    const sellOrderRatio = data.quick_status.sellOrders / avgHourlySellVolume;
    const buyOrderRatio = data.quick_status.buyOrders / avgHourlyBuyVolume;

    result.orderToAverageRatio = {
      value: Math.min(sellOrderRatio, buyOrderRatio),
      anomaly:
        sellOrderRatio < 0.5 && buyOrderRatio > 0.5
          ? "willLikelyIncreasePrice"
          : buyOrderRatio < 0.5 && sellOrderRatio > 0.5
            ? "willLikelyDecreasePrice"
            : "none",
    };

    // 2. Spread Analysis
    const topBuyPrice = data.buy_summary[0]?.pricePerUnit || 0;
    const topSellPrice = data.sell_summary[0]?.pricePerUnit || 0;
    const spreadPercentage =
      topSellPrice > 0 ? ((topSellPrice - topBuyPrice) / topSellPrice) * 100 : 0;

    result.spreadPercentage = {
      value: spreadPercentage,
      anomaly:
        spreadPercentage > 5
          ? data.quick_status.buyVolume > data.quick_status.sellVolume
            ? "willLikelyIncreasePrice"
            : "willLikelyDecreasePrice"
          : "none",
    };

    // 3. Buy/Sell Order Imbalance
    const orderImbalance =
      totalSellVolume > 0 ? totalBuyVolume / totalSellVolume : totalBuyVolume > 0 ? Infinity : 1;
    result.buySellImbalance = {
      value: orderImbalance,
      anomaly:
        orderImbalance > 2
          ? "willLikelyIncreasePrice"
          : orderImbalance < 0.5
            ? "willLikelyDecreasePrice"
            : "none",
    };

    // 4. Liquidity Buffer
    const sellHoursOfLiquidity = totalSellVolume / avgHourlyBuyVolume;
    const buyHoursOfLiquidity = totalBuyVolume / avgHourlySellVolume;

    result.liquidityBuffer = {
      value: Math.min(sellHoursOfLiquidity, buyHoursOfLiquidity),
      anomaly:
        sellHoursOfLiquidity < 2 && buyHoursOfLiquidity > 2
          ? "willLikelyIncreasePrice"
          : buyHoursOfLiquidity < 2 && sellHoursOfLiquidity > 2
            ? "willLikelyDecreasePrice"
            : "none",
    };

    // 5. Top Order Concentration
    const totalSellOrders = data.sell_summary.reduce((sum, order) => sum + order.orders, 0);
    const totalBuyOrders = data.buy_summary.reduce((sum, order) => sum + order.orders, 0);
    const topTwoSellConcentration =
      (data.sell_summary.slice(0, 2).reduce((sum, order) => sum + order.orders, 0) /
        totalSellOrders) *
      100;
    const topTwoBuyConcentration =
      (data.buy_summary.slice(0, 2).reduce((sum, order) => sum + order.orders, 0) /
        totalBuyOrders) *
      100;

    result.topOrderConcentration = {
      value: Math.max(topTwoSellConcentration, topTwoBuyConcentration),
      anomaly:
        topTwoSellConcentration > 90 && topTwoBuyConcentration <= 90
          ? "willLikelyIncreasePrice"
          : topTwoBuyConcentration > 90 && topTwoSellConcentration <= 90
            ? "willLikelyDecreasePrice"
            : "none",
    };

    // 6. Price Impact Analysis
    const IMPACT_TARGET_PERCENT = 0.05; // 5% price movement

    // Calculate buy side impact
    let buySideVolume = 0;
    let i = 0;
    const buyTargetPrice = topBuyPrice * (1 - IMPACT_TARGET_PERCENT);
    while (i < data.buy_summary.length && data.buy_summary[i].pricePerUnit >= buyTargetPrice) {
      buySideVolume += data.buy_summary[i].amount;
      i++;
    }

    // Calculate sell side impact
    let sellSideVolume = 0;
    i = 0;
    const sellTargetPrice = topSellPrice * (1 + IMPACT_TARGET_PERCENT);
    while (i < data.sell_summary.length && data.sell_summary[i].pricePerUnit <= sellTargetPrice) {
      sellSideVolume += data.sell_summary[i].amount;
      i++;
    }

    const buyImpactScore = buySideVolume / avgHourlySellVolume;
    const sellImpactScore = sellSideVolume / avgHourlyBuyVolume;

    result.priceImpactScore = {
      value: Math.min(buyImpactScore, sellImpactScore),
      anomaly:
        sellImpactScore < 1 && buyImpactScore > 1
          ? "willLikelyIncreasePrice"
          : buyImpactScore < 1 && sellImpactScore > 1
            ? "willLikelyDecreasePrice"
            : "none",
    };

    return result;
  }

  function calculateNet(analysis) {
    return Object.values(analysis)
      .map((x) => x.anomaly)
      .map((x) => (x == "willLikelyIncreasePrice" ? 1 : x == "willLikelyDecreasePrice" ? -1 : 0))
      .reduce((a, b) => a + b, 0);
  }

  $: analyzed = Object.entries(bazaar)
    .map(([k, v]) => ({
      item: k,
      data: v,
      signals: analyzeMarket(v),
      net: calculateNet(analyzeMarket(v)),
    }))
    .sort(reverse ? (a, b) => a.net - b.net : (a, b) => b.net - a.net);
</script>

<table>
  <thead>
    <tr>
      <th class="pr-2 text-left">Item</th>
      <th class="text-theme-100 cursor-pointer pr-2 text-left" onclick={() => (reverse = !reverse)}
        >Net</th
      >
      <th class="text-left">Info</th>
    </tr>
  </thead>
  <tbody>
    {#each analyzed as { item, data, signals, net }}
      {@const willFly = Object.entries(signals).filter(
        ([k, v]) => v.anomaly == "willLikelyIncreasePrice",
      )}
      {@const willCrash = Object.entries(signals).filter(
        ([k, v]) => v.anomaly == "willLikelyDecreasePrice",
      )}
      <tr class="h-8">
        <td>{getName(item)}</td>
        <td
          class:text-green-500={net == 5}
          class:text-green-400={net == 4}
          class:text-green-300={net == 3}
          class:text-green-200={net == 2}
          class:text-green-100={net == 1}
          class:text-red-500={net == -5}
          class:text-red-400={net == -4}
          class:text-red-300={net == -3}
          class:text-red-200={net == -2}
          class:text-red-100={net == -1}
        >
          {net}
        </td>
        <td class="flex gap-2 py-2">
          <div class="bg-theme-700 flex h-12 min-w-80 items-center rounded-full px-4">
            {#if data.buy_summary.length}
              Instabuy at {formatPrice(data.buy_summary[0]?.pricePerUnit)}c
              <div class="flex-grow"></div>
              (/{data.buy_summary.length} sellers)
            {:else}
              No sellers
            {/if}
          </div>
          <div class="bg-theme-700 flex h-12 min-w-80 items-center rounded-full px-4">
            {#if data.sell_summary.length}
              Instasell at {formatPrice(data.sell_summary[0]?.pricePerUnit)}c
              <div class="flex-grow"></div>
              (/{data.sell_summary.length} buyers)
            {:else}
              No buyers
            {/if}
          </div>
          {#if willFly.length}
            <div
              class="flex h-12 items-center rounded-full bg-green-900 px-4"
              title={willFly.map(([k, v]) => k).join("; ")}
            >
              {willFly.length} say will fly
            </div>
          {/if}
          {#if willCrash.length}
            <div
              class="flex h-12 items-center rounded-full bg-red-900 px-4"
              title={willCrash.map(([k, v]) => k).join("; ")}
            >
              {willCrash.length} say will crash
            </div>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<p class="mt-2">Remember:</p>
<p class="mt-2">
  Flying means that it's likely to go up if someone instabuys the supply. They would essentially be
  manipulating the market into going up. You could manipulate the market yourself or ride their
  wave. This is more likely when there's concentrated sell orders without instasellers or a large
  gap between buy and sell prices.
</p>
<p class="mt-2">
  Crashing means that it's likely to go down if someone instasells, filling all buy orders. That
  would be a good time to get things for cheap. Watch for concentrated buy orders without
  instabuyers or unusually high buy prices compared to recent history.
</p>
<p class="mt-2">
  The more signals that agree (higher net score), the stronger the potential movement could be.
</p>
