'use strict';

const path = require('path');
const capitalize = require(path.resolve(__dirname, '../../utils/capitalize.js'));

let flyingPressEffectiveness =  {
  bug: 0,
  dark: 1,
  dragon: 0,
  electric: 2,
  fairy: 2,
  fighting: 1,
  fire: 0,
  flying: 2,
  ghost: 3,
  grass: 1,
  ground: 0,
  ice: 1,
  normal: 1,
  poison: 2,
  psychic: 2,
  rock: 0,
  steel: 0,
  water: 0
};

module.exports = {
  desc: "Provides coverage versus single types.",
  longDesc: "Provides a Pokemon's or a moveset's coverage versus a single type.",
  usage: "<Pokemon name>|(<type 1>, [type 2], [type 3], [type 4])",
  aliases: ['cover'],
  options: [{
    name: "inverse",
    value: false,
    desc: "Invert the type chart."
  }],
  upgrade: [
    '`//coverage <Pokemon name>` - `/coverage pokemon:<Pokemon name>`',
    '`//coverage <type>[, <type>...]` - `/coverage types:<type>[, <type>]`',
    '`//coverage <Pokemon name>, <type>[, <type>...]` - `/coverage pokemon:<Pokemon name> types:<type>[, <type>]	`',
  ].join('\n'),
  process: async function(msg, flags, dex) {
    if (msg.length === 0){
      return null;
    }

    let types = Object.keys(dex.data.TypeChart);
    let attackTyping = [];

    let pokemon = dex.species.get(msg[0]);
    if (!pokemon || !pokemon.exists || pokemon.gen > dex.gen) {
      pokemon = {name: '-'};
      for (let i = 0; i < Math.min(msg.length, 4); i++) {
        let capitalCaseType = capitalize(msg[i]);
        if (dex.data.TypeChart[msg[i]]) {
          attackTyping.push(capitalCaseType);
        }
        if (capitalCaseType === 'Flyingpress' && dex.gen >= 7) {
          attackTyping.push("Flying Press");
        }
        if (capitalCaseType === 'Freezedry' && dex.gen >= 7) {
          attackTyping.push("Freeze-Dry");
        }
      }
    } else {
      attackTyping = pokemon.types;
    }
    if (attackTyping.length === 0) {
      return null;
    }

    let sendMsg = [
      `${pokemon.name} [${attackTyping.join('/')}]`,
      "x0.00: ",
      "x0.50: ",
      "x1.00: ",
      "x2.00: ",
    ];

    let effective = {};

    //x1, x2, x1/2, x0
    let typeChartToModifierMap;
    if (flags.inverse) {
      typeChartToModifierMap = [2, 1, 3, 3];
    } else {
      typeChartToModifierMap = [2, 3, 1, 0];
    }

    for (let i = 0; i < types.length; i++){
      effective[types[i]] = 0;

      for (let j = 0; j < attackTyping.length; j++) {
        let effectivenessIndex = 0;
        if (attackTyping[j] === "Flying Press") {
          effectivenessIndex = flyingPressEffectiveness[types[i]];
        } else if (attackTyping[j] === "Freeze-Dry") {
          if (types[i] === 'water') {
            //Freeze-Dry is ALWAYS super effective against water even in inverse battles
            effectivenessIndex = (flags.inverse ? 2 : 1);
          } else {
            effectivenessIndex = dex.data.TypeChart[types[i]].damageTaken['Water'];
          }
        } else {
          effectivenessIndex = dex.data.TypeChart[types[i]].damageTaken[attackTyping[j]];
        }

        effective[types[i]] = Math.max(effective[types[i]], typeChartToModifierMap[effectivenessIndex]);
      }

      sendMsg[effective[types[i]] + 1] += `${capitalize(types[i])}; `;
    }
    return sendMsg;
  }
};






