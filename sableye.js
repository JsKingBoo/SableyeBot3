'use strict';

const discordjs = require('discord.js');
const path = require('path');

global.config = require('./config.js');
global.packagejson = require('./package.json');

const BOT_EVENTS_DIR = path.resolve(__dirname, 'bot_events');
const UTILS_DIR = path.resolve(__dirname, 'utils');

global.bot = new discordjs.Client({
  intents: [
    discordjs.Intents.FLAGS.GUILD_MESSAGES,
    discordjs.Intents.FLAGS.GUILDS,
    discordjs.Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: [
    'CHANNEL',
  ],
});

const botReady = require(path.resolve(BOT_EVENTS_DIR, 'ready.js'));
const botMessage = require(path.resolve(BOT_EVENTS_DIR, 'message.js'));
const logger = require(path.resolve(UTILS_DIR, 'Logger.js'));

global.Logger = new logger();

bot.on('ready', () => {
  botReady();
});

bot.on('messageCreate', (msg) => {
  botMessage(msg, null);
});

module.exports = function launch() {
  global.Logger.init()
    .then(() => {
      bot.login(config.token);
      console.log("Launching SableyeBot");
    })
    .catch((e) => {
      console.log('Error while initiating SableyeBot', e);
    });
};
