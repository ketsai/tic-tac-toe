var express = require('express');
var router = express.Router();
var amqp = require('amqplib/callback_api');

router.post('/listen', function (req, res, next) {
	var keys = req.body.keys;
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
					conn.close();
				});
			});
		});
		res.end();
	});
});

router.post('/speak', function (req, res, next) {
	var key = req.body.key;
	var msg = req.body.msg;
	amqp.connect('amqp://localhost', function (err, conn) {
		conn.createChannel(function (err, ch) {
			var ex = 'hw3';
			console.log("Speak: '" + msg + "' to key=" + key);
			ch.publish(ex, key, new Buffer(msg));
			conn.close();
		});
	});
	res.end();
});

module.exports = router;
console.log('Rabbitmq routing loaded')