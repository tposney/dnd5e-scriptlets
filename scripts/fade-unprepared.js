// Tidy5e marks an unprepared, preparable spell row itself (can-prepare diminished); the stylesheet fades it while this class is set
export function setFadeUnpreparedClass(enabled) {
  document.body.classList.toggle("dnd5e-scriptlets-fade-unprepared", !!enabled);
}

export function setFadeUnpreparedOpacity(percent) {
  document.body.style.setProperty("--dnd5e-scriptlets-unprepared-opacity", `${Number(percent) || 60}%`);
}

export function setupLukasFadeUnprepared() {
  setFadeUnpreparedClass(game.settings.get("dnd5e-scriptlets", "lukasFadeUnprepared"));
  setFadeUnpreparedOpacity(game.settings.get("dnd5e-scriptlets", "fadeUnpreparedOpacity"));

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