export function setupLegendaryRecharge() {
	Hooks.on("updateCombat", async function (combat, update, context, userId) {
		if (!game.settings.get("dnd5e-scriptlets", "legendaryRecharge")) return;
		const wantedGM = game.users?.find((u) => u.isGM && u.active);
		if (game.user.id !== wantedGM?.id || context.direction !== 1 || combat.combatant?.defeated) return;

		const actor = combat.combatant.actor;
		if (actor?.type === "npc") {
			const max = actor.system.resources.legact.max;
			if (max > 0 && actor.system.resources.legact.value < max) {
				await ChatMessage.create({
					content: `${actor.name}'s legendary actions were reset`,
					whisper: [game.user.id],
				});
				await actor.update({ "system.resources.legact.value": max });
			}
		}
	});
}
