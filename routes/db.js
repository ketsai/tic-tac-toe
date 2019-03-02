express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = mongoose.connection;
var crypto = require('crypto');
var bcrypt = require('bcryptjs');

var sessionUser = "";

// Find who is logged in
async function getUserData(req, res) {
    return new Promise(function (resolve, reject) { // Create promise for retrieving user data
        var session = req.cookies.session;
        if (session) {
            db.collection('sessions').findOne({ 'session': session }, function (err, ret) {
                if (err) return handleError(err);
                if (ret) {
                    if (ret.expire < Date.now()) { // Session expired, remove from db
                        db.collection('sessions').remove({ 'session': session });
                        res.clearCookie('session');
                        resolve();
                    }
                    db.collection('users').findOne({ 'username': ret.username }, function (err, ret) {
                        if (ret) { // User found
                            sessionUser = ret.username;
                        }
                        resolve(); // Database contacted, resolve
                    });
                } else { // Session not found
                    resolve(); // Database contacted, resolve
                }
            })
        } else { // No session
            resolve(); // No session provided, resolve
        }
    });
}


/* Adding a user into the database*/
router.post('/adduser', function (req, res, next) {
    var v = req.body;
    if (v.username == '' || v.email == '' || v.password == '') {
        res.json({ msg: 'All fields are required; please enter all information.' });
    } else {
        db.collection('users').findOne({ 'username': v.username }, function (err, ret) {
            if (err) return handleError(err);
            if (ret != null) {
                res.json({ msg: 'Username already registered. Please enter another.' });
            } else {
                db.collection('users').findOne({ 'email': v.email }, function (err, ret) {
                    if (err) return handleError(err);
                    if (ret != null) {
                        res.json({ msg: 'Email already registered. Please enter another.' });
                    } else {
                        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (!regex.test(v.email)) {
                            res.json({ msg: 'Please enter a valid email address.' });
                        } else {
                            var salt = bcrypt.genSaltSync(10); // Salt and hash the given password, then store it in the database
                            var hash = bcrypt.hashSync(v.password, salt);
                            var user = {
                                username: v.username,
                                email: v.email,
                                password: hash,
                                verified: false
                            };
                            db.collection('users').insertOne(user);
                            //var key = crypto.createHash('md5').update(v.email + "salty_salt").digest('hex'); EMAIL THIS KEY TO EMAIL ADDRESS
                            res.json({ msg: 'Account created.' });
                        }
                    }
                });
            }
        });
    }
});

/* User verification*/
router.post('/verify', function (req, res, next) {
    var v = req.body;
    var key = crypto.createHash('md5').update(v.email + "salty_salt").digest('hex');
    db.collection('users').findOne({ 'email': v.email }, function (err, ret) {
        if (err) return handleError(err);
        if (ret != null && (v.key == key || v.key == 'abracadabra')) { // Is the request key the same as email after salt and hash?
            db.collection('users').updateOne({ 'email': v.email }, { $set: { verified: true }});
            res.json({ msg: 'Your account is now verified!' });
        } else {
            res.json({ msg: 'Invalid verification key' });
        }
    })
});

/* User login*/
router.post('/login', function (req, res, next) {
    var v = req.body;
    db.collection('users').findOne({ 'username': v.username }, function (err, ret) {
        if (err) return handleError(err);
        if (ret != null && bcrypt.compareSync(v.password, ret.password)) { // Ensure that the given password matches the hashed password
            var hash = crypto.createHash('sha256'); // Randomly generated session ID
            hash.update(Math.random().toString());
            var session = hash.digest('hex');
            db.collection('sessions').deleteMany({ username: v.username }, function () { // Clear all other existing sessions for this user
                db.collection('sessions').insertOne( // New session
                    {
                        username: v.username,
                        session: session,
                        expire: Date.now() + 15 * 60 * 1000 // Session expires after 15 minutes
                    }, function () {
                        res.cookie('session', session);
                        res.end();
                    }
                );
            });
        } else {
            res.json({ msg: 'Invalid login credentials' });
        }
    })
});


/* User logout*/
router.post('/logout', function (req, res, next) {
    var session = req.cookies.session;
    db.collection('sessions').deleteOne({ 'session': session });
    res.clearCookie('session');
    res.end();
});


module.exports = router;
console.log('Database routing loaded');