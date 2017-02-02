'use strict';
const dotenv = require('dotenv');
const fs     = require('fs');
const pug    = require('pug');
const spawn  = require('child_process').spawn

/**
 * Read dotenv (.env + ENV)
 */
exports.readEnv = () => {
  let exampleText = fs.readFileSync(`${__dirname}/../env-example`);
  let exampleKeys = Object.keys(dotenv.parse(exampleText));

  let dots = {};
  try {
    let dottext = fs.readFileSync(`${__dirname}/../.env`);
    dots = dotenv.parse(dottext);
  } catch (err) {}

  let env = {};
  for (let key of exampleKeys) {
    if (process.env[key] !== undefined || (dots[key] && dots[key] !== '')) {
      let val = process.env[key] || dots[key];
      if (val === 'true') {
        env[key] = true;
      } else if (val === 'false') {
        env[key] = false;
      } else if (isNaN(val) || val == '') {
        env[key] = val;
      } else {
        env[key] = parseInt(val);
      }
    } else {
      env[key] = undefined;
    }
  }
  return env;
};

/**
 * Find the script tags to include
 */
exports.findScripts = (isDist) => {
  let scripts = [];
  if (isDist) {
    let files = [];
    try { files = fs.readdirSync(`${__dirname}/../dist`); } catch (e) {}
    scripts.push(files.find(f => f.match(/^vendor\..+\.bundle\.js$/)));
    scripts.push(files.find(f => f.match(/^main\..+\.bundle\.js$/)));
    scripts = scripts.filter(f => f ? true : false);
    if (scripts.length !== 2) {
      console.error('ERROR: could not find built scripts in ./dist/');
      console.error('       did you forget to run npm build?');
      process.exit(1);
    }
  } else {
    scripts.push('vendor.bundle.js', 'main.bundle.js');
  }
  return scripts;
};

/**
 * Compile the index
 */
let cachedEnv = null, cachedScripts = null, cachedFn = null, cachedCss, cachedInline;
exports.buildIndex = (isDist) => {
  cachedEnv = (isDist && cachedEnv) ? cachedEnv : exports.readEnv();
  cachedScripts = (isDist && cachedScripts) ? cachedScripts : exports.findScripts(isDist);
  cachedCss = (isDist && cachedCss) ? cachedCss : exports.getInlineCss(isDist);
  cachedInline = (isDist && cachedInline) ? cachedInline : exports.getInlineJs(isDist);
  cachedFn = (isDist && cachedFn) ? cachedFn : pug.compileFile(`${__dirname}/../src/index.pug`);
  return cachedFn({inlineJs: cachedInline, css: cachedCss, env: cachedEnv, scripts: cachedScripts, gaKey: cachedEnv.GA_KEY});
};

/**
 * Determine if a request looks like a path (vs a file)
 */
exports.isIndex = (path) => {
  if (path === '/' || path === '/index.html') {
    return true;
  } else if (path.match(/^\/proxy/)) {
    return false;
  } else {
    let lastToken = path.substr(path.lastIndexOf('/') + 1).split(/\?|;/)[0];
    return lastToken.indexOf('.') === -1;
  }
};

exports.getInlineCss = (isDist) => {
  if (isDist) {
    let files = [];
    try { files = fs.readdirSync(`${__dirname}/../dist`); } catch (e) {}
    let cssFile = files.find(f => f.match(/^styles\..+\.bundle\.css$/));
    if (cssFile) {
      return `<style>${fs.readFileSync(`${__dirname}/../dist/${cssFile}`)}</style>`;
    }
  } else {
    return '<link rel="stylesheet" href="style.bundle.css" />';
  }
}


exports.getInlineJs = (isDist) => {
  if (isDist) {
    let files = [];
    try { files = fs.readdirSync(`${__dirname}/../dist`); } catch (e) {}
    let inlineFile = files.find(f => f.match(/^inline\..+\.bundle\.js$/));
    if (inlineFile) {
      return `<script>${fs.readFileSync(`${__dirname}/../dist/${inlineFile}`)}</script>`;
    }
  } else {
    return '<script src="inline.bundle.js"></script>';
  }
}
/**
 * Spawn a process to run ng serve
 */
exports.ngServe = (port) => {
  let ng = `${__dirname}/../node_modules/.bin/ng`;
  return spawn(ng, ['serve', '--port', port], {stdio: 'inherit'});
};
