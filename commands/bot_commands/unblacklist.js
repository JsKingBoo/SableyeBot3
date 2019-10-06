'use strict';

module.exports = {
  desc: "Remove user from blacklist",
  usage: "<user ID>",
  adminOnly: true,
  process: async function(msg, flags) {
    if (msg.length === 0) {
      return 'No user ID given';
    }
    msg[0] = msg[0].trim();
    Logger.unBlacklist(msg[0]);
    return `Removed "${msg[0]}" from blacklist`;
  }
};
