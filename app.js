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
  //fill in given name and date
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

app.post('/ttt/play', function (req, res, next) {
    //check for a winner and return json
    var grid = JSON.parse(req.body.grid);
    var winner = ' ';
    for (var i = 0; i < 9; i++) { //game should continue if there's at least one empty space
        if (grid[i] == " ") {
            winner = '';
        }
    }
    //unless someone has won
    if (grid[0] == grid[1] && grid[1] == grid[2] && grid[0] != " ") { //r0
        winner = grid[0];
    } else if (grid[3] == grid[4] && grid[4] == grid[5] && grid[3] != " ") { //r1
        winner = grid[3];
    } else if (grid[6] == grid[7] && grid[7] == grid[8] && grid[6] != " ") { //r2
        winner = grid[6];
    } else if (grid[0] == grid[3] && grid[3] == grid[6] && grid[0] != " ") { //c0
        winner = grid[0];
    } else if (grid[1] == grid[4] && grid[4] == grid[7] && grid[1] != " ") { //c1
        winner = grid[1];
    } else if (grid[2] == grid[5] && grid[5] == grid[8] && grid[2] != " ") { //c2
        winner = grid[2];
    } else if (grid[0] == grid[4] && grid[4] == grid[8] && grid[0] != " ") { //top left to bottom right
        winner = grid[0];
    } else if (grid[2] == grid[4] && grid[4] == grid[6] && grid[2] != " ") { //top right to bottom left
        winner = grid[2];
    }
    res.json({grid: grid, winner: winner});
});

//start server
app.listen(80, ()=> console.log('Project listening on port 80'));

module.exports = app;
