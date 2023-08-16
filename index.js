const express = require('express');
const app = express();
http = require('http');
const cors = require('cors');
const { Server } = require('socket.io'); // Add this

app.use(cors()); // Add cors middleware

const server = http.createServer(app); // Add this

// Add this
// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Add this
// Listen for when the client connects via socket.io-client
io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Listen for 'message' event from clients
    socket.on('message', (message) => {
      // Broadcast the message to all connected clients
      io.emit('message', message);
    });
    socket.on('user-join', ({ username }) => {
        socket.broadcast.emit('message', { text: `${username} joined the chat` });
      });
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

server.listen(5000, () => 'Server is running on port 5000');