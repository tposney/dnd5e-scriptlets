export function setupEnableTokenDynamicRing() {
  Hooks.on("preCreateToken", async (tokenDocument) => {
    if (game.settings.get("dnd5e-scriptlets", "EnableTokenDynamicRing") === false) return;
    if (game.release.generation < 12) {
      tokenDocument.updateSource({"flags.dnd5e.tokenRing.enabled": true})
    } else {
      const ringColor = game.settings.get("dnd5e-scriptlets", "EnableTokenDynamicRingColour");
      const options = {
        ring: {
          enabled: true,
        },
      };
      if (ringColor !== "None" && !tokenDocument.ring?.colors?.ring) {
        foundry.utils.setProperty(options, "ring.colors.ring", `${getHexColor(ringColor)}`);
      }
      const backgroundColor = game.settings.get("dnd5e-scriptlets", "EnableTokenDynamicRingBackgroundColour");
      if (backgroundColor !== "None" && !tokenDocument.ring?.colors?.background) {
        foundry.utils.setProperty(options, "ring.colors.background", `${getHexColor(backgroundColor)}`);
      }
      tokenDocument.updateSource(options)
    }
  });
}

function getHexColor(colorStr) {
  var a = document.createElement('div');
  a.style.color = colorStr;
  var colors = window.getComputedStyle( document.body.appendChild(a) ).color.match(/\d+/g).map(function(a){ return parseInt(a,10); });
  document.body.removeChild(a);
  return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
}