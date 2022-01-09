'use strict';

const fs = require('fs');

module.exports = {
  desc: "List servers.",
  usage: "",
  options: [{
    name: "verbose",
    value: false,
    desc: "Lists all guilds in a file on the server"
  }],
  adminOnly: true,
  process: async function(msg, flags) {
    let sendMsg = [];
    let servers = bot.guilds.cache;
    sendMsg.push(`Currently watching ${servers.size} server${servers.size === 1 ? '' : 's'}`);
    //Only spit out detailed list while in DM/PM channel
    const guildList = [];
    if (flags.verbose) {
      servers.forEach(server => {
        const joinedAt = server.joinedAt;
        guildList.push(`[${server.id}] ${server.name} ${joinedAt.getUTCFullYear()}-${joinedAt.getUTCMonth()+1}-${joinedAt.getUTCDate()}`);
      });
    }
    fs.writeFileSync('logs/servers.txt', guildList.join('\n'));
    return sendMsg;
  }
};






