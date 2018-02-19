#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var server = "amqp://user:password@172.17.0.2:5672/";

amqp.connect(server, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'all-queues';

    //ch.assertQueue(q, {durable: true});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());

      var options = {
        // persistent: false,
        // durable: false,
        autoDelete: false,
        //noAck: false,
        //timestamp: Date.now(),
        contentEncoding: "utf-8",
        contentType: "application/json"
      };
      var temp = JSON.parse(msg.content.toString());
      console.log(temp.queue_name);
    
      //ch.assertQueue(temp.queue_name, options);
      ch.assertExchange(temp.queue_name, 'fanout', {durable: false});
      ch.sendToQueue(temp.queue_name, new Buffer("foo"));

    }, {noAck: true});
  });
});