
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LogOut, User as UserIcon, ChevronRight, MessageCircle, Sparkles, Globe, Sun, Moon, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PetalAnimation } from './components/UI/PetalAnimation';
import { ChatInterface } from './components/Chat/ChatInterface';
import { DemoPage } from './components/Demo/DemoPage';
import { Theme, User, Project, Message } from './types';
import { AuthModal } from './components/Auth/AuthModal';
import { Sidebar } from './components/Chat/Sidebar';
import { LANGUAGES, TRANSLATIONS, LanguageCode, FEATURE_ICONS } from './constants';
import { Toaster } from './components/ui/toaster';
import { Badge } from './components/ui/badge';
import { useToast } from './hooks/use-toast';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './components/ui/dropdown-menu';
import { cn } from './lib/utils';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('sakura_theme') as Theme) || Theme.Dark);
  const [lang, setLang] = useState<LanguageCode>(() => (localStorage.getItem('sakura_lang') as LanguageCode) || 'pt-BR');
  const [view, setView] = useState<'home' | 'chat' | 'demo'>('home');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sakura_active_session');
    return saved ? JSON.parse(saved) : null;
  });
  const { toast } = useToast();
  
  const [allProjects, setAllProjects] = useState<Record<string, Project[]>>(() => {
    const saved = localStorage.getItem('sakura_projects_db');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const t = TRANSLATIONS[lang];

  const projects = useMemo(() => {
    const userId = user?.id || 'guest';
    return allProjects[userId] || [];
  }, [allProjects, user]);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('sakura_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sakura_lang', lang);
  }, [lang]);

  useEffect(() => { 
    if (user) localStorage.setItem('sakura_active_session', JSON.stringify(user)); 
    else localStorage.removeItem('sakura_active_session');
  }, [user]);

  useEffect(() => { 
    localStorage.setItem('sakura_projects_db', JSON.stringify(allProjects)); 
  }, [allProjects]);

  const toggleTheme = () => setTheme(prev => prev === Theme.Light ? Theme.Dark : Theme.Light);

  const handleLogout = () => { 
    setUser(null); 
    setView('home'); 
    setActiveProjectId(null); 
    toast({ title: t.logout, description: t.auth.syncComplete });
  };

  const handleNewProject = useCallback(() => {
    const userId = user?.id || 'guest';
    const newProject: Project = { 
      id: Date.now().toString(), 
      name: `${t.newChat} #${(allProjects[userId] || []).length + 1}`, 
      lastUpdated: Date.now(), 
      messages: [] 
    };
    
    setAllProjects(prev => ({
      ...prev,
      [userId]: [newProject, ...(prev[userId] || [])]
    }));
    setActiveProjectId(newProject.id);
    if (view !== 'chat') setView('chat');
  }, [allProjects, user, view, t]);

  const handleUpdateMessages = (messages: Message[]) => {
    if (!activeProjectId) return;
    const userId = user?.id || 'guest';
    setAllProjects(prev => ({
      ...prev,
      [userId]: (prev[userId] || []).map(p => 
        p.id === activeProjectId ? { ...p, messages, lastUpdated: Date.now() } : p
      )
    }));
  };

  const handleDeleteProject = (id: string) => {
    const userId = user?.id || 'guest';
    setAllProjects(prev => ({
      ...prev,
      [userId]: (prev[userId] || []).filter(p => p.id !== id)
    }));
    if (activeProjectId === id) setActiveProjectId(null);
  };

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  return (
    <div className={cn(
      "h-screen selection:bg-sakura/30 overflow-hidden transition-colors duration-700 flex flex-col", 
      theme === Theme.Dark ? 'bg-[#0B0F14]' : 'bg-[#FFF7FB]'
    )}>
      <PetalAnimation theme={theme} />
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        lang={lang}
        onLogin={(u) => { 
          setUser(u); 
          setView('chat');
          toast({ title: t.auth.syncComplete, description: `${u.name} ${t.auth.enclaveActive}.` });
          const userProjects = allProjects[u.id] || [];
          if (userProjects.length > 0) setActiveProjectId(userProjects[0].id);
          else handleNewProject();
        }} 
      />

      <nav className="shrink-0 z-[60] glass border-b border-sakura/10 px-8 h-20 flex items-center justify-between">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => setView('home')}
        >
          <div className="w-12 h-12 rounded-2xl bg-sakura flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter text-foreground leading-none uppercase">SAKURA<span className="text-sakura">CORE</span></span>
            <span className="text-[9px] font-bold text-sakura/60 uppercase tracking-widest mt-1">Master Intelligence</span>
          </div>
        </motion.div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setView('home')} className={cn("text-[10px] font-black uppercase tracking-widest transition-all hover:text-sakura", view === 'home' ? 'text-sakura sakura-text-glow' : 'text-foreground/60')}>{t.home}</button>
            <button onClick={() => setView('demo')} className={cn("text-[10px] font-black uppercase tracking-widest transition-all hover:text-sakura", view === 'demo' ? 'text-sakura sakura-text-glow' : 'text-foreground/60')}>{t.demo}</button>
            {user && <button onClick={() => setView('chat')} className={cn("text-[10px] font-black uppercase tracking-widest transition-all hover:text-sakura", view === 'chat' ? 'text-sakura sakura-text-glow' : 'text-foreground/60')}>{t.chat}</button>}
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3.5 rounded-2xl border border-sakura/20 text-sakura hover:border-sakura transition-all shadow-sm"
                >
                  <Globe className="w-5 h-5" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl glass border-sakura/20 shadow-2xl">
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem 
                    key={l.code} 
                    onClick={() => setLang(l.code as LanguageCode)}
                    className={cn("px-4 py-3 cursor-pointer transition-all rounded-xl", lang === l.code ? 'text-sakura bg-sakura/10 font-bold' : 'text-foreground/60 hover:text-sakura')}
                  >
                    <span className="mr-3">{l.flag}</span> {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-3.5 rounded-2xl border border-sakura/20 text-sakura hover:border-sakura transition-all shadow-sm"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -5, opacity: 0 }}
                >
                  {theme === Theme.Dark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-12 h-12 rounded-2xl bg-sakura/10 flex items-center justify-center text-sakura border border-sakura/20 cursor-pointer overflow-hidden group">
                    <UserIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 rounded-[2rem] p-3 glass border-sakura/20 shadow-2xl">
                  <DropdownMenuLabel className="px-5 py-4 flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-sakura mb-1">{t.activeOperator}</span>
                    <span className="text-base font-bold text-foreground">{user.name}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-sakura/10 mx-2" />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl px-5 py-4 cursor-pointer text-destructive hover:bg-destructive/10 transition-all font-black text-[10px] uppercase tracking-widest">
                    <LogOut className="w-4 h-4 mr-3" /> {t.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAuthOpen(true)} 
                className="bg-sakura text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
              >
                {t.access}
              </motion.button>
            )}
          </div>
        </div>
      </nav>

      <main id="app-content" className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="h-full overflow-y-auto px-8 pt-32 pb-48 no-scrollbar"
            >
              <div className="max-w-6xl mx-auto text-center space-y-20">
                <Badge variant="outline" className="bg-sakura/5 border-sakura/20 text-sakura text-[10px] font-black uppercase tracking-[0.4em] px-8 py-3 rounded-full">
                  {t.protocolStatus}
                </Badge>
                <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter text-foreground leading-[0.85] sakura-text-glow">
                  {t.heroTitle}<br /><span className="text-sakura italic font-light opacity-90">{t.heroSubtitle}</span>
                </h1>
                <p className="text-lg md:text-2xl text-foreground/70 max-w-3xl mx-auto font-medium leading-relaxed">
                  {t.heroDesc}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => user ? setView('chat') : setIsAuthOpen(true)} 
                    className="w-full sm:w-auto px-16 py-8 bg-sakura text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4"
                  >
                    {t.requestAccess} <ChevronRight className="w-4 h-4" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setView('demo')} 
                    className="w-full sm:w-auto px-16 py-8 glass text-foreground border border-sakura/20 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-sakura/5 transition-all"
                  >
                    {t.demo}
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
                  {t.featuresList.map((f: any, i: number) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -10 }}
                      className="p-10 rounded-[2.5rem] glass border border-sakura/10 text-left hover:border-sakura/40 transition-all group"
                    >
                      <div className="text-sakura mb-6 group-hover:scale-110 transition-transform">{FEATURE_ICONS[i]}</div>
                      <h3 className="text-xl font-black text-foreground mb-4">{f.title}</h3>
                      <p className="text-foreground/50 text-sm leading-relaxed">{f.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'demo' && (
            <motion.div 
              key="demo"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full overflow-y-auto"
            >
              <DemoPage lang={lang} />
            </motion.div>
          )}

          {view === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              className="h-full"
            >
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={22} minSize={18} maxSize={30}>
                  <Sidebar 
                    lang={lang}
                    projects={projects} 
                    activeProjectId={activeProjectId} 
                    onSelectProject={setActiveProjectId} 
                    onNewProject={handleNewProject} 
                    onDeleteProject={handleDeleteProject} 
                  />
                </ResizablePanel>
                <ResizableHandle withHandle className="bg-transparent" />
                <ResizablePanel defaultSize={78}>
                  <ChatInterface lang={lang} activeProject={activeProject} onUpdateMessages={handleUpdateMessages} />
                </ResizablePanel>
              </ResizablePanelGroup>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {view !== 'chat' && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5, y: -5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => user ? setView('chat') : setIsAuthOpen(true)}
            className="fixed bottom-12 right-12 z-[100] w-24 h-24 bg-sakura text-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_60px_rgba(236,72,153,0.4)] group overflow-hidden border-4 border-white/20"
            aria-label="Toggle Chat"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col items-center">
               <MessageCircle className="w-10 h-10 group-hover:scale-110 transition-transform mb-1" />
               <span className="text-[8px] font-black uppercase tracking-widest opacity-80">{t.chat}</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  );
};
export default App;
