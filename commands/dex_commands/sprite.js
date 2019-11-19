'use strict';

const path = require('path');
const https = require('https');

const SPRITE_URL = 'https://play.pokemonshowdown.com/sprites/';

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
  process: async function(msg, flags, dex) {
    if (msg.length === 0){
      return "```PokemonShowdown's sprite directory:``` https://play.pokemonshowdown.com/sprites/";
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
    if (pokemon.tier === 'CAP') {
      genNum = 5;
    }
    if (pokemon.num === 0) {
      genNum = 1;
    }

    let genData = {1:'gen1', 2:'gen2', 3:'gen3', 4:'gen4', 5:'gen5', 6:'', 7:'', 8:''}[genNum];
    let ending = '.png';
    if (!flags.noani && genNum >= 5 && pokemon.num > 0) {
      genData += 'ani';
      ending = '.gif';
    }
    if (flags.noani && genNum >= 7 && !flags.back) {
      genData = "dex";
    }      

    let dir = '';
    let facing = 'front';

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
    if (dir === "") {
      dir = "gen6";
    }

    if (flags.female && genNum >= 4) {
      let checker = new Promise((resolve, reject) => {
        let req = https.request({'host': 'play.pokemonshowdown.com',
            'method': 'HEAD',
            'path': `${SPRITE_URL}${dir}/${spriteId}-f${ending}`
        });

        req.on('response', res => {
          resolve(res);
        });

        req.on('error', err => {
          reject(err);
        });

        req.end();
      });

      let result = await checker;
      if (result.statusCode === 200) {
        spriteId += '-f';
      }
    }

    return `${SPRITE_URL}${dir}/${spriteId}${ending}`;

  }
};

