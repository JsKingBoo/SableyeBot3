'use strict';

module.exports = {
  desc: "Information of an ability",
  longDesc: [
    "Gives information on the effects of an ability and rates it. The rating scale goes from -2 to 5 and is based on its usefulness in a singles battle.", 
    "-2: Extremely detrimental",
    "The sort of ability that relegates Pokemon with Uber-level BSTs into NU. ex. Slow Start, Truant",
    "-1: Detrimental",
    "An ability that does more harm than good. ex. Defeatist, Normalize",
    "0: Useless",
    "An ability with no net effect during a singles battle. ex. Healer, Illuminate",
    "1: Ineffective",
    "An ability that has a minimal effect. Should not be chosen over any other ability. ex. Damp, Shell Armor",
    "2: Situationally useful",
    "An ability that can be useful in certain situations. ex. Blaze, Insomnia",
    "3: Useful",
    "An ability that is generally useful. ex. Infiltrator, Sturdy",
    "4: Very useful",
    "One of the most popular abilities. The difference between 3 and 4 can be ambiguous. ex. Protean, Regenerator",
    "5: Essential",
    "The sort of ability that defines metagames. ex. Desolate Land, Shadow Tag"
  ],
  usage: "<ability name>",
  aliases: ['abilities', 'abil'],
  process: async function(msg, flags, dex) {
    if (msg.length === 0) {
      return null;
    }
		
    if (dex.gen === 1 || dex.gen === 2) {
      return 'Abilities did not exist until gen3.';
    }
    
    let sendMsg = [];
    
    let ability = dex.getAbility(msg[0]);
    if (!ability || !ability.exists) {
      ability = dex.dataSearch(msg[0], ['Abilities']);
      if (!ability) {
        return `No ability ${msg[0]} found.`;
      }
      sendMsg.push(`No ability ${msg[0]} found. Did you mean ${ability[0].name}?`);
      ability = dex.getAbility(ability[0].name);
    }
    if (ability.gen > dex.gen) {
      return `${ability.name} did not exist in gen${dex.gen}; it was introduced in gen${ability.gen}.`;
    }
		
    sendMsg = sendMsg.concat([
      `${ability.name}`,
      `${(ability.desc || ability.shortDesc)}`,
      `> Rating: ${ability.rating}`
    ]);

    return sendMsg;
		
  }
};
