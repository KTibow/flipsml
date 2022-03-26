import { findCraftSum, itemPrices } from "./prices.js";

class Flip extends HTMLElement {
  connectedCallback() {
    const buyPrice = this.findBuyPrice();
    const sellPrice = this.findSellPrice();
    const [worstPrice, lossExplanation] = this.getLossData();

    const maxCount = Math.max(
      this.repeatLimit
        ? Math.min(Math.floor(1000000 / buyPrice), this.repeatLimit)
        : Math.floor(1000000 / buyPrice),
      1
    );
    const isCostly = maxCount == 1;
    this.profitPerMil = (sellPrice - buyPrice) * maxCount;

    const hasVideo = this.getAttribute("data-video") !== null;
    const videoID =
      hasVideo && this.getAttribute("data-video").split("=")[1].split("&")[0];
    const hasReq = this.getAttribute("data-req") !== null;
    this.innerHTML = `
      <div class="shadow-md shadow-mypurple-900 bg-mypurple-800 rounded-lg p-8 m-8 max-w-prose lg:max-w-[calc(33vw-4rem)]">
        <h2 class="text-3xl font-bold">${this.getAttribute("data-title")}</h2>
        <p>${this.type}</p>
        <hr class="border-mypurple-500 my-2" />
        <p><i>If you spent ${
          isCostly ? buyPrice.toLocaleString() : "1mil"
        } coins on this flip...</i></p>
        <p>You could do it ${isCostly ? "once" : `${maxCount} times`}.</p>
        ${
          hasReq
            ? `
                <p>⚠️ You need
                  <span class="text-red-200">
                    ${this.getAttribute("data-req")}
                  </span>
                </p>
              `
            : ""
        }
        ${
          isCostly
            ? "<p>⚠️ This flip costs more than 1 million coins to perform once.</p>"
            : ""
        }
        <br>
        <div class="flex flex-row justify-between">
          <div class="flex-1 basis-2/3">
            <h3 class="text-xl">Best Case</h3>
            <p class="text-green-300">
              +${((sellPrice - buyPrice) * maxCount).toLocaleString()} coins
            </p>
            <hr class="border-mypurple-500 my-2" />
            <p>Buying for 1 flip: <span class="text-red-200">${buyPrice.toLocaleString()}</span> coins</p>
            <p>Selling for 1 flip: <span class="text-green-200">${sellPrice.toLocaleString()}</span> coins</p>
          </div>
          <div class="flex-1 basis-1/3">
            <h3 class="text-xl">Typical Loss</h3>
            <p class="text-red-300">
              -${((buyPrice - worstPrice) * maxCount).toLocaleString()} coins
            </p>
            <hr class="border-mypurple-500 my-2" />
            <p>${lossExplanation}</p>
          </div>
        </div>
        <br>
        ${
          hasVideo
            ? `
                <a
                  href="${this.getAttribute("data-video")}"
                  class="inline-block bg-mypurple-600 opacity-70 hover:opacity-100 transition-all text-white font-bold py-4 px-4 rounded"
                >
                  Watch example of doing the flip
                  <img src="https://img.youtube.com/vi/${videoID}/maxresdefault.jpg" class="opacity-70" />
                </a>
              `
            : ""
        }
      </div>
    `;
    this.style.display = "inline-block";
    this.style.verticalAlign = "top";
  }
  findSellPrice() {
    return window.sellPrices[this.getAttribute("data-id")];
  }
}
class MarginFlip extends Flip {
  type = "Margin Flip";
  repeatLimit = 64 * 27 * 3;
  findBuyPrice() {
    return window.buyPrices[this.getAttribute("data-id")];
  }
  getLossData() {
    const typicalLow = itemPrices[this.getAttribute("data-id")];
    if (typicalLow > this.findBuyPrice()) {
      return [
        this.findBuyPrice(), // Displays -0 coins
        `The current buy price is cheap, because it usually sells for a minimum of ${typicalLow.toLocaleString()} coins`,
      ];
    } else {
      return [
        typicalLow,
        `The buy price is currently more pricey than the typical minimum of ${typicalLow.toLocaleString()} coins`,
      ];
    }
  }
}
class CraftToAHFlip extends Flip {
  type = "Craft to AH Flip";
  repeatLimit = 10;
  findBuyPrice() {
    return findCraftSum(this, window.buyPrices, window.sellPrices);
  }
  getLossData() {
    return [
      this.findBuyPrice() * 0.95,
      `In buying/selling things, some taxes could apply`,
    ];
  }
}
class CraftToBazaarFlip extends Flip {
  type = "Craft to Bazaar Flip";
  repeatLimit = (64 * 27 * 3) / 64;
  findBuyPrice() {
    return findCraftSum(this, window.buyPrices, window.sellPrices);
  }
  getLossData() {
    const typicalLow = itemPrices[this.getAttribute("data-id")];
    const priceMinusTaxes = this.findBuyPrice() * 0.95;
    if (typicalLow < this.findSellPrice()) {
      return [
        Math.min(typicalLow, priceMinusTaxes),
        `You usually get paid less for this product, because it usually sells for a minimum of ${typicalLow.toLocaleString()} coins`,
      ];
    } else {
      return [priceMinusTaxes, `In buying/selling things, some taxes could apply`];
    }
  }
}
class NPCToBazaarFlip extends Flip {
  type = "NPC to Bazaar Flip";
  repeatLimit = 640;
  findBuyPrice() {
    return Number(this.getAttribute("data-buy"));
  }
  getLossData() {
    const typicalLow = itemPrices[this.getAttribute("data-id")];
    if (typicalLow > this.findBuyPrice()) {
      return [
        this.findBuyPrice(), // Displays -0 coins
        `The current buy price is cheap, because it usually sells for a minimum of ${typicalLow.toLocaleString()} coins`,
      ];
    } else {
      return [
        typicalLow,
        `The buy price is currently more pricey than the typical minimum of ${typicalLow.toLocaleString()} coins`,
      ];
    }
  }
}
class BazaarToNPCFlip extends Flip {
  type = "Bazaar to NPC Flip";
  findBuyPrice() {
    return window.buyPrices[this.getAttribute("data-id")];
  }
  findSellPrice() {
    return this.getAttribute("data-sell");
  }
  getLossData() {
    return [
      this.findBuyPrice(), // Displays -0 coins
      `Loss is impossible as long as you buy at the right prices`,
    ];
  }
}

