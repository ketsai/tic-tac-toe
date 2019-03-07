var express = require('express');
var router = express.Router();
var amqp = require('amqplib/callback_api');
var helper = require('./helpers.js');
var conn;

amqp.connect('amqp://localhost', function (err, con) {
    conn = con;
});


router.post('/listen', function (req, res, next) {
	var keys = req.body.keys;
	conn.createChannel(function (err, ch) {
		var ex = 'hw3';
		ch.assertExchange(ex, 'direct', { durable: false });
		ch.assertQueue('', { exclusive: true }, async function (err, q) {
			keys.forEach(function (key) {
				ch.bindQueue(q.queue, ex, key);
				console.log("Listening on key=" + key);
			});
            let msg = await helper.listen(ch, q);
            if (msg) {
                res.json({ msg: msg });
            } else {
                res.end();
            }
            ch.close();
        });
    });
});

router.post('/speak', function (req, res, next) {
	var key = req.body.key;
	var msg = req.body.msg;
	conn.createChannel(function (err, ch) {
	    var ex = 'hw3';
		console.log("Speak: '" + msg + "' to key=" + key);
		ch.assertExchange(ex, 'direct', { durable: false });
        ch.publish(ex, key, new Buffer.from(msg));
        ch.close();
	});
	res.end();
});

module.exports = router;
console.log('Rabbitmq routing loaded')