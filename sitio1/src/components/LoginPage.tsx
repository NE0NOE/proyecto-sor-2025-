import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Card className="w-[350px] border-primary/20 bg-card/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageSquare size={32} />
          </div>
          <CardTitle>Bienvenido a Bolt Chat</CardTitle>
          <CardDescription>Ingresa tu nombre para comenzar a chatear</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Tu nombre..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10"
              autoFocus
            />
            <Button type="submit" className="w-full" disabled={!username.trim()}>
              Unirse al Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
