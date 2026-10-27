export function setupTokenResizer() {
  globalThis.dnd5eScriptlets.api.tokenResizeData = sizeData;
  globalThis.dnd5eScriptlets.api.queryResizeTokens = queryResizeTokens;
  globalThis.dnd5eScriptlets.api.doResizeTokens = doResizeTokens;

  Hooks.on("getSceneControlButtons", (buttons) => {
    if (game.settings.get("dnd5e-scriptlets", "tokenResizer")) {
      let tokenButtons = buttons["tokens"];
      if (tokenButtons) {
        tokenButtons.tools["tokenResizer"] = {
          name: "tokenResizer",
          title: game.i18n.localize("dnd5e-scriptlets.TokenResizer.Name"),
          icon: "fas fa-expand-alt",
          button: true,
          toggle: false,
          active: true,
          visible: game.user.isGM,
          onChange: async (event, active) => {
            if (game.canvas.tokens.controlled.length < 1) {
              const warningMessage = game.i18n.localize("dnd5e-scriptlets.NoTokenSelected");
              ui.notifications.warn(warningMessage);
              return;
            }
            queryResizeTokens(game.canvas.tokens.controlled);
          },
        };
      }
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
  "unit": { label: "Absolute Unit", tokenSize: 8, minScale: 1, dndSize: "grg" },
};

/*
  Where a token can grow to width x height grid spaces on a square grid: a position whose footprint contains the token's
  current one, inside the scene, overlapping no other token (tokens it already shares space with excepted) and with every
  space reachable from the token's centre without crossing a movement wall. The nearest to the current centre, or
  undefined if there is none.
*/
export function findGrowthPosition(token, width, height) {
  const grid = canvas.grid;
  const size = grid.size;
  const doc = token.document;
  const rect = (x, y, w, h) => new PIXI.Rectangle(x, y, w * size, h * size);
  const overlaps = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
  const current = rect(doc.x, doc.y, doc.width, doc.height);
  const others = canvas.tokens.placeables.filter(t => t !== token)
    .map(t => rect(t.document.x, t.document.y, t.document.width, t.document.height))
    .filter(r => !overlaps(r, current));
  const scene = canvas.dimensions.sceneRect;
  const origin = token.center;
  const base = grid.getTopLeftPoint({ x: doc.x + 1, y: doc.y + 1 });
  const candidates = [];
  for (let i = 0; i <= Math.max(0, width - Math.ceil(doc.width)); i++) {
    for (let j = 0; j <= Math.max(0, height - Math.ceil(doc.height)); j++) {
      const area = rect(base.x - i * size, base.y - j * size, width, height);
      candidates.push({ area, distance: Math.hypot(area.x + area.width / 2 - origin.x, area.y + area.height / 2 - origin.y) });
    }
  }
  const fits = (area) => {
    if (area.x < scene.x || area.y < scene.y || area.right > scene.right || area.bottom > scene.bottom) return false;
    if (others.some(r => overlaps(r, area))) return false;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const space = { x: area.x + (i + 0.5) * size, y: area.y + (j + 0.5) * size };
        if (CONFIG.Canvas.polygonBackends.move.testCollision(origin, space, { type: "move", mode: "any" })) return false;
      }
    }
    return true;
  };
  const found = candidates.sort((a, b) => a.distance - b.distance).find(c => fits(c.area));
  return found ? { x: found.area.x, y: found.area.y } : undefined;
}

/* Resize the passed tokens to the passed size, which must be a key in the sizeData
   Use sizeDataToUse (defaults to the module defined sizeData) when working which changes to make
 */
export async function doResizeTokens(tokens, size, sizeDataToUse = globalThis.dnd5eScriptlets.api.tokenResizeData) {
  if (!size) return;
  const sizeEntry = sizeDataToUse[size];
  if (!sizeEntry) return;
  for (let token of tokens) {
    const update = { height: sizeEntry.height ?? sizeEntry.tokenSize, width: sizeEntry.width ?? sizeEntry.tokenSize };
    // growing on a square grid: find room rather than covering neighbours or crossing walls
    let position = {};
    if (canvas.grid.isSquare && (update.width > token.document.width || update.height > token.document.height)) {
      position = findGrowthPosition(token, update.width, update.height);
      if (!position) {
        ui.notifications.warn(game.i18n.format("dnd5e-scriptlets.TokenResizer.NoRoom", { name: token.name, size: sizeEntry.label }));
        continue;
      }
      Object.assign(update, position);
    } else if (canvas.grid.isSquare && Number.isInteger(update.width) && Number.isInteger(update.height)
      && (update.width < token.document.width || update.height < token.document.height)) {
      // shrinking: keep the token's centre (up and left when it falls on a grid line, undoing a growth into free space)
      const size = canvas.grid.size;
      const { x, y } = canvas.grid.getTopLeftPoint({ x: token.center.x - (update.width - 1) * size / 2 - 1, y: token.center.y - (update.height - 1) * size / 2 - 1 });
      position = { x, y };
      Object.assign(update, position);
    }
    const scaleX = token.document.texture?.scaleX;
    const scaleY = token.document.texture?.scaleY;
    if (scaleX < (sizeEntry.minScaleX ?? sizeEntry.minScale) || scaleY < (sizeEntry.minScaleY ?? sizeEntry.minScale)) {
      update["texture"] = { scaleX: Math.max(scaleX, sizeEntry.minScaleX ?? sizeEntry.minScale ?? 1), scaleY: Math.max(scaleY, sizeEntry.minScaleY ?? sizeEntry.minScale ?? 1) }
    } else if (sizeEntry.scale) {
      update["texture"] = { scaleX: sizeEntry.scale, scaleY: sizeEntry.scale }
    }
    await token.document.update(update, { movement: { [token.id]: { waypoints: [{ ...position, width: update.width, height: update.height, action: "displace" }] } } });
    await token.actor.update({ "system.traits.size": sizeEntry.dndSize ?? size })
  }
}

/*
  Show a dialog to choose a new token size
  Use sizeDataToUse which defaults to the module generate size data.
*/
export async function queryResizeTokens(tokens, sizeDataToUse = globalThis.dnd5eScriptlets.api.tokenResizeData) {
  let size;
  const buttonData = Object.keys(sizeData).map((key) => {
    return {
      action: key,
      label: sizeDataToUse[key].label,
      callback: () => { size = key },
      disabled: false
    }
  });
  await foundry.applications.api.DialogV2.wait({
    window: {
      title: "Change Size?",
      width: "auto",
      resizable: true,
    },
    buttons: buttonData,
    rejectClose: false,
    close: () => { return null }
  });

  if (size) return await doResizeTokens(tokens, size, sizeDataToUse);
}
