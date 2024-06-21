export function setupTokenResizer() {
  globalThis.dnd5eScriptlets.api.tokenResizeData = sizeData;
  globalThis.dnd5eScriptlets.api.queryResizeTokens = queryResizeTokens;
  globalThis.dnd5eScriptlets.api.doResizeTokens = doResizeTokens;

  Hooks.on("getSceneControlButtons", (controls) => {
    if (!game.user.isGM || !game.settings.get("dnd5e-scriptlets", "tokenResizer")) return;
    const token = controls.find((c) => c.name === "token");

    if (token) {
      let i = token.tools.length;
      token.tools.splice(i, 0, {
        name: "tokenResizer",
        title: game.i18n.localize("dnd5e-scriptlets.TokenResizer.Name"),
        icon: "fas fa-expand-alt",
        visible: true,
        onClick: () => {
          if (game.canvas.tokens.controlled.length < 1) {
            const warningMessage = game.i18n.localize("dnd5e-scriptlets.NoTokenSelected");
            ui.notifications.warn(warningMessage);
            return;
          }
          queryResizeTokens(game.canvas.tokens.controlled);
        },
        button: true,
      });
    }
  });
}
/* default token resize data
  label: the label shown in the dialog in queryResizeTokens
  tokenSize: for square tokens (most) the height and width of the token
  height,width: allows for non-square tokens
  scale: scale to set for the token (relevant for small tokens)
  minScale: when resizing set the scale to be at least minScale or minscaleX/minScaleY if specified
  dndSize: if present set the token.trait.size to this otherwise use the size passed to doResize tokens
*/
let sizeData = {
  "tiny": { label: "Tiny", tokenSize: 0.25, minScale: 1 },
  "sm": { label: "Small", tokenSize: 1, scale: 0.5 },
  "med": { label: "Medium", tokenSize: 1, minScale: 1 },
  "lg": { label: "Large", tokenSize: 2, minScale: 1 },
  "huge": { label: "Huge", tokenSize: 3, minScale: 1 },
  //"huge-snake": {label: "Huge Snake", height: 3, width: 1, minScaleY: 3, dndSize: "huge"},
  "grg": { label: "Gargantuan", tokenSize: 4, minScale: 1 },
  "unit": { label: "An Absolute Unit", tokenSize: 8, minScale: 1, dndSize: "grg" },
};

/* Resize the passed tokens to the passed size, which must be a key in the sizeData
   Use sizeDataToUse (defaults to the module defined sizeData) when working which changes to make
 */
export async function doResizeTokens(tokens, size, sizeDataToUse = globalThis.dnd5eScriptlets.api.tokenResizeData) {
  if (!size) return;
  const sizeEntry = sizeDataToUse[size];
  if (!sizeEntry) return;
  for (let token of tokens) {
    const update = { height: sizeEntry.height ?? sizeEntry.tokenSize, width: sizeEntry.width ?? sizeEntry.tokenSize };
    const scaleX = token.document.texture?.scaleX;
    const scaleY = token.document.texture?.scaleY;
    if (scaleX < (sizeEntry.minScaleX ?? sizeEntry.minScale) || scaleY < (sizeEntry.minScaleY ?? sizeEntry.minScale)) {
      update["texture"] = { scaleX: Math.max(scaleX, sizeEntry.minScaleX ?? sizeEntry.minScale ?? 1), scaleY: Math.max(scaleY, sizeEntry.minScaleY ?? sizeEntry.minScale ?? 1) }
    } else if (sizeEntry.scale) {
      update["texture"] = { scaleX: sizeEntry.scale, scaleY: sizeEntry.scale }
    }
    await token.document.update(update);
    await token.actor.update({ "system.traits.size": sizeEntry.dndSize ?? size })
  }
}

/*
  Show a dialog to choose a new token size
  Use sizeDataToUse which defaults to the module generate size data.
*/
export async function queryResizeTokens(tokens, sizeDataToUse = globalThis.dnd5eScriptlets.api.tokenResizeData) {
  let size;
  const buttonData = Object.keys(sizeData).reduce((buttons, key) => {
    buttons[key] = {
      label: sizeDataToUse[key].label,
      callback: () => { size = key }
    };
    return buttons;
  }, {});
  await Dialog.wait({
    title: "Change Size?",
    buttons: buttonData,
    rejectClose: false,
    close: () => { return null }
  });

  if (size) return await doResizeTokens(tokens, size, sizeDataToUse);
}
