'use strict';

const express   = require('express');
const pug       = require('pug');
// const config   = require('./config');

const CONTENT_TYPE = 'Content-Type';
const TEXT_HTML = 'text/html';

const PORT = 3000;

// pre-render
const index = pug.renderFile('./src/index.pug', {
  dist: true,
  // config: config.windowEnv()
});

const server = listen(PORT);

function listen(port) {
  const app = express();

  app.use('/scripts',       express.static('./.dist/scripts'));
  app.use('/stylesheets',   express.static('./src/stylesheets'));
  app.use('/images',        express.static('./src/images'));
  app.use('/app',           express.static('./src/app'));

  // Return 404 for anything with a file extension
  app.use(function fileNotFound(req, res, next) {
    if (req.path.indexOf('.') > -1) {
      res.status(404).send(`${req.path} 404 Not found`);
    } else {
      next();
    }
  });

  // Route remaining requests to index
  app.get('*', (req, res) => {
    res.setHeader(CONTENT_TYPE, TEXT_HTML);
    res.send(index);
  });

  return app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
