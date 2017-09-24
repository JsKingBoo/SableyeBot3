'use strict';

module.exports = {
  desc: "Add game information to your account.",
  usage: '<abbreviated game>, <in-game name>, [TSV value]',
  process: (msg, flags, authorId, fcm) => {
    if (msg.length < 2) {
      return null;
    }
    
    let user = fcm.getUser(authorId);
    let game = msg[0].trim();
    let ign = msg[1].trim();
    let tsv = (msg.length > 2 ? msg[2].trim().slice(0, 4) : null);
    
    let success = user.addGame(game, ign, tsv);
    fcm.addUser(user);

    return (success ? `Registered ${user.games[user.games.length - 1].game} for ${authorId} as ${user.games[user.games.length - 1].name}.` : `Error: could not add game information.`);
  }
};
