const socket = io('http://3.23.96.43:81');

// Elementos del DOM
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username-input');
const joinChatBtn = document.getElementById('join-chat-btn');
const leaveChatBtn = document.getElementById('leave-chat-btn');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message-btn');
const activeUsersCount = document.getElementById('active-users-count');

let currentUser = null;

// Unirse al chat
joinChatBtn.addEventListener('click', joinChat);
usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') joinChat();
});

function joinChat() {
  const username = usernameInput.value.trim();
  
  if (!username) {
    alert('Por favor ingresa tu nombre');
    return;
  }
  
  if (username.length > 20) {
    alert('El nombre no puede tener más de 20 caracteres');
    return;
  }
  
  currentUser = username;
  
  // Cambiar a pantalla de chat
  loginScreen.classList.remove('active');
  chatScreen.classList.add('active');
  
  // Conectar al socket
  socket.emit('join-chat', { username });
  
  // Enfocar el input de mensajes
  messageInput.focus();
}

// Salir del chat
leaveChatBtn.addEventListener('click', () => {
  socket.disconnect();
  window.location.reload();
});

// Enviar mensaje
sendMessageBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const text = messageInput.value.trim();
  
  if (!text) return;
  
  if (text.length > 500) {
    alert('El mensaje no puede tener más de 500 caracteres');
    return;
  }
  
  socket.emit('send-message', { text });
  messageInput.value = '';
}

// Eventos del socket
socket.on('connect', () => {
  console.log('Conectado al servidor AWS');
});

socket.on('chat-history', (history) => {
  chatMessages.innerHTML = '';
  history.forEach(message => {
    addMessageToChat(message);
  });
});

socket.on('new-message', (message) => {
  addMessageToChat(message);
});

socket.on('user-joined', (data) => {
  addSystemMessage(`${data.username} se unió al chat`);
  updateActiveUsers(data.activeUsers);
});

socket.on('user-left', (data) => {
  addSystemMessage(`${data.username} salió del chat`);
  updateActiveUsers(data.activeUsers);
});

// Funciones auxiliares
function addMessageToChat(message) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${message.userId === socket.id ? 'own' : 'other'}`;
  
  const time = new Date(message.timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  messageElement.innerHTML = `
    <div class="message-header">
      <span class="message-username">${message.username}</span>
      <span class="message-time">${time}</span>
    </div>
    <div class="message-text">${escapeHtml(message.text)}</div>
  `;
  
  chatMessages.appendChild(messageElement);
  scrollToBottom();
}

function addSystemMessage(text) {
  const systemElement = document.createElement('div');
  systemElement.className = 'message system-message';
  systemElement.textContent = text;
  
  chatMessages.appendChild(systemElement);
  scrollToBottom();
}

function updateActiveUsers(users) {
  const count = users.length;
  const userText = count === 1 ? '1 usuario activo' : `${count} usuarios activos`;
  activeUsersCount.textContent = userText;
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Manejar reconexión
socket.on('connect', () => {
  if (currentUser) {
    socket.emit('join-chat', { username: currentUser });
  }
});

socket.on('disconnect', () => {
  addSystemMessage('Conexión perdida. Intentando reconectar...');
});

socket.on('connect_error', (error) => {
  console.error('Error de conexión:', error);
  addSystemMessage('Error de conexión con el servidor');
});
