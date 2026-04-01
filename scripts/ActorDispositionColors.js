
function getDispositionColors() {
  return {
    "-2": '#' + CONFIG.Canvas.dispositionColors.SECRET.toString(16).padStart(6, '0'),
    "-1": '#' + CONFIG.Canvas.dispositionColors.HOSTILE.toString(16).padStart(6, '0'),
    "0": '#' + CONFIG.Canvas.dispositionColors.NEUTRAL.toString(16).padStart(6, '0'),
    "1": '#' + CONFIG.Canvas.dispositionColors.FRIENDLY.toString(16).padStart(6, '0')
  };
}

function applyDot(item, colors) {
  const actorId = item.dataset.entryId;
  const actor = game.actors.get(actorId);
  if (!actor) return;
  const disposition = actor.prototypeToken.disposition.toString();
  if (!(disposition in colors)) return;

  let dot = item.querySelector('.disposition-dot');
  if (!dot) {
    dot = document.createElement('span');
    dot.className = 'disposition-dot';
    item.insertBefore(dot, item.firstChild);
  }
  dot.style.backgroundColor = colors[disposition];
}

function colorActorDispositionRender(app, html) {
  if (!game.settings.get("dnd5e-scriptlets", "ActorDispositionColors")) return;
  const colors = getDispositionColors();
  html.querySelectorAll("li.directory-item.entry.actor").forEach(item => applyDot(item, colors));
}

function colorActorDisposition(actor) {
  if (!game.settings.get("dnd5e-scriptlets", "ActorDispositionColors")) return;
  const colors = getDispositionColors();
  const item = document.querySelector(`li.directory-item.entry.actor[data-entry-id="${actor.id}"]`);
  if (item) applyDot(item, colors);
}

export function initActorDispositionColors() {
  Hooks.on("renderActorDirectory", colorActorDispositionRender);
  Hooks.on("updateActor", (actor, updates) => {
    if (updates.prototypeToken?.disposition !== undefined)
      colorActorDisposition(actor);
  });
}
