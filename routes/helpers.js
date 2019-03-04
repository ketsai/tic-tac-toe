var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = {
    // Find who is logged in
    getUserData: async function(req, res) {
        return new Promise(function (resolve, reject) { // Create promise for retrieving user data
            var session = req.cookies.session;
            if (session) {
                db.collection('sessions').findOne({ 'session': session }, function (err, ret) {
                    if (err) return handleError(err);
                    if (ret) {
                        if (ret.expire < Date.now()) { // Session expired, remove from db
                            db.collection('sessions').deleteOne({ 'session': session });
                            res.clearCookie('session');
                            resolve();
                        }
                        db.collection('users').findOne({ 'username': ret.username }, function (err, ret) {
                            if (ret) { // User found
                                resolve(ret);
                            }
                        });
                    } else { // Session not found
                        res.clearCookie('session');
                        resolve();
                    }
                })
            } else { // No session cookie
                resolve();
            }
        });
    },
    // Find current game for user
    findGame: async function (req, res, user) {
        return new Promise(function (resolve, reject) {
            if (user.currentGameID) { //game in progress
                db.collection('games').findOne({ 'ID': user.currentGameID }, function (err, ret) {
                    //console.log("game found: ");
                    //console.log(ret.grid);
                    resolve(ret.grid);
                });
            } else { //start new game
                db.collection('global_variables').findOne({ 'ID_INCREMENTER': true }, function (err, ret) {
                    if (ret) { // Incrementer found
                        console.log("making new game");
                        var date = new Date();
                        var newDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
                        db.collection('games').insertOne({ 'ID': ret.GLOBAL_GAME_ID, 'start_date': newDate, 'user': user.username, 'grid': [" ", " ", " ", " ", " ", " ", " ", " ", " "], 'winner': '' }) //new game
                        db.collection('users').updateOne({ 'username': user.username }, { $set: { 'currentGameID': ret.GLOBAL_GAME_ID } }); //update user's current game to be the new one
                        db.collection('global_variables').updateOne({ 'ID_INCREMENTER': true }, { $set: { 'GLOBAL_GAME_ID': (parseInt(ret.GLOBAL_GAME_ID) + 1) } }); //increment next game's ID
                    }
                });
            }
        });
    },
    //List games previously played by the specified user
    listGames: async function (req, res, user) {
        return new Promise(function (resolve, reject) {
            var games = new Array();
            db.collection('games').find({ 'user': user.username }).count(function (err, count) {
                if (count > 0) {
                    db.collection('games').find({ 'user': user.username }, function (err, ret) {
                        ret.on('data', function (doc) {
                            games.push({ 'id': doc.ID, 'start_date': doc.start_date });
                        });
                        ret.on('close', function (doc) {
                            resolve(games);
                        });
                    });
                } else {
                    resolve();
                }
            });
        });
    },
    //Get game by id number
    getGame: async function (req, res, user, id) {
        return new Promise(function (resolve, reject) {
            db.collection('games').findOne({ 'ID': parseInt(id), 'user': user.username, }, function (err, ret) {
                if (ret) {
                    resolve({ 'grid': ret.grid, 'winner': ret.winner });
                } else {
                    resolve("game not found");
                }
            });
        });
    },
    //Get total score for user
    getScore: async function (req, res, user) {
        return new Promise(function (resolve, reject) {
            var human = 0;
            var wopr = 0;
            var tie = 0;
            db.collection('games').find({ 'user': user.username }).count(function (err, count) {
                if (count > 0) {
                    db.collection('games').find({ 'user': user.username }, function (err, ret) {
                        ret.on('data', function (doc) {
                            if (doc.winner == 'O') {
                                wopr += 1;
                            } else if (doc.winner == 'X') {
                                human += 1;
                            } else if (doc.winner == ' ') {
                                tie += 1;
                            }
                        });
                        ret.on('close', function (doc) {
                            resolve({ human: human, wopr: wopr, tie: tie });
                        });
                    });
                } else {
                    resolve();
                }
            });
        });
    }
}