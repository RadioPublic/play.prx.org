'use strict';
const express = require('express');
const proxy   = require('express-http-proxy');
const gzip    = require('connect-gzip-static');
const morgan  = require('morgan');
const http    = require('http');
const https   = require('https');
const url     = require('url');
const util    = require('./util');

// dev/dist mode
if (process.argv.length !== 3 || ['dev', 'dist'].indexOf(process.argv[2]) < 0) {
  console.log('Usage: node server.js [dev|dist]');
  process.exit(1);
}
let isDist = process.argv[2] === 'dist';
util.buildIndex(isDist); // throw compilation errors right away

let app = express();
let env = util.readEnv(isDist);
let port = parseInt(process.env.PORT || 4300);
app.use(morgan('combined', { skip: req => !util.isIndex(req.path) }));

// proxy feed requests
app.get('/proxy', function proxyFeed(req, res) {
  res.setHeadersetHeader('Cache-Control', 'public, max-age=30');

  let feedUrl = url.parse(decodeURIComponent(req.query.url));
  let requester = (feedUrl.protocol === 'http:' ? http : https);
  let proxyReq = requester.request(feedUrl.href, (proxyRes) => {
    proxyRes.setEncoding('utf8');
    proxyRes.on('data', (chunk) => res.write(chunk));
    proxyRes.on('close', () => res.end());
    proxyRes.on('end', () => res.end());
  }).on('error', (e) => {
    console.log(e.message);
    res.writeHead(500);
    res.end();
  });
  proxyReq.end();
});

// render embeds with inline player markup, other paths without
app.get('/e', function sendEmbed(req, res) {
  res.setHeader('Content-Type', 'text/html');
  util.buildIndex(isDist, true).then(html => res.send(html));
});
app.use(function sendIndex(req, res, next) {
  if (util.isIndex(req.path)) {
    res.setHeader('Content-Type', 'text/html');
    util.buildIndex(isDist).then(html => res.send(html));
  } else {
    next();
  }
});

// asset serving (static or ng serve'd)
if (isDist) {
  let serveStatic = gzip('dist');
  app.use(function serveAssets(req, res, next) {
    serveStatic(req, res, next);
  });
  app.use(function fileNotFound(req, res, next) {
    res.status(404).send('Not found');
  });
} else {
  util.ngServe(port + 1);
  app.use(proxy(`127.0.0.1:${port + 1}`, {forwardPath: (req, res) => req.url}));
}

// actual listening port
app.listen(port);
console.log('+---------------------------+');
console.log(`| express listening on ${port} |`);
console.log('+---------------------------+\n');
