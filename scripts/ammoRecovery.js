import { socketlibSocket } from "./GMAction.js";

export function setupAmmoRecovery() {
  Hooks.on("dnd5e.rollAttack", ammoUsage);
  Hooks.on("deleteCombat", restoreAmmo);
  globalThis.dnd5eScriptlets.api =  mergeObject(globalThis.dnd5eScriptlets.api, {
    restoreAmmoActor, 
    restoreAmmoActors
  });
}

export function ammoUsage(item, roll, ammoUpdates) {
  try {
    if (game.settings.get("dnd5e-scriptlets", "ammoTracker") !== true) return;
    const actor = item.parent;
    const storedQuantities = duplicate(getProperty(actor, "flags.dnd5e-scriptlets.ammoQuantities") ?? {});
    if (ammoUpdates) {
      for (let ammoUpdate of ammoUpdates) {
        const ammoItem = actor.items.get(ammoUpdate._id);
        if (!ammoItem) continue;
        const ammoUsed = ammoItem.system.quantity - ammoUpdate["system.quantity"];
        if (ammoUsed > 0) storedQuantities[ammoUpdate._id] = ammoUsed + (storedQuantities[ammoUpdate._id] ?? 0);
      }
      actor.setFlag("dnd5e-scriptlets", "ammoQuantities", storedQuantities);
    }
  } finally {
    return true;
  }
}
export function restoreAmmoActor(actor) {
  if (!actor) return;
  const storedQuantities = getProperty(actor, "flags.dnd5e-scriptlets.ammoQuantities");
  if (!storedQuantities) return;
  const updates = [];
  const messages = [];
  for (let itemId of Object.keys(storedQuantities)) {
    const item = actor.items.get(itemId);
    if (!item) continue;
    if (item.system.properties?.mgc) { // House rule magic ammo is not recoverable
      messages.push(`Consumed ${storedQuantities[itemId]} ${item.name} (magic)`);
    } else {
      const newQuantity = item.system.quantity + Math.floor(storedQuantities[itemId] / 2);
      updates.push({ _id: itemId, "system.quantity": newQuantity });
      messages.push(`Recovered ${Math.floor(storedQuantities[itemId] / 2)} ${item.name}`);
    }
  }
  socketlibSocket.executeAsGM("unsetFlag", actor.uuid, "dnd5e-scriptlets", "ammoQuantities") 
    .then(() => { socketlibSocket.executeAsGM("updateActorItems", actor.uuid, updates) })
    .then(() => {
      if (game.settings.get("dnd5e-scriptlets", "ammoRecoveryMessage") && messages.length) ChatMessage.create({
        content: messages.join("<br>"), speaker: ChatMessage.getSpeaker({ actor: actor })
      });
      ;
    });
}

export async function restoreAmmoActors() {
  for (let actor of game.actors) await restoreAmmoActor(actor);
}

export async function restoreAmmo(combat, options, id) {
  if (!game.users?.activeGM?.isSelf) return;
  if (game.settings.get("dnd5e-scriptlets", "ammoTracker") !== true) return;
  console.error(
    "Doing restore ammo", combat.combatants.map(c => c.actor.name)
  )
  for (let combatant of combat.combatants) {
    await restoreAmmoActor(combatant.actor)
  }
}