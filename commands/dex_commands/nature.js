'use strict';

let backwardNatures = {
  atk: {
    atk: "Hardy",
    def: "Lonely",
    spa: "Adamant",
    spd: "Naughty",
    spe: "Brave"
  },
  def: {
    atk: "Bold",
    def: "Docile",
    spa: "Impish",
    spd: "Lax",
    spe: "Relaxed"
  },
  spa: {
    atk: "Modest",
    def: "Mild",
    spa: "Bashful",
    spd: "Rash",
    spe: "Quiet"
  },
  spd: {
    atk: "Calm",
    def: "Gentle",
    spa: "Careful",
    spd: "Quirky",
    spe: "Sassy"
  },
  spe: {
    atk: "Timid",
    def: "Hasty",
    spa: "Jolly",
    spd: "Naive",
    spe: "Serious"
  }
};

let stats = ['atk', 'def', 'spa', 'spd', 'spe'];

module.exports = {
  desc: "Information of a nature, or returns the nature given the boosted and hindered stat.",
  usage: "<nature name>|(<abbreviated boosted stat>, <abbreviated hindered stat>)",
  aliases: ['natures'],
  process: async function(msg, flags, dex) {
    if (msg.length === 0){
      return null;
    }

    if (dex.gen === 1 || dex.gen === 2) {
      return 'Natures did not exist until gen3.';
    }

    let sendMsg = [];

    let nature = dex.natures.get(msg[0]);
    if (!nature || !nature.exists) {
      nature = dex.dataSearch(msg[0], ['Natures']);
      if (!nature) {
        if (msg.length < 2) {
          return `No nature ${msg[0]} found.`;
        }
        if (!stats.includes(msg[0]) || !stats.includes(msg[1])) {
          return `${msg[0]},${msg[1]} not recognized.`;
        }
        nature = dex.natures.get(backwardNatures[msg[0]][msg[1]]);
      } else {
        sendMsg.push(`No nature ${msg[0]} found. Did you mean ${nature[0].name}?`);
        nature = dex.natures.get(nature[0].name);
      }
    }

    if (nature.plus) {
      sendMsg.push(`${nature.name}: +${nature.plus.toUpperCase()}, -${nature.minus.toUpperCase()}`);
    } else {
      sendMsg.push(`${nature.name}: no effect.`);
    }
    return sendMsg;

  }
};





