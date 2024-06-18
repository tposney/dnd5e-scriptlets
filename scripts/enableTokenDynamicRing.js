export function setupEnableTokenDynamicRing() {
  Hooks.on("preCreateToken", async (tokenDocument) => {
    if (game.settings.get("dnd5e-scriptlets", "EnableTokenDynamicRing") === false) return;
    if (game.release.generation < 12) {
      tokenDocument.updateSource({"flags.dnd5e.tokenRing.enabled": true})
    } else {
      tokenDocument.updateSource({"ring.enabled": true})
    }
  });
}
