'use strict';

const path = require('path');

const CommandManager = require(path.resolve(__dirname, '../utils/CommandManager.js'));
const Flag = require(path.resolve(__dirname, '../utils/Flag.js'));
var meme;

try {
  meme = require(path.resolve(__dirname, '../utils/meme.js'));
} catch (e) {
  meme = () => {};
}

const cm = new CommandManager();
cm.init()
  .then(() => {
    meme(cm);
  })
  .catch((e) => {
    console.log("Error initiating CommandManager!", e);
  });

module.exports = function message(msg) { 
  if (msg.author.bot) {
    return;
  }
  if (!(msg.content.startsWith(config.botCommandPrefix) || msg.content.startsWith(config.dexCommandPrefix))) {
    return;
  }
  if (Logger.blacklisted(msg.author.id)) {
    return;
  }
  
  let msgContent = msg.content.trim().split(" ");
  let cmd = msgContent[0];
  let flags = [];
  for (let i = 0; i < msgContent.length; i++){
    let tryConvertToFlag = Flag.fromString(msgContent[i]);
    if (!tryConvertToFlag) {
      continue;
    }
    flags.push(tryConvertToFlag);
    msgContent.splice(i, 1);
    i--;
  }
  msgContent = msgContent.join(" ").slice(cmd.length).split(",");
  
  let commandOutput = cm.executeCommand(cmd, msgContent, flags, msg);
  
  if (!commandOutput) {
    return;
  }
  
  if (typeof commandOutput === 'object') { //RichEmbed
    msg.channel.send('', {'embed': commandOutput});
  } else if (commandOutput.length < config.forcePM) {
    msg.channel.send(commandOutput, config.messageOptions);
  } else {
    if (msg.guild) {
      msg.channel.send(`${msg.author}, sent response via PM.`);
    }
    let splitCommandOutput = [];
    for (let i = 0; i < config.maxPMs; i++) {
      if (commandOutput.length < config.maxMsgLength) {
        splitCommandOutput.push(commandOutput);
        break;
      }
      
      //Try to split the message by cutting on these characters in priority order
      let sliceChars = ['\n', ',', ' ', ''];
      for (let j = 0; j < sliceChars.length; j++) {
        let section = commandOutput.slice(config.forcePM, config.maxMsgLength);
        let charIndex = section.lastIndexOf(sliceChars[j]) + config.forcePM;
        if (charIndex < config.forcePM) {
          continue;
        }
        section = commandOutput.slice(0, charIndex + sliceChars[j].length);
        splitCommandOutput.push(section.trim());
        commandOutput = commandOutput.slice(section.length);
        break;
      }
    }
    
    var timeoutWrapper = (strarr, ind) => {
      setTimeout(() => {
        msg.author.send("```" + strarr[ind].trim() + "```");
        if (strarr[ind+1]) {
          timeoutWrapper(strarr, ind+1);
        }
      }, 1000);
    };
    timeoutWrapper(splitCommandOutput, 0);
    
  }
  
};
