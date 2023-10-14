### 0.16
* Fix the origins of actor effects (as best we can) when creating an actor.

### 0.15
* Support silent initiative rolls - if enabled initiative rolls are not reported to the chat log.
* Added support for Ready Set Roll in ammo selector.

### 0.14
* Fix for bogus error reported during initialisation

### 0.13
* Fix for token resizer bug introduced in 0.12

### 0.12
* Added simple ammo recovery - for a more complete solution use the excellent Ammo Recovery module.
* Auto executed at end of combat.
* Can be called per actor with globalThis.dnd5eScriptlets.restoreAmmoActor(actor), or globalThis.dnd5eScriptlets.restoreAmmoActors(). 
* Magical ammunition is not recovered but the amount consumed is recorded and displayed. Magical ammo must have the magic property set recovery to be disabled.

### 0.11
* Added Collapsible inventory sections for the default character sheet.

### 0.10.1
* Fix for alternative advantage not setting disadvantage correctly

### 0.10
* Added option to whisper recharge message to GM only.
* legendary actions are recharged when a combatant is added to the combat.
* items are recharged when a combatant is added to the combat.

### 0.9.1
* Fix for error being thrown in v10 when managing settings.

### 0.9
* Added "Alternative Advantage" which allows you to specify a roll formula to add/subtract to a roll for advantage/disadvantage instead of rolling 2 dice.
  - The roll is evaluated against the actor/items roll data so expressions like "1d4 + @abilities.str.mod" will work, or just a number like 2

### 0.8
* Allow item recharge to be silent or generate a chat message.

### 0.7
* Fix for not working in non-english environments

### 0.6 
* Size small now works as per RAW (i.e size 1 but scaled to look small)
* Major changes to tokenResizer - now can be configured by passing size data to the functions or altering globalThis.dnd5eScriptlets.API.tokenResizeData.
* Export queryResize(tokens: [Token], resizeData) 
* Export doResizeTokens(tokens: [Token], size: string, resizeData) size is a key into resizeData
* resize data is optional and if omitted defaults to globalThis.dnd5eScriptlets.API.tokenResizeData
### 0.5
* Export queryResize(tokens: [Token]) in globalThis.dnd5eScriptlets.API
* Export doResizeTokens(tokens: [Token], size: number) (0.25, 0.5, 1, 2, 4, 8)
### 0.4
* Added Clean Rolls, Item Recharge, Legendary Recharge, Token Resizer, Roll Unlinked Token HP.
* Clean rolls will remove the + + or + - from various dnd5e rolls.

### 0.3
* Fix for doing late targeting twice (if using midi-qol)
