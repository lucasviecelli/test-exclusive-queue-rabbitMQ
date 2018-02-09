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

function sendMessage(ch){
  channel = ch;

  console.log("sending message");
  var msg = "foooooo";

  var options = {
    persistent: true,
    durable: true,
    autoDelete: false,
    //noAck: false,
    timestamp: Date.now(),
    contentEncoding: "utf-8",
    contentType: "text/plain"
  };

  channel.sendToQueue("foo-queue", new Buffer("work work work"));
  return channel.close();
}

console.log("connecting");
amqplib.connect(server)
  .then(createChannel)
  .then(sendMessage)
  .then(process.exit, reportError);