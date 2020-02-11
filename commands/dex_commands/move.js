'use strict';
			
let stats = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'];
        
module.exports = {
  desc: "Information of a move",
  longDesc: "Gives the type, category, power, Z-crystal effects, accuracy, PP, description, priority, target, generation, viability, contest type, and ability interactions of a move. An accuracy of 'true' means that the move does not perform an accuracy check.",
  usage: "<move name>",
  aliases: ['moves', 'attack'],
  options: [{
    name: "verbose",
    value: false,
    desc: "Gives additional information such as target, generation, singles viability, and contest type."
  }],
  process: async function(msg, flags, dex) {
    if (msg.length === 0){
      return null;
    }
    
    let sendMsg = [];
    
    let move = dex.getMove(msg[0]);
    if (!move || !move.exists) {
      move = dex.dataSearch(msg[0], ['Movedex']);
      if (!move) {
        return `No move ${msg[0]} found.`;
      }
      sendMsg.push(`No move ${msg[0]} found. Did you mean ${move[0].name}?`);
      move = dex.getMove(move[0].name);
    }
    if (move.gen > dex.gen) {
      return `${move.name} did not exist in gen${dex.gen}; it was introduced in gen${move.gen}.`;
    }

    let zStr = "";
    if (dex.gen === 7 || dex.gen === 0) {
      if (move.isZ) {
        zStr = `(${dex.getItem(move.isZ).name})`;
      } else if (move.zMoveEffect) {
        zStr = `(Z: ${move.zMoveEffect})`;
      } else if (move.zMoveBoost) {
        zStr = [];
        for (let i = 0; i < stats.length; i++){
          if (move.zMoveBoost[stats[i]]) {
            zStr.push(`${stats[i].slice(0, 3).toUpperCase()}+${move.zMoveBoost[stats[i]]}`);
          }
        }
        zStr = `(Z: ${zStr.join(",")})`;
      } else {
        zStr = `(Z: ${move.zMovePower})`;
      }
      zStr = " " + zStr;
    }

    let dStr = "";
    if (dex.gen >= 8 || dex.gen === 0) {
      // Yikes @ this method but there's no field to help otherwise.
      if (move.name.startsWith('G-Max')) {
        dStr = "";
      } else if (move.gmaxPower === 0) {
        dStr = "(Max Guard)";
      } else {
        dStr = `(Max Power: ${move.gmaxPower})`;
      }
      dStr = " " + dStr;
    }

    sendMsg = sendMsg.concat([
      `${move.name} [${move.type}] [${move.category}]`,
      `Power: ${move.basePower}${zStr}${dStr}; Accuracy: ${move.accuracy}; PP: ${move.pp} (max ${Math.floor(move.pp * 1.6)})`,
      `${(move.desc || move.shortDesc)}`,
      `Priority: ${((move.priority > 0) ? "+" : "")}${move.priority}`
    ]);
		
    if (flags.verbose) {
      sendMsg.push(`Target: ${move.target}`);
      sendMsg.push(`Introduced in gen${move.gen}`);
      sendMsg.push(`Viable (singles): ${(move.isViable ? "yes" : "no")}`);
      sendMsg.push(`Contest type: ${move.contestType}`);
    }

    let behaviorFlags = "";
    if (move.flags.bullet) {
      behaviorFlags += "Has no effect on Pokemon with the Ability Bulletproof. ";
    }
    if (move.flags.protect) {
      behaviorFlags += "Blocked by Detect, Protect, Spiky Shield, and if not a Status move, King's Shield. ";
    }
    if (move.flags.mirror) {
      behaviorFlags += "Can be copied by Mirror Move. ";
    }
    if (move.flags.authentic) {
      behaviorFlags += "Ignores a target's substitute. ";
    }
    if (move.flags.bite) {
      behaviorFlags += "Power is multiplied by 1.5 when used by a Pokemon with the Ability Strong Jaw. ";
    }
    if (move.flags.charge) {
      behaviorFlags += "The user is unable to make a move between turns. ";
    }
    if (move.flags.contact) {
      behaviorFlags += "Makes contact. ";
    }
    if (move.flags.dance) {
      behaviorFlags += "Can be copied by the ability Dancer. ";
    }
    if (move.flags.defrost) {
      behaviorFlags += "Thaws the user if executed successfully while the user is frozen. ";
    }
    if (move.flags.distance) {
      behaviorFlags += "Can target a Pokemon positioned anywhere in a Triple Battle. ";
    }
    if (move.flags.gravity) {
      behaviorFlags += "Prevented from being executed or selected during Gravity's effect. ";
    }
    if (move.flags.heal) {
      behaviorFlags += "Prevented from being executed or selected during Heal Block's effect. ";
    }
    if (move.flags.nonsky) {
      behaviorFlags += "Prevented from being executed or selected in a Sky Battle. ";
    }
    if (move.flags.powder) {
      behaviorFlags += "Has no effect on Grass-type Pokemon, Pokemon with the Ability Overcoat, and Pokemon holding Safety Goggles. ";
    }
    if (move.flags.pulse) {
      behaviorFlags += "Power is multiplied by 1.5 when used by a Pokemon with the Ability Mega Launcher. ";
    }
    if (move.flags.punch) {
      behaviorFlags += "Power is multiplied by 1.2 when used by a Pokemon with the Ability Iron Fist. ";
    }
    if (move.flags.recharge) {
      behaviorFlags += "If this move is successful, the user must recharge on the following turn and cannot make a move. ";
    }
    if (move.flags.reflectable) {
      behaviorFlags += "Bounced back to the original user by Magic Coat or the Ability Magic Bounce. ";
    }
    if (move.flags.snatch) {
      behaviorFlags += "Can be stolen from the original user and instead used by another Pokemon using Snatch. ";
    }
    if (move.flags.sound) {
      behaviorFlags += "Has no effect on Pokemon with the Ability Soundproof. ";
    }
    if (behaviorFlags.length > 0) {
      sendMsg.push("~~");
      sendMsg.push(behaviorFlags);
    }
    
    return sendMsg;
		
  }
};



