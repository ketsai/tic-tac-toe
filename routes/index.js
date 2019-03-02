var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('home.html');
});

router.get('/ttt', function (req, res, next) {
    res.render('home.html');
});

router.get('/adduser', function (req, res, next) {
    res.render('adduser.html');
});

router.get('/login', function (req, res, next) {
    res.render('login.html');
});

module.exports = router;
console.log('Index routing loaded')