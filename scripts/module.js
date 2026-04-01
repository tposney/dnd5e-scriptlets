import { registerSettings } from "./settings.js";
import { setupLukasItemRarityColors } from "./item-rarity-colors.js";
import { setupLukasFadeUnprepared } from "./fade-unprepared.js";
import { setupTokenResizer } from "./tokenResizer.js";
import { setupAlternativeAdvantage } from "./alternativeAdvantage.js";
import { setupAmmoRecovery } from "./ammoRecovery.js";
import { setupSilentInitiative } from "./silentInitiative.js";
import { setupLegendaryRecharge } from "./legendaryRecharge.js";
import { setupSocket } from "./GMAction.js";
import { initActorDispositionColors } from "./ActorDispositionColors.js";
import { setupContainerHelpers } from "./containerHelper.js";

export let systemString;

Hooks.once("init", async function () {
  console.log("dnd5e-scriptlets | doing init setup");
  foundry.utils.setProperty(globalThis, "dnd5eScriptlets.api", {});
  registerSettings();
  setupTokenResizer();
  systemString = game.system.id;
  initActorDispositionColors();
});

Hooks.once("setup", () => {
  registerSettings();
  console.log("dnd5e-scriptlets | doing setup");
});

Hooks.once("ready", async function () {
  console.log("dnd5e-scriptlets | Doing ready setup");
  setupSocket();
  setupLukasItemRarityColors();
  setupLukasFadeUnprepared();
  setupAlternativeAdvantage();
  setupAmmoRecovery();
  setupSilentInitiative();
  setupLegendaryRecharge();
  setupContainerHelpers();
  const module = game.modules.get("dnd5e-scriptlets");
  if (module) {
    module.api = globalThis.dnd5eScriptlets.api;
  }
});
