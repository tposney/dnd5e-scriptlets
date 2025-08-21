import { systemString } from "./module.js";
export function setupAutoRollUnlinkedHP() {
  if (foundry.utils.isNewerVersion("4.3.6", game.system.version)) return;
  Hooks.on('preCreateToken', (tDoc, data, options, userId) => {
    if (game.settings.get("dnd5e-scriptlets", "autoRollUnlinkedHP") === "none") return true;
    const actor = game.actors.get(data.actorId);
    if (!game.users?.activeGM?.isSelf || !actor || data.actorLink) return;
    const hpFormula = foundry.utils.getProperty(actor, 'system.attributes.hp.formula');
    const hpRoll = {};
    if (hpFormula) {
      const rolled = rollDiceFormula(hpFormula);
      foundry.utils.setProperty(hpRoll, "delta.system.attributes.hp.value", rolled);
      foundry.utils.setProperty(hpRoll, "delta.system.attributes.hp.max", rolled);
      tDoc.updateSource(hpRoll);
    };
    ChatMessage.create({
      content: `@UUID[${actor.uuid}]{${actor.name}}'s HP set to ${val}`,
      whisper: [game.user.id],
    });
    return true;
  });
}

function rollDiceFormula(formula) {
  const diceRegex = /(\d*)d(\d+)/gi;
  const replaced = formula.replace(diceRegex, (_, count, sides) => {
    const numDice = parseInt(count) || 1;
    const dieSides = parseInt(sides);
    let total = 0;
    for (let i = 0; i < numDice; i++) {
      total += Math.floor(Math.random() * dieSides) + 1;
    }
    return total;
  });

  return Math.max(Roll.safeEval(replaced), 1);
}

// For summoned tokens generate a fake formula so the hp can be rolled correctly.
Hooks.on("dnd5e.preSummonToken", (item, profile, tokenData, options) => {
  if (tokenData.actorLink) return;
  const hpBonus = (tokenData.actorUpdates["system.attributes.hp.max"] ?? tokenData.actor.system.attributes.hp.max) - tokenData.actor.system.attributes.hp.max;
  const hpFormula = tokenData.actor.system.attributes.hp.formula || `${tokenData.actor.system.attributes.hp.max}`;
  if (hpBonus)
    tokenData.actorUpdates["system.attributes.hp.formula"] = `${hpFormula} + ${hpBonus}`;
  return true;
})

const hpProperties = {
  dnd5e: "system.attributes.hp.formula",
  dcc: "system.attributes.hitDice.value",
  sw5e: "system.attributes.hp.formula"
};

async function _rollHPV12(actor) {
  const formula = foundry.utils.getProperty(actor, hpProperties[systemString]);
  if (!hpProperties[systemString]) return undefined;
  if (formula) {
    const r = new Roll(formula.replace(" ", ""), actor.getRollData());
    await r.roll({ allowInteractive: false });
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
  } else console.warn(`dnd5e-scriptles | Can not randomize hp for ${actor.name}. HP formula is not set.`);
  return;
}