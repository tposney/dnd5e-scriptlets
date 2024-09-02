export function setupLegendaryRecharge() {
	Hooks.on("updateCombat", async function (combat, update, context, userId) {
		if (!game.settings.get("dnd5e-scriptlets", "legendaryRecharge")) return;
		if (!game.users?.activeGM?.isSelf || context.direction !== 1 || combat.combatant?.defeated) return;

		const actor = combat.combatant.actor;
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
