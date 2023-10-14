import { geti18nOptions } from "./module.js";

export function registerSettings() {
  game.settings.register("dnd5e-scriptlets", "cleanRolls", {
		name: game.i18n.localize("dnd5e-scriptlets.CleanRolls.Name"),
		hint: game.i18n.localize("dnd5e-scriptlets.CleanRolls.Hint"),
		scope: "world",
		default: false,
		config: true,
		type: Boolean,
		requiresReload: true
	});
  
	game.settings.register("dnd5e-scriptlets", "lukasSheetFilter", {
		name: game.i18n.localize("dnd5e-scriptlets.LukasSheetFilter.Name"),
		hint: game.i18n.localize("dnd5e-scriptlets.LukasSheetFilter.Hint"),
		scope: "world",
		default: false,
		config: true,
		type: Boolean,
		requiresReload: false
	});

  game.settings.register("dnd5e-scriptlets", "lukasItemRarityColors", {
		name: game.i18n.localize("dnd5e-scriptlets.LukasItemRarityColors.Name"),
		hint: game.i18n.localize("dnd5e-scriptlets.LukasItemRarityColors.Hint"),
		scope: "world",
		default: false,
		config: true,
		type: Boolean,
		requiresReload: false
	});
  game.settings.register("dnd5e-scriptlets", "lukasFadeUnprepared", {
		name: game.i18n.localize("dnd5e-scriptlets.LukasFadeUnprepared.Name"),
		hint: game.i18n.localize("dnd5e-scriptlets.LukasFadeUnprepared.Hint"),
		scope: "world",
		default: false,
		config: true,
		type: Boolean,
		requiresReload: false
	});

  game.settings.register("dnd5e-scriptlets", "ammoSelector", {
    name: game.i18n.localize("dnd5e-scriptlets.AmmoSelector.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.AmmoSelector.Hint"),
    scope: "client",
    default: "off",
    type: String,
    config: true,
    choices: geti18nOptions("AmmoSelectorOptions"),
    requiresReload: false
  });

  game.settings.register("dnd5e-scriptlets", "ammoTracker", {
    name: game.i18n.localize("dnd5e-scriptlets.AmmoTracker.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.AmmoTracker.Hint"),
    scope: "world",
    default: false,
    type: Boolean,
    config: true,
    requiresReload: false
  });
  game.settings.register("dnd5e-scriptlets", "ammoRecoveryMessage", {
    name: game.i18n.localize("dnd5e-scriptlets.AmmoRecoveryMessage.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.AmmoRecoveryMessage.Hint"),
    scope: "world",
    default: false,
    type: Boolean,
    config: true,
    requiresReload: false
  });
  game.settings.register("dnd5e-scriptlets", "legendaryRecharge", {
    name: game.i18n.localize("dnd5e-scriptlets.LegendaryRecharge.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.LegendaryRecharge.Hint"),
    scope: "world",
    default: false,
    type: Boolean,
    config: true,
    requiresReload: false
  });

  game.settings.register("dnd5e-scriptlets", "autoItemRecharge", {
    name: game.i18n.localize("dnd5e-scriptlets.AutoItemRecharge.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.AutoItemRecharge.Hint"),
    scope: "world",
    type: String,
    choices: geti18nOptions("AutoItemRechargeOptions"),
    default: false,
    config: true,
    requiresReload: false
  });
  

  game.settings.register("dnd5e-scriptlets", "autoRollUnlinkedHP", {
    name: game.i18n.localize("dnd5e-scriptlets.AutoRollUnlinkedHP.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.AutoRollUnlinkedHP.Hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
    requiresReload: false
  });

  game.settings.register("dnd5e-scriptlets", "tokenResizer", {
    name: game.i18n.localize("dnd5e-scriptlets.TokenResizer.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.TokenResizer.Hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
    requiresReload: false
  });

  game.settings.register("dnd5e-scriptlets", "alternativeAdvantage", {
    name: game.i18n.localize("dnd5e-scriptlets.AlternativeAdvantage.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.AlternativeAdvantage.Hint"),
    scope: "world",
    type: String,
    default: "",
    config: true,
    requiresReload: false
  });

  game.settings.register("dnd5e-scriptlets", "ActorCollapsibleSection", {
    name: game.i18n.localize("dnd5e-scriptlets.ActorCollapsibleSection.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.ActorCollapsibleSection.Hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
    requiresReload: false
  });

  game.settings.register("dnd5e-scriptlets", "SilentInitiative", {
    name: game.i18n.localize("dnd5e-scriptlets.SilentInitiative.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.SilentInitiative.Hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
    requiresReload: false
  });

  game.settings.register("dnd5e-scriptlets", "UpdateCreatedOrigins", {
    name: game.i18n.localize("dnd5e-scriptlets.UpdateCreatedOrigins.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.UpdateCreatedOrigins.Hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
    requiresReload: false
  });
}
