export function setupLukasCharSheetFilter() {
  if (isNewerVersion("2.9.9", game.system.version)) {
    //From @Lukas
    Hooks.on("renderActorSheet", (sheet, html) => {
      if (!game.settings.get("dnd5e-scriptlets", "lukasSheetFilter")) return;
      if (sheet.constructor.name !== "ActorSheet5eCharacter") return;

      const tabsToFilter = ["inventory", "features", "spellbook"];

      tabsToFilter.forEach((tab) => {
        const filterInput = $(
          `<input type="text" class="filter-input" placeholder="Filter..." style="position: relative;"/>`
        );
        const clearButton = $('<span class="clear-input">x</span>');
        clearButton.css({
          cursor: "pointer",
          position: "absolute",
          right: "6px",
          top: "50%",
          transform: "translateY(-50%)",
          "font-weight": "bold",
        });

        const filterWrapper = $('<li style="position: relative;"></li>');
        filterWrapper.append(filterInput);
        filterWrapper.append(clearButton);

        clearButton.hide();

        html.find(`.tab.${tab} .inventory-filters ul.filter-list`).prepend(filterWrapper);

        filterInput.on("input", (event) => {
          //@ts-expect-error .value
          const searchText = event.target.value.trim();
          clearButton.toggle(!!searchText);

          html.find(`.tab.${tab} .items-list .item`).each((_, element) => {
            const itemText = $(element).text().toLowerCase();
            const isMatch = itemText.includes(searchText.toLowerCase());
            $(element).toggle(isMatch);
          });
        });

        clearButton.on("click", () => {
          filterInput.val("");
          clearButton.hide();
          html.find(`.tab.${tab} .items-list .item`).show();
        });
      });
    });
  }
}
