import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Users, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system';
}

interface User {
  id: string;
  name: string;
  isOnline: boolean;
  avatar?: string;
}

interface ChatPanelProps {
  currentUser: { id: string; name: string };
  roomId: string;
}

export const ChatPanel = ({ currentUser, roomId }: ChatPanelProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "sys-1",
      userId: "system",
      userName: "System",
      message: `Welcome to room ${roomId}! Start collaborating and coding together.`,
      timestamp: new Date(Date.now() - 300000),
      type: 'system'
    },
    {
      id: "msg-1",
      userId: "user-456",
      userName: "Alice",
      message: "Hey everyone! Ready to work on this project?",
      timestamp: new Date(Date.now() - 240000),
      type: 'message'
    },
    {
      id: "msg-2",
      userId: "user-789",
      userName: "Bob",
      message: "Absolutely! I've been looking at the requirements. Should we start with the component structure?",
      timestamp: new Date(Date.now() - 180000),
      type: 'message'
    },
    {
      id: "msg-3",
      userId: "user-456",
      userName: "Alice",
      message: "Good idea! I think we should create a modular approach. What do you think about using TypeScript?",
      timestamp: new Date(Date.now() - 120000),
      type: 'message'
    }
  ]);

  const [users] = useState<User[]>([
    { id: currentUser.id, name: currentUser.name, isOnline: true },
    { id: "user-456", name: "Alice", isOnline: true },
    { id: "user-789", name: "Bob", isOnline: true },
    { id: "user-101", name: "Charlie", isOnline: false },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate receiving messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) { // 15% chance every 3 seconds
        const sampleMessages = [
          "Looking good so far!",
          "I made some changes to the function on line 23",
          "Can you check the console? I'm getting an error",
          "Nice work on that component!",
          "Should we add error handling here?",
          "The design is coming together nicely",
        ];
        
        const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        const randomUser = users.filter(u => u.id !== currentUser.id && u.isOnline)[Math.floor(Math.random() * 2)];
        
        if (randomUser) {
          const newMessage: Message = {
            id: `msg-${Date.now()}`,
            userId: randomUser.id,
            userName: randomUser.name,
            message: randomMessage,
            timestamp: new Date(),
            type: 'message'
          };
          setMessages(prev => [...prev, newMessage]);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUser.id, users]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      message: message.trim(),
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="h-full flex flex-col bg-chat-bg rounded-lg border border-border shadow-card">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card/50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Team Chat</h3>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
              {users.filter(u => u.isOnline).length} online
            </span>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Online Users */}
      <div className="p-3 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {users.filter(u => u.isOnline).map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-2 bg-secondary/50 rounded-full px-3 py-1"
            >
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium">
                {getInitials(user.name)}
              </div>
              <span className="text-xs text-foreground">{user.name}</span>
              <div className="w-2 h-2 bg-success rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'system' ? 'justify-center' : 'justify-start'}`}>
              {msg.type === 'system' ? (
                <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  {msg.message}
                </div>
              ) : (
                <div className={`max-w-[80%] ${msg.userId === currentUser.id ? 'ml-auto' : ''}`}>
                  <div className={`flex items-start space-x-2 ${msg.userId === currentUser.id ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium flex-shrink-0">
                      {getInitials(msg.userName)}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      msg.userId === currentUser.id 
                        ? 'bg-gradient-primary text-primary-foreground' 
                        : 'bg-chat-message text-foreground'
                    }`}>
                      {msg.userId !== currentUser.id && (
                        <div className="text-xs font-medium text-chat-user mb-1">
                          {msg.userName}
                        </div>
                      )}
                      <div className="text-sm">{msg.message}</div>
                      <div className={`text-xs mt-1 ${
                        msg.userId === currentUser.id 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card/50 rounded-b-lg">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-input border-border"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="icon"
            variant="default"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};