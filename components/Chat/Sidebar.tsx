
import React from 'react';
import { Plus, MessageSquare, Trash2, Layout } from 'lucide-react';
import { Project } from '../../types';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';
import { TRANSLATIONS, LanguageCode } from '../../constants';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
  lang: LanguageCode;
}

export const Sidebar: React.FC<SidebarProps> = ({ projects, activeProjectId, onSelectProject, onNewProject, onDeleteProject, lang }) => {
  const commonT = TRANSLATIONS[lang];
  const t = commonT.sidebar;
  return (
    <div className="h-full border-r border-sakura/20 bg-zinc-950 flex flex-col z-20 transition-all duration-700">
      <div className="p-8 border-b border-sakura/10">
        <button 
          onClick={onNewProject} 
          className="w-full flex items-center justify-center gap-4 py-5 bg-sakura text-zinc-950 rounded-2xl font-black text-[13px] uppercase tracking-[0.15em] shadow-[0_15px_35px_-10px_rgba(236,72,153,0.5)] hover:scale-[1.03] hover:brightness-110 active:scale-95 transition-all group border-2 border-white/40"
        >
          <div className="p-1 bg-zinc-950/10 rounded-lg group-hover:rotate-90 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          {commonT.newChat}
        </button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          <h3 className="text-[10px] font-black text-sakura uppercase tracking-[0.6em] px-4 mb-6 opacity-50">{commonT.memory}</h3>
          {projects.length === 0 ? (
            <div className="py-24 text-center space-y-6 opacity-20">
              <Layout className="w-16 h-16 mx-auto text-sakura" />
              <p className="text-[10px] font-black uppercase tracking-widest text-sakura">{t.empty}</p>
            </div>
          ) : (
            projects.sort((a, b) => b.lastUpdated - a.lastUpdated).map(project => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={cn(
                  "group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border",
                  activeProjectId === project.id 
                    ? 'bg-sakura/10 border-sakura/40 shadow-lg' 
                    : 'border-transparent hover:bg-sakura/5'
                )}
              >
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-md",
                  activeProjectId === project.id ? 'bg-sakura text-zinc-950 rotate-3' : 'bg-zinc-900 text-sakura/40'
                )}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={cn(
                    "text-[14px] font-bold truncate transition-colors",
                    activeProjectId === project.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                  )}>
                    {project.name}
                  </p>
                  <p className="text-[9px] text-sakura/40 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                    {new Date(project.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all text-sakura/20"
                  aria-label="Delete Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <div className="p-8 border-t border-sakura/10">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-sakura/5 border border-sakura/10 group cursor-default shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-sakura animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
          <span className="text-[9px] font-black text-sakura uppercase tracking-[0.4em] opacity-70">{commonT.syncStatus}</span>
        </div>
      </div>
    </div>
  );
};
