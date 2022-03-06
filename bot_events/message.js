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
  if (!(msg.content.startsWith(config.botCommandPrefix) || msg.content.startsWith(config.dexCommandPrefix) || msg.content.startsWith(config.fcCommandPrefix))) {
    return;
  }
  if (Logger.blacklisted(msg.author.id)) {
    return;
  }

  resolveMessage(msg);
};

async function resolveMessage(msg) {
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

  let commandOutput = await cm.executeCommand(cmd, msgContent, flags, msg);

  if (!commandOutput) {
    return;
  }

  const warnSlashCommands = Math.random() < 0.2;
  const components = [];
  const newEmbeds = [];

  if(warnSlashCommands) {
    const desc = [
      'Message commands will be deprecated on the 30th of April 2022.',
      'Click on the link above for more details',
    ];
    if(msg.guild) {
      try {
        await msg.guild.commands.fetch();
        desc.push('Type one `/` in the chatbox to browse the available slash commands!');
      } catch (e) {
        desc.push('Have a moderator click the button below to enable slash commands in this server!');
        components.push({
          type: 1,
          components: [
            {
              type: 2,
              style: 5,
              label: 'Add Slash Commands',
              url: 'https://discord.com/api/oauth2/authorize?client_id=211522070620667905&permissions=0&scope=bot%20applications.commands',
            }
          ],
        });
      }
    } else {
      desc.push('Type one `/` in the chatbox to browse the available slash commands!');
    }
    newEmbeds.push({
      title: 'Sableye Bot now uses Slash Commands!',
      description: desc.join('\n\n'),
      url: "https://sableye-bot.xyz/migration",
      color: 0x5F32AB,
      fields: [
        {
          name: 'Support Server',
          value: 'https://discord.gg/etUxhVfA7u',
          inline: true,
        },
      ],
      footer: {
        text: `SableyeBot version 4.x`,
        icon_url: 'https://cdn.discordapp.com/avatars/211522070620667905/6b037c17fc6671f0a5dc73803a4c3338.webp',
      }
    });
  }

  if (typeof commandOutput === 'object') {
    commandOutput.embeds = [...commandOutput.embeds, ...newEmbeds];
    commandOutput.components = components;
    msg.channel.send(commandOutput);
  } else if (commandOutput.length < config.forcePM) {
    const message = {
      content: commandOutput,
      tts: false,
      embeds: newEmbeds,
      components,
    };
    msg.channel.send(message);
  } else {
    if (msg.guild) {
      msg.channel.send({
        content: `${msg.author}, sent response via PM.`
      });
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
