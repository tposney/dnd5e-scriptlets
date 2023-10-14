export function setupUpdateCreatedOrigins() {
  Hooks.on("createActor", createActorHook);
  Hooks.on("preCreateActor", preCreateActorHook);
}

function preCreateActorHook(candidate, data, options, user) {
  if (options.keepEmbeddedId || options.keepId) return true;
  if (!game.settings.get("dnd5e-scriptlets", "UpdateCreatedOrigins")) return true;
  for (let effect of candidate.effects) {
    const originRe = /(.*)Actor\.([^\.]+)(.*)$/g;
    //@ts-expect-error fromUuidSync
    if (effect.origin && !effect.origin.startsWith("Compendium") && !fromUuidSync(effect.origin)) {
      // we have a candidate whose origin does not exist
      const newOrigin = effect.origin.replace(originRe, "$1Actor.<ActorId>$3");
      if (newOrigin !== effect.origin) {
        const newEffect = effect.toObject();
        newEffect.origin = newOrigin;
        candidate.updateSource({ effects: [newEffect] });
      }
    }
  }
}

function createActorHook(actor, options, user) {
  if (options.keepEmbeddedId || options.keepId) return true;
  if (!game.settings.get("dnd5e-scriptlets", "UpdateCreatedOrigins")) return;
  if (game.user?.id !== user) return;
  const actorRe = /.*<ActorId>.*/;
  const newEffects = [];
  for (let effect of actor.effects) {
    const newEffect = effect.toObject();
    if (effect.origin.match(actorRe)) {
      const newOrigin = effect.origin.replace("<ActorId>", actor._id);
      //@ts-expect-error fromUuidSync
      if (fromUuidSync(newOrigin)) newEffect.origin = newOrigin
      else newEffect.Origin = null; // We broke the origin so best we can do is delete it.
    }
    newEffects.push(newEffect);
  }
  console.error(actor.effects, newEffects)
  actor.updateEmbeddedDocuments("ActiveEffect", newEffects).then(() => console.error(actor.effects));
}
