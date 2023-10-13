export function setupSilentInitiative() {
  Hooks.on("preCreateChatMessage", (message, data, options, userId) => {
    if (game.settings.get("dnd5e-scriptlets", "SilentInitiative")) {
      if (message.flags?.core?.initiativeRoll) {
        return false;
      }
    }
    return true;
  });
}