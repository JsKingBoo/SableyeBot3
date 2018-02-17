//http://play.pokemonshowdown.com/data/
//https://pokemonshowdown.com/damagecalc/js/data/

var http = require('http');
var fs = require('fs');
const path = require('path');

const SHOWDOWN_DATA_URL = 'http://play.pokemonshowdown.com/data/';
const DATA_DIR = path.resolve(__dirname, '../data/');

var SHOWDOWN_DATA_FILE_NAMES = ['abilities', 'aliases', 'items', 'learnsets', 'moves', 'pokedex', 'pokedex-mini', 'pokedex-mini-bw', 'typechart', 'formats-data'];

var files = [];

for (let i = 0; i < SHOWDOWN_DATA_FILE_NAMES.length; i++) {
  let filename = SHOWDOWN_DATA_FILE_NAMES[i];
  files.push({url: `${SHOWDOWN_DATA_URL}${filename}.js`, file: path.resolve(DATA_DIR, filename + '.js')});
}

function update() {
 
  let saveFile = function(fileId) {
    if (fileId >= files.length) {
      console.log('FINISHED! REBOOTING...');
      process.exit(2);
      return;
    }
    file = files[fileId];
    let fileDir = fs.createWriteStream(file.file);
    http.get(file.url, function(response) {
      response.pipe(fileDir);
      fileDir.on('finish', function() {
        fileDir.close(() => {
          saveFile(fileId + 1);
        });
      }).on('error', function(err) {
        fs.unlink(fileDir);
        console.log(err);
      });
    });
  }
  
  saveFile(0);
}

module.exports = update;