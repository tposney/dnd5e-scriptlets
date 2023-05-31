export function registerSettings() {
game.settings.register("dnd5e_scriptlets", "lukasSheetFilter", {
  name: game.i18n.localize("dnd5e_scriptlets.LukasSheetFilter.Name"),
  hint: game.i18n.localize("dnd5e_scriptlets.LukasSheetFilter.Hint"),
  scope: "world",
  default: false,
  config: true,
  type: Boolean,
  //@ts-ignore v10
  requiresReload: true
});
}