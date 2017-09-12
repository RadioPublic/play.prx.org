'use strict';
const dotenv    = require('dotenv');
const fs        = require('fs');
const pug       = require('pug');
const spawn     = require('child_process').spawn
const inlineCss = require('inline-css');
const cheerio   = require('cheerio');
const mediaQ    = require('siphon-media-query');

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
    scripts.push(files.find(f => f.match(/^polyfills\..+.bundle\.js$/)));
    scripts.push(files.find(f => f.match(/^vendor\..+\.bundle\.js$/)));
    scripts.push(files.find(f => f.match(/^main\..+\.bundle\.js$/)));
    scripts = scripts.filter(f => f ? true : false).map(f => `/${f}`);
    if (scripts.length !== 3) {
      console.error('ERROR: could not find built scripts in ./dist/');
      console.error('       did you forget to run npm build?');
      process.exit(1);
    }
  } else {
    scripts.push('polyfills.bundle.js', 'styles.bundle.js', 'vendor.bundle.js', 'main.bundle.js');
  }
  return scripts;
};

/**
 * Compile the index
 */
exports.buildIndex = (isDist, includeLoadingMarkup = false) => {
  let tpl = cache('html', isDist, () => pug.compileFile(`${__dirname}/../src/index.pug`));
  let data = {
    js:      cache('js',      isDist, () => exports.getInlineJs(isDist)),
    scripts: cache('scripts', isDist, () => exports.findScripts(isDist)),
    css:     cache('css',     isDist, () => exports.getInlineCss(isDist)),
    env:     cache('env',     isDist, () => exports.readEnv())
  };

  if (includeLoadingMarkup) {
    let loading = cache('loading', isDist, () => exports.getLoadingMarkup(isDist, data.env.LOGO_NAME));
    return loading.then(markup => {
      data.loadingMarkup = markup;
      return tpl(data);
    });
  } else {
    return Promise.resolve(tpl(data));
  }
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
    return '';
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

exports.getLoadingMarkup = (isDist, logoName) => {
  if (isDist) {
    return inlineLoadingPlayer("../dist/app/shared/player/player.component.css", "../dist/app/shared/player/player.component.html", logoName);
  } else {
    return inlineLoadingPlayer("../src/app/shared/player/player.component.css", "../src/app/shared/player/player.component.html", logoName);
  }
}

/**
 * Spawn a process to run ng serve
 */
exports.ngServe = (port) => {
  let ng = `${__dirname}/../node_modules/.bin/ng`;
  return spawn(ng, ['serve', '--port', port], {stdio: 'inherit'});
};

function inlineLoadingPlayer(cssPath, htmlPath, logoName) {
  const cssContent = fs.readFileSync(`${__dirname}/${cssPath}`).toString('utf-8');
  const mediaQueries = mediaQ(cssContent).replace(/;/g,' !important;').replace(/\s+/g,' ').replace(/\s?([\{\},:\(\)])\s?/g, '$1').replace(/;\s?\}/g, '}');
  return inlineCss(`<style>${cssContent}</style>
    <div class="loadingRender">${fs.readFileSync(`${__dirname}/${htmlPath}`)}</div>
    `, {url: '/'}).then((markup) => {
    const $ = cheerio.load(markup, {normalizeWhitespace: true});
    scrub($, $('.loadingRender').children(), logoName);
    return `<style>${mediaQueries}</style>${$('.loadingRender').html()}`;
  });
}

const CACHED = {};
function cache(key, useCached, cacheFn) {
  if (useCached && CACHED[key]) {
    return CACHED[key];
  } else {
    return CACHED[key] = cacheFn();
  }
}

function scrub($, elems, logoName) {
  elems.each(function () {
    scrubElem($, $(this), logoName);
  });
}

function scrubElem($, elem, logoName) {
  if (elem[0].type === 'comment') {
    elem.remove();
    return;
  }
  if (elem[0].type === 'text') {
    if (/^[\s\n]*$/.test(elem.text())) {
      elem.remove();
    } else {
      elem[0].data = "";
    }
    return;
  }
  for (let key of Object.keys(elem.attr())) {
    if (logoName && key === "[src]" && elem.attr(key) === "logoSrc") {
      elem.attr("src", `/assets/images/${logoName}-logo.svg`);
    }

    if (key === '*ngif' && elem.attr(key) !== 'logoSrc' && elem.attr(key) !== 'player.paused' && elem.attr(key) !== 'subscribeUrl') {
      elem.remove();
    }

    if (/^\[|\*|\(/i.test(key)) {
      elem.attr(key, null);
    }
  };
  scrub($, elem.contents(), logoName);
}
