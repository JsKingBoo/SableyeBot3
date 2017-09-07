'use strict';

module.exports = {
  desc: "Link to PokemonShowdown's damage calculator.",
  usage: "",
  aliases: ['calc', 'damagecalc'],
  options: [],
  hasCustomFormatting: true,
  process: (msg, flags, dex) => {
    return "```Pokemon damage calculator:``` https://pokemonshowdown.com/damagecalc/";
  }
};






