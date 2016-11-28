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
  let envVar = {"sample": "works"};
  for (let key of keys) {
    if (process.env[key] !== undefined || (env[key] && env[key] !== '')) {
      let val = process.env[key] || env[key];
      if (['true', 'false', 'null', 'undefined'].indexOf(val) > -1) {
        val = val;
      } else if (isNaN(val) || val == '') {
        val = `'${val}'`;
      } else {
        val = val;
      }
      envVar[key] = val
    }
  }

  // remove the old dotenv.js, just in case
  try {
    fs.unlinkSync(`${__dirname}/../dist/assets/dotenv.js`);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  return envVar;
};
