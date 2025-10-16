const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity
    methods: ['GET', 'POST'],
  },
});

const rooms = { 'General': [] }; // Default room
const users = {}; // { socketId: username }

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Send existing rooms to the new user
  socket.emit('update_rooms', Object.keys(rooms));

  socket.on('join_room', ({ username, room }) => {
    if (!rooms[room]) {
      // Room doesn't exist, maybe handle this case
      return;
    }
    socket.join(room);
    users[socket.id] = { username, room };
    
    // Remove user from old room list if they were in one
    for (const r in rooms) {
        const index = rooms[r].indexOf(username);
        if (index > -1) {
            rooms[r].splice(index, 1);
            io.in(r).emit('update_users', rooms[r]);
        }
    }

    rooms[room].push(username);

    console.log(`${username} joined room: ${room}`);
    // Notify others in the room
    socket.to(room).emit('receive_message', {
      author: 'System',
      message: `${username} has joined the room.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    // Update user list for the room
    io.in(room).emit('update_users', rooms[room]);
  });

  socket.on('create_room', (roomName) => {
    if (!rooms[roomName]) {
      rooms[roomName] = [];
      io.emit('update_rooms', Object.keys(rooms));
      console.log(`Room created: ${roomName}`);
    }
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
    const userData = users[socket.id];
    if (userData) {
      const { username, room } = userData;
      if (rooms[room]) {
        const userIndex = rooms[room].indexOf(username);
        if (userIndex !== -1) {
          rooms[room].splice(userIndex, 1);
          io.in(room).emit('receive_message', {
            author: 'System',
            message: `${username} has left the room.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
          io.in(room).emit('update_users', rooms[room]);
        }
      }
    }
    delete users[socket.id];
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
