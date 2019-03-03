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
    }
}