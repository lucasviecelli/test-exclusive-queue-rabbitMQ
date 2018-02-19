var amqplib = require("amqplib");

var server = "amqp://user:password@172.17.0.2:5672/";

var connection, channel;

function reportError(err){
  console.log("Error :(");
  console.log(err.stack);
  process.exit(1);
}

function createChannel(conn){
  console.log("creating channel");
  connection = conn;
  return connection.createChannel();
}

function sendMessage(channel){
  console.log("sending message");
  var queues = [
    {"queue_name": "h1000-rates-booking", "service": "rate_booking"},
    {"queue_name": "h1000-rates-expedia", "service": "rate_expedia"},
    {"queue_name": "h1000-rates-decolar", "service": "rate_decolar"},
    {"queue_name": "h2000-rates-decolar", "service": "rate_decolar"}
  ]

  var options = {
    persistent: true,
    durable: true,
    autoDelete: false,
    //noAck: false,
    //timestamp: Date.now(),
    contentEncoding: "utf-8",
    contentType: "application/json"
  };

  channel.assertQueue("all-queues", options);

  queues.forEach(function(json){
    channel.sendToQueue("all-queues", new Buffer(JSON.stringify(json)));
  });

  return channel.close();
}

console.log("connecting");
amqplib.connect(server)
  .then(createChannel)
  .then(sendMessage)
  .then(process.exit, reportError);