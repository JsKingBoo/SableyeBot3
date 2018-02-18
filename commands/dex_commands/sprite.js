'use strict';

const path = require('path');

const minidex = require(path.resolve(__dirname, '../../data/pokedex-mini.js'))['BattlePokemonSprites'];
const minidexbw = require(path.resolve(__dirname, '../../data/pokedex-mini-bw.js'))['BattlePokemonSpritesBW'];

const SPRITE_URL = 'http://play.pokemonshowdown.com/sprites/';

module.exports = {
  desc: "Image link of a Pokémon, or link to sprite directory if no argument is given. Uses PokemonShowdown's sprite library.",
  usage: "[Pokémon name]",
  aliases: ['gif'],
  options: [{
    name: "shiny",
    value: false,
    desc: "Enables shiny variant."
  },
  {
    name: "back",
    value: false,
    desc: "Enables back variant."
  },
  {
    name: "female",
    value: false,
    desc: "Enables female variant, if available."
  },
  {
    name: "noani",
    value: false,
    desc: "Prefer the non-animated variant, if available."
  },
  {
    name: "afd",
    value: false,
    desc: "Enables April Fool's Day sprites."
  }],
  hasCustomFormatting: true,
  process: (msg, flags, dex) => {
    if (msg.length === 0){
      return "```PokemonShowdown's sprite directory:``` http://play.pokemonshowdown.com/sprites/";
    }
		
    let pokemon = dex.getTemplate(msg[0]);
    if (!pokemon || !pokemon.exists) {
      pokemon = dex.dataSearch(msg[0], ['Pokedex']);
      if (!pokemon) {
        return '```' + `No Pokémon ${msg[0]} found.` + '```';
      }
      pokemon = dex.getTemplate(pokemon[0].name);
    }
    
    if (pokemon.gen > dex.gen) {
      return '```' + `${pokemon.species} did not exist in gen${dex.gen}; it was introduced in gen${pokemon.gen}.` + '```';
    }
    
    let spriteId = pokemon.spriteid;
    let genNum = dex.gen;
    if (flags.noani && genNum >= 6) { 
      genNum = 5;
    }
    if (pokemon.tier === 'CAP') {
      genNum = 5;
    }
    if (pokemon.num === 0) {
      genNum = 1;
    }
    
    let genData = {1:'rby', 2:'gsc', 3:'rse', 4:'dpp', 5:'bw', 6:'xy', 7:'xy'}[genNum];
    let ending = '.png';
    if (!flags.noani && genNum >= 5 && pokemon.num > 0) {
      genData += 'ani';
      ending = '.gif';
    }
    
    let dir = '';
    let facing = 'front';
    let dexData = minidex[pokemon.speciesid];
    if (genNum === 5) {
      dexData = minidexbw[pokemon.speciesid];
    }
    
    if (flags.back) {
      dir += '-back';
      facing = 'back';
    }
    if (flags.shiny && genNum > 1) {
      dir += '-shiny';
    }
    if (flags.afd) {
      dir = 'afd' + dir;
      return `${SPRITE_URL}${dir}/${spriteId}.png`;
    }
		
    dir = genData + dir;
    
    if (flags.female && genNum >= 4) {
      if (dexData[facing + 'f']){
        spriteId += '-f';
      }
    }
    
    return `${SPRITE_URL}${dir}/${spriteId}${ending}`;

  }
};

