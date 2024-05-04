const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New user connected');

    // Event listener for chat messages
    socket.on('chat message', (msg) => {
        console.log("Chat message received:", msg);
        io.emit('chat message', msg);  // Emitting to all clients
    });

    // Event listener for 'message read' events
    socket.on('message read', () => {
        console.log("Client has read the message");
        io.emit('message read');  // Notify all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
