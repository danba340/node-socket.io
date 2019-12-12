'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const cors = require('cors')


server.use(cors())

const io = socketIO(server);

io.on("connection", function(socket) {
  socket.join(socket.handshake.query.sessionId);

  socket.on("paused", function(msg) {
    io.sockets.in(socket.handshake.query.sessionId).emit("paused", msg);
  });

  socket.on("playing", function(msg) {
    io.sockets.in(socket.handshake.query.sessionId).emit("playing", msg);
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
