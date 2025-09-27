"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ChevronLeft, ChevronRight, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatSidebarProps {
  className?: string;
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(userMessage.content),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("hello") || input.includes("hi")) {
      return "Hello! Nice to meet you. What would you like to know?";
    }
    if (input.includes("help")) {
      return "I'm here to help! You can ask me questions about anything and I'll do my best to assist you.";
    }
    if (input.includes("weather")) {
      return "I don't have access to real-time weather data, but I'd recommend checking a weather app or website for current conditions.";
    }
    if (input.includes("time")) {
      return `The current time is ${new Date().toLocaleTimeString()}.`;
    }
    if (input.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    }

    return "That's an interesting question! I'm a demo AI assistant, so my responses are limited, but I'm here to help however I can.";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={cn(
        " top-0 right-0 h-full z-40 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-80 md:w-96",
        className
      )}
    >
      <div className="h-full bg-gradient-to-b from-chat-gradient-from to-chat-gradient-to backdrop-blur-xl border-l border-border/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          {!isCollapsed && (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm text-foreground">
                    AI Assistant
                  </h3>
                  <p className="text-xs text-muted-foreground">Always online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="h-8 w-8 hover:bg-accent/50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {isCollapsed && (
            <div className="flex flex-col items-center w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(false)}
                className="h-8 w-8 hover:bg-accent/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      message.sender === "user"
                        ? "ml-auto flex-row-reverse"
                        : ""
                    )}
                  >
                    <Avatar className="h-7 w-7 flex-shrink-0">
                      {message.sender === "user" ? (
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          U
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={cn(
                        "flex flex-col gap-1",
                        message.sender === "user" ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2 text-sm leading-relaxed",
                          message.sender === "user"
                            ? "bg-chat-bubble-user text-red"
                            : "bg-chat-bubble-assistant text-foreground border border-border/20"
                        )}
                      >
                        {message.content}
                      </div>
                      <span className="text-xs text-muted-foreground px-1">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 max-w-[85%]">
                    <Avatar className="h-7 w-7 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        <Bot className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 items-start">
                      <div className="rounded-2xl px-4 py-2 text-sm leading-relaxed bg-chat-bubble-assistant text-foreground border border-border/20">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border/30">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-background/50 border-border/30 focus:border-primary/50 rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90"
                  disabled={!newMessage.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {isCollapsed && (
          <div className="flex flex-col items-center py-4 gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              {messages.slice(-3).map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    message.sender === "user"
                      ? "bg-primary"
                      : "bg-muted-foreground"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
