'use strict';

module.exports = {
  desc: "Get friend code information of a user.",
  longDesc: "Retrieve friend code information of a user along with a list of the games they own. If no Discord ID is provided, your information will be displayed. Discord ID is retrievable by enabling Developer Mode via Settings → Appearance → Advanced → Developer Mode. Once Developer Mode is activated, you can right click any user and select the \"Copy ID\" function to obtain another user's Discord ID.",
  usage: '[Discord ID]',
  process: async function(msg, flags, authorId, fcm) {
    let queryId = ((msg[0].length === 0 ? authorId : msg[0])+'').replace(/\D/g, '').trim();
    let user = fcm.getUser(queryId);
    
    let sendMsg = [
      `${queryId}:`
    ];
    
    //FC data
    sendMsg.push("Friend Code info:");
    if (user.fc.length === 0) {
      sendMsg.push(" - No friend code information found.");
    } else {
      for (let i = 0; i < user.fc.length; i++) {
        sendMsg.push(` - [${i}] ${user.fc[i].fc} (Mii: ${user.fc[i].mii || "No name provided"})`);
      }
    }
    
    //Game data
    sendMsg.push("Owned games info:");
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
