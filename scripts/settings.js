export function registerSettings() {
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

  game.settings.register("dnd5e-scriptlets", "ammoTracker", {
    name: game.i18n.localize("dnd5e-scriptlets.AmmoTracker.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.AmmoTracker.Hint"),
    scope: "world",
    default: false,
    type: Boolean,
    config: true,
    requiresReload: false
  });

  game.settings.register("dnd5e-scriptlets", "ammoTrackerMultiplier", {
    name: game.i18n.localize("dnd5e-scriptlets.AmmoTrackerMultiplier.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.AmmoTrackerMultiplier.Hint"),
    scope: "world",
    default: 0.5,
    type: Number,
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

  game.settings.register("dnd5e-scriptlets", "SilentInitiative", {
    name: game.i18n.localize("dnd5e-scriptlets.SilentInitiative.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.SilentInitiative.Hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
    requiresReload: false
  });

  game.settings.register("dnd5e-scriptlets", "legendaryRecharge", {
    name: game.i18n.localize("dnd5e-scriptlets.LegendaryRecharge.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.LegendaryRecharge.Hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
    requiresReload: false
  });

  game.settings.register("dnd5e-scriptlets", "ActorDispositionColors", {
    name: game.i18n.localize("dnd5e-scriptlets.ActorDispositionColors.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.ActorDispositionColors.Hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
    requiresReload: false
  });

  game.settings.register("dnd5e-scriptlets", "AutoRemoveItems", {
    name: game.i18n.localize("dnd5e-scriptlets.AutoRemoveItems.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.AutoRemoveItems.Hint"),
    scope: "world",
    type: String,
    choices: {
      "none": "Do not auto remove",
      "removeWorld": "Auto remove from world containers",
    },
    default: "none",
    config: true,
    requiresReload: false
  });

  game.settings.register("dnd5e-scriptlets", "AutoRemoveItemsFromActor", {
    name: game.i18n.localize("dnd5e-scriptlets.AutoRemoveItemsFromActor.Name"),
    hint: game.i18n.localize("dnd5e-scriptlets.AutoRemoveItemsFromActor.Hint"),
    scope: "world",
    type: String,
    choices: {
      "none": "Do not auto remove",
      "removeAll": "Auto remove from any actor",
      "removeCharacter": "Auto remove from characters",
      "removeNPC": "Auto remove from npcs",
      "removeGroup": "Auto remove from group actors",
      "removeCharacterGroup": "Auto remove from characters & groups",
      "removeNPCGroup": "Auto remove from npcs & groups",
      "removeCharacterNPC": "Auto remove from characters & npcs",
    },
    default: "none",
    config: true,
    requiresReload: false
  });

}
