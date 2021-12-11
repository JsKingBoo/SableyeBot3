'use strict';

const path = require('path');
const Loki = require('lokijs');

const fullDbPath = path.resolve(__dirname, '../logs/', config.fcData);

const db = new Loki(fullDbPath, {
  autoload: false,
  autosave: false
});

const gamesList = {'b': 1, 'w': 1, 'b2': 1, 'w2': 1, 'x': 1, 'y': 1, 'or': 1, 'as': 1, 's': 1, 'm': 1, 'us': 1, 'um': 1, 'lgp': 1, 'lge': 1, 'sw': 1, 'sh': 1, 'bd': 1, 'sp': 1};

class FriendCode {
  constructor(discordID) {
    this.discordID = discordID;
    this.fc = [];
    this.games = [];
  }
  
  addFC(fc, miiName = "No name provided") {
    fc = (fc+'').replace(/\D/g, '').slice(0, 12);
    if (fc.length !== 12) {
      return false;
    }
    fc = `${fc.slice(0, 4)}-${fc.slice(4, 8)}-${fc.slice(8, 12)}`;
    for (let i = 0; i < this.fc.length; i++) {
      if (this.fc[i].fc === fc) {
        this.fc[i].mii = miiName;
        return true;
      }
    }
    this.fc.push({ 'fc': fc, 'mii': miiName });
    return true;
  }
  
  removeFC(fc) {
    if (typeof fc === 'number' && fc < this.fc.length) {
      this.fc.splice(fc, 1);
      return;
    }
    for (let i = 0; i < this.fc.length; i++) {
      if (this.fc[i].fc === fc || this.fc[i].fc.replace(/\D/g, '') === fc) {
        this.fc.splice(i, 1);
        return;
      }
    }
  }
  
  addGame(game, name, tsv = null) {
    game = game.toLowerCase();
    if (!gamesList[game]) {
      return;
    }
    if (tsv) {
      tsv = (tsv+'').replace(/\D/g, '').slice(0, 4);
      if (tsv.length !== 4) {
        tsv = null;
      }
    }
    this.games.push({
      'game': game.toUpperCase(),
      'name': name,
      'tsv': tsv
    });
    return true;
  }
  
  removeGame(game) {
    game = game.toUpperCase();
    if (!gamesList[game.toLowerCase()]) {
      let index = parseInt(game);
      if (index < this.games.length) { 
        this.games[index] = this.games[this.games.length - 1];
        this.games.pop();
        return true;
      }
      return false;
    }
    for (let i = 0; i < this.games.length; i++) {
      if (this.games[i].game === game) {
        this.games.splice(i, 1);
        return true;
      }
    }
  }
  
  editGame(index, properties = {}) {
    Object.assign(this.games[index], properties);
  }  
  
  static copy(fcObj) {
    if (!fcObj) {
      return null;
    }
    let c = new FriendCode();
    c.discordID = fcObj.discordID;
    c.fc = fcObj.fc;
    c.games = fcObj.games;
    return c;
  }
  
}

class FCManager {
  constructor() {
  }
  
  init() {
    return new Promise((resolve, reject) => {
      db.loadDatabase({}, () => {
        this.fcData = db.getCollection('fcData');
        if (!this.fcData) {
          this.fcData = db.addCollection('fcData');
        }
        resolve();
      });
    });
  }
  
  registerUser(discordID) {
    discordID = (discordID+'').trim();
    let checkIfExists = this.fcData.find({
      'discordID': discordID
    });
    if (checkIfExists.length > 0) {
      return;
    }
    this.fcData.insert(new FriendCode(discordID));
    db.saveDatabase();
  }
  
  addUser(friendCode) {
    //FriendCode object, not friend code string
    this.fcData.findAndRemove({
      'discordID': friendCode.discordID
    });
    this.fcData.insert(friendCode);
    db.saveDatabase();
  }
  
  getUser(discordID) {
    this.registerUser(discordID);
    return FriendCode.copy(this.fcData.find({
      'discordID': discordID
    })[0]);
  }

}

module.exports = FCManager;
