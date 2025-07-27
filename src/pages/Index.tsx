import { useState } from "react";
import { AuthPage } from "@/components/AuthPage";
import { Dashboard } from "@/components/Dashboard";
import { RoomEditor } from "@/components/RoomEditor";

type AppState = 'auth' | 'dashboard' | 'room';

interface User {
  id: string;
  name: string;
  email: string;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string>("");

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setAppState('dashboard');
  };

  const handleJoinRoom = (roomId: string) => {
    setCurrentRoomId(roomId);
    setAppState('room');
  };

  const handleCreateRoom = () => {
    const newRoomId = `room-${Math.random().toString(36).substr(2, 9)}`;
    setCurrentRoomId(newRoomId);
    setAppState('room');
  };

  const handleLeaveRoom = () => {
    setAppState('dashboard');
    setCurrentRoomId("");
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('auth');
    setCurrentRoomId("");
  };

  if (appState === 'auth') {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (appState === 'dashboard' && user) {
    return (
      <Dashboard
        user={user}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
        onLogout={handleLogout}
      />
    );
  }

  if (appState === 'room' && user && currentRoomId) {
    return (
      <RoomEditor
        user={user}
        roomId={currentRoomId}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  return null;
};

export default Index;
