import { addLukasCharSheetFilter } from "./lukas-char-sheet-qol.js";
import { registerSettings } from "./settings.js";

Hooks.once('init', async function() {
  registerSettings();
});

Hooks.once('ready', async function() {
  if (game.settings.get("scriptlets", "lukasSheetFilter")) addLukasCharSheetFilter();
});
