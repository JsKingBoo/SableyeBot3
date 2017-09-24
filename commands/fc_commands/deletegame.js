'use strict';

module.exports = {
  desc: "Remove game.",
  usage: '<game|game index>',
  process: (msg, flags, authorId, fcm) => {
    if (msg[0].length === 0) {
      return null;
    }
    let user = fcm.getUser(authorId);
    let game = msg[0].trim().toLowerCase();
       
    let success = user.removeGame(game);
    fcm.addUser(user);

    return (success ? "Game entry removed." : "Error: could not remove game entry");
  }
};
