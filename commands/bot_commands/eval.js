'use strict';

const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '../../');
const UTILS_DIR = path.resolve(BASE_DIR, 'utils/');

module.exports = {
  desc: "Please don't.",
  usage: "<expression>",
  adminOnly: true,
  process: async function(msg, flags) {
    return "";
    /*
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
    return output;*/
  }
};
