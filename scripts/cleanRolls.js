export function checkCleanRolls() {
  if (!game.settings.get("dnd5e-scriptlets", "cleanRolls")) return;
  if (!globalThis.libWrapper) {
    errorMessage = game.i18n.localize("dnd5e-scriptlets.needsLibWrapper");
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
  Hooks.on("dnd5e.preRollAttack",(item, rollConfig) => {
    rollConfig.parts = cleanParts(rollConfig.parts);
    cleanAtFields(rollConfig);
  });
  Hooks.on("dnd5e.rollAttack", (iteem, roll, ammoutUpdate) => {
    roll.resetFormula();
  })
  return true;
}

function setupCleanDamageRolls() {
  Hooks.on("dnd5e.preRollDamage",(item, rollConfig) => {
    rollConfig.parts = cleanParts(rollConfig.parts);
    cleanAtFields(rollConfig);
  });
  Hooks.on("dnd5e.rollDamage", (iteem, roll, ammoutUpdate) => {
    roll.resetFormula();
  })
  return true;
}

function setupCleanSkillRoll() {
  Hooks.on("dnd5e.preRollSkill", (actor, rollConfig) => {
    rollConfig.parts = cleanParts(rollConfig.parts);
    cleanAtFields(rollConfig);
    return true;
  });
  Hooks.on("dnd5e.rollSkill", (actor, roll, skillId) => {
    roll.resetFormula();
  });

}
function setupCleanAbiityTest() {
  Hooks.on("dnd5e.preRollAbilityTest", (actor, rollConfig, abilityId) => {
    rollConfig.parts = cleanParts(rollConfig.parts);
    cleanAtFields(rollConfig);

  });
  Hooks.on("dnd5e.rollAbilityTest", (actor, roll, skillId) => {
    roll.resetFormula();
  });
  return true;
}

function setupCleanAbiitySave() {
  Hooks.on("dnd5e.preRollAbilitySave", (actor, rollConfig, abilityId) => {
    rollConfig.parts = cleanParts(rollConfig.parts);
    cleanAtFields(rollConfig);
  });
  Hooks.on("dnd5e.rollAbilitySave", (actor, roll, skillId) => {
    roll.resetFormula();
  });
  return true;
}