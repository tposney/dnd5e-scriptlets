import { systemString } from "./module.js";

export function checkCleanRolls() {
  if (!game.settings.get("dnd5e-scriptlets", "cleanRolls")) return;
  if (!globalThis.libWrapper) {
    const errorMessage = game.i18n.localize("dnd5e-scriptlets.needsLibWrapper");
    console.error(errorMessage);
    ui.notifications?.error(errorMessage, {permanent: true});
  }
}

export function setupCleanRolls() {
  if (!game.settings.get("dnd5e-scriptlets", "cleanRolls")) return;
  const libWrapper = globalThis.libWrapper;
  if (libWrapper) libWrapper.register("dnd5e-scriptlets", "Roll.simplifyTerms", simplifyTerms, "WRAPPER");
  setupCleanDamageRolls();
  setupCleanAttackRolls()
  setupCleanSkillRoll();
  setupCleanAbiityTest();
  setupCleanAbiitySave();
}

function simplifyTerms(wrapped, terms) {
  terms = wrapped(terms);
  terms = terms.reduce((terms, term) => {
    const prior = terms[terms.length -1];
    const isOperator = term instanceof OperatorTerm;
    if (isOperator && prior instanceof OperatorTerm) {
      if (prior.operator === "+") {
        if (term.operator === "-") prior.operator = "-"
      } else if (prior.operator === "-") {
        if (term.operator === "-") prior.operator = "+";
      }
    } else terms.push(term);
    return terms;
  }, []);
  return terms;
}

function cleanParts(parts) {
  for (let i = 1; i < parts.length; i++){
    let part = parts[i].trim();
    if (part[0] === "+") parts[i] = part.slice(1);
  };
  return parts;
}

function cleanAtFields(rollConfig) {
  for (let part of rollConfig.parts) {
    const stringPart = part.trim();
    if (stringPart[0] !== "@") continue;
    const valueString = stringPart.slice(1);
    let value = getProperty(rollConfig.data, valueString);
    if (typeof value !== "string") continue;
    while (value.trim()[0] === "+") {
      value = value.trim().slice(1);
    }
    rollConfig.data[valueString] = value;
  }
}
function setupCleanAttackRolls() {
  const preRollHook = `${systemString}.preRollAttack`
  Hooks.on(preRollHook,(item, rollConfig) => {
    rollConfig.parts = cleanParts(rollConfig.parts);
    cleanAtFields(rollConfig);
  });
  const rollHook = `${systemString}.rollAttack`
  Hooks.on(rollHook, (item, roll, ammoutUpdate) => {
    if (isNewerVersion(game.version, "11.0")) roll.resetFormula();
    else roll._formula = Roll.getFormula(roll.terms);  })
  return true;
}

function setupCleanDamageRolls() {
  const preRollHook = `${systemString}.preRollDamage`;
  Hooks.on(preRollHook,(item, rollConfig) => {
    rollConfig.parts = cleanParts(rollConfig.parts);
    cleanAtFields(rollConfig);
  });
  const rollHook = `${systemString}.rollDamage`;
  Hooks.on(rollHook, (item, roll, ammoutUpdate) => {
    if (isNewerVersion(game.version, "11.0")) roll.resetFormula();
    else roll._formula = Roll.getFormula(roll.terms);  })
  return true;
}

function setupCleanSkillRoll() {
  const preRollHook = `${systemString}.preRollSkill`
  Hooks.on(preRollHook, (actor, rollConfig) => {
    rollConfig.parts = cleanParts(rollConfig.parts);
    cleanAtFields(rollConfig);
    return true;
  });
  const rollHook = `${systemString}.rollSkill`;
  Hooks.on(rollHook, (actor, roll, skillId) => {
    if (isNewerVersion(game.version, "11.0")) roll.resetFormula();
    else roll._formula = Roll.getFormula(roll.terms);
  });

}
function setupCleanAbiityTest() {
  const preRollHook = `${systemString}.preRollAbilityTest`;
  Hooks.on(preRollHook, (actor, rollConfig, abilityId) => {
    rollConfig.parts = cleanParts(rollConfig.parts);
    cleanAtFields(rollConfig);

  });
  const rollHook = `${systemString}.rollAbilityTest`;
  Hooks.on(rollHook, (actor, roll, skillId) => {
    if (isNewerVersion(game.version, "11.0")) roll.resetFormula();
    else roll._formula = Roll.getFormula(roll.terms);
  });
  return true;
}

function setupCleanAbiitySave() {
  const preRollHook = `${systemString}.preRollAbilitySave`
  Hooks.on(preRollHook, (actor, rollConfig, abilityId) => {
    rollConfig.parts = cleanParts(rollConfig.parts);
    cleanAtFields(rollConfig);
  });
  const rollHook = `${systemString}.rollAbilitySave`;
  Hooks.on(rollHook, (actor, roll, skillId) => {
    if (isNewerVersion(game.version, "11.0")) roll.resetFormula();
    else roll._formula = Roll.getFormula(roll.terms);
  });
  return true;
}