import { addLukasCharSheetFilter } from "./lukas-char-sheet-qol.js";
import { registerSettings } from "./settings.js";

Hooks.once('init', async function() {
  console.log("dnd5e_scriptlets | registering settings");
  registerSettings();
});

Hooks.once('ready', async function() {
  if (game.settings.get("dnd5e_scriptlets", "lukasSheetFilter")) {
    console.log("dnd5e_scriptlets | registering Lukas Character Sheet Filters");
    addLukasCharSheetFilter();
  }
});
