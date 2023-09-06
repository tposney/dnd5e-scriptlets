export function setupLukasItemRarityColors() {

Hooks.on("renderActorSheet", (actor, html) => {
  // Check if this is a 5E actor sheet
  if (actor.constructor.name !== 'ActorSheet5eCharacter')  return;
  if (!game.settings.get("dnd5e-scriptlets", "lukasItemRarityColors")) return;
  
  let items = html.find($(".items-list .item"));
  for (let itemElement of items) {
    let id = itemElement.outerHTML.match(/data-item-id="(.*?)"/);
    if (!id) {
      continue;
    }
    let item = actor.object.items.get(id[1]);
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