export function registerSettings() {
  const translations = game.i18n.translations["dnd5e_scriptlets"];
console.error("trans",  translations.AmmoSelector.Options);
	game.settings.register("dnd5e_scriptlets", "lukasSheetFilter", {
		name: game.i18n.localize("dnd5e_scriptlets.LukasSheetFilter.Name"),
		hint: game.i18n.localize("dnd5e_scriptlets.LukasSheetFilter.Hint"),
		scope: "world",
		default: false,
		config: true,
		type: Boolean,
		//@ts-ignore v10
		requiresReload: true,
	});

  game.settings.register("dnd5e_scriptlets", "ammoSelector", {
    name: game.i18n.localize("dnd5e_scriptlets.AmmoSelector.Name"),
    hint: game.i18n.localize("dnd5e_scriptlets.AmmoSelector.Hint"),
    scope: "client",
    default: "off",
    type: String,
    config: true,
    choices: translations.AmmoSelector.Options,
  });
}
