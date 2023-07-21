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