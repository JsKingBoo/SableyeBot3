'use strict';

const path = require('path');
const fs = require('fs');

const hdSpritePath = path.resolve(__dirname, '../../sprites/');

module.exports = {
  desc: "Image link of a Pokémon, or link to sprite directory if no argument is given. Uses FurretTurret's HD sprite library.",
  usage: "[Pokémon name]",
  elevated: true,
  aliases: ['ftsprite', 'hdsprite', 'hqsprite'],
  options: [{
    name: "shiny",
    value: false,
    desc: "Enables shiny variant."
  },
    {
      name: "female",
      value: false,
      desc: "Enables female variant, if available."
    }],
  hasCustomFormatting: true,
  process: async function(msg, flags, dex) {
    if (msg.length === 0){
      return null;
    }

    let pokemon = dex.species.get(msg[0]);
    if (!pokemon || !pokemon.exists) {
      pokemon = dex.dataSearch(msg[0], ['Pokedex']);
      if (!pokemon) {
        return '```' + `No Pokémon ${msg[0]} found.` + '```';
      }
      pokemon = dex.species.get(pokemon[0].name);
    }
    if (pokemon.tier === 'CAP') {
      return '```CAP Pokémon not available```';
    }

    let spriteId = capitalize(pokemon.spriteid.replace('-', '_'));
    let ending = '.gif';

    let dir = '';
    let dexData = minidex[pokemon.speciesid];

    if (flags.shiny) {
      dir = 'shiny';
    } else {
      dir = 'regular';
    }

    if (flags.female) {
      if (dexData['frontf']){
        spriteId += '_Female';
      }
    }

    dir = `${hdSpritePath}/${dir}/${spriteId}${ending}`;
    let credits = "```HD Pokémon sprites by FurretTurret.com:```";
    if (flags.shiny) {
      credits += "https://www.furretturret.com/resources/hd/shiny";
    } else {
      credits += "https://www.furretturret.com/resources/hd/regular";
    }
    if (fs.existsSync(dir)) {
      let fileSize = fs.statSync(dir).size / 1000000.0;
      if (fileSize > 7.5) {
        return "```" + `ERROR: Filesize too large! (${fileSize} MB)` + "```";
      }
      return ({'msg': credits, 'files': [dir]});
    } else {
      return "```" + `${spriteId}${ending} not found` + "```";
    }
  }
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
