var express = require('express');
var router = express.Router();
var helper = require('./helpers.js');

var NEWGRID = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

function checkWinner(grid) {
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
    return winner;
}

router.post('/ttt/play', async function (req, res, next) {
    //check for a winner and return json
    let user = await helper.getUserData(req, res);
    var move = req.body.move;
    var grid;
    if (user.currentGameID > -1) { //game in progress
        db.collection('games').findOne({ 'ID': user.currentGameID }, function (err, ret) {
            grid = ret.grid;
        }
    } else { //no game in progress; make a new one
        db.collection('games').findOne({ 'ID_INCREMENTER': true }, function (err, ret) {
            if (ret) { // Incrementer found
                var newDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
                db.collection('games').insertOne({ 'ID': ret.GLOBAL_GAME_ID, 'start_date': newDate, 'user': user.username, 'grid': NEWGRID, 'winner': '' }) //new game
                db.collection('users').updateOne({ 'username': user.username }, { $set: { 'currentGameID': ret.GLOBAL_GAME_ID } }); //update user's current game to be the new one
                db.collection('games').updateOne({ 'ID_INCREMENTER': true }, { $set: { 'GLOBAL_GAME_ID': (ret.GLOBAL_GAME_ID + 1) } }); //increment next game's ID
                grid = NEWGRID;
            } 
        });
    }
    if (move) { //valid move was made
        grid[move] = "O";
        var winner = checkWinner(grid); //X if X won, O if O won, empty string if no winner, space if tie
        if (winner != '') {
            res.json({ status: "OK", grid: grid, winner: winner });
        } else { //no winner yet
            var randomCell;
            while (grid[randomCell] != " ") {
                randomCell = Math.floor(Math.random() * 9);
                console.log("randomly selected cell: " + randomCell.toString());
            }
            grid[randomCell] = "X";
            winner = checkWinner(grid);
            if (winner != '') { //no winner; return grid
                res.json({ status: 'OK'});
            } else { //tie or computer win; return grid, winner, update database game + user currentgame

            }
        }
    } else { //no move; just return current grid
        db.collection('games').findOne({ 'id': user.currentGameID }, function (err, ret) {
            if (ret) { // Game found
                res.json({ status: "OK", grid: ret.grid });
            } else {
                res.json({ status: "ERROR" });
            }
        });
    }

    //function botTurn(serverResponse) {
    //    if (serverResponse.winner == ' ') {
    //        $("#winner").html("Tie game");
    //    } else if (serverResponse.winner != '') {
    //        $("#winner").html(serverResponse.winner + " wins!");
    //    } else {
    //        var randomCell;
    //        while (gridArray[randomCell] != " ") {
    //            randomCell = Math.floor(Math.random() * 9);
    //            console.log("randomly selected cell: " + randomCell.toString());
    //        }
    //        $("#cell" + randomCell.toString()).html("X");
    //        gridArray[randomCell] = "X";
    //        $.ajax({
    //            data: { grid: JSON.stringify(gridArray) },
    //            url: "/ttt/play",
    //            method: "POST",
    //            success: function (response) {
    //                if (response.winner != '') {
    //                    $("#winner").html(response.winner + " wins!");
    //                }
    //            }
    //        });
    //    }
    //}
    /////////////////////////////////////////////
    //res.json({ grid: grid, winner: winner });
});

module.exports = router;
console.log('Tic-tac-toe routing loaded')