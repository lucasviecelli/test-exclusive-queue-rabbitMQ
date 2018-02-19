#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var server = "amqp://user:password@172.17.0.2:5672/";

amqp.connect(server, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'h1000-rates-booking';

    ch.assertExchange(ex, 'fanout', {durable: false});

    ch.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      ch.bindQueue(ex, ex, '');

      ch.consume(ex, function(msg) {
        console.log(" [x] %s", msg.content.toString());
      }, {noAck: true});
    });
  });
});