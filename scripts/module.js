import { setupAmmoSelector } from "./ammo-selector.js";
import { setupLukasCharSheetFilter } from "./char-sheet-filter.js";
import { registerSettings } from "./settings.js";
import { setupLukasItemRarityColors } from "./item-rarity-colors.js";
import { setupLukasFadeUnprepared } from "./fade-unprepared.js";
import { setupLegendaryRecharge } from "./legendaryRecharge.js";
import { setupAutoItemRecharge } from "./autoItemRecharge.js";
import { setupAutoRollUnlinkedHP } from "./autoRollUnlinkedHP.js";
import { checkTokenResizer, setupTokenResizer, queryResizeTokens, doResizeTokens } from "./tokenResizer.js";
import { setupCleanRolls, checkCleanRolls } from "./cleanRolls.js";

Hooks.once("init", async function () {
	console.log("dnd5e-scriptlets | doing init setup");
	setProperty(globalThis, "dnd5eScriptlets.API", {});
	setupTokenResizer();
});

Hooks.once("setup", () => {
	console.log("dnd5e-scriptlets | doing setup");
	registerSettings();
	setupCleanRolls();
});

Hooks.once("ready", async function () {
	console.log("dnd5e-scriptlets | Doing ready setup");
	setupLukasCharSheetFilter();
	setupLukasItemRarityColors();
	setupLukasFadeUnprepared();
	setupAmmoSelector();
	setupLegendaryRecharge();
	setupAutoItemRecharge();
	setupAutoRollUnlinkedHP();
	checkTokenResizer();
	checkCleanRolls();
});
