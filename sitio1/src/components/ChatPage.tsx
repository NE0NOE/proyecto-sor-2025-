import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PlusCircle, Send, Users, Hash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ChatPageProps {
  socket: Socket;
  username: string;
}

interface Message {
  author: string;
  message: string;
  time: string;
}

export default function ChatPage({ socket, username }: ChatPageProps) {
  const [currentRoom, setCurrentRoom] = useState('General');
  const [rooms, setRooms] = useState<string[]>(['General']);
  const [users, setUsers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [isRoomCreateOpen, setIsRoomCreateOpen] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const isAdmin = username.toLowerCase() === 'admin';

  useEffect(() => {
    // Join the default room on initial load
    socket.emit('join_room', { username, room: currentRoom });

    const messageListener = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };
    const roomsListener = (serverRooms: string[]) => {
      setRooms(serverRooms);
    };
    const usersListener = (roomUsers: string[]) => {
      setUsers(roomUsers);
    };

    socket.on('receive_message', messageListener);
    socket.on('update_rooms', roomsListener);
    socket.on('update_users', usersListener);

    return () => {
      socket.off('receive_message', messageListener);
      socket.off('update_rooms', roomsListener);
      socket.off('update_users', usersListener);
    };
  }, [socket, username]);

  useEffect(() => {
    // Auto-scroll to bottom
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        room: currentRoom,
        author: username,
        message: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessage('');
    }
  };

  const createRoom = () => {
    if (newRoomName.trim() && isAdmin) {
      socket.emit('create_room', newRoomName);
      setNewRoomName('');
      setIsRoomCreateOpen(false);
      toast({
        title: "Sala Creada",
        description: `La sala "${newRoomName}" ha sido creada exitosamente.`,
      });
    }
  };

  const switchRoom = (room: string) => {
    if (room !== currentRoom) {
      setMessages([]); // Clear messages from old room
      setCurrentRoom(room);
      socket.emit('join_room', { username, room });
    }
  };

  return (
    <div className="grid h-screen w-screen grid-cols-[260px_1fr] bg-background">
      {/* Sidebar */}
      <div className="flex flex-col border-r border-border bg-card/30 p-4">
        <div className="mb-4 flex items-center gap-3 p-2">
          <Avatar>
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{username}</span>
        </div>
        <Separator />
        <div className="flex-1">
          <div className="my-2 flex items-center justify-between pr-2">
            <h2 className="px-2 text-lg font-semibold tracking-tight">Salas</h2>
            {isAdmin && (
              <Dialog open={isRoomCreateOpen} onOpenChange={setIsRoomCreateOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear una nueva sala</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input
                      placeholder="Nombre de la sala..."
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                    />
                    <Button onClick={createRoom} className="w-full">Crear Sala</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <ScrollArea className="h-[calc(100vh-150px)] pr-2">
            <div className="space-y-1">
              {rooms.map((room) => (
                <Button
                  key={room}
                  variant={currentRoom === room ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => switchRoom(room)}
                >
                  <Hash className="mr-2 h-4 w-4" />
                  {room}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <div>
            <h1 className="text-xl font-bold">{currentRoom}</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-5 w-5" />
            <span>{users.length} {users.length !== 1 ? 'usuarios' : 'usuario'} en línea</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <ScrollArea className="h-[calc(100vh-160px)]" ref={scrollAreaRef}>
            <div className="space-y-6 pr-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    msg.author === username ? 'flex-row-reverse' : '',
                    msg.author === 'System' ? 'justify-center' : ''
                  )}
                >
                  {msg.author !== 'System' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{msg.author.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xs rounded-lg px-4 py-2 lg:max-w-md',
                      msg.author === username ? 'rounded-br-none bg-primary text-primary-foreground' : '',
                      msg.author !== username && msg.author !== 'System' ? 'rounded-bl-none bg-card' : '',
                      msg.author === 'System' ? 'text-xs text-muted-foreground italic' : ''
                    )}
                  >
                    {msg.author !== 'System' && msg.author !== username && (
                      <p className="mb-1 text-xs font-semibold text-primary">{msg.author}</p>
                    )}
                    <p className="text-sm break-words">{msg.message}</p>
                    <p className={cn(
                      "mt-1 text-xs",
                      msg.author === username ? 'text-primary-foreground/70' : 'text-muted-foreground',
                      msg.author === 'System' ? 'hidden' : 'block',
                      msg.author === username ? 'text-right' : 'text-left'
                    )}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </main>

        <footer className="border-t border-border p-4">
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <Input
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-10 flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </footer>
      </div>
    </div>
  );
}
