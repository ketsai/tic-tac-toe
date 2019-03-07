var express = require('express');
var router = express.Router();
var amqp = require('amqplib/callback_api');

router.post('/listen', function (req, res, next) {
	var keys = req.body.keys;
	if (keys.length > 0) {
		amqp.connect('amqp://localhost', function (err, conn) {
			conn.createChannel(function (err, ch) {
				var ex = 'hw3';
				ch.assertExchange(ex, 'direct', { durable: false });
				ch.assertQueue('', { exclusive: true }, function (err, q) {
					keys.forEach(function (key) {
						ch.bindQueue(q.queue, ex, key);
						console.log("Listening on key=" + key);
					});
					ch.consume(q.queue, function (msg) {
						console.log("Sent msg : '" + msg.content.toString() + "' to " + msg.fields.routingKey);
						res.json({ msg: msg.content.toString() });
						setTimeout(function () { conn.close() }, 500);
					}, { noAck: true });
				});
			});
		});
	}
});

router.post('/speak', function (req, res, next) {
	var key = req.body.key;
	var msg = req.body.msg;
	amqp.connect('amqp://localhost', function (err, conn) {
		conn.createChannel(function (err, ch) {
			var ex = 'hw3';
			console.log("Speaking: '" + msg + "' to key=" + key);
			ch.publish(ex, key, new Buffer(msg));
		});
		setTimeout(function () { conn.close() }, 500);
	});
	res.end();
});

module.exports = router;
console.log('Rabbitmq routing loaded')