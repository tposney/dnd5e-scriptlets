
export function setupUpdateCreatedOrigins() {
  Hooks.on("createActor", createActorHook);
  Hooks.on("createToken", createTokenHook);
  Hooks.on("createItem", createItemHook);
  globalThis.dnd5eScriptlets.api = foundry.utils.mergeObject(globalThis.dnd5eScriptlets.api, {
    fixActorOrigins,
    fixTokenOrigins,
    fixActorOriginsForAllActors,
    fixTokenOriginsForScene,
    fixTokenOriginsForActiveScene,
    fixTokenOriginsForAllScenes
  });
}

function createItemHook(...args) {
  let [item, options, userId] = args;
  if (!game.settings.get("dnd5e-scriptlets", "UpdateCreatedOrigins")) return;
  if (game.user?.id !== userId) return;
  if (item.parent) return;
  let effectsChanged = false;
  const newEffects = [];
  for (let effect of item.effects) {
    if (effect.transfer && effect.orign !== item.uuid) {
      effectsChanged = true;
      console.log(`dnd5e-scriptlets | Setting ${item.name} effect ${effect.name} origin ${effect.origin} -> ${item.uuid}`)
      effect.origin = item.uuid;
    }
    newEffects.push(effect.toObject());
  }
  if (effectsChanged) {
    item.updateEmbeddedDocuments("ActiveEffect", newEffects);
  }
  return true;
}

function updateActorEffects(actor) {
  if (!actor) return;
  const originRe = /(.*)Actor\.([^\.]+)(.*)$/g;
  const tokenOriginRe = /(Scene.[^\.]+.Token.[^\.]+.Actor\.[^\.]+)(.*)$/g;
  const newEffects = [];
  const actorUuid = actor.uuid.replace("..", ".");
  let changesMade = false;
  for (let effect of actor.effects) {
    const newEffect = effect.toObject();
    let testOrigin;
    if (typeof effect.origin === "string" && effect.origin.startsWith("Compendium")) {
      const originParts = effect.origin.split(".");
      if (originParts[originParts.length -2] === "Item") {
        const baseOrigin = originParts.slice(-2).join(".");
        testOrigin = `${actorUuid}.${baseOrigin}`;
      } else testOrigin = `${actorUuid}`;
    } else if (typeof effect.origin === "string" && !effect.origin.startsWith("Compendium") && effect.origin.match(originRe)) {
      if (effect.origin.match(tokenOriginRe)) {
        testOrigin = effect.origin.replace(tokenOriginRe, `${actorUuid}$2`);
      } else {
        testOrigin = effect.origin.replace(originRe, `${actorUuid}$3`);
      }
    }
    // if editing an actor in a compendium the rewritten testOrigin will still reference a compendium so don't do anything
    //@ts-expect-error fromUuidSync
    if (testOrigin && !testOrigin.startsWith("Compendium") && fromUuidSync(testOrigin) && testOrigin !== effect.origin) {
      changesMade = true;
      console.log(`dnd5e-scriptlets | ${actor.name} effect ${effect.name} origin ${effect.origin} -> ${testOrigin} ${actorUuid}`);
      newEffect.origin = testOrigin
    }
    newEffects.push(newEffect);
  }
  if (changesMade) {
    return actor.updateEmbeddedDocuments("ActiveEffect", newEffects);
  }
}

function createActorHook(actor, options, user) {
  // Can't do this in preCreate because the actor id doesn't exist yet.
  if (options.keepId) return true;
  if (!game.settings.get("dnd5e-scriptlets", "UpdateCreatedOrigins")) return;
  if (game.user?.id !== user) return;
  return updateActorEffects(actor);
}

function createTokenHook(tokenDocument, options, user) {
  if (options.keepId) return true;
  if (!game.settings.get("dnd5e-scriptlets", "UpdateCreatedOrigins")) return true;
  if (game.user.id !== user) return;
  return updateActorEffects(tokenDocument.actor);
}

export function fixActorOrigins(actor) {
  updateActorEffects(actor);
}
export function fixTokenOrigins(tokenOrTokenDocument) {
  if (!tokenOrTokenDocument.actor) return;
  updateActorEffects(tokenOrTokenDocument.actor);
}

export function fixActorOriginsForAllActors() {
  for (let actor of game.actors) {
    updateActorEffects(actor);
  }
}

export function fixTokenOriginsForScene(scene) {
  for (let token of scene.tokens) {
    updateActorEffects(token.actor);
  }
}
export function fixTokenOriginsForActiveScene() {
  fixTokenOriginsForScene(game.scenes.active);
}

export function fixTokenOriginsForAllScenes() {
  for (let scene of game.scenes) {
    fixTokenOriginsForScene(scene);
  }
}
