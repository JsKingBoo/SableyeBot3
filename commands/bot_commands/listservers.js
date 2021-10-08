'use strict';

module.exports = {
  desc: "List servers.",
  usage: "",
  options: [{
    name: "verbose",
    value: false,
    desc: "Lists all servers"
  }],
  adminOnly: true,
  process: async function(msg, flags) {
    let sendMsg = [];
    let servers = bot.guilds.cache;
    sendMsg.push(`Currently watching ${servers.size} server${servers.size === 1 ? '' : 's'}`);
    //Only spit out detailed list while in DM/PM channel
    if (flags.verbose) {
      servers.forEach(server => {
        sendMsg.push(`[${server.id}] ${server.name}`);
      });
    }
    return sendMsg;
  }
};






