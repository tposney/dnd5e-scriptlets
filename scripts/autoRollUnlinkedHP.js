export function setupAutoRollUnlinkedHP() {
	Hooks.on("preCreateToken", (tokenDocument, data, options, userId) => {
		if (!game.settings.get("dnd5e-scriptlets", "autoRollUnlinkedHP")) return;
		const actor = tokenDocument.actor;
		if (!actor || data.actorLink) return;

		const hpRoll = {};
		_rollHP(hpRoll, actor);
		if (!isEmpty(hpRoll)) tokenDocument.updateSource(hpRoll);
	});

	function _rollHP(data, actor) {
		const hpProperties = {
			dnd5e: "system.attributes.hp.formula",
			dcc: "system.attributes.hitDice.value",
		};

		const formula = getProperty(actor, hpProperties[game.system.id]);
		if (formula) {
			const r = new Roll(formula.replace(" ", ""));
			r.roll({ async: false });
			// Make sure hp is at least 1
			const val = Math.max(r.total, 1);
			if (isNewerVersion(game.version, "11.0")) {
				setProperty(data, "delta.system.attributes.hp.value", val);
				setProperty(data, "delta.system.attributes.hp.max", val);
			} else {
				setProperty(data, "actorData.system.attributes.hp.value", val);
				setProperty(data, "actorData.system.attributes.hp.max", val);
			}
      ChatMessage.create({
        content: `${actor.name}'s HP set to ${val}`,
        whisper: [game.user.id],
      });
		} else ui.notifications.warn("Can not randomize hp. HP formula is not set.");
		return;
	}
}
