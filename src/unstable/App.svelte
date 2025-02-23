<script lang="ts">
  import { onMount } from "svelte";
  import List from "./List.svelte";

  let bazaarData: { products: Record<string, any> } | undefined;
  let itemsData: { items: any[] } | undefined;

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

<header class="bg-theme-700 -m-2 mb-2 flex h-10 items-center rounded-full px-4">
  Flips - Unstable
</header>
<div class="mb-6 flex justify-end gap-2">
  <a href="/" class="bg-theme-600 rounded-full px-3 py-2">Home</a>
  <button on:click={updateData} class="bg-theme-600 rounded-full px-3 py-2">Refresh</button>
</div>
{#if bazaarData && itemsData}
  <List
    bazaar={bazaarData.products}
    items={Object.fromEntries(itemsData.items.map((item) => [item.id, item]))}
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
