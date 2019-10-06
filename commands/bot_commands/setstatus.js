'use strict';

module.exports = {
  desc: "Set current status",
  usage: '<"online"|"offline"|"idle"|"dnd">',
  adminOnly: true,
  process: async function(msg, flags) {
    let str = msg.join(',').toLowerCase().trim();
    bot.user.setStatus(str);
    return `Status set to "${str}"`;
  }
};
