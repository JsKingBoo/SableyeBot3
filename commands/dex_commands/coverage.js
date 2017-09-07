'use strict';

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
  process: (msg, flags, dex) => {
    if (msg.length === 0){
      return null;
    }
		
    let types = Object.keys(dex.data.TypeChart);
    let attackTyping = [];
    
    let pokemon = dex.getTemplate(msg[0]);
    if (!pokemon || !pokemon.exists || pokemon.gen > dex.gen) {
      pokemon = {name: '-'};
      for (let i = 0; i < Math.min(msg.length, 4); i++) {
        let capitalCaseType = `${msg[i].charAt(0).toUpperCase()}${msg[i].slice(1)}`;
        if (dex.data.TypeChart[capitalCaseType]) {
          attackTyping.push(capitalCaseType);
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
      'x0.00: ',
      'x0.50: ',
      'x1.00: ',
      'x2.00: ',
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
        effective[types[i]] = Math.max(effective[types[i]], typeChartToModifierMap[dex.data.TypeChart[types[i]].damageTaken[attackTyping[j]]]);
      }
      
      sendMsg[effective[types[i]] + 1] += `${types[i]}; `;
    }
    return sendMsg;
  }
};






