import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Almacenamiento en memoria (se borra cuando el servidor se reinicia)
let activeUsers = new Map();
let messages = [];

app.use(express.static(join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Health check para AWS
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    activeUsers: activeUsers.size,
    messageCount: messages.length,
    timestamp: new Date().toISOString()
  });
});

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join-chat', (userData) => {
    const { username } = userData;
    
    // Guardar usuario
    activeUsers.set(socket.id, {
      id: socket.id,
      username,
      joinedAt: new Date()
    });

    // Enviar mensajes existentes al nuevo usuario
    socket.emit('chat-history', messages);
    
    // Notificar a todos que un usuario se unió
    io.emit('user-joined', {
      username,
      activeUsers: Array.from(activeUsers.values())
    });

    console.log(`${username} se unió al chat. Usuarios activos: ${activeUsers.size}`);
  });

  socket.on('send-message', (messageData) => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now().toString(),
      username: user.username,
      text: messageData.text,
      timestamp: new Date(),
      userId: socket.id
    };

    messages.push(message);
    
    // Enviar mensaje a todos los usuarios
    io.emit('new-message', message);
  });

  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    
    if (user) {
      activeUsers.delete(socket.id);
      
      // Si no hay usuarios activos, borrar todos los mensajes
      if (activeUsers.size === 0) {
        messages = [];
        console.log('Todos los usuarios salieron. Mensajes borrados.');
      } else {
        // Notificar que un usuario salió
        io.emit('user-left', {
          username: user.username,
          activeUsers: Array.from(activeUsers.values())
        });
      }
    }

    console.log('Usuario desconectado:', socket.id);
    console.log('Usuarios activos restantes:', activeUsers.size);
  });
});

const PORT = process.env.PORT || 81;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor ejecutándose en http://${HOST}:${PORT}`);
  console.log(`📱 Accesible desde: http://3.23.96.43:81`);
  console.log(`🏥 Health check disponible en: http://3.23.96.43:81/health`);
});
