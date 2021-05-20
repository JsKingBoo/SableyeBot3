'use strict';

module.exports = {
  desc: "Register your friend code",
  longDesc: "Link your friend code to your Discord account. By doing so, anyone can look up and find your friend code using the `fc` command so long as they know what your Discord ID is. Enter your friend code as a string of digits with or without dashes.",
  usage: '<friend code>, [Mii name]',
  process: async function(msg, flags, author, fcm) {
    let miiName = (msg.length > 1 ? msg.splice(1).join(',').trim() : null);
    let user = fcm.getUser(author.id);
    let success = user.addFC(msg[0], miiName);
    fcm.addUser(user);
    return (success ? `Registered ${user.fc[user.fc.length - 1].fc} for @${author.tag} as ${miiName}.` : `Error: could not add friend code.`);
  }
};
