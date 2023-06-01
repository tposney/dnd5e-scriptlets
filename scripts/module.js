import { setupAmmoSelector } from "./ammo-selector.js";
import { setupLukasCharSheetFilter } from "./char-sheet-filter.js";
import { registerSettings } from "./settings.js";
import { setupLukasItemRarityColors } from "./item-rarity-colors.js";
import { setupLukasFadeUnprepared } from "./fade-unprepared.js";


Hooks.once('init', async function() {

});

Hooks.once('setup', () => {

  console.log("dnd5e-scriptlets | registering settings");
  registerSettings();
})
Hooks.once('ready', async function() {
  console.log("dnd5e-scriptlets | Doing ready settings")
  setupLukasCharSheetFilter();
  setupLukasItemRarityColors();
  setupLukasFadeUnprepared();

  setupAmmoSelector();

  const API = {
  }
  setProperty(globalThis, "dnd5eScriptlets.API", API);
});
