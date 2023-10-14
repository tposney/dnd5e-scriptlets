export function setupLukasFadeUnprepared() {

  Hooks.on("renderActorSheet", (app, html) => {
    // Rather than checking that it is a 5e sheet we check that it is a sheet with items and the correct classes
    if (!game.settings.get("dnd5e-scriptlets", "lukasFadeUnprepared")) return;
    
    let items = html.find($(".items-list .item"));
    for (let itemElement of items) {
      let id = itemElement.outerHTML.match(/data-item-id="(.*?)"/);
      if (!id) continue;
      let item = app.object.items.get(id[1]);
      if (!item) continue;

      if (item.system?.preparation?.prepared === false && item.system?.preparation?.mode === "prepared" && item.system.level > 0) {
        itemElement.classList.add("preparation-unprepared");
      }
    }
  });
  }