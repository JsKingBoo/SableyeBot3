'use strict';

const fs = require('fs');
const path = require('path');

const Commands = require('./Commands.js');
const Dex = require('./dex.js');
const Flag = require('./Flag.js');
const FCManager = require('./FCManager.js');

const BOT_CMD_DIR = path.resolve(__dirname, '../commands/bot_commands/');
const DEX_CMD_DIR = path.resolve(__dirname, '../commands/dex_commands/');
const FC_CMD_DIR = path.resolve(__dirname, '../commands/fc_commands/');

const fcm = new FCManager();
fcm.init();

class CommandManager {
  constructor() {
    this.commands = [];
    Dex.includeModData();    
  }
  
  async init() {
    await Promise.all([
      this.loadDirectory(BOT_CMD_DIR, Commands.BotCommand, config.botCommandPrefix),
      this.loadDirectory(DEX_CMD_DIR, Commands.DexCommand, config.dexCommandPrefix),
      this.loadDirectory(FC_CMD_DIR, Commands.FCCommand, config.fcCommandPrefix),
    ]);
  }
  
  loadDirectory(directory, Command, prefix) {
     return new Promise((resolve, reject) => {
			fs.readdir(directory, (err, files) => {
				if (err) {
					reject(`Error reading commands directory: ${err}`);
				} else if (!files) {
					reject(`No files in directory ${directory}`);
				} else {
					for (let name of files) {
						if (name.endsWith('.js')) {
							try {
								name = name.slice(0, -3);
								let command = new Command(name, prefix, require(directory + '/' + name + '.js'));
								this.commands.push(command);
							} catch (e) {
								console.log(`CommandManager loadDirectory() error: ${e} while parsing ${name}.js in ${directory}`);
							}
						}
					}
					resolve();
				}
			});
		});
  }
  
  executeCommand(cmd, msg = [], flags, msgMetadata) {
    let passDex = Dex;
    let authorId = msgMetadata.author.id;
    let isAdmin = config.admins.includes(parseInt(authorId));
    
    if (cmd === `${config.dexCommandPrefix}${config.helpCommand}` || cmd === `${config.botCommandPrefix}${config.helpCommand}`) {
      let usedPrefix = cmd.slice(0, -1 * config.helpCommand.length);
      for (let i = 0; i < this.commands.length; i++){
        let command = this.commands[i];
        if (command.trigger(`${usedPrefix}${msg[0]}`)) {
          return this.helpCommand(usedPrefix, command, flags, isAdmin);
        }
      }
      return this.helpCommand(usedPrefix, '', flags, isAdmin);
    }
    
    for (let i = 0; i < this.commands.length; i++){
      let command = this.commands[i];
      if (command.trigger(cmd)) {        
        if (command.adminOnly && !isAdmin) {
          return undefined;
        }
        let parsedFlags = {};        
        for (let j = 0; j < command.options.length; j++) {
          let currentOption = command.options[j];
          parsedFlags[currentOption.name] = currentOption.value;
          for (let k = 0; k < flags.length; k++){
            let currentFlag = flags[k];
            if (currentFlag.match(currentOption)) {
              if (command.commandType === 'DexCommand' && currentFlag.name === 'gen') {
                let genInt = parseInt(currentFlag.value);
                if (genInt > 0 && genInt <= 7) {
                  passDex = Dex.mod('gen' + genInt);
                }
              }
              parsedFlags[currentOption.name] = currentFlag.value;
              break;
            }
          }
        }
        
        let commandOutput;
        try {
          switch (command.commandType) {
            case 'BotCommand':
              commandOutput = command.execute(msg, parsedFlags);
              break;
            case 'DexCommand':
              commandOutput = command.execute(msg, parsedFlags, passDex);
              break;
            case 'FCCommand':
              commandOutput = command.execute(msg, parsedFlags, authorId, fcm);
              break;
            default:
              commandOutput = command.execute(msg, parsedFlags);
          }
        } catch (e) {
          console.log(`ERROR: ${e} at ${e.stack}\nfrom command ${command.name}\nwith input ${msg}\nwith parsedFlags ${JSON.stringify(parsedFlags)}\nin server ${msgMetadata.guild} by user ${authorId} (${msgMetadata.author.username}#${msgMetadata.author.discriminator})`);
          commandOutput = false;
        }
       
        let badOutput = false;
        if (!commandOutput) {
          badOutput = true;
          let flagInfo = [];
          for (let j = 0; j < command.options.length; j++){
            flagInfo.push(command.options[j].toString());
          }
          commandOutput = [
            command.toString(),
            command.desc,
            `Aliases: ${command.aliases.join(", ")}`,
            `Flags: ${flagInfo.join(", ")}`,
            `For more information, use ${command.prefix}${config.helpCommand} ${command.name}`
          ].join('\n');
        }
        if (!command.hasCustomFormatting || badOutput) {
          if (typeof commandOutput !== 'string') {
            if (Array.isArray(commandOutput)) {
              commandOutput = commandOutput.join('\n');
            } else if (typeof commandOutput === 'number') {
              commandOutput = commandOutput+'';
            } else if (commandOutput.toString()) {
              commandOutput = commandOutput.toString();
            } else {
              //something really bad happened
              console.log('error while parsing command output: somehow has no string representation');
              return;
            }
          }
          if (commandOutput.length < config.forcePM) {
            commandOutput = '```' + commandOutput + '```';
          }
        }
        if (!badOutput) {
          Logger.logCommand(command.name);
        }
        return commandOutput;
      }
    }
    return null;
  }
  
  helpCommand(prefix, cmd, flags, isAdmin) {
    Logger.logCommand(`${config.helpCommand}`);
    let sendMsg = [];
    if (!cmd) {
      sendMsg.push(`List of commands; use ${prefix}${config.helpCommand} <command name> for more information:`);
      sendMsg.push("~~");
      for (let i = 0; i < this.commands.length; i++){
        let command = this.commands[i];
        if (command.prefix === prefix && !command.disabled && (isAdmin || !command.adminOnly)) {
          sendMsg.push(`${command.toString()} - ${command.desc}`);
        }
      }
      sendMsg = sendMsg.join('\n');
      if (sendMsg.length < config.forcePM) {
        sendMsg = '```' + sendMsg + '```';
      }
      return sendMsg;
    }
      
    if (cmd.adminOnly && !isAdmin) {
      return `${cmd.name} is an admin-only command.`;
    }
    
    sendMsg = [
      cmd.name,
      '',
      cmd.longDesc,
      '',
      `Aliases: ${cmd.aliases.join(", ")}`,
      'Flags:'
    ];
    for (let i = 0; i < cmd.options.length; i++) {
      sendMsg.push(`  ${cmd.options[i].toString()}: ${cmd.options[i].desc}`);
    }
    sendMsg = sendMsg.join('\n');
    if (sendMsg.length < config.forcePM) {
      sendMsg = '```' + sendMsg + '```';
    }
    return sendMsg;
  }
  
}

module.exports = CommandManager;