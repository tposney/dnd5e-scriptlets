import { systemString } from "./module.js";
export function setupAutoRollUnlinkedHP() {
  if (foundry.utils.isNewerVersion(game.version, "11.0")) {
    Hooks.on("createToken", (tokenDocument, options, userId) => {
      if (game.user !== game.users.activeGM) return;
      if (game.settings.get("dnd5e-scriptlets", "autoRollUnlinkedHP") === "none") return;
      const actor = tokenDocument.actor;
      if (!actor || tokenDocument.actorLink) return true;
        const hpRoll = {};
      _rollHPV12(actor);
    });
  } else {
    Hooks.on("preCreateToken", (tokenDocument, data, options, userId) => {
    if (game.settings.get("dnd5e-scriptlets", "autoRollUnlinkedHP") === "none") return;
    const actor = tokenDocument.actor;
    if (!actor || data.actorLink) return true;
      const hpRoll = {};
      _rollHPV11(data, actor);
      if (!foundry.utils.isEmpty(hpRoll)) tokenDocument.updateSource(hpRoll);
    return true;
  });
}
  const hpProperties = {
    dnd5e: "system.attributes.hp.formula",
    dcc: "system.attributes.hitDice.value",
    sw5e: "system.attributes.hp.formula"
  };

  function _rollHPV11(data, actor) {
    const formula = foundry.utils.getProperty(actor, hpProperties[systemString]);
    if (!hpProperties[systemString]) return undefined;
    if (formula) {
      const r = new Roll(formula.replace(" ", ""));
      r.roll({ async: false });
      // Make sure hp is at least 1
      const val = Math.max(r.total, 1);
      foundry.utils.setProperty(data, "delta.system.attributes.hp.value", val);
      foundry.utils.setProperty(data, "delta.system.attributes.hp.max", val);
      if (game.settings.get("dnd5e-scriptlets", "autoRollUnlinkedHP") === "rollOnly") return;
      Hooks.once("createToken", (token, options, userId) => {
        if (userId !== game.user.id) return;
        ChatMessage.create({
          content: `@UUID[${token.uuid}]{${token.name}}'s HP set to ${val}`,
          whisper: [game.user.id],
        });
      });
    } else ui.notifications.warn("Can not randomize hp. HP formula is not set.");
    return;
  }

  async function _rollHPV12(actor) {
    const formula = foundry.utils.getProperty(actor, hpProperties[systemString]);
    if (!hpProperties[systemString]) return undefined;
    if (formula) {
      const r = new Roll(formula.replace(" ", ""));
      await r.roll();
      // Make sure hp is at least 1
      const val = Math.max(r.total, 1);
      const updates = {
        "system.attributes.hp.value": val,
        "system.attributes.hp.max": val
      }
      await actor.update(updates);
      if (game.settings.get("dnd5e-scriptlets", "autoRollUnlinkedHP") === "rollOnly") return;
      ChatMessage.create({
        content: `@UUID[${actor.uuid}]{${actor.name}}'s HP set to ${val}`,
        whisper: [game.user.id],
      });
    } else ui.notifications.warn("Can not randomize hp. HP formula is not set.");
    return;
  }
}
