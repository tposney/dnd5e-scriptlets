export function checkTokenResizer() {
  if (game.user.isGM && game.settings.get("dnd5e-scriptlets", "tokenResizer") && !game.modules.get("warpgate")?.active) {
    const errorMessage = game.i18n.localize("dnd5e-scriptlets.TokenResizerWarpgateError");
    console.error(errorMessage);
    ui.notifications?.error(errorMessage, {permanent: true});
  } 
}
export function setupTokenResizer() {
  if (!game.modules.get("warpgate")?.active) {
    return;
  }

	Hooks.on("getSceneControlButtons", (controls) => {
		if (!game.user.isGM || !game.settings.get("dnd5e-scriptlets", "tokenResizer")) return;
		const token = controls.find((c) => c.name === "token");

		if (token) {
			let i = token.tools.length;
			token.tools.splice(i, 0, {
				name: "tokenResizer",
				title: game.i18n.localize("dnd5e-scriptlets.TokenResizer.Name"),
				icon: "fas fa-arrows-alt",
				visible: true,
				onClick: () => {
					if (game.canvas.tokens.controlled.length < 1) {
            const warningMessage = game.i18n.localize("dnd5e-scriptlets.NoTokenSelected");
						ui.notifications.warn(warningMessages);
						return;
					}
					resizeTokens(game.canvas.tokens.controlled);
				},
				button: true,
			});
		}
	});
}

async function resizeTokens(tokens) {
	const buttonData = {
		buttons: [
			{
				label: "Tiny",
				value: 0.25,
			},
			{
				label: "Small",
				value: 0.5,
			},
			{
				label: "Medium",
				value: 1,
			},
			{
				label: "Large",
				value: 2,
			},
			{
				label: "Huge",
				value: 3,
			},
			{
				label: "Gargantuan",
				value: 4,
			},
			{
				label: "An Absolute Unit",
				value: 8,
			},
		],
		title: "Change Size?",
	};

	let size = await warpgate.buttonDialog(buttonData, "row");
	if (!size) return;
	for (let token of tokens) {
		await token.document.update({ height: size, width: size });
		switch (size) {
			case 0.25:
				await token.actor.update({ "system.traits.size": "tiny" });
				break;
			case 0.5:
				await token.actor.update({ "system.traits.size": "sml" });
				break;
			case 1:
				await token.actor.update({ "system.traits.size": "med" });
				break;
			case 2:
				await token.actor.update({ "system.traits.size": "lg" });
				break;
			case 3:
				await token.actor.update({ "system.traits.size": "huge" });
				break;
			case 4:
				await token.actor.update({ "system.traits.size": "grg" });
				break;
			case 8:
				await token.actor.update({ "system.traits.size": "grg" });
				break;
		}
	}
}
