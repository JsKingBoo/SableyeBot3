'use strict';

const path = require('path');
const Learnset = require(path.resolve(__dirname, '../../utils/Learnset.js'));

let sourceNames = {
  E:"egg", 
  D:"dream world",
  S:"event", 
  L:"level up", 
  M:"TM/HM", 
  T:"tutor", 
  X:"egg, traded back", 
  Y:"event, traded back", 
  V:"VC transfer from Gen 1/2"
};

module.exports = {
  desc: "Learnset of a Pokémon, how a Pokémon learns a move, or Pokémon than can learn a move.",
  longDesc: "If both Pokémon and move are supplied, gives information on how the Pokémon learns the move. If only Pokémon is supplied, gives the learnset of that Pokémon. If only move is supplied, gives a list of Pokémon than can learn the move.",
  usage: "(<Pokémon name>, [move name])|<move name>",
  aliases: ['learnset'],
  options: [{
    name: "verbose",
    value: false,
    desc: "Lists learnset information of more generations."
  },
  {
    name: "cap",
    value: false,
    desc: "Includes non-canon Pokémon."
  }],
  process: (msg, flags, dex) => {
    if (msg.length === 0){
      return null;
    }
    let sendMsg = [];
    
    let pokemon = dex.getTemplate(msg[0]);
    let move = null;
    if (!pokemon || !pokemon.exists) {
      pokemon = dex.dataSearch(msg[0], ['Pokedex', 'Movedex']);
      if (!pokemon || pokemon[0].searchType === 'move') {
        pokemon = null;
        if (msg.length === 1) {
          msg.push(msg[0]);
        } else {
          msg[1] = msg[0];
        }
      } else {
        sendMsg.push(`No Pokémon ${msg[0]} found. Did you mean ${pokemon[0].name}?`);
        pokemon = dex.getTemplate(pokemon[0].name);
      }
    }
    if (pokemon && pokemon.gen > dex.gen && !flags.verbose) {
      return `${pokemon.species} did not exist in gen${dex.gen}; it was introduced in gen${pokemon.gen}.`;
    }
    
    if (msg.length > 1) {
      move = dex.getMove(msg[1]);
      if (!move || !move.exists) {
        move = dex.dataSearch(msg[1], ['Movedex']);
        if (!move) {
          move = null;
        } else {
          sendMsg.push(`No move ${msg[1]} found. Did you mean ${move[0].name}?`);
          move = dex.getMove(move[0].name);
        }
      }
      if (move && move.gen > dex.gen && !flags.verbose) {
        return `${move.name} did not exist in gen${dex.gen}; it was introduced in gen${move.gen}.`;
      }
    }
    
    if (!pokemon && !move) {
      return `No Pokémon nor move recognized.`;
    }
    
    let learnset = (pokemon ? new Learnset(pokemon, dex) : null);
        
    if (pokemon && !move) {
      let moveNames = {};
      let sketch = false;
      for (let i = 0; i < learnset.learnset.length; i++){
        let moveEntry = learnset.learnset[i];
        if (moveEntry.gen > dex.gen) {
          continue;
        }
        if (moveEntry.name === 'sketch') {
          sketch = true;
        }
        moveNames[dex.getMove(moveEntry.name).name] = 1;
      }
      
      let listMoves = Object.keys(moveNames).sort();
      if (!listMoves) {
        //?
        return `${pokemon.name} cannot learn any moves.`;
      }
      sendMsg.push(`${pokemon.name}'s learnset:`);
      sendMsg.push(listMoves.join(", "));
      if (sketch) {
        sendMsg.push('Note: This Pokémon can learn Sketch and any Sketch-able moves.');
      }
    } else if (!pokemon && move) {
      let allMons = Object.keys(dex.data.Pokedex);
      let validMons = [];
      for (let i = 0; i < allMons.length; i++){
        if (!flags.cap && dex.data.Pokedex[allMons[i]].num <= 0) {
          continue;
        }
        let monset = new Learnset(dex.getTemplate(allMons[i]), dex);
        if (monset.canHaveMove(move.id, dex.gen)) {
          validMons.push(dex.data.Pokedex[allMons[i]].species);
        }
      }
      sendMsg.push(`Pokémon that can learn ${move.name}:`);
      sendMsg.push(validMons.join(", "));
    } else if (pokemon && move) {   
      let search = learnset.findMove(move.id, (!flags.verbose ? dex.gen : null));
      if (search.length === 0 && !flags.verbose) {
        search = learnset.findMove(move.id, null);
        if (search.length === 0) {
          return `${pokemon.name} cannot obtain ${move.name} in gen${dex.gen}`;
        } else {
          return `${pokemon.name} can obtain ${move.name} in another generation.`;
        }
      }
      let parseResults = {};
      for (let i = 0; i < search.length; i++){
        let learnsetMove = search[i];
        if (!parseResults[learnsetMove.gen]) {
          parseResults[learnsetMove.gen] = {};
        }
        if (!parseResults[learnsetMove.gen][learnsetMove.source]) {
          parseResults[learnsetMove.gen][learnsetMove.source] = {};
        }
        if (!parseResults[learnsetMove.gen][learnsetMove.source][learnsetMove.method]) {
          parseResults[learnsetMove.gen][learnsetMove.source][learnsetMove.method] = [];
        }
        parseResults[learnsetMove.gen][learnsetMove.source][learnsetMove.method].push(learnsetMove.level);
      }
      sendMsg.push(`${pokemon.name} can learn ${move.name} in:`);
      let resultGens = Object.keys(parseResults);
      for (let i = 0; i < resultGens.length; i++) {
        sendMsg.push(`Gen${resultGens[i]}:`);
        let resultSources = Object.keys(parseResults[resultGens[i]]);
        for (let j = 0; j < resultSources.length; j++) {
          let sourceLine = `  ${resultSources[j]}: `;
          let resultMethod = Object.keys(parseResults[resultGens[i]][resultSources[j]]);
          for (let k = 0; k < resultMethod.length; k++) {
            sourceLine += sourceNames[resultMethod[k]];
            if (resultMethod[k] === 'S' || resultMethod[k] === 'L') {
              sourceLine += ` (${parseResults[resultGens[i]][resultSources[j]][resultMethod[k]].join(",")})`;
            }
            sourceLine += '; ';
          }
          sendMsg.push(sourceLine);
        }
      }
      
    }
    
    return sendMsg;
    
  }
};






