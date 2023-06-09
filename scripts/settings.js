export function registerSettings() {
  const translations = game.i18n.translations["dnd5e-scriptlets"];

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
    choices: translations.AmmoSelector.Options,
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
    type: Boolean,
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
}
