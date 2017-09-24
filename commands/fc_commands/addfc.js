'use strict';

module.exports = {
  desc: "Register your friend code",
  usage: '<friend code>, [Mii name]',
  process: (msg, flags, authorId, fcm) => {
    let miiName = (msg.length > 1 ? msg.splice(1).join(',').trim() : null);
    let user = fcm.getUser(authorId);
    let success = user.addFC(msg[0], miiName);
    fcm.addUser(user);
    return (success ? `Registered ${user.fc[user.fc.length - 1].fc} for ${authorId} as ${miiName}.` : `Error: could not add friend code.`);
  }
};
