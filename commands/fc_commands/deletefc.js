'use strict';

module.exports = {
  desc: "Remove friend code.",
  usage: '<friend code|friend code index>',
  process: (msg, flags, authorId, fcm) => {
    if (msg[0].length === 0) {
      return null;
    }
    
    let user = fcm.getUser(authorId);
    let fc = msg[0].replace(/\D/g, '').slice(0, 12);
    if (fc.length < 12) {
      fc = parseInt(fc);
    }
   
    user.removeFC(fc);
    fcm.addUser(user);

    return "Friend code removed."
  }
};
