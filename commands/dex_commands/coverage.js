'use strict';

let flyingPressEffectiveness =  {
  Bug: 0,
  Dark: 1,
  Dragon: 0,
  Electric: 2,
  Fairy: 2,
  Fighting: 1,
  Fire: 0,
  Flying: 2,
  Ghost: 3,
  Grass: 1,
  Ground: 0,
  Ice: 1,
  Normal: 1,
  Poison: 2,
  Psychic: 2,
  Rock: 0,
  Steel: 0,
  Water: 0
};

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
        if (capitalCaseType === 'Flyingpress' && dex.gen >= 7) {
          attackTyping.push("Flying Press");
        }
        if (capitalCaseType === 'Freezedry' && dex.gen >= 7) {
          attackTyping.push("Freeze-Dry");
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
      "x0.00: ",
      "x0.50: ",
      "x1.00: ",
      "x2.00: ",
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
        let effectivenessIndex = 0;
        if (attackTyping[j] === "Flying Press") {
          effectivenessIndex = flyingPressEffectiveness[types[i]];
        } else if (attackTyping[j] === "Freeze-Dry") {
          if (types[i] === 'Water') {
            //Freeze-Dry is ALWAYS super effective against water even in inverse battles
            effectivenessIndex = (flags.inverse ? 2 : 1); 
          } else {
            effectivenessIndex = dex.data.TypeChart[types[i]].damageTaken['Water'];
          }
        } else {
          effectivenessIndex = dex.data.TypeChart[types[i]].damageTaken[attackTyping[j]];
        }
        
        effective[types[i]] = Math.max(effective[types[i]], typeChartToModifierMap[effectivenessIndex]);
      }
      
      sendMsg[effective[types[i]] + 1] += `${types[i]}; `;
    }
    return sendMsg;
  }
};






