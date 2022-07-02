'use strict';

const fs = require('fs');

const DAY = 1000 * 60 * 60 * 24;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

module.exports = {
  desc: "View save data",
  usage: "[command name]",
  options: [], //Some eventually
  adminOnly: true,
  process: async function(msg, flags) {
    let command = null;
    if (msg.length > 0) {
      command = msg[0].trim().toLowerCase();
    }
    
    let commandData = Logger.getCommand(command);
    
    let timeline = {};
    let total = 0;
    for (let i = 0; i < commandData.length; i++) {
      total++;
      let commandTimestamp = new Date(commandData[i].timestamp);
      let commandName = commandData[i].command;
      let commandYear = commandTimestamp.getUTCFullYear();
      let commandMonth = commandTimestamp.getUTCMonth();
      if (!timeline[commandYear]) {
        timeline[commandYear] = {};
      }
      if (!timeline[commandYear][commandMonth]) {
        timeline[commandYear][commandMonth] = {};
      }
      if (!timeline[commandYear][commandMonth][commandName]) {
        timeline[commandYear][commandMonth][commandName] = 0;
      }
      timeline[commandYear][commandMonth][commandName]++;
    }
    
    let sendMsg = [];
    let years = Object.keys(timeline).sort((a, b) => { return a - b; } );
    for (let i = 0; i < years.length; i++) {
      let months = Object.keys(timeline[years[i]]).sort((a, b) => { return a - b; } );
      for (let j = 0; j < months.length; j++){
        sendMsg.push(`${years[i]} ${MONTHS[parseInt(months[j])]}:`);
        let commandsUsed = Object.keys(timeline[years[i]][months[j]]);
        for (let k = 0; k < commandsUsed.length; k++){
          sendMsg.push(`  - ${commandsUsed[k]}: ${timeline[years[i]][months[j]][commandsUsed[k]]}`);
        }
      }
    }

    fs.writeFileSync(config.commandSummary, sendMsg.join('\n'));
    
    if (sendMsg.length === 0) {
      return "Command either does not exist or not used yet";
    }
    
    return "Saved to disk.";
  }
};
