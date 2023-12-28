import { systemString, localizeHeader, systemConfig } from "./module.js";

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
      if (["silent", "whisper"].includes(rechargeSetting)) Hooks.once(`${systemString}.preRollRecharge`, (item, rollConfig) => {
        rollConfig.chatMessage = false;
        target = rollConfig.target;
        return true;
      });
      if (rechargeSetting === "whisper") Hooks.once(`${systemString}.rollRecharge`, (item, roll) => {
        const success = roll.total >= target;
        const resultMessage = game.i18n.localize(`${localizeHeader}.ItemRecharge${success ? "Success" : "Failure"}`);
        const flavor = `${localizeHeader}.ItemRechargeCheck`;
        roll.toMessage({
          flavor: `${game.i18n.format(flavor, { name: item.name })} - ${resultMessage}`,
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
      const resultMessage = game.i18n.localize(`${localizeHeader}.ItemRecharge${ "Success"}`);
      const contentLabel = `${localizeHeader}.ItemRechargeCheck`;
      ChatMessage.create({
        user: game.user.id,
        content: `${ game.i18n.format(contentLabel, { name: item.name }) } - ${ resultMessage }`,
        speaker: ChatMessage.getSpeaker({ actor: item.actor, token: item.actor.token }),
        whisper: [game.user.id],
      });
    }
  });
}
