export function setupAutoItemRecharge() {
	Hooks.on("updateCombat", async function (combat, update, context, userId) {
		if (!game.settings.get("dnd5e-scriptlets", "autoItemRecharge")) return;
		const wantedGM = game.users?.find((u) => u.isGM && u.active);
		if (game.user.id !== wantedGM?.id || context.direction !== 1 || combat.combatant?.defeated) return;

		const actor = combat.combatant.actor;
		for (const item of actor.items) {
			const recharge = item.system.recharge;
			if (!recharge?.value || recharge?.charged) continue;
			Hooks.once("dnd5e.preRollRecharge", (item, rollConfig) => {
				rollConfig.chatMessage = false;
				return true;
			});
			await item.rollRecharge();
		}
	});
}
