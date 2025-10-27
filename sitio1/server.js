import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const ADMIN_PASSWORD = 'password123';

// In-memory data store
let chatRooms = {
  'General': { users: new Set(), messages: [] },
  'Technology': { users: new Set(), messages: [] },
  'Random': { users: new Set(), messages: [] },
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  const emitRooms = () => {
    const roomData = Object.fromEntries(
      Object.entries(chatRooms).map(([name, room]) => [name, { userCount: room.users.size }])
    );
    io.emit('updateRooms', roomData);
  };

  // Send initial room list
  emitRooms();

  socket.on('joinRoom', ({ room, username }) => {
    if (!chatRooms[room]) return;

    // Leave previous rooms
    for (const r in chatRooms) {
      if (chatRooms[r].users.has(username)) {
        chatRooms[r].users.delete(username);
        socket.leave(r);
        io.to(r).emit('updateUsers', Array.from(chatRooms[r].users));
      }
    }
    
    socket.join(room);
    chatRooms[room].users.add(username);

    console.log(`${username} (${socket.id}) joined room: ${room}`);

    // Send message history
    socket.emit('messageHistory', chatRooms[room].messages);
    // Update user list for the room
    io.to(room).emit('updateUsers', Array.from(chatRooms[room].users));
    emitRooms();
  });

  socket.on('sendMessage', ({ room, message, username }) => {
    if (!chatRooms[room]) return;

    const messageData = {
      username,
      message,
      timestamp: new Date().toISOString(),
    };
    chatRooms[room].messages.push(messageData);
    // Keep only the last 100 messages
    if (chatRooms[room].messages.length > 100) {
      chatRooms[room].messages.shift();
    }
    io.to(room).emit('receiveMessage', messageData);
  });

  socket.on('adminLogin', (password) => {
    if (password === ADMIN_PASSWORD) {
      socket.emit('adminAuth', { success: true });
    } else {
      socket.emit('adminAuth', { success: false });
    }
  });

  socket.on('createRoom', ({ roomName, password }) => {
    if (password !== ADMIN_PASSWORD) return;
    if (!chatRooms[roomName]) {
      chatRooms[roomName] = { users: new Set(), messages: [] };
      console.log(`Admin created room: ${roomName}`);
      emitRooms();
    }
  });
  
  socket.on('deleteRoom', ({ roomName, password }) => {
    if (password !== ADMIN_PASSWORD) return;
    if (chatRooms[roomName]) {
      delete chatRooms[roomName];
      io.emit('roomDeleted', roomName);
      console.log(`Admin deleted room: ${roomName}`);
      emitRooms();
    }
  });

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (chatRooms[room]) {
        // This is tricky as we don't have the username on disconnect
        // A better approach would be mapping socket.id to username
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 81;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
