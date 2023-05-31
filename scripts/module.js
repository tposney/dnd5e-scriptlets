import { ammoSelector, addAmmoSelector } from "./ammo-selector.js";
import { addLukasCharSheetFilter } from "./lukas-char-sheet-qol.js";
import { registerSettings } from "./settings.js";

Hooks.once('init', async function() {

});

Hooks.once('setup', () => {

  console.log("dnd5e-scriptlets | registering settings");
  registerSettings();
})
Hooks.once('ready', async function() {
  console.error("dnd5e-scriptlets | Doing ready settings")
  if (game.settings.get("dnd5e-scriptlets", "lukasSheetFilter")) {
    console.log("dnd5e-scriptlets | registering Lukas Character Sheet Filters");
    addLukasCharSheetFilter();
  }

  addAmmoSelector();

  const API = {
    ammoSelector: ammoSelector
  }
  setProperty(globalThis, "dnd5e-scriptlets.API", API);
});
