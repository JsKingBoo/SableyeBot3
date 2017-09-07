'use strict';

const cluster = require('cluster');
const sableye = require('./sableye.js');

if (cluster.isMaster) {
  cluster.fork();

  cluster.on('exit', (code, signal) => {
    if (signal) {
      console.log(`Worker killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`Worker exited with error code: ${code}`);
    } else {
      console.log('Worker ended with no code nor signal');
    }
    setTimeout(() => {
      cluster.fork();
    }, 5000);
  });
}

if (cluster.isWorker) {
  sableye();
}
