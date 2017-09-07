'use strict';

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
  process: (msg, flags, dex) => {
    if (msg.length === 0){
      return null;
    }
    
    let types = Object.keys(dex.data.TypeChart);
    let targetTyping = [];
    
    let pokemon = dex.getTemplate(msg[0]);
    if (!pokemon || !pokemon.exists || pokemon.gen > dex.gen) {
      pokemon = {name: '-'};
      for (let i = 0; i < Math.min(msg.length, 2); i++) {
        let capitalCaseType = `${msg[i].charAt(0).toUpperCase()}${msg[i].slice(1)}`;
        if (dex.data.TypeChart[capitalCaseType]) {
          targetTyping.push(capitalCaseType);
        }
      }
    } else {
      targetTyping = pokemon.types;
    }
    if (targetTyping.length === 0) {
      return null;
    }
    
    let sendMsg = [
      `${pokemon.name} [${targetTyping.join('/')}]`,
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
        effective[types[i]] += typeChartToModifierMap[dex.data.TypeChart[targetTyping[j]].damageTaken[types[i]]];
      }
      
      if (effective[types[i]] < -3) {
        effective[types[i]] = -3;
      }
      sendMsg[effective[types[i]] + 4] += `${types[i]}; `;
    }
    
    return sendMsg;
    
  }
};






