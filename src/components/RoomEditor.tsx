import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CodeEditor } from "./CodeEditor";
import { ChatPanel } from "./ChatPanel";
import { ConsoleOutput } from "./ConsoleOutput";
import { Copy, Users, LogOut, Share2, History, Settings } from "lucide-react";

interface RoomEditorProps {
  user: { id: string; name: string; email: string };
  roomId: string;
  onLeaveRoom: () => void;
}

export const RoomEditor = ({ user, roomId, onLeaveRoom }: RoomEditorProps) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    output?: string;
    error?: string;
    executionTime?: number;
  } | undefined>();
  const [showConsole, setShowConsole] = useState(true);
  
  const { toast } = useToast();

  // Simulate auto-save
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (code.trim()) {
        // Simulate saving to backend
        console.log("Auto-saving code...", { roomId, code: code.substring(0, 50) + "..." });
      }
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, [code, roomId]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    // Simulate real-time sync via WebSocket
    console.log("Broadcasting code change...", { roomId, userId: user.id });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    console.log("Broadcasting language change...", { roomId, language: newLanguage });
  };

  const handleExecuteCode = async (codeToExecute: string, lang: string) => {
    setIsExecuting(true);
    setExecutionResult(undefined);

    // Simulate code execution
    setTimeout(() => {
      const results = simulateCodeExecution(codeToExecute, lang);
      setExecutionResult(results);
      setIsExecuting(false);
      setShowConsole(true);
    }, 1500 + Math.random() * 1000);
  };

  const simulateCodeExecution = (code: string, lang: string) => {
    const executionTime = Math.floor(Math.random() * 300) + 50;
    
    // Simulate different outputs based on language and code content
    if (code.includes("console.log") || code.includes("print") || code.includes("cout")) {
      if (code.includes("Hello")) {
        return {
          output: "Hello, World!",
          executionTime,
        };
      } else if (code.includes("error") || code.includes("Error")) {
        return {
          error: "ReferenceError: 'error' is not defined",
          executionTime,
        };
      } else {
        return {
          output: "Code executed successfully!\nOutput: " + (Math.random() * 100).toFixed(2),
          executionTime,
        };
      }
    } else if (code.trim() === "") {
      return {
        error: "No code to execute",
        executionTime: 10,
      };
    } else {
      return {
        output: `Code executed successfully in ${lang}!`,
        executionTime,
      };
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Room ID copied!",
      description: "Share this ID with others to invite them to collaborate.",
    });
  };

  const shareRoom = () => {
    const shareUrl = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Room link copied!",
      description: "Share this link to invite collaborators.",
    });
  };

  return (
    <div className="h-screen bg-gradient-dark flex flex-col">
      {/* Top Bar */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CollabCode
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Room:</span>
                <code className="text-sm bg-muted px-2 py-1 rounded font-mono text-foreground">
                  {roomId}
                </code>
                <Button variant="ghost" size="sm" onClick={copyRoomId}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>3 collaborators</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={shareRoom}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onLeaveRoom}>
              <LogOut className="h-4 w-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className="flex-1 flex flex-col p-4">
          <div className={`${showConsole ? 'h-2/3' : 'h-full'} transition-all duration-300`}>
            <CodeEditor
              language={language}
              onLanguageChange={handleLanguageChange}
              onCodeChange={handleCodeChange}
              isExecuting={isExecuting}
              onExecute={handleExecuteCode}
            />
          </div>
          
          {/* Console Output */}
          {showConsole && (
            <div className="h-1/3 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground">Output</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConsole(!showConsole)}
                  className="text-xs"
                >
                  {showConsole ? 'Hide' : 'Show'} Console
                </Button>
              </div>
              <ConsoleOutput
                isExecuting={isExecuting}
                executionResult={executionResult}
              />
            </div>
          )}
          
          {!showConsole && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConsole(true)}
                className="w-full"
              >
                Show Console Output
              </Button>
            </div>
          )}
        </div>

        {/* Right Panel - Chat */}
        <div className="w-80 p-4 border-l border-border">
          <ChatPanel currentUser={user} roomId={roomId} />
        </div>
      </div>
    </div>
  );
};