'use strict';

let pokedexjs = require('./pokedex.js');
let movejs = require('./move.js');
let itemjs = require('./item.js');
let abilityjs = require('./ability.js');
let naturejs = require('./nature.js');

let dbLink = {
  'pokemon': pokedexjs,
  'move': movejs,
  'item': itemjs,
  'ability': abilityjs,
  'nature': naturejs
};

let stats = ['atk', 'def', 'spa', 'spd', 'spe'];

module.exports = {
  desc: "Information of a Pokémon, ability, move, item, or nature",
  usage: "<effect name>",
  aliases: ['dt', 'info', 'dex'],
  options: [{
    name: "verbose",
    value: false,
    desc: "Gives additional information, if applicable."
  }],
  process: async function(msg, flags, dex) {
    if (msg.length === 0){
      return null;
    }
    
    if (msg.length >= 2) {
      if (stats.includes(msg[0]) && stats.includes(msg[1])) {
        return naturejs.process(msg, flags, dex);
      }
    }
    
    let search = dex.dataSearch(msg[0]);
    if (!search) {
      return `Cannot recognize ${msg.join(",")}.`;
    }
    
    return dbLink[search[0].searchType].process(msg, flags, dex);
    
  }
};
