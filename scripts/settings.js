game.settings.register("scriptlets", "lukasSheetFilter", {
  name: game.i18n.localize("scriptlets.LukasSheetFilter.Name"),
  hint: game.i18n.localize("scriptlets.LukasSheetFilter.Hint"),
  scope: "world",
  default: false,
  config: true,
  type: Boolean,
  //@ts-ignore v10
  requiresReload: true
});