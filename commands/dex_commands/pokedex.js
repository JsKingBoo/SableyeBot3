'use strict';

let lowKickCalcs = (number) => {
  if (number < 10) { return 20; }
  if (number < 25) { return 40; }
  if (number < 50) { return 60; }
  if (number < 100) { return 80; }
  if (number < 200) { return 100; }
  return 120;
};

module.exports = {
  desc: "Information of a Pokémon",
  longDesc: "Gives the number, species name, typing, potential abilities, and stat spread of a Pokémon. If applicable, gives the base species and/or other formes of a Pokémon. If applicable, gives the required items and/or abilities that a Pokémon must have or cannot have. If applicable, mentions the availability of the Pokémon.",
  usage: "<Pokémon name>",
  aliases: ['pokemon', 'mon'],
  options: [{
    name: "verbose",
    value: false,
    desc: "Gives additional information such as BST, generation, weight, height, and tier."
  }],
  upgrade: '`//pokedex <pokemon name>` - `/dt name:<pokemon name>`',
  process: async function(msg, flags, dex) {
    if (msg.length === 0){
      return null;
    }
    let sendMsg = [];

    let pokemon = dex.species.get(msg[0]);
    if (!pokemon || !pokemon.exists) {
      pokemon = dex.dataSearch(msg[0], ['Pokedex']);
      if (!pokemon) {
        return `No Pokémon ${msg[0]} found.`;
      }
      sendMsg.push(`No Pokémon ${msg[0]} found. Did you mean ${pokemon[0].name}?`);
      pokemon = dex.species.get(pokemon[0].name);
    }
    if (pokemon.gen > dex.gen) {
      return `${pokemon.name} did not exist in gen${dex.gen}; it was introduced in gen${pokemon.gen}.`;
    }

    // Must check ability compatibility
    let abilitiesStr = 'Ability: <none>';
    if (dex.gen >= 3) {
      abilitiesStr = [pokemon.abilities['0']];
      if (pokemon.abilities['1'] && dex.abilities.get(pokemon.abilities['1']).gen <= dex.gen) {
        abilitiesStr.push(pokemon.abilities['1']);
      }
      if (pokemon.abilities['H']) {
        abilitiesStr.push(pokemon.abilities['H'] + " (Hidden)");
      }
      (abilitiesStr.length === 1) ? abilitiesStr = 'Ability: ' + abilitiesStr[0] : abilitiesStr = `Abilities: ${abilitiesStr.join(", ")}`;
    }

    let bstStr = (flags.verbose ? ` [BST: ${(pokemon.baseStats.hp + pokemon.baseStats.atk + pokemon.baseStats.spa + pokemon.baseStats.spe + pokemon.baseStats.def + pokemon.baseStats.spd)}]` : '');

    sendMsg = sendMsg.concat([
      `No. ${pokemon.num}: ${pokemon.name} [${pokemon.types.join('/')}]`,
      `${abilitiesStr}`,
      `HP/ATK/DEF/SPA/SPD/SPE: ${pokemon.baseStats.hp}/${pokemon.baseStats.atk}/${pokemon.baseStats.def}/${pokemon.baseStats.spa}/${pokemon.baseStats.spd}/${pokemon.baseStats.spe}${bstStr}`
    ]);

    if (flags.verbose) {
      sendMsg.push(`Introduced in gen${pokemon.gen}`);
    }

    if (flags.verbose) {
      sendMsg.push(`Weight: ${pokemon.weightkg}kg (${lowKickCalcs(pokemon.weightkg)} BP); Height: ${pokemon.heightm}m; BMI: ${Math.round((100*pokemon.weightkg)/(pokemon.heightm*pokemon.heightm))/100}`);
    }

    if (pokemon.baseSpecies !== pokemon.name){
      sendMsg.push(`Base species: ${pokemon.baseSpecies}`);
    }

    if (pokemon.otherFormes){
      let otherFormHelper = [];
      for (let i = 0; i < pokemon.otherFormes.length; i++){
        let otherForme = dex.species.get(pokemon.otherFormes[i]);
        if (otherForme.gen <= dex.gen) {
          otherFormHelper.push(otherForme.name);
        }
      }
      if (otherFormHelper.length > 0) {
        sendMsg.push(`Other formes: ${otherFormHelper.join(",")}`);
      }
    }

    if (flags.verbose) {
      if (pokemon.prevo) {
        sendMsg.push(`Prevo: ${dex.species.get(pokemon.prevo)}`);
      }
      if (pokemon.nfe) {
        let formatEvos = [];
        for (let i = 0; i < pokemon.evos.length; i++){
          let evo = dex.species.get(pokemon.evos[i]);
          if (evo.gen <= dex.gen) {
            formatEvos.push(evo.name);
          }
        }
        sendMsg.push(`Evo: ${formatEvos.join(", ")}`);
      }

      sendMsg.push(`Egg groups: ${pokemon.eggGroups.join(", ")}`);

      let genders = ['M', 'F'];
      let genderStr = [];
      for (let i = 0; i < genders.length; i++) {
        if (pokemon.genderRatio[genders[i]]) {
          genderStr.push(`${genders[i]}: ${pokemon.genderRatio[genders[i]] * 100}%`);
        }
      }
      if (genderStr.length === 0) {
        genderStr = ['N: 100%'];
      }
      sendMsg.push(`Gender ratio: ${genderStr.join(", ")}`);

      if (pokemon.color) {
        sendMsg.push(`Color: ${pokemon.color}`);
      }
      if (pokemon.requiredItems) {
        sendMsg.push(`This Pokémon must hold ${pokemon.requiredItems.join(" or ")} as an item.`);
      }
      if (pokemon.requiredAbility) {
        sendMsg.push(`This Pokémon must have the ability ${pokemon.requiredAbility}.`);
      }
      if (pokemon.unreleasedHidden) {
        sendMsg.push(`This Pokémon's hidden ability is unreleased.`);
      }
      if (pokemon.eventOnly) {
        sendMsg.push(`This Pokémon is only available through events.`);
      }
      if (pokemon.battleOnly) {
        sendMsg.push(`This Pokémon is only available through battle.`);
      }
    }
    return sendMsg;

  }
};
