'use strict';

const path = require('path');
const fs = require('fs');

const BASE_DIR = __dirname;
const Dex = require(path.resolve(__dirname, '../../utils/dex.js'));

module.exports = {
  desc: "Evaluate an arbitrary expression",
  usage: "<expression>",
  adminOnly: true,
  process: (msg, flags) => {
    msg = msg.join(',').trim();
    let output;
    try {
      output = eval(msg);
      if (output.constructor == {}.constructor) {
        output = JSON.stringify(output, null, 2);
      }
    } catch (e) {
      return `Error while evaluating expression: ${e}`;
    }
    return output;
  }
};
