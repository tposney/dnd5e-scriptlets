export function setupLukasFadeUnprepared() {

  Hooks.on("renderBaseActorSheet", (app, html) => {
    // Rather than checking that it is a 5e sheet we check that it is a sheet with items and the correct classes
    if (!game.settings.get("dnd5e-scriptlets", "lukasFadeUnprepared")) return;
    
    let items = html.querySelectorAll(".items-list .item");
    for (let itemElement of items) {
      let id = itemElement.outerHTML.match(/data-item-id="(.*?)"/);
      if (!id) continue;
      let item = app.document.items.get(id[1]);
      if (!item || item.type !== "spell") continue;
      if (item.system?.prepared === 0 && item.system?.method === "spell" && item.system.level > 0) {
        itemElement.classList.add("preparation-unprepared");
      }
    }
  });
  }