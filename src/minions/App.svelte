<script lang="ts">
  import { onMount } from "svelte";
  import MinionsList from "./MinionsList.svelte";

  let bazaarData: { products: Record<string, any> } | undefined;
  let itemsData: { items: any[] } | undefined;
  let settings = {
    budget: 1000000,
    tax: 1.125,
    afkHours: 730,
    afkDivisor: 30,
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

<header class="-m-2 mb-2 flex h-10 items-center rounded-full bg-theme-700 px-4">
  Flips - Minions
</header>
<p class="mb-2">
  Find which minions give you the most for the least price. (Warning: We use fractions when items
  overflow. The amount you find in your slots may vary. We also don't have all minions.)
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
  <label class="flex items-center gap-2">
    <input type="number" bind:value={settings.afkHours} class="rounded-md bg-theme-700 px-3 py-2" />
    Hours AFK
  </label>
  <label class="flex items-center gap-2">
    <input
      type="number"
      bind:value={settings.afkDivisor}
      class="rounded-md bg-theme-700 px-3 py-2"
    />
    Times collected during AFK
  </label>
</div>
{#if bazaarData && itemsData}
  <MinionsList
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
