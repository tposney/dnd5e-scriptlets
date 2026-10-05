![](https://img.shields.io/badge/Foundry-v13-informational)
![](https://img.shields.io/badge/Foundry-v14-informational)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fdnd5e-scriptlets&colorB=4aa94a)

Discord <a href="https://discord.gg/Xd4NEvw5d7"><img src="https://img.shields.io/discord/915186263609454632?logo=discord" alt="chat on Discord"></a>

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/tposney)


# DND5E Scriptlets
This module provides a few QOL features for dnd5e that don't really fit anywhere else.

This branch is for Foundry v13 and v14 with dnd5e 5.x. Each feature is enabled in the module settings.

## Lukas' Fade Unprepared Spells
Spells that are not prepared are faded out on display. Thanks @Lukas

## Lukas' Item rarity colors
Color item inventory lines according to the item's rarity. Thanks @Lukas

## Legendary Recharge
When enabled legendary actions are reset at the start of each round and when an NPC joins combat, instead of at the end of the creature's turn.

## Token Resizer
When enabled adds a resizer icon to the token controls sidebar to allow setting selected tokens size.

## Alternate Advantage
Allows you to specify a roll formula to add/subtract to a roll for advantage/disadvantage instead of rolling 2 dice. Requires libWrapper.
The roll is evaluated against the actor/items roll data so expressions like "1d4 + @abilities.str.mod" will work, or just a number like 2

## Ammunition Recovery
Simple ammo recovery - for a more complete solution use the excellent Ammo Recovery module.
Auto executed at end of combat.
Can be called per actor with `game.modules.get("dnd5e-scriptlets").api.restoreAmmoActor(actor)`, or for all actors with `game.modules.get("dnd5e-scriptlets").api.restoreAmmoActors()`.
Magical ammunition is not recovered but the amount consumed is recorded and displayed. Magical ammo must have the magic property set for recovery to be disabled.

## Silent Initiative
Support silent initiative rolls - if enabled initiative rolls are not reported to the chat log.

## Actor Disposition Colors
Shows a dot coloured by the prototype token's disposition next to each actor in the Actors sidebar.

## Item Drag Drop
When dragging an item from an actor or world container you can specify to delete the item on the completion of the drop. Configurable in settings.
