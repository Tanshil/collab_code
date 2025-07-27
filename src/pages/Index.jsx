import React, { useState } from "react";
import { AuthPage } from "@/components/AuthPage.jsx";
import { Dashboard } from "@/components/Dashboard.jsx";
import { RoomEditor } from "@/components/RoomEditor.jsx";

const Index = () => {
  const [appState, setAppState] = useState('auth');
  const [user, setUser] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState("");

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setAppState('dashboard');
  };

  const handleJoinRoom = (roomId) => {
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