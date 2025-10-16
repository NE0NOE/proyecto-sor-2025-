import { useState } from 'react';
import ChatPage from './components/ChatPage';
import LoginPage from './components/LoginPage';
import { Toaster } from '@/components/ui/toaster';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (name: string) => {
    if (name.trim()) {
      setUsername(name);
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="dark h-screen w-screen overflow-hidden bg-background text-foreground">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <ChatPage socket={socket} username={username} />
      )}
      <Toaster />
    </div>
  );
}

export default App;
