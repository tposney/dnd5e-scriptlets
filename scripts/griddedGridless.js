export function setupGriddedGridless() {
  const libWrapper = globalThis.libWrapper;
  if (game.release.generation < 12) {
  if (libWrapper) libWrapper.register("dnd5e-scriptlets", "BaseGrid.prototype.measureDistances", measureDistances, "MIXED");
  } else {
    if (libWrapper) libWrapper.register("dnd5e-scriptlets", "game.grid.BaseGrid.prototype.measureDistances", measureDistances, "MIXED");
  }
}

function measureDistances(wrapped, segments, options = {}) {
  //@ts-expect-error .grid - Only do our own if is a gridless grid, calculating in grid spaces and we are enabled
  if (game.release.generation < 12) {
  if (canvas?.grid?.grid.constructor.name !== "BaseGrid" || !options.gridSpaces || !game.settings.get("dnd5e-scriptlets", "griddedGridless"))
    return wrapped(segments, options);
    return SquareGrid.prototype.measureDistances.call(this, segments, options);
  } else {
    if (canvas?.grid?.constructor.name !== "BaseGrid" || !options.gridSpaces || !game.settings.get("dnd5e-scriptlets", "griddedGridless"))
    return wrapped(segments, options);
    return foundry.grid.SquareGrid.prototype.measureDistances.call(this, segments, options);

  }
}