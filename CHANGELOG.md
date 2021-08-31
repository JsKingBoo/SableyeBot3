### 3.1.25 - 2021-08-31

 * Add new filters `resist` and `weakness`
 * Fix bug in `//weakness <type>[, <type>]`

### 3.1.24 - 2021-08-05

 * Update libraries and fix the bot invite link to prepare for slash commands.

### 3.1.23 - 2020-10-26

 * New Crown Tundra learnsets added.

### 3.1.22 - 2020-10-23

 * Crown Tundra information added.
 * Fix GMax Issue.
 * Fix `//learn <move>` bug.
 * Fix `//event` not working.

### 3.1.21 - 2020-06-30
 * `//learn` now respects prevos
 * Probably fixes a lot of other bugs.

### 3.1.20 - 2020-06-25
 * Isle of Armor pokemon added
 * `//filter` output made more helpful
 * Remedy typos in `//learn --vgc`
 * Use the latest Pokemon Showdown data
 * Fix a bug in `//filter --verbose`
 * Add Max Move power to `//dt`
 * Isle of armor data!

### 3.1.19 - 2020-01-03
 * Allow `//learn` to take multiple moves in the `//learn <Pokemon>[, <Move>]...` form.
   * This will list the learn method for every move listed for the given Pokemon.

### 3.1.18 - 2019-12-30
 * Make the `//filter` command check VGC legality of Pokemon/Move combinations when supplied with `--vgc`.
 * Add the following flags to `//learn`:
   * `--vgc`: Excludes transfer-only Moves/Pokemon from `//learn <move>` and `//learn <Pokemon>`.
   * `--natdex`: Search the entire National Pokedex - listing Sword/Shield-legal Pokemon only is the new default behaviour. 

### 3.1.17 - 2019-12-09
 * Make the `//filter` command search Sword/Shield-legal Pokemon by default and include a `--natdex` option to revert to the old behaviour.
 * Add TRs to the `//learn` command's text for TMs/HMs/TRs.
 * Removed the `--alola` flag for the `//filter` command.

### 3.1.16 - 2019-11-30
 * Add Let's Go, Pikachu! and Let's Go, Eevee! to `//addgame`

### 3.1.15 - 2019-11-18
 * Directly leech off of Showdown's repository instead of cherrypicking a few files (lol)
 * Band-aid fix `//sprite` while we wait for more gen 8 data

### 3.1.14 - 2019-11-18
 * Update bot to support gen 8 (use `//updatedb` to pull data changes from Showdown)
 * `//filter` now notes the number of Pokemon matched

### 3.1.13 - 2019-10-06
 * Add tier information to non-verbose dex call
 * Remove weight information from non-verbose dex call

### 3.1.12 - 2019-04-25
 * Add --vgclegal and --gscup options to `//filter`
 * All commands run asynchronously
 * Update README to reflect changes in dependencies

### 3.1.11 - 2019-04-05
 * Fix typo in `learn.js`

### 3.1.10 - 2018-12-17
 * Add invite link to `about.js`
 * Add command usage when using `//help <cmd>`
 * Fix `resist` filter parameter failing on non-equals operators

### 3.1.9 - 2018-11-10
 * Add "resist" filter parameter to `filter.js`
 * Update `package.lock.json` so Github stop complaining
 * Various styling fixes

### 3.1.8 - 2018-04-25
 * Add Flying Press and Freeze-Dry support to `coverage.js`
 * Improve `addfc.js` help
 * Update README to reflect changes in installation instructions
 * Fix various typos

### 3.1.7 - 2018-03-24
 * Fix `pokedex.js` showing abilities that didn't exist yet on older generations
 * Improve `addgame.js` help
 * Fix various typos

### 3.1.6 - 2018-02-17
 * Add "elevated" permission level
 * Fix `updatedb.js` doing nothing

### 3.1.5 - 2018-02-16
 * Add automatic database update (mostly)
 * Changed how command outputs are parsed
 * Comment out automatic setting avatar
 * Wonder why people haven't found the Easter Egg (on live) yet
  
### 3.1.4 - 2017-12-01
 * Fix `FCManager` not correctly storing discord ID
 * Improve anti-crash logging

### 3.1.3 - 2017-11-28
 * Add basic anti-crash logging
 * Fix typo in `Learnset` that failed every learnset creation after the first

### 3.1.2 - 2017-11-27
 * Fix `filter.js` not parsing != operator correctly
 * Fix typo in `filter.js`
 * Fix bug where learnsets from prevos were not properly inherited into their parent
 * Changed some acceptable falsey/truthy values in `filter.js` 
 * Update friend code to accept USUM games

### 3.1.1 - 2017-10-08
 * Fix `filter.js` not parsing strings correctly

### 3.1.0 - 2017-09-24
 * Add Friend Code commands
 * Add `config.js.example`
 * Fix `meme.js` throwing an error

# 3.0.0 - 2017-09-06
 * Initial release
 
