export function registerSettings() {
  const translations = game.i18n.translations["dnd5e-scriptlets"];

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
}
