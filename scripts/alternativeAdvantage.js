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
    ui.notifications?.error(errorMessage, { permanent: true });
  }
}

// A formula of more than one term is bracketed, so disadvantage subtracts all of it
function bonusTerms(formula, data) {
  const terms = new Roll(formula, data).terms;
  return terms.length > 1 ? new Roll(`(${formula})`, data).terms : terms;
}

function configureAdvantage(wrapped) {
  wrapped();
  const advantageQuantum = game.settings.get("dnd5e-scriptlets", "alternativeAdvantage");
  if (!advantageQuantum || advantageQuantum.trim().length === 0) return;
  const d20 = this.terms[0];
  if (this.hasAdvantage) {
    d20.modifiers = d20.modifiers?.filter(s => s !== "kh" && !/^adv\d*$/i.test(s));
    d20.number = 1;
    if (!d20.options.hasAdvantage) {
      this.terms.push(new foundry.dice.terms.OperatorTerm({ operator: "+", options: { isAdvantageTerm: true } }));
      const extraTerms = bonusTerms(advantageQuantum, this.data);
      for (let term of extraTerms) term.options.isAdvantageTerm = true;
      this.terms = this.terms.concat(extraTerms)
      d20.options.hasAdvantage = true;
    }
  } else {
    this.terms = this.terms.filter(t => !t.options.isAdvantageTerm);
    d20.options.hasAdvantage = false;
  }

  if (this.hasDisadvantage) {
    d20.modifiers = d20.modifiers?.filter(s => s !== "kl" && !/^dis\d*$/i.test(s));
    d20.number = 1;
    if (!d20.options.hasDisadvantage) {
      this.terms.push(new foundry.dice.terms.OperatorTerm({ operator: "-", options: { isDisadvantageTerm: true } }));
      const extraTerms = bonusTerms(advantageQuantum, this.data);
      for (let term of extraTerms) term.options.isDisadvantageTerm = true;
      this.terms = this.terms.concat(extraTerms)
      d20.options.hasDisadvantage = true;
    }
  } else {
    this.terms = this.terms.filter(t => !t.options.isDisadvantageTerm);
    d20.options.hasDisadvantage = false;
  }

  this._formula = this.constructor.getFormula(this.terms);
}