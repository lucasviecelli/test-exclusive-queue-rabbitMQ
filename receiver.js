#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var server = "amqp://user:password@172.17.0.2:5672/";

amqp.connect(server, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'foo-queue';

    ch.assertQueue(q, {durable: true, exclusive: true});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
  });
});