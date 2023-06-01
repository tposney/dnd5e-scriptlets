export function setupLukasFadeUnprepared() {

  Hooks.on("renderActorSheet", (actor, html) => {
    // Check if this is a 5E actor sheet
    if (actor.constructor.name !== 'ActorSheet5eCharacter')  return;
    if (!game.settings.get("dnd5e-scriptlets", "lukasFadeUnprepared")) return;
    
    let items = html.find($(".items-list .item"));
    for (let itemElement of items) {
      let id = itemElement.outerHTML.match(/data-item-id="(.*?)"/);
      if (!id) continue;
      let item = actor.object.items.get(id[1]);
      if (!item) continue;

      if (item.system?.preparation?.prepared === false && item.system?.preparation?.mode === "prepared" && item.system.level > 0) {
        itemElement.classList.add("preparation-unprepared");
      }
    }
  });
  }