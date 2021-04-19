'use strict';

module.exports = {
  desc: "Information of an item.",
  longDesc: "Gives a description of an item's effects and the generation it was introduced in. If applicable, the fling power and fling status effect is given. If applicable, the base power of the move Natural Gift and its type is given.",
  usage: "<item name>",
  aliases: ['items'],
  options: [{
    name: "verbose",
    value: false,
    desc: "Gives additional information such as Natural Gift power, Natural Gift typing, Fling power, Fling status, and generation."
  }],
  process: async function(msg, flags, dex) {
    if (msg.length === 0){
      return null;
    }

    let sendMsg = [];

    let item = dex.items.get(msg[0]);
    if (!item || !item.exists) {
      item = dex.dataSearch(msg[0], ['Items']);
      if (!item) {
        return `No item ${msg[0]} found.`;
      }
      sendMsg.push(`No item ${msg[0]} found. Did you mean ${item[0].name}?`);
      item = dex.items.get(item[0].name);
    }
    if (item.gen > dex.gen) {
      return `${item.name} did not exist in gen${dex.gen}; it was introduced in gen${item.gen}.`;
    }

    sendMsg = sendMsg.concat([
      `${item.name}`,
      `${(item.desc || "No description availible.")}`
    ]);

    if (flags.verbose) {
      if (item.naturalGift) {
        sendMsg.push(`Natural Gift: BP: ${(item.naturalGift.basePower || "-")}; Type: [${(item.naturalGift.type || "-")}]`);
      }
      if (item.fling) {
        sendMsg.push(`Fling: BP: ${(item.fling.basePower || "-")} Status: ${((item.fling.status || item.fling.volatileStatus) || "-")}`);
      }

      sendMsg.push(`Introduced in gen${item.gen}`);
    }

    return sendMsg;

  }
};







