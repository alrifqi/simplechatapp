// A Node.js server
var server = require('http').Server();

// Requiring the ioredis package
var Redis = require('ioredis');
// A redis client
var redis = new Redis();

// Subscribe to all channels which name complies with the '*' pattern
// '*' means we'll subscribe to ALL possible channels
redis.psubscribe('*');

// Listen for new messages
redis.on('pmessage', function (pattern, channel, message) {
    message = JSON.parse(message);

    // Just to check that things really work
    console.log(message);
    io.emit(channel + ':' + message.event, message.data);
    io.on('connect', function (socket) {
      var username = socket.handshake.query.username;

      // Push the user to the array
      participants.push(username);

      // The "participants" array is now included in the message
      io.emit('user-joined', { username: username, participants: participants });

      socket.on('disconnect', function (socket) {
          // Remove the user to the array
          participants.splice(participants.indexOf(username), 1);

          // The "participants" array is now included in the message
          io.emit('user-left', { username: username, participants: participants });
      });
    });
  
});

// Start the server at http://localhost:3000
server.listen(3000);

// Just to be sure it's working
console.log('Server started');