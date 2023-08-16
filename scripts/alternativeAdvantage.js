export function setupAlternativeAdvantage() {
  const libWrapper = globalThis.libWrapper;
	if (libWrapper) libWrapper.register("dnd5e-scriptlets", "CONFIG.Dice.D20Roll.prototype.configureModifiers", configureAdvantage, "WRAPPER");

  /*
  Hooks.on("dnd5e.preRollAttack", (...args) => {
    const [item, rollConfig] = args;
    if (rollConfig.advantage)
  })
  */
}

export function checkAlternativeAdvatage() {
  if (!game.settings.get("dnd5e-scriptlets", "alternativeAdvantage")) return;
  if (!globalThis.libWrapper) {
    const errorMessage = game.i18n.localize("dnd5e-scriptlets.needsLibWrapper");
    console.error(errorMessage);
    ui.notifications?.error(errorMessage, {permanent: true});
  }
}

function configureAdvantage(wrapped) {
  wrapped();
  const advantageQuantum = game.settings.get("dnd5e-scriptlets", "alternativeAdvantage");
  if (!advantageQuantum || advantageQuantum.trim().length === 0) return;
  const d20 = this.terms[0];
  if (this.hasAdvantage) {
    console.error("configure adv data is ", this.data)
    d20.modifiers = d20.modifiers?.filter(s => s !== "kh");
    this.terms.push(new OperatorTerm({operator: "+"}));
    const extraTerms = new Roll(advantageQuantum, this.data).terms;
    this.terms = this.terms.concat(extraTerms)
    d20.number = 1;
  }
  if (this.hasDisadvantage) {
    d20.modifiers = d20.modifiers?.filter(s => s !== "kl");
    this.terms.push(new OperatorTerm({operator: "-"}));
    const extraTerms = new Roll(advantageQuantum, this.data).terms;
    this.terms.concat(extraTerms)
    d20.number = 1;
  }
  this._formula = this.constructor.getFormula(this.terms);
}
function advantageAdjust(...args) {
  if (!game.settings.get("dnd5e-scriptlets", "alternativeAdvantage")) return;
  const [actorOrItem, rollData] = args;
  if (rollData.advantage) {
    rollData.data.adv = 2;
    rollData.parts.push("@adv")
    rollData.advantage = false;
  }
  if (rollData.disadvantage) {
    rollData.data.disadv = 2;
    rollData.parts.push("@disadv")
    rollData.disadvantage = false;
  }
  return true;
}