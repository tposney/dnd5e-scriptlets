export function setupGriddedGridless() {
  const libWrapper = globalThis.libWrapper;
  if (libWrapper) libWrapper.register("dnd5e-scriptlets", "BaseGrid.prototype.measureDistances", measureDistances, "MIXED");
}

function measureDistances(wrapped, segments, options = {}) {
  //@ts-expect-error .grid - Only do our own if is a gridless grid, calculating in grid spaces and we are enabled
  if (canvas?.grid?.grid.constructor.name !== "BaseGrid" || !options.gridSpaces || !game.settings.get("dnd5e-scriptlets", "griddedGridless"))
    return wrapped(segments, options);
  return SquareGrid.prototype.measureDistances.call(this, segments, options);
}