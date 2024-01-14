<script lang="ts">
  import { onMount } from "svelte";
  import ManipulationData from "./ManipulationData.svelte";

  let bazaarData: { products: Record<string, any> } | undefined;
  let settings = {
    budget: 10000000,
    tax: 1.125,
  };

  const updateData = () => {
    fetch("https://api.hypixel.net/skyblock/bazaar")
      .then((res) => res.json())
      .then((data) => {
        bazaarData = data;
      });
  };
  onMount(updateData);
</script>

<header class="-m-2 mb-2 flex h-10 items-center rounded-full bg-theme-700 px-4">
  Flips - Manipulation
</header>
<p class="mb-2">
  See what would happen if you tried to buy out an item. (Assuming the instabuy/sell volume stays
  constant. We're not responsible for what you do with this.)
</p>
<div class="mb-6 flex justify-end gap-2">
  <a href="/" class="rounded-full bg-theme-600 px-3 py-2">Home</a>
  <button on:click={updateData} class="rounded-full bg-theme-600 px-3 py-2">Refresh</button>
</div>
<div class="mb-2 flex flex-col gap-2">
  <label class="flex items-center gap-2">
    <input type="number" bind:value={settings.budget} class="rounded-md bg-theme-700 px-3 py-2" />
    Budget
  </label>
  <label class="flex items-center gap-2">
    <input type="number" bind:value={settings.tax} class="rounded-md bg-theme-700 px-3 py-2" />
    Bazaar tax (%)
  </label>
</div>
{#if bazaarData}
  <ManipulationData bazaar={bazaarData.products} {settings} />
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
