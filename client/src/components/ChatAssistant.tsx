import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, Sparkles, MinusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

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
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-[380px] sm:w-[420px]"
          >
            <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl bg-white/95 backdrop-blur-xl flex flex-col h-[550px] rounded-3xl">
              {/* Header */}
              <div className="bg-primary p-5 text-white flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex items-center gap-3 z-10">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/20">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg leading-tight">ClauseCast AI</h3>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold opacity-70">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Legal Assistant
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <MinusCircle className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Chat Area */}
              <ScrollArea className="flex-1 p-4 bg-slate-50/50" viewportRef={scrollRef}>
                <div className="space-y-4">
                  {chatHistory.length === 0 && (
                    <div className="flex justify-start">
                      <div className="bg-white text-slate-800 border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm text-sm">
                        I've analyzed the contract for you. Do you have any follow-up questions about the consequences or specific terms?
                      </div>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10, y: 5 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                          msg.role === "user"
                            ? "bg-primary text-white rounded-tr-none"
                            : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                         <Loader2 size={16} className="animate-spin text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-4 bg-white border-t border-slate-100">
                <form 
                  className="relative group"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <Input
                    placeholder="Ask a follow-up question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="pr-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!message.trim() || isLoading}
                    className="absolute right-1.5 top-1.5 h-9 w-9 rounded-lg shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                <div className="mt-2 text-[10px] text-center text-slate-400 font-medium">
                  AI may provide general info, not legal advice.
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={isOpen ? { scale: 0.8, opacity: 0, y: 20 } : { scale: 1, opacity: 1, y: 0 }}
        className={isOpen ? "pointer-events-none" : "pointer-events-auto"}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full shadow-2xl bg-primary hover:bg-primary group relative overflow-hidden border-4 border-white"
        >
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Floating rings */}
          <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping [animation-duration:3s]" />
          <div className="absolute inset-0 border-2 border-white/10 rounded-full animate-ping [animation-duration:4s] [animation-delay:0.5s]" />
          
          <div className="relative z-10 flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-pulse" />
          </div>
          
          {/* Tooltip-like badge */}
          <div className="absolute -top-12 right-0 bg-white text-primary text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-primary/10 whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Have questions?
          </div>
        </Button>
      </motion.div>
    </div>
  );
}
