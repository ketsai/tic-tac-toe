var express = require('express');
var router = express.Router();
var amqp = require('amqplib/callback_api');

router.post('/listen', function (req, res, next) {
	console.log(req.body);
	var keys = req.body.keys;
	//console.log(keys);
	amqp.connect('amqp://localhost', function (err, conn) {
		conn.createChannel(function (err, ch) {
			var ex = 'hw3';
			ch.assertExchange(ex, 'direct', { durable: false });
			ch.assertQueue('', { exclusive: true }, function (err, q) {
				keys.forEach(function (key) {
					ch.bindQueue(q.queue, ex, key);
				});
				ch.consume(q.queue, function (msg) {
					console.log("Sent msg : '" + msg.content.toString() + "' to " + msg.fields.routingKey);
					res.json({ msg: msg.content.toString() });
				});
			});
		});
	});
});

router.post('/speak', function (req, res, next) {
	var key = req.body.key;
	var msg = req.body.msg;
	amqp.connect('amqp://localhost', function (err, conn) {
		conn.createChannel(function (err, ch) {
			var ex = 'hw3';
			ch.publish(ex, key, new Buffer(msg));
			console.log("Sent msg: " + msg);
			console.log("to key: " + key);
		});
		setTimeout(function () { conn.close(); process.exit(0) }, 500);
	});
	res.end();
});

module.exports = router;
console.log('Rabbitmq routing loaded')