var _ = require('lodash');
var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('server', function () {
    gulp.src('src')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

var request = require('request');
var url = 'https://github.com/suguru03/neo-async/stargazers';
exports.getStar = function(req, res) {
  //res.end(Math.floor(Math.random() * 1000) + '');
  //return;
  request.get(url, function(err, _res, body) {
    var str = _.find(body.split('\n'), function(data) {
      return /class="counter"/.test(data);
    });
    if (!/\d+/.test(str)) {
      return;
    }
    var star = /(\d+)/.exec(str)[0];
    res.end(star);
  });
};

//
var express = require('express');
var app = express();
var http = require('http').Server(app);

['js', 'img'].forEach(function(dir) {
  app.use('/' + dir, express.static('src/' + dir));
});

app.get('/*.md', function(req, res) {
  res.sendfile('src' + req.url);
});

app.get('/', function(req, res) {
  res.sendfile('src/index.html');
});

app.get('/star', exports.getStar);

http.listen(8000);
