<script lang="ts">
  import { onMount } from "svelte";
  import ExpendableData from "./ExpendableData.svelte";

  let bazaarData: { products: Record<string, any> } | undefined;
  let auctionData: Record<string, number> | undefined;
  let settings = {
    buyPricing: "1",
    sellPricing: "1",
    tax: 1.125,
  };

  const updateData = () => {
    fetch("https://api.hypixel.net/skyblock/bazaar")
      .then((res) => res.json())
      .then((data) => {
        bazaarData = data;
      });
    fetch("/ah")
      .then((res) => res.json())
      .then((data) => {
        auctionData = data;
      });
  };
  onMount(updateData);
</script>

<header class="bg-theme-700 -m-2 mb-2 flex h-10 items-center rounded-full px-4">
  Flips - Expendables
</header>
<p class="mb-2">See what you get on average when you consume certain items.</p>
<div class="mb-6 flex justify-end gap-2">
  <a href="/" class="bg-theme-600 rounded-full px-3 py-2">Home</a>
  <button on:click={updateData} class="bg-theme-600 rounded-full px-3 py-2">Refresh</button>
</div>
<div class="mb-6 flex flex-col gap-2">
  <label class="flex items-center gap-2">
    <select bind:value={settings.buyPricing} class="bg-theme-700 rounded-md px-3 py-2">
      <option value="1">Instant Buy</option>
      <option value="0.8">80% Instant Buy, 20% highest buy offer</option>
      <option value="0.5">50% Instant Buy, 50% highest buy offer</option>
      <option value="0">Same as highest buy offer</option>
    </select>
    Bazaar buy pricing
  </label>
  <label class="flex items-center gap-2">
    <select bind:value={settings.sellPricing} class="bg-theme-700 rounded-md px-3 py-2">
      <option value="1">Instant Sell</option>
      <option value="0.8">80% Instant Sell, 20% lowest sell offer</option>
      <option value="0.5">50% Instant Sell, 50% lowest sell offer</option>
      <option value="0">Same as lowest sell offer</option>
    </select>
    Bazaar sell pricing
  </label>
  <label class="flex items-center gap-2">
    <input type="number" bind:value={settings.tax} class="bg-theme-700 rounded-md px-3 py-2" />
    Bazaar tax (%)
  </label>
</div>
{#if bazaarData && auctionData}
  <ExpendableData bazaar={bazaarData.products} auction={auctionData} {settings} />
{:else}
  <div class="loader"></div>
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
