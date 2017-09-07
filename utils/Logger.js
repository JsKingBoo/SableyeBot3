'use strict';

const path = require('path');
const Loki = require('lokijs');

const fullDbPath = path.resolve(__dirname, '../logs/', config.lokidb);

const db = new Loki(fullDbPath, {
  autoload: false,
  autosave: false
});

function getEpochTime() {
  return new Date().getTime();
}

class Logger {
  constructor() {
  }
  
  init() {
    return new Promise((resolve, reject) => {
      db.loadDatabase({}, () => {
        let collections = ['blacklist', 'commands', 'status'];
        for (let i = 0; i < collections.length; i++){
          let name = collections[i];
          this[name] = db.getCollection(name);
          if (!this[name]) {
            this[name] = db.addCollection(name);
          }
        }
        resolve();
      });
    });
  }
  
  savePresence() {
    this.status.clear();
    this.status.insert({
      'status': bot.user.presence.status, 
      'game': (bot.user.presence.game ? bot.user.presence.game.name : null)
    });
    console.log(this.status.data);
    db.saveDatabase();
  }
  
  getPresence() {
    return this.status.data[0] || null;
  }
  
  addToBlacklist(userId, expire=0) {
    if (config.admins.includes(parseInt(userId))) {
      return;
    }
    let timestamp = getEpochTime();
    let expireTimestamp = (expire > 0) ? timestamp + parseInt(expire) : false;
    this.blacklist.insert({
      'user': userId,
      'timestamp': timestamp,
      'expireTimestamp': expireTimestamp
    });
    db.saveDatabase();
  }
  
  unBlacklist(userId) {
    this.blacklist.findAndRemove({
      'user': userId
    });
    db.saveDatabase();
  }
  
  getBlacklist() {
    let timestamp = getEpochTime();
    this.blacklist.findAndRemove({
      '$and': [{
        'expireTimestamp': { '$lt': timestamp }
      }, {
        'expireTimestamp': { '$type': 'number' }
      }]
    });
    return this.blacklist.data;
  }
  
  blacklisted(userId) {
    let blacklist = this.getBlacklist();
    for (let i = 0; i < blacklist.length; i++) {
      if (blacklist[i].user === userId) {
        return true;
      }
    }
    return false;
  }
  
  logCommand(commandName) {
    let timestamp = getEpochTime();
    this.commands.insert({
      'command': commandName,
      'timestamp': timestamp
    });
    db.saveDatabase();
  }
  
  getCommand(commandName=null) {
    return this.commands.chain().where((obj) => {
      return (!commandName || obj.command === commandName);
    }).data();
  }
  
}

module.exports = Logger;
