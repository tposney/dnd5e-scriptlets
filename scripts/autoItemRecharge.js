export function setupAutoItemRecharge() {
  Hooks.on("updateCombat", async function (combat, update, context, userId) {
    const rechargeSetting = game.settings.get("dnd5e-scriptlets", "autoItemRecharge");
    if ([undefined, false, "off"].includes(rechargeSetting)) return;
    const wantedGM = game.users?.activeGM;
    if (game.user?.id !== wantedGM?.id || context.direction !== 1 || combat.combatant?.defeated) return;

    const actor = combat.combatant.actor;
    let target;
    for (const item of actor.items) {
      const recharge = item.system.recharge;
      if (!recharge?.value || recharge?.charged) continue;
      if (["silent", "whisper"].includes(rechargeSetting)) Hooks.once("dnd5e.preRollRecharge", (item, rollConfig) => {
        rollConfig.chatMessage = false;
        target = rollConfig.target;

        return true;
      });
      if (rechargeSetting === "whisper") Hooks.once("dnd5e.rollRecharge", (item, roll) => {
        const success = roll.total >= target;
        const resultMessage = game.i18n.localize(`DND5E.ItemRecharge${success ? "Success" : "Failure"}`);
        roll.toMessage({
          flavor: `${game.i18n.format("DND5E.ItemRechargeCheck", { name: item.name })} - ${resultMessage}`,
          speaker: ChatMessage.getSpeaker({ actor: item.actor, token: item.actor.token })
        },
          { rollMode: "gmroll" }
        );
      });
      await item.rollRecharge();
    }
    return true;
  });
  Hooks.on("createCombatant", async function (combatant, options, user) {
    const rechargeSetting = game.settings.get("dnd5e-scriptlets", "autoItemRecharge");
    if ([undefined, false, "off"].includes(rechargeSetting)) return;
    const wantedGM = game.users?.activeGM;
    if (game.user?.id !== wantedGM?.id || combatant?.defeated) return;
    const actor = combatant.actor;
    if (!actor) return;
    for (const item of actor.items) {
      const recharge = item.system.recharge;
      if (!recharge?.value || recharge?.charged) continue;
      await item.update({ "system.recharge.charged": true });
      const resultMessage = game.i18n.localize(`DND5E.ItemRecharge${"Success"}`);
      ChatMessage.create({
        user: game.user.id,
        content: `${game.i18n.format("DND5E.ItemRechargeCheck", { name: item.name })} - ${resultMessage}`,
        speaker: ChatMessage.getSpeaker({ actor: item.actor, token: item.actor.token }),
        whisper: [game.user.id],
      });
    }
  });
}
