import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Terminal, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConsoleLog {
  id: string;
  type: 'output' | 'error' | 'info' | 'warning';
  content: string;
  timestamp: Date;
}

interface ConsoleOutputProps {
  isExecuting: boolean;
  executionResult?: {
    output?: string;
    error?: string;
    executionTime?: number;
  };
}

export const ConsoleOutput = ({ isExecuting, executionResult }: ConsoleOutputProps) => {
  const [logs, setLogs] = useState<ConsoleLog[]>([
    {
      id: "log-1",
      type: 'info',
      content: 'Console ready. Click "Run" to execute your code.',
      timestamp: new Date(),
    }
  ]);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Add execution result to logs
  useEffect(() => {
    if (executionResult) {
      const newLogs: ConsoleLog[] = [];
      
      if (executionResult.output) {
        newLogs.push({
          id: `log-${Date.now()}-output`,
          type: 'output',
          content: executionResult.output,
          timestamp: new Date(),
        });
      }
      
      if (executionResult.error) {
        newLogs.push({
          id: `log-${Date.now()}-error`,
          type: 'error',
          content: executionResult.error,
          timestamp: new Date(),
        });
      }
      
      if (executionResult.executionTime) {
        newLogs.push({
          id: `log-${Date.now()}-time`,
          type: 'info',
          content: `Execution completed in ${executionResult.executionTime}ms`,
          timestamp: new Date(),
        });
      }
      
      setLogs(prev => [...prev, ...newLogs]);
    }
  }, [executionResult]);

  // Add execution start log
  useEffect(() => {
    if (isExecuting) {
      setLogs(prev => [...prev, {
        id: `log-${Date.now()}-start`,
        type: 'info',
        content: 'Executing code...',
        timestamp: new Date(),
      }]);
    }
  }, [isExecuting]);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs]);

  const clearConsole = () => {
    setLogs([{
      id: `log-${Date.now()}-clear`,
      type: 'info',
      content: 'Console cleared.',
      timestamp: new Date(),
    }]);
    toast({
      title: "Console cleared",
      description: "All console output has been cleared.",
    });
  };

  const copyLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp.toLocaleTimeString()}] ${log.type.toUpperCase()}: ${log.content}`
    ).join('\n');
    
    navigator.clipboard.writeText(logText);
    toast({
      title: "Logs copied!",
      description: "Console logs have been copied to clipboard.",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getLogIcon = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'output':
        return '✅';
      default:
        return '>';
    }
  };

  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return 'text-destructive';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-primary';
      case 'output':
        return 'text-success';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col bg-editor-bg rounded-lg border border-border shadow-card">
      {/* Console Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card/50">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Console Output</h3>
          {isExecuting && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs text-primary">Running</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyLogs}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConsole}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Console Content */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-3">
        <div className="space-y-1 font-mono text-xs">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`flex items-start space-x-2 py-1 ${getLogColor(log.type)}`}
            >
              <span className="text-muted-foreground min-w-[60px] text-[10px]">
                {formatTime(log.timestamp)}
              </span>
              <span className="min-w-[16px]">
                {getLogIcon(log.type)}
              </span>
              <div className="flex-1 whitespace-pre-wrap break-words">
                {log.content}
              </div>
            </div>
          ))}
          
          {/* Cursor when executing */}
          {isExecuting && (
            <div className="flex items-center space-x-2 py-1">
              <span className="text-muted-foreground min-w-[60px] text-[10px]">
                {formatTime(new Date())}
              </span>
              <span className="text-primary animate-pulse">▊</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Console Footer */}
      <div className="p-2 border-t border-border bg-card/30">
        <div className="text-xs text-muted-foreground">
          {logs.length} log{logs.length !== 1 ? 's' : ''} • 
          Last update: {logs.length > 0 ? formatTime(logs[logs.length - 1].timestamp) : 'Never'}
        </div>
      </div>
    </div>
  );
};