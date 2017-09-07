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
  process: (msg, flags) => {
    let sendMsg = [];
    let servers = bot.guilds.array();
    sendMsg.push(`Currently watching over ${servers.length} server${servers.length === 1 ? '' : 's'}`);
    //Only spit out detailed list while in DM/PM channel
    if (flags.verbose) {
      for (let i = 0; i < servers.length; i++) {
        sendMsg.push(`[${i}] [${servers[i].id}] ${servers[i].name}`);
      }
    }
    return sendMsg;
		
  }
};






