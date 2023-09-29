export var socketlibSocket = undefined;
export function setupSocket() {
  socketlibSocket = globalThis.socketlib.registerModule("dnd5e-scriptlets");
  socketlibSocket.register("test", _testMessage);
  socketlibSocket.register("updateActorItems", updateActorItems);
  socketlibSocket.register("unsetFlag", unsetFlag);
}

export async function _testMessage() {
  console.log("test message recieved");
}

export async function updateActorItems(actorUuid, updates) {
  const actor = fromUuidSync(actorUuid);
  if (!actor) return;
  await actor.updateEmbeddedDocuments("Item", updates);
}

export async function unsetFlag(actorUuid, scope, key) {
  const actor = fromUuidSync(actorUuid);
  if (!actor) return;
  await actor.unsetFlag(scope, key);
}