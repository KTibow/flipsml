document.parseHTML = (html) => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstChild;
};
const getCraftPrice = (elem) => {
  let buyPrice = 0;
  const craftingIngredients = this.getAttribute("data-item-types");
  for (let i = 1; i <= craftingIngredients; i++) {
    const bzInfo = window.bazaar.products[elem.getAttribute(`data-in-item-${i}`)];
    const count = this.getAttribute(`data-in-count-${i}`);
    buyPrice += bzInfo.sell_summary[0]?.pricePerUnit * count;
  }
  return buyPrice;
};

class Flip extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="shadow-md shadow-mypurple-900 bg-mypurple-800 rounded-lg p-8 m-8 max-w-prose lg:max-w-[calc(33vw-4rem)]">
          <h2 class="text-3xl font-bold">
            ${this.getAttribute("data-item")}
          </h2>
          <p>${this.generateFlipInfo()}</p>
          <hr class="border-mypurple-500 my-2" />
          ${this.generateDescription()}
          ${
            this.getAttribute("data-video")
              ? `
            <p>
              <a href="${this.getAttribute("data-video")}"
              class="inline-block bg-mypurple-600 opacity-70 hover:opacity-100 transition-all text-white font-bold py-4 px-4 rounded">
                Watch example of doing the flip
                <img src="https://img.youtube.com/vi/${
                  this.getAttribute("data-video").split("=")[1].split("&")[0]
                }/maxresdefault.jpg" class="opacity-70" />
              </a>
            </p>
          `
              : ""
          }
        </div>
      `;
    this.style.display = "inline-block";
    this.style.verticalAlign = "middle";
  }
}
class MarginFlip extends Flip {
  generateFlipInfo() {
    const bzInfo = window.bazaar.products[this.getAttribute("data-id")];
    const buyPrice = bzInfo.sell_summary[0]?.pricePerUnit;
    const sellPrice = bzInfo.buy_summary[0]?.pricePerUnit;
    const margin = sellPrice - buyPrice;
    const countPer1mil = Math.floor(1000000 / buyPrice);
    const marginPer1mil = Math.floor(margin * countPer1mil);
    this.profit = marginPer1mil;
    return `Margin Flip for ${marginPer1mil.toLocaleString()} coins per 1mil (with ${countPer1mil.toLocaleString()}x items)`;
  }
  generateDescription() {
    const bzInfo = window.bazaar.products[this.getAttribute("data-id")];
    const buyPrice = bzInfo.sell_summary[0]?.pricePerUnit;
    const sellPrice = bzInfo.buy_summary[0]?.pricePerUnit;
    const instaBuyCount = bzInfo.quick_status.buyMovingWeek / 7 / 24 / 60;
    const instaSellCount = bzInfo.quick_status.sellMovingWeek / 7 / 24 / 60;
    return `
        <p>
          <b>Buy</b> order price: <b>${buyPrice.toLocaleString()}</b>
        </p>
        <p>
          <b>Sell</b> order price: <b>${sellPrice.toLocaleString()}</b>
        </p>
        <p>
          <b>In a minute,</b> around
          ${Math.floor(instaSellCount)} items fill buy orders
          and ${Math.floor(instaBuyCount.toFixed(1))} items get sold from sell orders.
        </p>
      `;
  }
}
class CraftToAHFlip extends Flip {
  generateFlipInfo() {
    const buyPrice = getCraftPrice(this);
    const sellPrice = window.auctions[this.getAttribute("data-out-item")];
    const margin = sellPrice - buyPrice;
    const countPer1mil = Math.floor(1000000 / buyPrice);
    const marginPer1mil = Math.floor(margin * countPer1mil);
    this.profit = marginPer1mil;
    return (
      `Craft to Auction Flip for ${marginPer1mil.toLocaleString()} coins per 1mil (with ${countPer1mil.toLocaleString()}x items)` +
      (this.getAttribute("data-req") ? `<br />⚠️ ${this.getAttribute("data-req")}` : "")
    );
  }
  generateDescription() {
    const buyPrice = getCraftPrice(this);
    const sellPrice = window.auctions[this.getAttribute("data-out-item")];
    return `
        <p>
          <b>Buy</b> price for all ingredients: <b>${buyPrice.toLocaleString()}</b>
        </p>
        <p>
          <b>Sell</b> auction price: <b>${sellPrice.toLocaleString()}</b>
        </p>
      `;
  }
}
class CraftToBazaarFlip extends Flip {
  generateFlipInfo() {
    const buyPrice = getCraftPrice(this);
    const bzInfoOut = window.bazaar.products[this.getAttribute("data-out-item")];
    const sellPrice = bzInfoOut.buy_summary[0]?.pricePerUnit;
    const margin = sellPrice - buyPrice;
    const countPer1mil = Math.floor(1000000 / buyPrice);
    const marginPer1mil = Math.floor(margin * countPer1mil);
    this.profit = marginPer1mil;
    return (
      `Craft to Bazaar Flip for ${marginPer1mil.toLocaleString()} coins per 1mil (with ${countPer1mil.toLocaleString()}x items)` +
      (this.getAttribute("data-req") ? `<br />⚠️ ${this.getAttribute("data-req")}` : "")
    );
  }
  generateDescription() {
    const buyPrice = getCraftPrice(this);
    const bzInfoOut = window.bazaar.products[this.getAttribute("data-out-item")];
    const sellPrice = bzInfoOut.buy_summary[0]?.pricePerUnit;
    const instaBuyCount = bzInfoOut.quick_status.buyMovingWeek / 7 / 24 / 60;
    if (this.getAttribute("data-item-types") == 1) {
      const bzInfoIn = window.bazaar.products[this.getAttribute("data-in-item-1")];
      var instaSellCount = bzInfoIn.quick_status.sellMovingWeek / 7 / 24 / 60;
    }
    return `
        <p>
          <b>Buy</b> price for all ingredients: <b>${buyPrice.toLocaleString()}</b>
        </p>
        <p>
          <b>Sell</b> bazaar price: <b>${sellPrice.toLocaleString()}</b>
        </p>
        <p>
          <b>In a minute,</b> around
          ${
            instaSellCount
              ? `${Math.floor(instaSellCount.toFixed(1))} items fill buy orders and`
              : ""
          }
          ${Math.floor(instaBuyCount.toFixed(1))} items get sold from sell orders.
        </p>
      `;
  }
}
class NPCToBazaarFlip extends Flip {
  generateFlipInfo() {
    const buyPrice = this.getAttribute("data-npc-price");
    const bzInfoOut = window.bazaar.products[this.getAttribute("data-id")];
    const sellPrice = bzInfoOut.buy_summary[0]?.pricePerUnit;
    const margin = sellPrice - buyPrice;
    const countPer1mil = Math.min(
      Math.floor(1000000 / buyPrice),
      this.getAttribute("data-count")
    );
    const marginPer1mil = Math.floor(margin * countPer1mil);
    this.profit = marginPer1mil;
    return `NPC to Bazaar Flip for ${marginPer1mil.toLocaleString()} coins per 1mil (with ${countPer1mil.toLocaleString()}x items)`;
  }
  generateDescription() {
    const buyPrice = this.getAttribute("data-npc-price");
    const bzInfoOut = window.bazaar.products[this.getAttribute("data-id")];
    const sellPrice = bzInfoOut.buy_summary[0]?.pricePerUnit;
    const instaBuyCount = bzInfoOut.quick_status.buyMovingWeek / 7 / 24 / 60;
    return `
        <p>
          <b>Buy</b> price from NPC: <b>${buyPrice.toLocaleString()}</b>
        </p>
        <p>
          <b>Sell</b> order price: <b>${sellPrice.toLocaleString()}</b>
        </p>
        <p>
          <b>In a minute,</b> around
          ${Math.floor(instaBuyCount.toFixed(1))} items get sold from sell orders.
        </p>
      `;
  }
}
customElements.define("margin-flip", MarginFlip);
customElements.define("craft-to-ah-flip", CraftToAHFlip);
customElements.define("craft-to-bazaar-flip", CraftToBazaarFlip);
customElements.define("npc-to-bazaar-flip", NPCToBazaarFlip);

Promise.all([
  fetch("https://api.hypixel.net/skyblock/bazaar"),
  fetch("https://flips.ml/allPrices.json"),
]).then(async ([bazaar, auctions]) => {
  window.bazaar = await bazaar.json();
  window.auctions = await auctions.json();
  const flips = [
    `<margin-flip data-item="Enchanted Coal" data-id="ENCHANTED_COAL"
        data-video="https://www.youtube.com/watch?v=doX-2Q9Tpzg&t=76s"></margin-flip>`,
    `<margin-flip data-item="Enchanted Flint" data-id="ENCHANTED_FLINT"
        data-video="https://www.youtube.com/watch?v=doX-2Q9Tpzg&t=194s"></margin-flip>`,
    `<margin-flip data-item="Enchanted End Stone" data-id="ENCHANTED_ENDSTONE"
        data-video="https://www.youtube.com/watch?v=doX-2Q9Tpzg&t=321s"></margin-flip>`,
    `<margin-flip data-item="Enchanted Sand" data-id="ENCHANTED_SAND"
        data-video="https://www.youtube.com/watch?v=doX-2Q9Tpzg&t=410s"></margin-flip>`,
    `<craft-to-ah-flip data-item-types="1" data-in-item-1="WISE_FRAGMENT" data-in-count-1="40" data-out-item="WISE_DRAGON_BOOTS" data-item="Wise Dragon Boots"
        data-video="https://www.youtube.com/watch?v=wniKYUFD9kw&t=87"></craft-to-ah-flip>`,
    `<craft-to-ah-flip data-item-types="1" data-in-item-1="YOUNG_FRAGMENT" data-in-count-1="40" data-out-item="YOUNG_DRAGON_BOOTS" data-item="Young Dragon Boots"
        data-video="https://www.youtube.com/watch?v=wniKYUFD9kw&t=164"></craft-to-ah-flip>`,
    `<craft-to-ah-flip data-item-types="1" data-in-item-1="WISE_FRAGMENT" data-in-count-1="70" data-out-item="WISE_DRAGON_LEGGINGS" data-item="Wise Dragon Leggings"
        data-video="https://www.youtube.com/watch?v=wniKYUFD9kw&t=466"></craft-to-ah-flip>`,
    `<craft-to-ah-flip data-item-types="1" data-in-item-1="YOUNG_FRAGMENT" data-in-count-1="70" data-out-item="YOUNG_DRAGON_LEGGINGS" data-item="Young Dragon Leggings"
        data-video="https://www.youtube.com/watch?v=wniKYUFD9kw&t=466"></craft-to-ah-flip>`,
    // Superior costs too much
    `<craft-to-bazaar-flip data-item-types="1" data-in-item-1="ENCHANTED_PUMPKIN" data-in-count-1="160" data-out-item="POLISHED_PUMPKIN" data-item="Polished Pumpkin"
        data-req="Needs Pumpkin collection X" data-video="https://www.youtube.com/watch?v=_zSMSv72Y_g&t=94"></craft-to-bazaar-flip>`,
    `<craft-to-bazaar-flip data-item-types="1" data-in-item-1="ENCHANTED_PORK" data-in-count-1="160" data-out-item="ENCHANTED_GRILLED_PORK" data-item="Enchanted Grilled Pork"
        data-req="Needs Raw Porkchop collection VII" data-video="https://www.youtube.com/watch?v=_zSMSv72Y_g&t=224"></craft-to-bazaar-flip>`,
    `<npc-to-bazaar-flip data-npc-price="9" data-item="Packed Ice" data-id="PACKED_ICE" data-count="640"
        data-video="https://www.youtube.com/watch?v=_zSMSv72Y_g&t=283s"></npc-to-bazaar-flip>`,
    `<craft-to-ah-flip data-item-types="2" data-in-item-1="ENCHANTED_EMERALD" data-in-count-1="8" data-in-item-2="WOLF_TOOTH" data-in-count-2="16"
        data-out-item="RADIANT_POWER_ORB" data-item="Radiant Power Orb"
        data-req="Needs Wolf Slayer 2" data-video="https://www.youtube.com/watch?v=_zSMSv72Y_g&t=356"></craft-to-ah-flip>`,
  ].map((flip) => document.parseHTML(flip));
  document.querySelector("main").innerHTML = `
    <p class="text-xl text-center">Flips fetched at ${new Date().toLocaleString()}</p>
    <div class="flip-container"></div>
  `;
  for (const flip of flips) {
    document.querySelector(".flip-container").appendChild(flip);
  }
  // Sort the flips by profit
  flips.sort((a, b) => {
    return b.profit - a.profit;
  });
  // Remove the existing ones, and add the new ones
  const flipContainer = document.querySelector(".flip-container");
  flipContainer.innerHTML = flips
    .map((flip) => {
      return flip.outerHTML;
    })
    .join("");
});
