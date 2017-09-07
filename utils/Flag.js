'use strict';

class Flag {  
  constructor(name, defaultValue = true, desc = "") {
    this.name = name.trim().toLowerCase().replace(/[^0-9a-z-]/gi, '');
    this.value = defaultValue;
    this.desc = desc;
  }
  
  toString() {
    return `${config.flagPrefix}${this.name}`;
  }
  
  match(flag) {
    if (!flag.name) {
      return false;
    }
    if (flag.name === this.name) {
      return true;
    }
    if (flag.name.startsWith(this.name) || this.name.startsWith(flag.name)) {
      return true;
    }
    return false;
  }
  
  static fromString(str) {
    if (!str.startsWith(config.flagPrefix)) {
      return null;
    }
    str = str.slice(config.flagPrefix.length);
    let equal = str.indexOf('=');
    if (equal < 0) {
      return new Flag(str);
    } else {
      return new Flag(str.slice(0, equal), str.slice(equal+1));
    }
  }
  
}

module.exports = Flag;
