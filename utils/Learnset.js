'use strict';

var learnsetCache = {};

class Learnset {

  constructor (pokemon, dex) {
    if (typeof pokemon === 'string') {
      pokemon = dex.getSpecies(pokemon);
    }
    
    pokemon.learnset = dex.getLearnsetData(pokemon.id)['learnset'];
    this.pokemon = pokemon.id;
    this.learnset = [];
    this.gen = dex.gen;
    
    if (learnsetCache[this.gen] && learnsetCache[this.gen][this.pokemon]) {
      this.learnset = learnsetCache[this.gen][this.pokemon];
      return;
    }
    
    let alreadyChecked = {};
    let srcMon = 'direct';
    
    do {
      alreadyChecked[pokemon.id] = true;
      
      //Does not have its own learnset (e.g. Mega form); take from base
      if (!pokemon.learnset) {
        if (pokemon.baseSpecies !== pokemon.name) {
          pokemon = dex.getSpecies(pokemon.baseSpecies);
          srcMon = 'base species';
          continue;
        }
        break;
      }
      
      let moves = Object.keys(pokemon.learnset);
      for (let i = 0; i < moves.length; i++){
        let move = moves[i];
        for (let j = 0; j < pokemon.learnset[move].length; j++){
          let moveEntry = pokemon.learnset[move][j];
          let gen = moveEntry.charAt(0);
          let method = moveEntry.charAt(1);
          let lvl = -1;
          if (method === 'S' || method === 'L') {
            lvl = moveEntry.slice(2);
          }
            
          let moveObj = {
            'name': move, 
            'gen': parseInt(gen), 
            'method': method,
            'source': srcMon,
            'level': lvl
          };

          this.learnset.push(moveObj);
        }
      }
      
      if (pokemon.name === 'Lycanroc-Dusk') {
        pokemon = dex.getSpecies('Rockruff-Dusk');
      } else if (pokemon.prevo) {
        pokemon = dex.getSpecies(pokemon.prevo);
        pokemon.learnset = dex.getLearnsetData(pokemon.id)['learnset'];
        srcMon = 'prevo';
        if (pokemon.gen > this.gen) {
          pokemon = null;
        }
      } else if (pokemon.baseSpecies && pokemon.baseSpecies === 'Rotom') {
        pokemon = dex.getSpecies(pokemon.baseSpecies);
        pokemon.learnset = dex.getLearnsetData(pokemon.id)['learnset'];
        srcMon = 'base species';
      } else {
        pokemon = null;
      }
    } while (pokemon && pokemon.id && !alreadyChecked[pokemon.id]);
    
    if (!learnsetCache[this.gen]) {
      learnsetCache[this.gen] = {};
    }
    learnsetCache[this.gen][this.pokemon] = this.learnset;
  }
  
  findMove(moveid, gen = null) {
    let moves = [];
    for (let i = 0; i < this.learnset.length; i++){
      if (this.learnset[i].name === moveid) {
        if (!gen || this.learnset[i].gen === gen) {
          moves.push(this.learnset[i]);
        }
      }
    }
    return moves;
  }
  
  canHaveMove(moveid, gen = null, transfer = true) {
    for (let i = 0; i < this.learnset.length; i++){
      if (this.learnset[i].name !== moveid) {
        continue;
      }
      if (gen && this.learnset[i].gen > gen) {
        continue;
      }
      if (!transfer) {
        if (gen && this.learnset[i].gen != gen) {
          continue;
        }
        if (!gen && this.learnset[i].gen != this.gen) {
          continue;
        }
      }
      return true;
    }
    return false;
  }
  
  movesArray(transfer = true) {
    let arr = [];
    for (let i = 0; i < this.learnset.length; i++){
      if (transfer || this.learnset[i].gen === this.gen) {
        arr.push(this.learnset[i].name);
      }
    }
    return arr;
  }
  
}

module.exports = Learnset;
