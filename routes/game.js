var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = mongoose.connection;
var helper = require('./helpers.js');

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
    let grid = await helper.findGame(req, res, user);
    var move = req.body.move;
    if (move && move != null) { //valid move was made
        grid[parseInt(move)] = "X";
        var winner = checkWinner(grid); //X if X won, O if O won, empty string if no winner, space if tie
        if (winner && winner != '') {
            db.collection('games').updateOne({ 'ID': user.currentGameID }, { $set: { 'winner': winner, 'grid': grid } });
            db.collection('users').updateOne({ 'username': user.username }, { $set: { 'currentGameID': -1 } });
            res.json({ status: "OK", grid: grid, winner: winner });
        } else { //no winner yet
            var randomCell;
            while (grid[randomCell] != " ") {
                randomCell = Math.floor(Math.random() * 9);
                //console.log("randomly selected cell: " + randomCell.toString());
            }  
            grid[randomCell] = "O";
            winner = checkWinner(grid);
            if (winner && winner != '') { //return winner, update db
                db.collection('games').updateOne({ 'ID': user.currentGameID }, { $set: { 'winner': winner, 'grid': grid } });
                db.collection('users').updateOne({ 'username': user.username }, { $set: { 'currentGameID': -1 } });
                res.json({ status: 'OK', grid: grid, winner: winner });
            } else { //no winner; return grid
                db.collection('games').updateOne({ 'ID': user.currentGameID }, { $set: { 'grid': grid } });
                res.json({ status: 'OK', grid: grid });
            }
        }
    } else { //no move; just return current grid
        db.collection('games').findOne({ 'ID': user.currentGameID }, function (err, ret) {
            if (ret) { // Game found
                console.log("No move");
                res.json({ status: "OK", grid: ret.grid });
            } else {
                res.json({ status: "ERROR" });
            }
        });
    }
});

router.post('/listgames', async function (req, res, next) {
    let user = await helper.getUserData(req, res);
    if (user) {
        let games = await helper.listGames(req, res, user);
        if (games) {
            res.json({ status: "OK", games: games });
        } else {
            res.json({ status: "OK", games: [], msg: "No games found" });
        }
    } else {
        res.json({ status: "ERROR", msg: "Please log in to a verified account." });
    }
});

router.post('/getgame', async function (req, res, next) {
    let user = await helper.getUserData(req, res);
    if (user) {
        let game = await helper.getGame(req, res, user, req.body.id);
        if (game != "game not found") {
            res.json({ status: "OK", grid: game.grid, winner: game.winner });
        } else {
            res.json({ status: "ERROR", msg: "You did not play a game with this ID." });
        }
    } else {
        res.json({ status: "ERROR", msg: "Please log in to a verified account." });
    }
});

router.post('/getscore', async function (req, res, next) {
    let user = await helper.getUserData(req, res);
    if (user) {
        let score = await helper.getScore(req, res, user);
        if (score) {
            res.json({ status: "OK", human: score.human, wopr: score.wopr, tie: score.tie });
        } else {
            res.json({ status: "OK", human: 0, wopr: 0, tie: 0, msg: "No games found" });
        }
    } else {
        res.json({ status: "ERROR", msg: "Please log in to a verified account." });
    }
});

module.exports = router;
console.log('Tic-tac-toe routing loaded')