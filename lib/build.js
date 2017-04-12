'use strict';

var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var brfs = require('brfs');
var b = browserify();
var es2040 = require('es2040');
var indexhtmlify = require('indexhtmlify');
var metadataify = require('metadataify');
var pkgup = require('pkg-up');
var pkg = JSON.parse(fs.readFileSync(pkgup.sync(), 'utf8'));
var injectScript = require('html-inject-script');
var ghCorner = require('github-cornerify');
var injectFonts = require('./inject-fonts');
var injectMathjax = require('./inject-mathjax');

b.add('./lib/production.js');
b.transform('es2040')
b.transform('brfs')
b.bundle()
  .pipe(indexhtmlify())
  .pipe(metadataify(pkg))
  .pipe(injectFonts())
  .pipe(injectMathjax(false))
  .pipe(injectScript(['https://cdn.plot.ly/plotly-latest.js']))
  .pipe(ghCorner())
  .pipe(fs.createWriteStream(path.join(__dirname, '../index.html')))
