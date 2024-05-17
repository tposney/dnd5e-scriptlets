import { socketlibSocket } from "./GMAction.js";
import { libWrapper } from "./module.js";


export function setupContainerHelpers() {
  libWrapper.register("dnd5e-scriptlets", "game.system.applications.actor.ActorSheet5e.prototype._onDropItem", _actorSheetOnDropItem, "WRAPPER");
  libWrapper.register("dnd5e-scriptlets", "game.system.applications.actor.GroupActorSheet.prototype._onDropItem", _actorSheetOnDropItem, "WRAPPER");
  libWrapper.register("dnd5e-scriptlets", "game.system.applications.item.ContainerSheet.prototype._onDropItem", _containerSheetOnDropItem, "WRAPPER");

}

async function _actorSheetOnDropItem(wrapped, event, data) {
  const actorRemove = game.settings.get("dnd5e-scriptlets", "AutoRemoveItemsFromActor");
  const containerRemove = game.settings.get("dnd5e-scriptlets", "AutoRemoveItems");
  if (actorRemove === "none" && containerRemove === "none") return wrapped(event, data);

  console.error(this, event, data);
  // If dropping an item to a new actor we should delete the container id
  return wrapped(event, data).then(result => {
      //@ts-expect-error
      const item = fromUuidSync(data.uuid);
      if (result?.length > 0 && item) {
        const resItem = result[0];

      if (item?.parent instanceof Actor && resItem.parent !== item.parent) { // dropped from an actor
        if (actorRemove === "removeAll" 
          || (item.parent.type === "character" && ["removeCharacter", "removeCharacterGroup", "removeCharacterNPC"].includes(actorRemove))
          || (item.parent.type === "npc" && ["removeNPC", "removeCharacterNPC", "removeNPCGroup"].includes(actorRemove))
          || (item.parent.type === "group" && ["removeGroup", "removeCharacterGroup", "removeNPCGroup"].includes(actorRemove))) { // dropped from inventory
          if (item.isOwner) item.delete();
          else socketlibSocket.executeAsGM("deleteItem", item.uuid);
        }
      } else if (!item.parent && item.container && resItem.parent instanceof Actor) { // dropped from a world container to an actor
        if (["removeWorld"].includes(containerRemove)) {
          if (item.isOwner) item.delete();
          else socketlibSocket.executeAsGM("deleteItem", item.uuid);
        }
      }
      // fix for dnd not clearing container on item drop
      if (!(this instanceof game.system.applications.item.ContainerSheet && item.systen.container)) 
        resItem.update({"system.container": null})
    }
  });
}

async function _containerSheetOnDropItem(wrapped, event, data) {
  return _actorSheetOnDropItem.bind(this)(wrapped, event, data)
}