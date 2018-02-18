'use strict';

const path = require('path');

var update = require(path.resolve(__dirname, '../../utils/update.js'));

module.exports = {
  desc: "Update (most of the) Showdown databases",
  usage: "",
  adminOnly: true,
  process: (msg, flags) => {
    update();
  }
};
