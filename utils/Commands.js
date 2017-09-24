'use strict';

const Flag = require('./Flag.js');

class Command {
  constructor(name, prefix, cmd) {
    this.name = name.toLowerCase();
    this.prefix = prefix;
    this.usage = cmd.usage || "";
    this.desc = cmd.desc || "No description.";
    this.longDesc = cmd.longDesc || this.desc;	
    this.adminOnly = cmd.adminOnly || false;
    this.aliases = cmd.aliases || [];
    this.disabled = cmd.disabled || false;
    this.hasCustomFormatting = cmd.hasCustomFormatting || false;
    this.storage = cmd.storage || {};
    this.process = cmd.process;
    this.commandType = 'Command';

    if (Array.isArray(this.longDesc)) {
      this.longDesc = this.longDesc.join('\n');
    }
    
    this.options = [];
    if (cmd.options) {
      for (let i = 0; i < cmd.options.length; i++){
        let cmdFlag = cmd.options[i];
        this.options.push(new Flag(cmdFlag.name, cmdFlag.value, cmdFlag.desc));
      }
    }
  }
  
  trigger(cmd = '') {
    if (this.disabled) {
      return false;
    }
    cmd = cmd.replace(/\s/gi, '').toLowerCase();
    if (cmd === `${this.prefix}${this.name}`) {
      return true;
    }
    for (let i = 0; i < this.aliases.length; i++){
      if (cmd === `${this.prefix}${this.aliases[i]}`) {
        return true;
      }
    }
    return false;
  }
  
  execute(msg = [], flags = this.options) {
    if (this.disabled) {
      return;
    }
    return this.process(msg, flags);
  }
  
  toString() {
    return `${this.prefix}${this.name} ${this.usage}`;
  }
  
}

class DexCommand extends Command {
  constructor(name, prefix, cmd) {
    super(name, prefix, cmd);
    this.commandType = 'DexCommand';
    this.regex = cmd.regex || /[^0-9a-z-]/gi;
    
    let hasDex = false;
    for (let i = 0; i < this.options.length; i++){
      if (this.options[i].name === 'gen') {
        hasDex = true;
        break;
      }
    }
    if (!hasDex) {
      this.options.push(new Flag('gen', config.defaultGen, "Pokémon generation to parse with."));
    }
  }
  
  execute(msg = [], flags = this.options, dex = null) {
    if (this.disabled) {
      return;
    }
    if (!dex) {
      return;
    }
    for (let i = 0; i < msg.length; i++){
      msg[i] = msg[i].toLowerCase().replace(this.regex, '');
      if (msg[i].length === 0) {
        msg.splice(i, 1);
        i--;
      }
    }
    return this.process(msg, flags, dex);
  }
}

class BotCommand extends Command {
  constructor(name, prefix, cmd) {
    super(name, prefix, cmd);
    this.commandType = 'BotCommand';
    this.adminOnly = cmd.adminOnly || true;
  }
  
  execute(msg = [], flags = this.options) {
    if (this.disabled) {
      return;
    }
    return this.process(msg, flags);
  }
}

class FCCommand extends Command {
  constructor(name, prefix, cmd) {
    super(name, prefix, cmd);
    this.commandType = 'FCCommand';
  }
  
  execute(msg = [], flags = this.options, authorId = -1, fcm = null) {
    if (this.disabled) {
      return;
    }
    return this.process(msg, flags, authorId, fcm);
  }
}

module.exports.Command = Command;
module.exports.DexCommand = DexCommand;
module.exports.BotCommand = BotCommand;
module.exports.FCCommand = FCCommand;