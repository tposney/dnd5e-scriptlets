export function setupLukasItemRarityColors() {


Hooks.on("renderActorSheet", (app, html) => {
  // Rather than checking it is a 5e sheet assume that if the classes are the same we can do the same mods.
  if (!game.settings.get("dnd5e-scriptlets", "lukasItemRarityColors")) return;

  let items = html.find($(".items-list .item"));
  for (let itemElement of items) {
    let id = itemElement.outerHTML.match(/data-item-id="(.*?)"/);
    if (!id) {
      continue;
    }
    let item = app.object.items.get(id[1]);
    if (!item) {
      continue;
    }

    let rarity = item.getRollData()?.item?.rarity || item?.system?.rarity || undefined;
    rarity = rarity ? rarity.replaceAll(/\s/g, "").toLowerCase().trim() : undefined;
    if (rarity) {
      itemElement.classList.add("rarity-color-" + rarity);
    }
  }
});
}