customElements.define("margin-flip", MarginFlip);
customElements.define("craft-to-ah-flip", CraftToAHFlip);
customElements.define("craft-to-bazaar-flip", CraftToBazaarFlip);
customElements.define("npc-to-bazaar-flip", NPCToBazaarFlip);
customElements.define("bazaar-to-npc-flip", BazaarToNPCFlip);

Promise.all([
  fetch("https://api.hypixel.net/skyblock/bazaar"),
  fetch("https://flips.ml/allPrices.json"),
]).then(async ([bazaar, auctions]) => {
  const bazaarData = await bazaar.json();
  const auctionsData = await auctions.json();
  window.buyPrices = {};
  window.sellPrices = {};
  for (let itemId in bazaarData.products) {
    const item = bazaarData.products[itemId];
    window.buyPrices[itemId] = item.sell_summary[0]?.pricePerUnit;
    window.sellPrices[itemId] = item.buy_summary[0]?.pricePerUnit;
  }
  for (let itemId in auctionsData) {
    window.sellPrices[itemId] = auctionsData[itemId];
  }
  const flips = [
    `<margin-flip data-title="Enchanted Coal" data-id="ENCHANTED_COAL"
        data-video="https://www.youtube.com/watch?v=doX-2Q9Tpzg&t=76s"></margin-flip>`,
    `<margin-flip data-title="Enchanted Flint" data-id="ENCHANTED_FLINT"
        data-video="https://www.youtube.com/watch?v=doX-2Q9Tpzg&t=194s"></margin-flip>`,
    `<margin-flip data-title="Enchanted End Stone" data-id="ENCHANTED_ENDSTONE"
        data-video="https://www.youtube.com/watch?v=doX-2Q9Tpzg&t=321s"></margin-flip>`,
    `<margin-flip data-title="Enchanted Sand" data-id="ENCHANTED_SAND"
        data-video="https://www.youtube.com/watch?v=doX-2Q9Tpzg&t=410s"></margin-flip>`,
    `<margin-flip data-title="Enchanted Raw Fish" data-id="ENCHANTED_RAW_FISH"
        data-video="https://www.youtube.com/watch?v=-2qrPDa_bHY&t=107s"></margin-flip>`,
    `<margin-flip data-title="Enchanted Dark Oak Wood" data-id="ENCHANTED_DARK_OAK_LOG"
        data-video="https://www.youtube.com/watch?v=-2qrPDa_bHY&t=202s"></margin-flip>`,
    `<margin-flip data-title="Enchanted Oak Wood" data-id="ENCHANTED_OAK_LOG"
        data-video="https://www.youtube.com/watch?v=-2qrPDa_bHY&t=242s"></margin-flip>`,
    `<margin-flip data-title="Enchanted Birch Wood" data-id="ENCHANTED_BIRCH_LOG"
        data-video="https://www.youtube.com/watch?v=-2qrPDa_bHY&t=253s"></margin-flip>`,
    `<margin-flip data-title="Enchanted Acacia Wood" data-id="ENCHANTED_ACACIA_LOG"
        data-video="https://www.youtube.com/watch?v=-2qrPDa_bHY&t=262s"></margin-flip>`,
    `<margin-flip data-title="Enchanted Glowstone Dust" data-id="ENCHANTED_GLOWSTONE_DUST"
        data-video="https://www.youtube.com/watch?v=-2qrPDa_bHY&t=316s"></margin-flip>`,
    `<margin-flip data-title="Carrot Bait" data-id="CARROT_BAIT"
        data-video="https://www.youtube.com/watch?v=S1bA-QgJrks&t=288s"></margin-flip>`,
    `<margin-flip data-title="Minnow Bait" data-id="MINNOW_BAIT"
        data-video="https://www.youtube.com/watch?v=S1bA-QgJrks&t=288s"></margin-flip>`,
    `<margin-flip data-title="Fish Bait" data-id="FISH_BAIT"
        data-video="https://www.youtube.com/watch?v=S1bA-QgJrks&t=288s"></margin-flip>`,
    `<margin-flip data-title="Dark Bait" data-id="DARK_BAIT"
        data-video="https://www.youtube.com/watch?v=S1bA-QgJrks&t=288s"></margin-flip>`,
    `<margin-flip data-title="Blessed Bait" data-id="BLESSED_BAIT"
        data-video="https://www.youtube.com/watch?v=S1bA-QgJrks&t=288s"></margin-flip>`,
    `<margin-flip data-title="Whale Bait" data-id="WHALE_BAIT"
        data-video="https://www.youtube.com/watch?v=S1bA-QgJrks&t=288s"></margin-flip>`,
    `<margin-flip data-title="Enchanted Ice" data-id="ENCHANTED_ICE"
        data-video="https://www.youtube.com/watch?v=QCjRbZCje0Q&t=112s"></margin-flip>`,
    `<margin-flip data-title="Enchanted Netherrack" data-id="ENCHANTED_NETHERRACK"
        data-video="https://www.youtube.com/watch?v=QCjRbZCje0Q&t=194s"></margin-flip>`,
    `<margin-flip data-title="Wolf Tooth" data-id="WOLF_TOOTH"
        data-video="https://www.youtube.com/watch?v=QCjRbZCje0Q&t=283s"></margin-flip>`,
    `<margin-flip data-title="Enchanted Ghast Tear" data-id="ENCHANTED_GHAST_TEAR"
        data-video="https://www.youtube.com/watch?v=QCjRbZCje0Q&t=401s"></margin-flip>`,

    `<craft-to-ah-flip data-title="Wise Dragon Boots" data-id="WISE_DRAGON_BOOTS"
        data-ingredient-count="1" data-ingredient-0-id="WISE_FRAGMENT" data-ingredient-0-count="40"
        data-video="https://www.youtube.com/watch?v=wniKYUFD9kw&t=87"></craft-to-ah-flip>`,
    `<craft-to-ah-flip data-title="Young Dragon Boots" data-id="YOUNG_DRAGON_BOOTS"
        data-ingredient-count="1" data-ingredient-0-id="YOUNG_FRAGMENT" data-ingredient-0-count="40"
        data-video="https://www.youtube.com/watch?v=wniKYUFD9kw&t=164"></craft-to-ah-flip>`,
    `<craft-to-ah-flip data-title="Wise Dragon Leggings" data-id="WISE_DRAGON_LEGGINGS"
        data-ingredient-count="1" data-ingredient-0-id="WISE_FRAGMENT" data-ingredient-0-count="70"
        data-video="https://www.youtube.com/watch?v=wniKYUFD9kw&t=466"></craft-to-ah-flip>`,
    `<craft-to-ah-flip data-title="Young Dragon Leggings" data-id="YOUNG_DRAGON_LEGGINGS"
        data-ingredient-count="1" data-ingredient-0-id="YOUNG_FRAGMENT" data-ingredient-0-count="70"
        data-video="https://www.youtube.com/watch?v=wniKYUFD9kw&t=466"></craft-to-ah-flip>`,
    `<craft-to-ah-flip data-title="Radiant Power Orb" data-id="RADIANT_POWER_ORB"
        data-ingredient-count="2" data-ingredient-0-id="ENCHANTED_EMERALD" data-ingredient-0-count="8"
        data-ingredient-1-id="WOLF_TOOTH" data-ingredient-1-count="16" data-req="Wolf Slayer 2"
        data-video="https://www.youtube.com/watch?v=_zSMSv72Y_g&t=356"></craft-to-ah-flip>`,
    `<craft-to-ah-flip data-title="Superior Dragon Boots" data-id="SUPERIOR_DRAGON_BOOTS"
        data-ingredient-count="1" data-ingredient-0-id="SUPERIOR_FRAGMENT" data-ingredient-0-count="40"
        data-video="https://www.youtube.com/watch?v=wniKYUFD9kw&t=91"></craft-to-ah-flip>`,
    `<craft-to-ah-flip data-title="Aspect of the End" data-id="ASPECT_OF_THE_END"
        data-ingredient-count="2" data-ingredient-0-id="ENCHANTED_DIAMOND" data-ingredient-0-count="1"
        data-ingredient-1-id="ENCHANTED_EYE_OF_ENDER" data-ingredient-1-count="32"
        data-req="Ender Pearl collection VIII"
        data-video="https://www.youtube.com/watch?v=wniKYUFD9kw&t=381"></craft-to-ah-flip>`,
    `<craft-to-ah-flip data-title="Null Edge" data-id="NULL_EDGE"
        data-ingredient-count="2" data-ingredient-0-id="NULL_ATOM" data-ingredient-0-count="3"
        data-ingredient-1-id="ENCHANTED_MITHRIL" data-ingredient-1-count="192"
        data-req="Enderman Slayer I (maybe?)"
        data-video="https://www.youtube.com/watch?v=IHbjcZQJoXI&t=325"></craft-to-ah-flip>`,

    `<craft-to-bazaar-flip data-title="Polished Pumpkin" data-id="POLISHED_PUMPKIN"
        data-ingredient-count="1" data-ingredient-0-id="ENCHANTED_PUMPKIN" data-ingredient-0-count="160"
        data-req="Pumpkin collection X"
        data-video="https://www.youtube.com/watch?v=_zSMSv72Y_g&t=94"></craft-to-bazaar-flip>`,
    `<craft-to-bazaar-flip data-title="Enchanted Grilled Pork" data-id="ENCHANTED_GRILLED_PORK"
        data-ingredient-count="1" data-ingredient-0-id="ENCHANTED_PORK" data-ingredient-0-count="160"
        data-req="Raw Porkchop collection VII"
        data-video="https://www.youtube.com/watch?v=_zSMSv72Y_g&t=224"></craft-to-bazaar-flip>`,
    `<craft-to-bazaar-flip data-title="Enchanted Raw Beef" data-id="ENCHANTED_RAW_BEEF"
        data-ingredient-count="1" data-ingredient-0-id="RAW_BEEF" data-ingredient-0-count="160"
        data-req="Leather Collection IV"
        data-video="https://www.youtube.com/watch?v=S1bA-QgJrks&t=80"></craft-to-bazaar-flip>`,
    `<craft-to-bazaar-flip data-title="Enchanted Red Mushroom Block" data-id="ENCHANTED_HUGE_MUSHROOM_2"
        data-ingredient-count="1" data-ingredient-0-id="HUGE_MUSHROOM_2" data-ingredient-0-count="576"
        data-req="Mushroom Collection VIII"
        data-video="https://www.youtube.com/watch?v=S1bA-QgJrks&t=193"></craft-to-bazaar-flip>`,
    `<craft-to-bazaar-flip data-title="Enchanted Brown Mushroom Block" data-id="ENCHANTED_HUGE_MUSHROOM_1"
        data-ingredient-count="1" data-ingredient-0-id="HUGE_MUSHROOM_1" data-ingredient-0-count="576"
        data-req="Mushroom Collection VIII"
        data-video="https://www.youtube.com/watch?v=S1bA-QgJrks&t=260"></craft-to-bazaar-flip>`,
    `<craft-to-bazaar-flip data-title="Tarantula Silk" data-id="TARANTULA_SILK"
        data-ingredient-count="2" data-ingredient-0-id="ENCHANTED_FLINT" data-ingredient-0-count="32"
        data-ingredient-1-id="TARANTULA_WEB" data-ingredient-1-count="128"
        data-req="Spider Slayer 2"
        data-video="https://www.youtube.com/watch?v=IHbjcZQJoXI&t=99"></craft-to-bazaar-flip>`,
    `<craft-to-bazaar-flip data-title="Golden Tooth" data-id="GOLDEN_TOOTH"
        data-ingredient-count="2" data-ingredient-0-id="ENCHANTED_GOLD" data-ingredient-0-count="32"
        data-ingredient-1-id="WOLF_TOOTH" data-ingredient-1-count="128"
        data-req="Wolf Slayer 2"
        data-video="https://www.youtube.com/watch?v=IHbjcZQJoXI&t=468"></craft-to-bazaar-flip>`,
    `<craft-to-bazaar-flip data-title="Enchanted Cookie" data-id="ENCHANTED_COOKIE"
        data-ingredient-count="2" data-ingredient-0-id="WHEAT" data-ingredient-0-count="32"
        data-ingredient-1-id="ENCHANTED_COCOA" data-ingredient-1-count="128"
        data-req="Cocoa Beans Collection VI"
        data-video="https://www.youtube.com/watch?v=TQCnGq45WkI&t=140"></craft-to-bazaar-flip>`,
    `<craft-to-bazaar-flip data-title="Revenant Viscera" data-id="REVENANT_VISCERA"
        data-ingredient-count="2" data-ingredient-0-id="ENCHANTED_STRING" data-ingredient-0-count="32"
        data-ingredient-1-id="REVENANT_FLESH" data-ingredient-1-count="128"
        data-req="Zombie Slayer 2"
        data-video="https://www.youtube.com/watch?v=TQCnGq45WkI&t=342"></craft-to-bazaar-flip>`,
    `<craft-to-bazaar-flip data-title="Enchanted Baked Potato" data-id="ENCHANTED_BAKED_POTATO"
        data-ingredient-count="1" data-ingredient-0-id="ENCHANTED_POTATO" data-ingredient-0-count="160"
        data-req="Potato Collection VII"
        data-video="https://www.youtube.com/watch?v=TQCnGq45WkI&t=506"></craft-to-bazaar-flip>`,
    `<craft-to-bazaar-flip data-title="Hot Potato Book" data-id="HOT_POTATO_BOOK"
        data-ingredient-count="2" data-ingredient-0-id="SUGAR_CANE" data-ingredient-0-count="3"
        data-ingredient-1-id="ENCHANTED_BAKED_POTATO" data-ingredient-1-count="1"
        data-req="Potato Collection VII"
        data-video="https://www.youtube.com/watch?v=TQCnGq45WkI&t=588"></craft-to-bazaar-flip>`,

    `<npc-to-bazaar-flip data-title="Packed Ice" data-id="PACKED_ICE" data-buy="9"
        data-video="https://www.youtube.com/watch?v=_zSMSv72Y_g&t=283s"></npc-to-bazaar-flip>`,
    `<bazaar-to-npc-flip data-title="Enchanted Slimeball" data-id="ENCHANTED_SLIME_BALL" data-sell="800"
        data-video="https://www.youtube.com/watch?v=-juQxAvFPnw&t=84"></bazaar-to-npc-flip>`,
    `<bazaar-to-npc-flip data-title="Enchanted Magma Cream" data-id="ENCHANTED_MAGMA_CREAM" data-sell="1280"
        data-video="https://www.youtube.com/watch?v=-juQxAvFPnw&t=167"></bazaar-to-npc-flip>`,
    `<bazaar-to-npc-flip data-title="Enchanted Mithril" data-id="ENCHANTED_MITHRIL" data-sell="1600"
        data-video="https://www.youtube.com/watch?v=-juQxAvFPnw&t=271"></bazaar-to-npc-flip>`,
    `<bazaar-to-npc-flip data-title="Enchanted Clownfish" data-id="ENCHANTED_CLOWNFISH" data-sell="3200"
        data-video="https://www.youtube.com/watch?v=-juQxAvFPnw&t=365"></bazaar-to-npc-flip>`,
    `<bazaar-to-npc-flip data-title="Enchanted Raw Salmon" data-id="ENCHANTED_RAW_SALMON" data-sell="1600"
        data-video="https://www.youtube.com/watch?v=-juQxAvFPnw&t=413"></bazaar-to-npc-flip>`,
    `<bazaar-to-npc-flip data-title="Enchanted Pufferfish" data-id="ENCHANTED_PUFFERFISH" data-sell="2400"
        data-video="https://www.youtube.com/watch?v=-juQxAvFPnw&t=453"></bazaar-to-npc-flip>`,
    `<bazaar-to-npc-flip data-title="Enchanted Cocoa Bean" data-id="ENCHANTED_COCOA" data-sell="480"
        ></bazaar-to-npc-flip>`,
  ].map((flip) => {
    const flipWrapper = document.createElement("template");
    flipWrapper.innerHTML = flip;
    return flipWrapper.content.firstElementChild;
  });
  // TODO: Show the volume of the items in the flip.
  document.querySelector("main").innerHTML = `
    <p class="text-xl text-center">Flips fetched at ${new Date().toLocaleString()}</p>
    <div class="flip-container"></div>
  `;
  const flipContainer = document.querySelector(".flip-container");
  for (let flip of flips) {
    flipContainer.appendChild(flip);
  }
  // Sort the flips
  flips.sort((a, b) => {
    const aProfitPerMil = a.profitPerMil;
    const bProfitPerMil = b.profitPerMil;
    return bProfitPerMil - aProfitPerMil;
  });
  // Display the flips
  flipContainer.innerHTML = "";
  for (let flip of flips) {
    flipContainer.appendChild(flip);
  }
});
