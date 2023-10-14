
export function setupCollapsibleActorSections() {
  Hooks.on("renderActorSheet", async (actorSheet, html) => {
    if (!game.settings.get("dnd5e-scriptlets", "ActorCollapsibleSection")) return;
  // Rather than checking it is a 5E actor sheet, we check it is a sheet with collapsible sections
  // This should work for sheets that are close to dnd5e

    const actor = actorSheet.actor; // Get the Actor instance from ActorSheet

    // For both inventory, features and spellbook
    const sections = ['.tab.inventory', '.tab.features', '.tab.spellbook'];

    sections.forEach(section => {
      const categories = html.find(`${section} .items-header`);
      categories.each(async (index, categoryElement) => {
        const $categoryElement = $(categoryElement);
        const categoryName = $categoryElement.text().trim();

        // Load the collapsed state of this category from the actor's flags
        const collapsed = actor.getFlag('dnd5e-scriptlets', `collapsed-category-${categoryName}`);

        // Add the collapsed class if it was previously collapsed
        if (collapsed) {
          $categoryElement.addClass('collapsed');
          $categoryElement.next('.item-list').hide();
        }

        // Add a click handler to the category
        $categoryElement.click((event) => {
          // Ignore clicks on inputs and links
          if ($(event.target).is('input, a, i')) {
            return;
          }

          // Toggle the collapsed class
          $categoryElement.toggleClass('collapsed');

          // Toggle the visibility of the items in this category
          $categoryElement.next('.item-list').slideToggle();

          // Save the collapsed state of this category in the actor's flags
          actor.setFlag('dnd5e-scriptlets', `collapsed-category-${categoryName}`, $categoryElement.hasClass('collapsed'));
        });

        // Add some custom CSS to indicate that the categories are clickable
        $categoryElement.css({
          cursor: 'pointer',
        });
      });
    });
  });
}