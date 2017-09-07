'use strict';

let stats = ["HP", "ATK", "DEF", "SPA", "SPD", "SPE"];

module.exports = {
  desc: "IV settings for a certain type, or the Hidden Power type given certain IVs.",
  usage: "<type>|(<hp IV>,<atk IV>,<def IV>,<spa IV>,<spd IV>,<spe IV>)",
  aliases: ['hp'],
  options: [],
  process: (msg, flags, dex) => {
    if (dex.gen === 1) {
      return 'Hidden Power did not exist in gen1';
    }
    if (msg.length !== 1 && msg.length < 6) {
      return null;
    }
      
    if (msg.length === 1) {
      if (dex.gen === 2) {
        return "Sorry, I do not have gen<=2 hidden power DV spreads";
      }
      let sendMsg = [];
      let hpIVs = [];
      switch (msg[0]) {
      case 'dark':
        hpIVs = ['111111']; break;
      case 'dragon':
        hpIVs = ['011111', '101111', '110111']; break;
      case 'ice':
        hpIVs = ['010111', '100111', '111110']; break;
      case 'psychic':
        hpIVs = ['011110', '101110', '110110']; break;
      case 'electric':
        hpIVs = ['010110', '100110', '111011']; break;
      case 'grass':
        hpIVs = ['011011', '101011', '110011']; break;
      case 'water':
        hpIVs = ['100011', '111010']; break;
      case 'fire':
        hpIVs = ['101010', '110010']; break;
      case 'steel':
        hpIVs = ['100010', '111101']; break;
      case 'ghost':
        hpIVs = ['101101', '110101']; break;
      case 'bug':
        hpIVs = ['100101', '111100', '101100']; break;
      case 'rock':
        hpIVs = ['001100', '110100', '100100']; break;
      case 'ground':
        hpIVs = ['000100', '111001', '101001']; break;
      case 'poison':
        hpIVs = ['001001', '110001', '100001']; break;
      case 'flying':
        hpIVs = ['000001', '111000', '101000']; break;
      case 'fighting':
        hpIVs = ['001000', '110000', '100000']; break;
      case 'fairy':
        return "Hidden Power Fairy is not obtainable.";
      default:
        return `No type ${msg[0]} recognized.`;
      }
      
      sendMsg.push(`Hidden Power ${msg[0].charAt(0).toUpperCase()}${msg[0].slice(1)}`);
      for (let i = 0; i < hpIVs.length; i++){
        let hpRecommend = [];
        for (let j = 0; j < stats.length; j++){
          hpRecommend.push(`${stats[j]}: ${(hpIVs[i].charAt(j) === '1') ? "odd" : "even"}`);
        }
        sendMsg.push(` - ${hpRecommend.join('; ')}`);
      }
      return sendMsg;
    }
  
    if (msg.length >= 6) {
      let ivs = {
        hp:  parseInt(msg[0]),
        atk: parseInt(msg[1]),
        def: parseInt(msg[2]),
        spa: parseInt(msg[3]),
        spd: parseInt(msg[4]),
        spe: parseInt(msg[5])
      };
      for (let i = 0; i < stats.length; i++){
        //dex.getHiddenPower() assumes that all IV values are 0-31, but DVs can only be 0-15. Thus, getHiddenPower() halves it to stay compatible with Showdown inputs. This adjustment is unnecessary for us.
        if (dex.gen === 2) {
          ivs[stats[i].toLowerCase()] *= 2;
        }
        if (ivs[stats[i].toLowerCase()] > 31) {
          ivs[stats[i].toLowerCase()] = 31;
        }
        if (ivs[stats[i].toLowerCase()] < 0) {
          ivs[stats[i].toLowerCase()] = 0;
        }
      }
      
      let hp = dex.getHiddenPower(ivs);
      return `Type: ${hp.type}; Power: ${hp.power}`;
    }

  }
  
  
  /*
		let IVargs = suffix.split(",");
		if (IVargs.length === 1) {
			IVargs = IVargs[0].charAt(0).toUpperCase() + IVargs[0].slice(1).toLowerCase();
			let type = typechart[IVargs];
			if (!type) {
				msg.channel.sendMessage("```" + `Type ${IVargs} not recognized.` + "```");
				return;
			}
			let ivs = type.HPivs;
			if (!ivs) {
				msg.channel.sendMessage("```" + `${IVargs} is an unattainable Hidden Power type.` + "```");
				return;
			}
			let IVset = {"hp":"odd", "atk":"odd", "def":"odd", "spa":"odd", "spd":"odd", "spe":"odd"};
			for (let stat in ivs) {
				(ivs[stat] % 2 === 1) ? IVset[stat] = "odd" : IVset[stat] = "even";
			}
			let sendMsg = [];
			for (let stat in IVset) {
				sendMsg.push(`${stat.toUpperCase()}: ${IVset[stat]}`);
			}
			msg.channel.sendMessage("```" + `${IVargs}: ${sendMsg.join(", ")}` + "```");
		} else if (IVargs.length === 6) {
			let HPtype = 0;
			let swap = IVargs[5];
			let invalid = false;
			IVargs[5] = IVargs[4];
			IVargs[4] = IVargs[3];
			IVargs[3] = swap;
			let fuckery = false;
			IVargs.forEach((value, index) => {
				if (!parseInt(value)){
					value = 0;
				}
				if (value < 0 || value > 31) {
					fuckery = true;
				}
				HPtype += (parseInt(value) % 2) * Math.pow(2, index);
			});
			if (invalid) {
				return;
			}
			HPtype = Math.floor(HPtype * 15.0 / 63);
			let typeIndex = ["Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Steel", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon", "Dark"];
			let detectText = "";
			if (fuckery) {
				detectText = "\nInvalid IV value detected. However, this does not greatly affect IV calculation as only the oddity (that is, whether or not the IV value is divisible by 2) of the IV value matters in Hidden Power calculation."
			}
			msg.channel.sendMessage("```" + `Hidden Power ${typeIndex[HPtype]}${detectText}` + "```");
		} else {
			return "bad suffix";
		}*/
};






