'use strict';

const path = require('path');
const capitalize = require(path.resolve(__dirname, '../../utils/capitalize.js'));

module.exports = {
  desc: "Provides a Pokemon's resistances, weaknesses, and immunities, ignoring abilities.",
  longDesc: "Provides a Pokemon's or a type combination's resistances, weaknesses, and immunities, ignoring abilities. Limited to two types maximum and one type minimum.",
  usage: "<Pokemon name>|(<type 1>, [type 2])",
  aliases: ['weak'],
  options: [{
    name: "inverse",
    value: false,
    desc: "Invert the type chart."
  }],
  process: async function(msg, flags, dex) {
    if (msg.length === 0){
      return null;
    }

    let types = Object.keys(dex.data.TypeChart);
    let targetName = '-';
    let targetTyping = [];
    let warnings = [];
    
    let capitalArg = `${msg[0].charAt(0).toUpperCase()}${msg[0].slice(1).toLowerCase()}`;
    if (dex.data.TypeChart[msg[0].toLowerCase()]) {
      // We are dealing with the `<type> <type>` form.
      targetTyping.push(capitalArg);
      if(msg.length > 1) {
        capitalArg = `${msg[1].charAt(0).toUpperCase()}${msg[1].slice(1).toLowerCase()}`;
        if (dex.data.TypeChart[msg[1]]) {
          targetTyping.push(capitalArg);
        }
      }
    } else {
      // We are dealing with the `<pokemon>` form
      let pokemon = dex.species.get(msg[0]);
      if (!pokemon || !pokemon.exists) {
        pokemon = dex.dataSearch(msg[0], ['Pokedex']);
        console.log(pokemon);
        if (!pokemon) {
          return `No Pokémon ${msg[0]} found.`;
        }
        warnings.push(`No Pokémon ${msg[0]} found. Did you mean ${pokemon[0].name}?`);
        pokemon = dex.species.get(pokemon[0].name);
      }
      console.log(pokemon.name, pokemon.types);
      targetName = pokemon.name;
      targetTyping = pokemon.types;
    }

    if (targetTyping.length === 0) {
      return null;
    }

    let info = [
      `${targetName} [${targetTyping.join('/')}]`,
      'x0.00: ',
      'x0.25: ',
      'x0.50: ',
      'x1.00: ',
      'x2.00: ',
      'x4.00: '
    ];

    let effective = {};

    //x1, x2, x1/2, x0
    let typeChartToModifierMap;
    if (flags.inverse) {
      typeChartToModifierMap = [0, -1, 1, 1];
    } else {
      typeChartToModifierMap = [0, 1, -1, -9];
    }

    for (let i = 0; i < types.length; i++) {
      effective[types[i]] = 0;

      for (let j = 0; j < targetTyping.length; j++) {
        let targetKey = targetTyping[j].toLowerCase();
        let attackKey = capitalize(types[i]);
        let typeChartValue = dex.data.TypeChart[targetKey].damageTaken[attackKey];
        effective[types[i]] += typeChartToModifierMap[typeChartValue];
      }
      effective[types[i]] = Math.max(-3, effective[types[i]]);
      info[effective[types[i]] + 4] += `${capitalize(types[i])}; `;
    }

    return [...warnings, ...info];

  }
};






