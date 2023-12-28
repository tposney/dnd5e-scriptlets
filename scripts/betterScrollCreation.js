export function setupBetterScrollCreation() {
  const libWrapper = globalThis.libWrapper;
  if (!CONFIG.Item.documentClass.createScrollFromSpell) {
    console.warn("dnd5e-scriptlets | BetterScrollCreation disabled due to createScrollFromSpell not found on Item class");
  } else if (libWrapper) libWrapper.register("dnd5e-scriptlets", "CONFIG.Item.documentClass.createScrollFromSpell", createScrollFromSpell, "WRAPPER");
}

async function createScrollFromSpell(wrapped, spell, options={}) {
  if (!game.settings.get("dnd5e-scriptlets", "BetterScrollCreation")) 
    return wrapped( spell, options);
  const itemData = (spell instanceof CONFIG.Item.documentClass) ? spell.toObject() : spell;
  const newOptions = mergeObject(options, {flags: itemData.flags, effects: itemData.effects}, {overwrite: false});
  return wrapped (spell, options);
}