import { useState, useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquareCode, SendHorizonal, Hash } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Message {
  username: string;
  message: string;
  timestamp: string;
}

interface Room {
  userCount: number;
}

interface ChatLayoutProps {
  username: string;
}

export default function ChatLayout({ username }: ChatLayoutProps) {
  const [currentRoom, setCurrentRoom] = useState<string>('General');
  const [rooms, setRooms] = useState<Record<string, Room>>({});
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.connect();

    socket.emit('joinRoom', { room: currentRoom, username });

    socket.on('updateRooms', (roomData) => {
      setRooms(roomData);
    });

    socket.on('updateUsers', (userList) => {
      setUsers(userList);
    });

    socket.on('messageHistory', (history) => {
      setMessages(history);
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    
    socket.on('roomDeleted', (deletedRoomName) => {
      if (currentRoom === deletedRoomName) {
        handleRoomChange('General');
      }
    });

    return () => {
      socket.off('updateRooms');
      socket.off('updateUsers');
      socket.off('messageHistory');
      socket.off('receiveMessage');
      socket.off('roomDeleted');
      socket.disconnect();
    };
  }, [username]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);
  
  useEffect(() => {
    socket.emit('joinRoom', { room: currentRoom, username });
    setMessages([]); // Clear messages when changing room
  }, [currentRoom, username]);

  const handleRoomChange = (room: string) => {
    setCurrentRoom(room);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit('sendMessage', { room: currentRoom, message: newMessage, username });
      setNewMessage('');
    }
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen w-full p-4 text-foreground">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 pr-4">
        <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageSquareCode className="text-primary" />
              chisChat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="mb-2 font-semibold text-muted-foreground">Salas</h3>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <ul>
                {Object.entries(rooms).map(([name, room]) => (
                  <li key={name}>
                    <Button
                      variant={currentRoom === name ? 'secondary' : 'ghost'}
                      className="w-full justify-start gap-2"
                      onClick={() => handleRoomChange(name)}
                    >
                      <Hash className="h-4 w-4" />
                      <span className="truncate flex-1 text-left">{name}</span>
                      <span className="text-xs text-muted-foreground">{room.userCount}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>#{currentRoom}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5" />
              <span>{users.length} Users</span>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 p-0 flex flex-col">
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      msg.username === username ? 'justify-end' : ''
                    }`}
                  >
                    {msg.username !== username && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {getInitials(msg.username)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-md ${
                        msg.username === username
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      <p className="font-bold text-sm">{msg.username}</p>
                      <p>{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                     {msg.username === username && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(msg.username)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-primary/20">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${currentRoom}...`}
                  className="flex-1"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="submit" size="icon">
                        <SendHorizonal className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send Message</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </form>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
