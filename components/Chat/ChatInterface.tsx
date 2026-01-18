
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Terminal, Sparkle, ShieldCheck, Cpu, ChevronDown, ChevronUp, BrainCircuit, Bot, User as UserIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { geminiService } from '../../services/geminiService';
import { CodeBlock } from './CodeBlock';
import { Message, Project } from '../../types';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSLATIONS, LanguageCode, LANGUAGES } from '../../constants';

interface ChatInterfaceProps {
  activeProject: Project | null;
  onUpdateMessages: (messages: Message[]) => void;
  lang: LanguageCode;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeProject, onUpdateMessages, lang }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  const currentLanguageLabel = useMemo(() => {
    return LANGUAGES.find(l => l.code === lang)?.label || 'Portuguese';
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeProject?.messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping || !activeProject) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now() };
    const newMessages = [...(activeProject.messages || []), userMsg];
    onUpdateMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const history = newMessages.map(m => ({ role: m.role, content: m.content }));
    const result = await geminiService.sendMessage(input, history, currentLanguageLabel);

    const assistantMsg: Message = { 
      id: (Date.now() + 1).toString(), 
      role: 'assistant', 
      content: result.text, 
      thought: result.thought,
      timestamp: Date.now() 
    };
    onUpdateMessages([...newMessages, assistantMsg]);
    setIsTyping(false);
  };

  const toggleThought = (id: string) => {
    setExpandedThoughts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderContent = (content: string, isAssistant: boolean) => {
    return (
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        className={cn(
          "max-w-none break-words prose text-sm md:text-base leading-relaxed",
          isAssistant ? "prose-sakura dark:prose-invert" : "text-white prose-invert font-semibold"
        )}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <CodeBlock 
                lang={lang}
                code={String(children).replace(/\n$/, '')} 
                language={match ? match[1] : 'typescript'} 
              />
            ) : (
              <code className={cn(
                "px-2 py-0.5 rounded font-mono text-[13px] font-bold",
                isAssistant ? "bg-sakura/15 text-sakura border border-sakura/20" : "bg-white/20 text-white"
              )} {...props}>
                {children}
              </code>
            );
          },
          p: ({children}) => <p className="mb-4 last:mb-0">{children}</p>,
          ul: ({children}) => <ul className="mb-4 list-disc list-inside space-y-1">{children}</ul>,
          ol: ({children}) => <ol className="mb-4 list-decimal list-inside space-y-1">{children}</ol>,
          blockquote: ({children}) => (
            <blockquote className={cn(
              "border-l-4 pl-4 italic my-4",
              isAssistant ? "border-sakura/30 bg-sakura/5 py-2 rounded-r-lg" : "border-white/30 bg-white/10 py-2 rounded-r-lg"
            )}>
              {children}
            </blockquote>
          ),
          table: ({children}) => (
            <div className="overflow-x-auto my-6 rounded-xl border border-sakura/20">
              <table className="w-full text-sm text-left border-collapse">{children}</table>
            </div>
          ),
          th: ({children}) => <th className="p-3 bg-sakura/10 font-black uppercase tracking-widest border-b border-sakura/20">{children}</th>,
          td: ({children}) => <td className="p-3 border-b border-sakura/5 text-zinc-300">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  if (!activeProject) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-background relative z-10 transition-all duration-1000">
        <div className="w-24 h-24 rounded-[3rem] bg-sakura flex items-center justify-center text-zinc-950 mb-10 shadow-2xl animate-pulse border-4 border-white/20">
          <Terminal className="w-12 h-12" />
        </div>
        <h2 className="text-5xl font-black text-foreground tracking-tighter mb-6 uppercase sakura-text-glow">{t.chat}</h2>
        <Badge variant="outline" className="text-sakura border-sakura/50 uppercase tracking-[0.4em] px-8 py-3 rounded-full text-xs font-black">
          {t.waitCommand}
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative z-10 transition-colors duration-1000">
      {/* Header do Chat */}
      <div className="px-8 py-6 glass border-b border-sakura/10 flex items-center justify-between sticky top-0 z-20 transition-all shadow-md">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-sakura flex items-center justify-center text-zinc-950 shadow-xl sakura-glow border-2 border-white/30">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{activeProject.name}</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-bold text-sakura uppercase tracking-widest opacity-80">{t.onlineStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-14 no-scrollbar scroll-smooth">
        <AnimatePresence>
          {activeProject.messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-10 opacity-30"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-sakura/20 blur-[80px] rounded-full" />
                <Sparkle className="w-24 h-24 text-sakura relative animate-pulse" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">{t.onlineStatus}</h3>
                <p className="text-[11px] uppercase tracking-[0.6em] font-black text-sakura sakura-text-glow">{t.emptyChat}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {activeProject.messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-6 group", msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
            <Avatar className={cn(
              "w-12 h-12 md:w-14 md:h-14 rounded-2xl shrink-0 shadow-2xl transition-all border-2",
              msg.role === 'assistant' ? "bg-sakura text-zinc-950 border-white/30 rotate-3 sakura-glow" : "bg-zinc-900 text-sakura border-sakura/20"
            )}>
              {msg.role === 'assistant' ? <Sparkle className="w-7 h-7" /> : <AvatarFallback><UserIcon className="w-6 h-6" /></AvatarFallback>}
            </Avatar>
            <div className={cn(
              "max-w-[90%] md:max-w-[85%] flex flex-col gap-4",
              msg.role === 'user' ? 'items-end' : 'items-start'
            )}>
              {msg.thought && (
                <div className="w-full max-w-2xl glass border border-sakura/20 rounded-3xl overflow-hidden shadow-xl transition-all hover:border-sakura/40">
                  <button 
                    onClick={() => toggleThought(msg.id)}
                    className="w-full flex items-center justify-between px-8 py-4 hover:bg-sakura/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-sakura/10 rounded-lg">
                        <BrainCircuit className="w-5 h-5 text-sakura" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sakura opacity-80">{t.logic}</span>
                    </div>
                    {expandedThoughts[msg.id] ? <ChevronUp className="w-5 h-5 text-sakura" /> : <ChevronDown className="w-5 h-5 text-sakura" />}
                  </button>
                  <AnimatePresence>
                    {expandedThoughts[msg.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8"
                      >
                        <div className="text-[13px] text-zinc-400 italic leading-relaxed whitespace-pre-wrap border-l-2 border-sakura/20 pl-6 mt-4 py-3">
                          {msg.thought}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className={cn(
                "rounded-[2.5rem] p-8 md:p-10 shadow-2xl transition-all w-full border-2",
                msg.role === 'user' 
                  ? 'bg-sakura text-zinc-950 border-white/20 rounded-tr-none' 
                  : 'glass text-foreground rounded-tl-none border-sakura/20'
              )}>
                <div className="text-[15px] md:text-[17px] leading-relaxed">
                  {renderContent(msg.content, msg.role === 'assistant')}
                </div>
                <div className={cn(
                  "text-[9px] mt-8 opacity-50 font-black uppercase tracking-[0.5em] flex items-center gap-4 border-t pt-8",
                  msg.role === 'user' ? 'justify-end border-white/10' : 'justify-start border-sakura/10 text-sakura'
                )}>
                  {msg.role === 'assistant' && <ShieldCheck className="w-4 h-4" />}
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {msg.role.toUpperCase()} MASTER ORCHESTRATION
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-6 animate-pulse">
            <Avatar className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-sakura flex items-center justify-center text-zinc-950 shrink-0 rotate-3 shadow-xl border-2 border-white/30 sakura-glow">
              <Cpu className="w-7 h-7 animate-spin" />
            </Avatar>
            <div className="glass rounded-[2rem] px-8 py-5 flex gap-4 items-center border-2 border-sakura/20">
              <span className="w-2.5 h-2.5 bg-sakura rounded-full animate-bounce shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
              <span className="w-2.5 h-2.5 bg-sakura rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2.5 h-2.5 bg-sakura rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-8 md:p-10 bg-zinc-950/80 backdrop-blur-3xl border-t-2 border-sakura/10 z-50 transition-all">
        <div className="relative flex items-center max-w-5xl mx-auto w-full group">
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="w-full bg-zinc-900 border-2 border-sakura/10 rounded-[2.5rem] px-10 py-6 pr-28 text-[15px] md:text-[17px] font-bold focus:outline-none focus:border-sakura focus:ring-4 focus:ring-sakura/5 text-foreground transition-all shadow-inner placeholder:text-zinc-500"
          />
          <button
            type="submit" disabled={!input.trim() || isTyping}
            className="absolute right-2 p-4 bg-sakura text-zinc-950 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg border-2 border-white/30 sakura-glow"
            aria-label="Send Message"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
};
