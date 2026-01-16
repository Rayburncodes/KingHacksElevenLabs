import { useState } from "react";
import { MessageSquare, Send, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ChatAssistantProps {
  contractText: string;
  scenario: string;
  language: string;
}

export function ChatAssistant({ contractText, scenario, language }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMsg = message.trim();
    setMessage("");
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          contractText,
          scenario,
          language
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");
      
      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      toast({
        title: "Assistant error",
        description: "Could not get a response from the AI assistant.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 md:w-96"
          >
            <Card className="shadow-2xl border-slate-200 overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-serif font-bold flex items-center gap-2">
                  <MessageSquare size={16} className="text-primary" />
                  Follow-up Assistant
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => setIsOpen(false)}
                >
                  <ChevronDown size={14} />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-64 overflow-y-auto p-4 space-y-4 bg-white/50">
                  {chatHistory.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-8">
                      Ask any follow-up questions about this scenario or specific clauses.
                    </p>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-slate-100 text-slate-700 rounded-bl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 p-2 rounded-lg rounded-bl-none">
                        <Loader2 size={16} className="animate-spin text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-slate-100 bg-white">
                  <form 
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                  >
                    <Input 
                      placeholder="Type your question..." 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="text-sm h-9"
                    />
                    <Button type="submit" size="icon" className="h-9 w-9" disabled={isLoading}>
                      <Send size={14} />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`shadow-lg h-12 w-12 rounded-full ${isOpen ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200' : 'bg-primary text-white'}`}
        size="icon"
      >
        {isOpen ? <ChevronDown size={20} /> : <MessageSquare size={20} />}
      </Button>
    </div>
  );
}
