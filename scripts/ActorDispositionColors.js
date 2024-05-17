
function colorActorDisposition() {
  if (!game.settings.get("dnd5e-scriptlets", "ActorDispositionColors")) return;
  // Define the colors based on CONFIG.Canvas.dispositionColors, converting the decimal colors to hexadecimal string for CSS
  const colors = {
    "-2": '#' + CONFIG.Canvas.dispositionColors.SECRET.toString(16), // Secret
    "-1": '#' + CONFIG.Canvas.dispositionColors.HOSTILE.toString(16), // Hostile
    "0": '#' + CONFIG.Canvas.dispositionColors.NEUTRAL.toString(16), // Neutral
    "1": '#' + CONFIG.Canvas.dispositionColors.FRIENDLY.toString(16) // Friendly
  };

  // Iterate through each actor in the sidebar
  document.querySelectorAll(".directory-item").forEach(item => {
    // Retrieve the actor's ID from the element
    let actorId = item.dataset.documentId;
    let actor = game.actors.get(actorId);

    if (actor && actor.prototypeToken.disposition.toString() in colors) {
      // Find the actor's name element within this directory item
      let nameElement = item.querySelector(".entry-name a");

      if (nameElement) {
        // Check if a disposition dot already exists to avoid duplicates
        if (!nameElement.previousSibling || nameElement.previousSibling.className !== 'disposition-dot') {
          // Create a colored dot span and prepend it to the actor's name element
          let dot = document.createElement('span');
          dot.className = 'disposition-dot';
          dot.style.display = 'inline-block';
          dot.style.marginRight = '5px';
          dot.style.borderRadius = '50%';
          dot.style.width = '8px';
          dot.style.height = '8px';
          dot.style.verticalAlign = 'middle';
          dot.style.backgroundColor = colors[actor.prototypeToken.disposition.toString()];

          // Insert the dot before the actor's name
          nameElement.parentNode.insertBefore(dot, nameElement);
        } else if (nameElement.previousSibling.className === 'disposition-dot') {
          const dot = nameElement.previousSibling;
          dot.className = 'disposition-dot';
          dot.style.display = 'inline-block';
          dot.style.marginRight = '5px';
          dot.style.borderRadius = '50%';
          dot.style.width = '8px';
          dot.style.height = '8px';
          dot.style.verticalAlign = 'middle';
          dot.style.backgroundColor = colors[actor.prototypeToken.disposition.toString()]
        }
      }

    }
  });
}

export function initActorDispositionColors() {
  Hooks.on("renderActorDirectory", colorActorDisposition);
  Hooks.on("updateActor", (actor, updates, options, userId) => {
   if (foundry.utils.getProperty(updates, "prototypeToken.disposition") !== undefined) colorActorDisposition();
  });
};
