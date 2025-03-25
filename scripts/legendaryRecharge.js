export function setupLegendaryRecharge() {
  Hooks.on("dnd5e.combatRecovery", (actor, periods, results) => {
    if (!game.settings.get("dnd5e-scriptlets", "legendaryRecharge")) return;
    if (results.actor["system.resources.legact.value"]) delete results.actor["system.resources.legact.value"];
    return true;
  });
	Hooks.on("updateCombat", async function (combat, update, context, userId) {
		if (!game.settings.get("dnd5e-scriptlets", "legendaryRecharge")) return;
		if (!game.users?.activeGM?.isSelf || context.direction !== 1 || combat.combatant?.defeated) return;
    if (combat.previous.round === combat.round) return;
    for (let combatant of combat.combatants) {
      const token = combatant.token; // may be null
      const actor = combatant.actor;
      if (actor?.type === "npc") {
        const max = actor.system.resources.legact?.max;
        if (max > 0 && actor.system.resources.legact.value < max) {
          await ChatMessage.create({
            content: `${game.i18n.localize("DND5E.LegendaryAction.Remaining")}: ${max}`,
            speaker: ChatMessage.getSpeaker({ actor: actor, token: token }),
            whisper: game.users.filter(u => actor.testUserPermission(u, "OWNER"))
          });
          await actor.update({ "system.resources.legact.value": max });
        }
      }
    }
    return;
  });
  Hooks.on("createCombatant", async function (combatant, options, user) {
		if (!game.settings.get("dnd5e-scriptlets", "legendaryRecharge")) return;
		if (!game.users?.activeGM?.isSelf || combatant?.defeated) return;
    const actor = combatant.actor;
    if (actor?.type === "npc") {
      const max = actor.system.resources.legact?.max;
      if (max > 0 && actor.system.resources.legact.value < max) {
        await ChatMessage.create({
					content: `${actor.name}'s legendary actions were reset`,
          speaker: ChatMessage.getSpeaker({ actor: actor, token: actor.token }),
					whisper: [game.user.id],
				});
				await actor.update({ "system.resources.legact.value": max });
      }
    }
  });
}
