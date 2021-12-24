'use strict';

module.exports = {
  desc: "Get friend code information of a user.",
  longDesc: "Retrieve friend code information of a user along with a list of the games they own. If no Discord ID is provided, your information will be displayed. Discord ID is retrievable by enabling Developer Mode via Settings → Appearance → Advanced → Developer Mode. Once Developer Mode is activated, you can right click any user and select the \"Copy ID\" function to obtain another user's Discord ID.",
  usage: '[Discord ID]',
  process: async function(msg, flags, author, fcm, queryUser) {
    let queryId = queryUser ? queryUser.id : ((msg[0].length === 0 ? author.id : msg[0])+'').replace(/\D/g, '').trim();
    let userName = queryUser ? `@${queryUser.tag}` : queryId;
    let user = fcm.getUser(queryId);
    fcm.addUser(user);

    let sendMsg = [
      `Info for ${userName}:`
    ];

    //FC data
    sendMsg.push("Friend Code(s):");
    if (user.fc.length === 0) {
      sendMsg.push(" - No friend code information found.");
    } else {
      for (let i = 0; i < user.fc.length; i++) {
        sendMsg.push(` - [${i}] ${user.fc[i].fc} (Mii: ${user.fc[i].mii || "No name provided"})`);
      }
    }

    //Game data
    sendMsg.push("Owned game(s):");
    if (user.games.length === 0) {
      sendMsg.push(" - No game information found.");
    } else {
      for (let i = 0; i < user.games.length; i++) {
        sendMsg.push(` - [${i}] ${user.games[i].game} (Name: ${user.games[i].name}) (TSV: ${user.games[i].tsv || "Not known"})`);
      }
    }

    return sendMsg;
  }
};
