'use strict';

module.exports = {
  desc: "Blacklist user",
  usage: "<user ID>, [duration in milliseconds]",
  adminOnly: true,
  process: async function(msg, flags) {
    if (msg.length === 0) {
      return 'No user ID given';
    }
    msg[0] = msg[0].trim();
    let length = parseInt(msg.length > 1 ? parseInt(msg[1]) : 0);
    Logger.addToBlacklist(msg[0], length);
    let lengthStr = (length === 0) ? "indefinitely" : `for ${length} ms`;
    return `Blacklisted "${msg[0]}" ${lengthStr}`;
  }
};
