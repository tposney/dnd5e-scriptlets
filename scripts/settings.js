export function registerSettings() {
  const translations = game.i18n.translations["dnd5e-scriptlets"];
console.error("trans",  translations.AmmoSelector.Options);
	game.settings.register("dnd5e-scriptlets", "lukasSheetFilter", {
		name: game.i18n.localize("dnd5e-scriptlets.LukasSheetFilter.Name"),
		hint: game.i18n.localize("dnd5e-scriptlets.LukasSheetFilter.Hint"),
		scope: "world",
		default: false,
		config: true,
		type: Boolean,
		//@ts-ignore v10
		requiresReload: true,
	});

  game.settings.register("dnd5e-scriptlets", "ammoSelector", {
    name: game.i18n.localize("dnd5e-scriptlets.AmmoSelector.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.AmmoSelector.Hint"),
    scope: "client",
    default: "off",
    type: String,
    config: true,
    choices: translations.AmmoSelector.Options,
  });
}
