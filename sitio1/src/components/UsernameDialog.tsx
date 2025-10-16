import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquareCode } from 'lucide-react';

interface UsernameDialogProps {
  onUsernameSet: (username: string) => void;
}

export default function UsernameDialog({ onUsernameSet }: UsernameDialogProps) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onUsernameSet(name.trim());
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px] bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <MessageSquareCode className="text-primary" />
            Welcome to chisChat
          </DialogTitle>
          <DialogDescription>
            Please choose a username to join the conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Username
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={!name.trim()}>
            Join Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
