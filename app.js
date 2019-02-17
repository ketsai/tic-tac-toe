var engines = require('consolidate');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();

// view engine setup
app.engine('html', engines.ejs);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/ttt', function(req, res, next){
  res.render('home.html');
});

app.post('/ttt', function(req, res, next){
  if(req.body.name != ''){
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    date = y.toString() + '-' + m.toString() + '-' + d.toString();
    res.render('gametime.html', {name: req.body.name, y: date});
  }else{
    res.render('home.html');
  }
});

app.post('/ttt/play', function(req, res, next){
  var grid = req.body.grid;

  if(grid[0] == grid[1] && grid[1] == grid[2] && grid[0] != " "){
    winner = grid[0];
  }
  console.log("winner was:" + req.body.winner);
  res.json({'uhh':'pls work','winner':'pongo'});
});

//start server
app.listen(80, ()=> console.log('Project listening on port 80'));

module.exports = app;
