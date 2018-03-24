'use strict';

module.exports = {
  desc: "Add game information to your account.",
  longDesc: [
    "Add game information to your account. Abbreviations are:",
    " - Black: B",
    " - White: W",
    " - Black 2: B2",
    " - White 2: W2",
    " - X: X",
    " - Y: Y",
    " - Omega Ruby: OR",
    " - Alpha Sapphire: AS",
    " - Sun: S",
    " - Moon: M",
    " - Ultra Sun: US",
    " - Ultra Moon: UM",
    "TSV stands for Trainer Shiny Value and is used to determine whether a Pokémon egg hatches a shiny."
  ],
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
