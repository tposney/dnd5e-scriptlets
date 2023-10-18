
export function setupUpdateCreatedOrigins() {
  Hooks.on("createActor", createActorHook);
  Hooks.on("createToken", createTokenHook);
  globalThis.dnd5eScriptlets.api = mergeObject(globalThis.dnd5eScriptlets.api, {
    fixActorOrigins,
    fixTokenOrigins,
    fixActorOriginsForAllActors,
    fixTokenOriginsForScene,
    fixTokenOriginsForActiveScene,
    fixTokenOriginsForAllScenes
  });
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
    if (typeof effect.origin === "string" && !effect.origin.startsWith("Compendium") && effect.origin.match(originRe)) {
      let testOrigin;
      if (effect.origin.match(tokenOriginRe)) {
        testOrigin = effect.origin.replace(tokenOriginRe, `${actorUuid}$2`);
      } else {
        testOrigin = effect.origin.replace(originRe, `${actorUuid}$3`);
      }
      //@ts-expect-error fromUuidSync
      if (fromUuidSync(testOrigin) && testOrigin !== effect.origin) {
        changesMade = true;
        console.log(`dnd5e-scriptlets | ${actor.name} effect ${effect.name} origin ${effect.origin} -> ${testOrigin} ${actorUuid}`);
        newEffect.origin = testOrigin
      }
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
