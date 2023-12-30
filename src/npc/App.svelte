<script lang="ts">
  import { onMount } from "svelte";
  import FlipsList from "./FlipsList.svelte";

  let bazaarData: { products: Record<string, any> } | undefined;
  let itemsData: { items: any[] } | undefined;
  let settings = {
    buyPricing: "1",
    budgetPrice: 1000000,
    budgetSlots: 18 * 3, // assuming flip is performed 3 times with 18 free slots
    budgetTax: 1.125,
  };

  const updateData = () => {
    fetch("https://api.hypixel.net/skyblock/bazaar")
      .then((res) => res.json())
      .then((data) => {
        bazaarData = data;
      });
    fetch("https://api.hypixel.net/resources/skyblock/items")
      .then((res) => res.json())
      .then((data) => {
        itemsData = data;
      });
  };
  onMount(updateData);
</script>

<header class="-m-2 mb-2 flex h-10 items-center rounded-full bg-theme-700 px-4">Flips - NPC</header>
<p class="mb-2">Buy items from the Bazaar and sell them in NPC shops for profit.</p>
<div class="mb-6 flex justify-end gap-2">
  <a href="/" class="rounded-full bg-theme-600 px-3 py-2">Home</a>
  <button on:click={updateData} class="rounded-full bg-theme-600 px-3 py-2">Refresh</button>
</div>
<div class="mb-6 flex flex-col gap-2">
  <label class="flex items-center gap-2">
    <select bind:value={settings.buyPricing} class="rounded-md bg-theme-700 px-3 py-2">
      <option value="1">Instant Buy</option>
      <option value="0.8">80% Instant Buy, 20% highest buy offer</option>
      <option value="0.5">50% Instant Buy, 50% highest buy offer</option>
      <option value="0">Same as highest buy offer</option>
    </select>
    Bazaar buy pricing
  </label>
  <label class="flex items-center gap-2">
    <input
      type="number"
      bind:value={settings.budgetTax}
      class="rounded-md bg-theme-700 px-3 py-2"
    />
    Bazaar tax (%)
  </label>
  <label class="flex items-center gap-2">
    <input
      type="number"
      bind:value={settings.budgetPrice}
      class="rounded-md bg-theme-700 px-3 py-2"
    />
    Budget
  </label>
  <label class="flex items-center gap-2">
    <input
      type="number"
      bind:value={settings.budgetSlots}
      class="rounded-md bg-theme-700 px-3 py-2"
    />
    Max slots for flips
  </label>
</div>
{#if bazaarData && itemsData}
  <FlipsList
    bazaar={bazaarData.products}
    items={Object.fromEntries(itemsData.items.map((item) => [item.id, item]))}
    {settings}
  />
{:else}
  <div class="loader" />
{/if}

<style>
  .loader {
    background-image: linear-gradient(to right, #0002, #fff2, #0002);
    background-size: 200% 100%;
    width: 100%;
    height: 2.5rem;
    margin-top: 1rem;
    animation: loading 1s infinite linear;
  }
  @keyframes loading {
    to {
      background-position-x: -200%;
    }
  }
</style>
