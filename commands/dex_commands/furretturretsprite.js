'use strict';

const path = require('path');
const fs = require('fs');
const dex = require(path.resolve(__dirname, '../../utils/dex.js'));

const minidex = require(path.resolve(__dirname, '../../data/pokedex-mini.js'))['BattlePokemonSprites'];

const hdSpritePath = path.resolve(__dirname, '../../sprites/')

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
  process: (msg, flags) => {
    if (msg.length === 0){
      return null;
    }
		
    let pokemon = dex.getTemplate(msg[0]);
    if (!pokemon || !pokemon.exists) {
      pokemon = dex.dataSearch(msg[0], ['Pokedex']);
      if (!pokemon) {
        return '```' + `No Pokémon ${msg[0]} found.` + '```';
      }
      pokemon = dex.getTemplate(pokemon[0].name);
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
    if (fs.existsSync(dir)) {
      return ({'msg': '```Sprites by https://www.furretturret.com/resources```', 'files': [dir]});
    } else {
      return `${dir} does not exist`;
    }
  }
};

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}