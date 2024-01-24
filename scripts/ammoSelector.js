// Actor onUse Macro (before item roll)
// script allows the selection of ammunition for a weapon item.
// The ammunition must have a keyword (e.g., "arrow") in its name to be available for selection.

import { systemString } from "./module.js";
// Define the mapping of weapon types to ammunition keywords
const weaponToAmmo = {
	longbow: "arrow",
	shortbow: "arrow",
	lightcrossbow: "bolt",
	handcrossbow: "bolt",
	heavycrossbow: "bolt",
	sling: "bullet",
	musket: "bullet",
	pistol: "bullet",
	revolver: "bullet",
	blowgun: "needle",
	scattergun: "shot",
};

export function setupAmmoSelector() {
	Hooks.on(`${systemString}.preUseItem`, ammoSelector);
}

export function ammoSelector(item, config, options) {
	if (game.settings.get("dnd5e-scriptlets", "ammoSelector") === "off") return true;
	if (options.ammoSelector?.hasRun || config.ammoSelector?.hasRun) return true;
  if (item.system.consume?.type !== "ammo") return true;

	const darkMode = game.settings.get("dnd5e-scriptlets", "ammoSelector") === "onDark"; // Set to true for dark mode styling
	// Check if the item is a weapon with ammunition property
	if (item.system.properties?.amm === true && item.type == "weapon") {
		let weaponType = item.system.baseItem;
		let ammoType = weaponToAmmo[weaponType];
		if (!ammoType) {
			// do some sort of log message
      setProperty(options, "ammoSelector.hasRun", true);
      setProperty(config, "ammoSelector.hasRun", true);
			return true;
		}
		// Filter available ammunition based on weapon type
		let allAmmo = item.parent.items.filter(
			(i) =>
				i.type == "consumable" && i.system.consumableType == "ammo" && i.name.toLowerCase().includes(ammoType)
		);
		let availableAmmo = allAmmo.filter((i) => i.system.quantity > 0);

		// Bypass the dialog if there's only one ammo type left and it's already set on the weapon
		if (availableAmmo.length === 1 && item.system.consume.target === availableAmmo[0].id) {
      setProperty(options, "ammoSelector.hasRun", true);
      setProperty(config, "ammoSelector.hasRun", true);
			return true;
		}
		if (availableAmmo.length === 0) {
			// No ammunition left
			ui.notifications.notify(`No ammunition left.`);
			return false;
		}

		const doDialog = async () => {
      let allowRoll = true;
			if (availableAmmo.length === 1) {
				// Automatically switch to the available ammunition
				await item.update({ "system.consume.target": availableAmmo[0].id });
				ui.notifications.notify(
					`Automatically switched to ${availableAmmo[0].name} (${availableAmmo[0].system.quantity} left)`
				);
			} else {
				let id = "ammo-select";
				let dialogOptions = allAmmo
					.sort((a, b) => b.system.quantity - a.system.quantity)
					.map((ammo) => {
						let isDisabled = item.system.quantity === 0;
						return {
							name: ammo.name,
							label: `
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <div style="display: flex; align-items: center;">
              <img src="${ammo.img}" width="36" height="36" style="margin-right: 15px;">
              <span>${ammo.name}</span>
            </div>
            <span style="margin-left: 15px;"">(${ammo.system.quantity})</span>
          </div>`,
							disabled: isDisabled,
							callback: async () => {
								if (!isDisabled) {
									await item.update({ "system.consume.target": ammo.id });
                  return true;
								}
							},
						};
					});
				let buttons = {};
				for (let o of dialogOptions) {
					buttons[o.name.slugify()] = {
						...o,
						disabled: o.disabled,
					};
				}
				allowRoll = await Dialog.wait(
					{
						title: `Select ammunition for ${item.name}`,
						buttons,
						content: `<style>
                  #${id} {
                    height: max-content !important;
                    width: auto !important;
                  }
                  #${id} .dialog-buttons {
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                  }
                  #${id} .dialog-button {
                    display: block;
                    padding: 3px 15px 3px 3px;
                    margin-bottom: 4px;
                    ${
						darkMode
							? "background-color: #333; color: var(--color-text-light-highlight); border: 2px groove #000"
							: ""
					}
                  }
                  #${id} .dialog-button[disabled] {
                    opacity: 0.3;
                    pointer-events: none;
                  }
                  #${id} .window-title {
                    padding-right: 15px;
                  }
                  #${id} .window-content {
                    ${darkMode ? "background: #222;" : ""}
                  }
                </style>`,
						close: () => {
							return false;
						},
					},
					{ id }
				);
			}
			setProperty(options, "ammoSelector.hasRun", true);
      setProperty(config, "ammoSelector.hasRun", true);

      setProperty(options, "workflowOptions.lateTargeting", "none");
      setProperty(options, "workflowOptions.targetConfirmation", "none");
			if (allowRoll) item.use(config, options);
		};
		doDialog();
		return false;
	}
	return true;
}
