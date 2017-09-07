'use strict';

const path = require('path');

module.exports = () => {
  bot.user.setAvatar(path.resolve(__dirname, '../assets/', config.avatar))
    .catch((e) => {
      console.log('Error while setting avatar:', e);
    });		
    
  let savedPresence = Logger.getPresence();
  if (!savedPresence) {
    savedPresence = config.defaultPresence;
  }
    
  bot.user.setPresence({
    'status': savedPresence.status,
    'game': {
      'name': savedPresence.game,
      'type': 0
    }
  });
};
