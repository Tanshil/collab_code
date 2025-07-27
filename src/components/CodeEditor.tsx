import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Square, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  initialCode?: string;
  language: string;
  onLanguageChange: (language: string) => void;
  onCodeChange: (code: string) => void;
  isExecuting?: boolean;
  onExecute: (code: string, language: string) => void;
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", defaultCode: "// Welcome to CollabCode!\nconsole.log('Hello, World!');\n\n// Start coding collaboratively..." },
  { value: "python", label: "Python", defaultCode: "# Welcome to CollabCode!\nprint('Hello, World!')\n\n# Start coding collaboratively..." },
  { value: "cpp", label: "C++", defaultCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, World!\" << endl;\n    return 0;\n}\n\n// Start coding collaboratively..." },
  { value: "java", label: "Java", defaultCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n        \n        // Start coding collaboratively...\n    }\n}" },
  { value: "go", label: "Go", defaultCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, World!\")\n    \n    // Start coding collaboratively...\n}" },
];

export const CodeEditor = ({ 
  initialCode, 
  language, 
  onLanguageChange, 
  onCodeChange, 
  isExecuting = false,
  onExecute 
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode || LANGUAGES.find(l => l.value === language)?.defaultCode || "");
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Update line numbers when code changes
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [code]);

  // Simulate cursor positions for collaborative editing
  const [cursors] = useState([
    { id: "user2", name: "Alice", position: { line: 3, column: 15 }, color: "#ff6b6b" },
    { id: "user3", name: "Bob", position: { line: 7, column: 8 }, color: "#4ecdc4" },
  ]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleLanguageChange = (newLanguage: string) => {
    const langData = LANGUAGES.find(l => l.value === newLanguage);
    if (langData) {
      setCode(langData.defaultCode);
      onCodeChange(langData.defaultCode);
      onLanguageChange(newLanguage);
      toast({
        title: "Language changed",
        description: `Switched to ${langData.label}`,
      });
    }
  };

  const handleExecute = () => {
    onExecute(code, language);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied!",
      description: "Code has been copied to clipboard",
    });
  };

  const handleReset = () => {
    const langData = LANGUAGES.find(l => l.value === language);
    if (langData) {
      setCode(langData.defaultCode);
      onCodeChange(langData.defaultCode);
      toast({
        title: "Code reset",
        description: "Editor has been reset to default template",
      });
    }
  };

  // Handle tab key for proper indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      onCodeChange(newCode);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col bg-editor-bg rounded-lg border border-border shadow-card">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40 bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            {cursors.map((cursor) => (
              <div key={cursor.id} className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cursor.color }}
                />
                <span className="text-xs text-muted-foreground">{cursor.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleCopyCode}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleExecute}
            disabled={isExecuting}
            variant="success"
            size="sm"
            className="min-w-24"
          >
            {isExecuting ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Running
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex relative">
        {/* Line Numbers */}
        <div className="w-12 bg-editor-line border-r border-border p-2 text-right select-none">
          {lineNumbers.map((num) => (
            <div key={num} className="text-xs text-muted-foreground leading-6 font-mono">
              {num}
            </div>
          ))}
        </div>

        {/* Code Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-4 bg-transparent text-foreground font-mono text-sm leading-6 resize-none focus:outline-none"
            placeholder="Start typing your code..."
            spellCheck={false}
          />
          
          {/* Collaborative cursors simulation */}
          {cursors.map((cursor) => (
            <div
              key={cursor.id}
              className="absolute w-0.5 h-6 pointer-events-none animate-pulse"
              style={{
                backgroundColor: cursor.color,
                top: `${cursor.position.line * 24 + 16}px`,
                left: `${cursor.position.column * 8.5 + 16}px`,
              }}
            >
              <div
                className="absolute -top-6 left-0 px-1 py-0.5 rounded text-xs text-white text-nowrap"
                style={{ backgroundColor: cursor.color }}
              >
                {cursor.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};