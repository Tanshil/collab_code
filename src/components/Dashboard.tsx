import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, Clock, Code, LogOut } from "lucide-react";

interface DashboardProps {
  user: { id: string; name: string; email: string };
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: () => void;
  onLogout: () => void;
}

export const Dashboard = ({ user, onJoinRoom, onCreateRoom, onLogout }: DashboardProps) => {
  const [roomId, setRoomId] = useState("");
  const { toast } = useToast();

  // Mock recent sessions
  const recentSessions = [
    { id: "room-abc123", name: "React Components", language: "JavaScript", participants: 3, lastActive: "2 hours ago" },
    { id: "room-def456", name: "Python Algorithm", language: "Python", participants: 1, lastActive: "1 day ago" },
    { id: "room-ghi789", name: "C++ Data Structures", language: "C++", participants: 5, lastActive: "3 days ago" },
  ];

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      toast({
        title: "Room ID required",
        description: "Please enter a valid room ID to join.",
        variant: "destructive",
      });
      return;
    }
    onJoinRoom(roomId.trim());
  };

  const handleCreateRoom = () => {
    const newRoomId = `room-${Math.random().toString(36).substr(2, 9)}`;
    toast({
      title: "Room created!",
      description: `New room created with ID: ${newRoomId}`,
    });
    onCreateRoom();
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CollabCode
            </h1>
            <div className="hidden md:block text-muted-foreground">
              Real-time collaborative coding
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Create Room Card */}
                <Card className="bg-gradient-card border-border shadow-card hover:shadow-primary transition-all duration-300 group cursor-pointer" onClick={handleCreateRoom}>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-2 group-hover:shadow-glow-primary transition-all duration-300">
                      <Plus className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-foreground">Create New Room</CardTitle>
                    <CardDescription>
                      Start a new collaborative coding session
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Join Room Card */}
                <Card className="bg-gradient-card border-border shadow-card">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-2">
                      <Users className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-center text-foreground">Join Room</CardTitle>
                    <CardDescription className="text-center">
                      Enter a room ID to join an existing session
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomId">Room ID</Label>
                      <Input
                        id="roomId"
                        placeholder="Enter room ID (e.g., room-abc123)"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                        className="bg-input border-border"
                      />
                    </div>
                    <Button 
                      onClick={handleJoinRoom} 
                      className="w-full"
                      variant="accent"
                    >
                      Join Room
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Sessions */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Recent Sessions</h2>
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <Card 
                    key={session.id} 
                    className="bg-card border-border shadow-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => onJoinRoom(session.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <Code className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {session.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {session.language} • {session.participants} participants
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {session.lastActive}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            ID: {session.id}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-foreground">Create or join a room</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-foreground">Share room ID with collaborators</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-foreground">Start coding together in real-time</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-foreground">Use chat to communicate</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  ✨ Real-time collaborative editing
                </div>
                <div className="text-sm text-muted-foreground">
                  💬 Integrated chat system
                </div>
                <div className="text-sm text-muted-foreground">
                  🚀 Code execution & testing
                </div>
                <div className="text-sm text-muted-foreground">
                  📝 Multiple language support
                </div>
                <div className="text-sm text-muted-foreground">
                  📚 Version history tracking
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};