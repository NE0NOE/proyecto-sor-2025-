import { useState, useEffect } from 'react';
import { socket } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Shield, KeyRound, PlusCircle, Trash2 } from 'lucide-react';

interface Room {
  userCount: number;
}

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [rooms, setRooms] = useState<Record<string, Room>>({});

  useEffect(() => {
    socket.connect();
    
    socket.on('adminAuth', ({ success }) => {
      if (success) {
        setIsAuthenticated(true);
        toast.success('Authentication successful!');
      } else {
        toast.error('Authentication failed. Incorrect password.');
      }
    });

    socket.on('updateRooms', (roomData) => {
      setRooms(roomData);
    });

    return () => {
      socket.off('adminAuth');
      socket.off('updateRooms');
      socket.disconnect();
    };
  }, []);

  const handleLogin = () => {
    socket.emit('adminLogin', password);
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      socket.emit('createRoom', { roomName: newRoomName.trim(), password });
      setNewRoomName('');
      toast.info(`Request to create room "${newRoomName.trim()}" sent.`);
    }
  };
  
  const handleDeleteRoom = (roomName: string) => {
    if (confirm(`Are you sure you want to delete the room "${roomName}"?`)) {
      socket.emit('deleteRoom', { roomName, password });
      toast.info(`Request to delete room "${roomName}" sent.`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[350px] bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="text-primary"/> Admin Panel</CardTitle>
            <CardDescription>Enter the admin password to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2"><Shield className="text-primary"/> Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle>Create New Room</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <PlusCircle className="text-muted-foreground" />
              <Input
                placeholder="New room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
              />
            </div>
            <Button onClick={handleCreateRoom} className="w-full">Create Room</Button>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle>Active Rooms</CardTitle>
            <CardDescription>Manage existing chat rooms.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(rooms).map(([name, room]) => (
                <li key={name} className="flex items-center justify-between p-2 bg-secondary rounded">
                  <div>
                    <span className="font-semibold">{name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({room.userCount} users)</span>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteRoom(name)} disabled={name === 'General'}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
