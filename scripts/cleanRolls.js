import { systemString } from "./module.js";

export function checkCleanRolls() {
  if (!game.settings.get("dnd5e-scriptlets", "cleanRolls")) return;
  if (!globalThis.libWrapper) {
    const errorMessage = game.i18n.localize("dnd5e-scriptlets.needsLibWrapper");
    console.error(errorMessage);
    ui.notifications?.error(errorMessage, { permanent: true });
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
    const prior = terms[terms.length - 1];
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
  for (let i = 0; i < parts.length; i++) {
    let part = `${parts[i]}`.trim();
    if (part[0] === "+") part = part.slice(1);
    if (part.endsWith("+")) part = part.slice(0, -1);
    for (let j = 0; j < 2; j++) {

      part = part.replace(/-\s*-/g, "+");
      part = part.replace(/-\s*\+/g, "-");
      part = part.replace(/\+\s*\+/g, "+");
      part = part.replace(/\+\s*-/g, "-");
    }
    parts[i] = part;
  }
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
  Hooks.on(preRollHook, (item, rollConfig) => {
    rollConfig.parts = cleanParts(rollConfig.parts);
    cleanAtFields(rollConfig);
  });
  const rollHook = `${systemString}.rollAttack`
  Hooks.on(rollHook, (item, roll, ammoutUpdate) => {
    if (isNewerVersion(game.version, "11.0")) roll.resetFormula();
    else roll._formula = Roll.getFormula(roll.terms);
  })
  return true;
}

function setupCleanDamageRolls() {
  if (isNewerVersion("2.9.99", game.system.version)) {
    const preRollHook = `${systemString}.preRollDamage`;
    Hooks.on(preRollHook, (item, rollConfig) => {
      if (isNewerVersion(game.system.version, "2.9.99")) {
        for (let singleRollConfig of rollConfig.rollConfigs) {
          singleRollConfig.parts = cleanParts(singleRollConfig.parts);
          cleanAtFields(singleRollConfig);
        }
      } else {
        rollConfig.parts = cleanParts(rollConfig.parts);
        cleanAtFields(rollConfig);
      }
    });
  }

  const rollHook = `${systemString}.rollDamage`;
  Hooks.on(rollHook, (item, roll, ammoutUpdate) => {
    if (isNewerVersion(game.system.version, "2.9.99")) {
      if (!(roll instanceof Array)) roll = [roll];
      roll.forEach(r => r.resetFormula());
    } else if (isNewerVersion(game.version, "11.0")) roll.resetFormula();
    else roll._formula = Roll.getFormula(roll.terms);
  })
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