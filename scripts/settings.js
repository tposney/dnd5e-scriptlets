export function registerSettings() {
game.settings.register("dnd5e_scriptletss", "lukasSheetFilter", {
  name: game.i18n.localize("dnd5e_scriptletss.LukasSheetFilter.Name"),
  hint: game.i18n.localize("dnd5e_scriptletss.LukasSheetFilter.Hint"),
  scope: "world",
  default: false,
  config: true,
  type: Boolean,
  //@ts-ignore v10
  requiresReload: true
});
}