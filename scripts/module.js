import { setupAmmoSelector } from "./ammoSelector.js";
import { setupLukasCharSheetFilter } from "./char-sheet-filter.js";
import { registerSettings } from "./settings.js";
import { setupLukasItemRarityColors } from "./item-rarity-colors.js";
import { setupLukasFadeUnprepared } from "./fade-unprepared.js";
import { setupLegendaryRecharge } from "./legendaryRecharge.js";
import { setupAutoItemRecharge } from "./autoItemRecharge.js";
import { setupAutoRollUnlinkedHP } from "./autoRollUnlinkedHP.js";
import { checkTokenResizer, setupTokenResizer } from "./tokenResizer.js";
import { setupCleanRolls, checkCleanRolls } from "./cleanRolls.js";
import { setupAlternativeAdvantage } from "./alternativeAdvantage.js";
import { setupCollapsibleActorSections } from "./collapsibleActorSections.js";
import { restoreAmmoActor, restoreAmmoActors, setupAmmoRecovery } from "./ammoRecovery.js";
import { setupSilentInitiative } from "./silentInitiative.js";
import { setupUpdateCreatedOrigins } from "./updateCreatedOrigins.js";
import { setupSocket } from "./GMAction.js";

Hooks.once("init", async function () {
	console.log("dnd5e-scriptlets | doing init setup");
	setProperty(globalThis, "dnd5eScriptlets.api", {});
  registerSettings();
	setupTokenResizer();
});


Hooks.once("setup", () => {
  registerSettings();

	console.log("dnd5e-scriptlets | doing setup");
	setupCleanRolls();
});

Hooks.once("ready", async function () {
	console.log("dnd5e-scriptlets | Doing ready setup");
  setupSocket();
	setupLukasCharSheetFilter();
	setupLukasItemRarityColors();
	setupLukasFadeUnprepared();
	setupAmmoSelector();
	setupLegendaryRecharge();
	setupAutoItemRecharge();
	setupAutoRollUnlinkedHP();
	checkTokenResizer();
	checkCleanRolls();
  setupAlternativeAdvantage();
  setupCollapsibleActorSections();
  setupAmmoRecovery();
  setupSilentInitiative();
  setupUpdateCreatedOrigins();
  const module = game.modules.get("dnd5e-scriptlets");
  if (module) {
    module.api = globalThis.dnd5eScriptlets.api;
  }
});

export function geti18nOptions(key) {
  const translations = game.i18n.translations["dnd5e-scriptlets"] ?? {};
  const fallback = game.i18n._fallback["dnd5e-scriptlets"] ?? {};
  //@ts-ignore _fallback not accessible
  let translation = translations[key] ?? fallback[key] ?? {};
  return translation;
}