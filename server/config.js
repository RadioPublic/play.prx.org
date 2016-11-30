'use strict';
const fs = require('fs');
const dotenv = require('dotenv');

this.windowEnv = function() {
  // pull env key names from env-example
  let exampleText = fs.readFileSync(`${__dirname}/../env-example`);
  let keys = Object.keys(dotenv.parse(exampleText));

  // safe parse .env
  let env = {};
  try {
    let dottext = fs.readFileSync(`${__dirname}/../.env`);
    env = dotenv.parse(dottext);
  } catch (err) {}

  // pull overrides out of process.env and .env
  let envVar = {};
  for (let key of keys) {
    if (process.env[key] !== undefined || (env[key] && env[key] !== '')) {
      let val = process.env[key] || env[key];
      if (val === 'true') {
        envVar[key] = val;
      } else if (val === 'false') {
        envVar[key] = false;
      } else if (isNaN(val) || val == '') {
        envVar[key] = val;
      } else {
        envVar[key] = parseInt(val);
      }
    } else {
      envVar[key] = undefined;
    }
  }

  return envVar;
};
