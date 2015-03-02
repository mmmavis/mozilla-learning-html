var Readable = require('stream').Readable;
var path = require('path');
var util = require('util');
var File = require('vinyl');

require('node-jsx').install();

var indexStatic = require('./index-static.jsx');

function IndexFileStream(indexStatic) {
  Readable.call(this, {
    objectMode: true
  });
  this._baseDir = __dirname;
  this._indexStatic = indexStatic;
  this._urls = indexStatic.URLS.slice();
}

util.inherits(IndexFileStream, Readable);

IndexFileStream.prototype._read = function() {
  if (this._urls.length == 0)
    return this.push(null);
  var url = this._urls.pop();
  var indexFile = path.join(
    this._baseDir,
    path.join.apply(path, url.split('/').slice(1, -1)),
    'index.html'
  );
  this.push(new File({
    cwd: this._baseDir,
    base: this._baseDir,
    path: indexFile,
    contents: new Buffer(this._indexStatic.generate(url, {
      baseURL: path.posix.relative(url, '/')
    }))
  }));
};

module.exports = function() {
  return new IndexFileStream(indexStatic);
};
