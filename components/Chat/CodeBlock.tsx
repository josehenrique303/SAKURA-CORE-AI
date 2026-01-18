
import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, GraduationCap, Code, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { geminiService } from '../../services/geminiService';
import { cn } from '../../lib/utils';
import { useToast } from '../../hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSLATIONS, LanguageCode, LANGUAGES } from '../../constants';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  onAction?: (response: string) => void;
  lang: LanguageCode;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code: initialCode, language = 'typescript', title, lang }) => {
  const [code, setCode] = useState(initialCode);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'improving' | 'learning'>('idle');
  const { toast } = useToast();
  const t = TRANSLATIONS[lang];

  const currentLanguageLabel = LANGUAGES.find(l => l.code === lang)?.label || 'Portuguese';

  // UI Update: Adapt state to language change
  useEffect(() => {
    setExplanation(null);
    setIsExplanationVisible(false);
  }, [lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({ title: t.copy, description: "Buffer sync complete." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImprove = async () => {
    if (status !== 'idle') return;
    setStatus('improving');
    try {
      const result = await geminiService.improveCode(code, t.prompts.improve, currentLanguageLabel);
      const text = result.text;
      // Extract code from markdown if present
      const match = text.match(/```(?:\w+)?\n([\s\S]*?)```/) || text.match(/```([\s\S]*?)```/);
      const extractedCode = match ? match[1].trim() : text.trim();
      setCode(extractedCode);
      toast({ title: t.improve, description: "Master Refactoring Success." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Improvement protocol failed." });
    } finally {
      setStatus('idle');
    }
  };

  const handleLearn = async () => {
    if (explanation && !isExplanationVisible) {
      setIsExplanationVisible(true);
      return;
    }
    if (isExplanationVisible && explanation) {
      setIsExplanationVisible(false);
      return;
    }

    setStatus('learning');
    try {
      const result = await geminiService.explainCode(code, t.prompts.explain, currentLanguageLabel);
      setExplanation(result.text);
      setIsExplanationVisible(true);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Learning protocol failed." });
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="my-10 rounded-[2.5rem] border-2 border-sakura/30 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group transition-all">
      <div className="flex items-center justify-between px-8 py-5 bg-zinc-950 border-b-2 border-sakura/20">
        <div className="flex items-center gap-5">
          <div className="flex gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          </div>
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-sakura" />
            <span className="text-[11px] font-black text-sakura uppercase tracking-[0.4em]">
              {title || language} MASTER NODE
            </span>
          </div>
        </div>
        <button 
          onClick={handleCopy} 
          className="p-3 bg-sakura/10 hover:bg-sakura/20 border border-sakura/30 rounded-2xl transition-all active:scale-90"
          aria-label="Copy Code"
        >
          {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white" />}
        </button>
      </div>

      <div className="relative group/code">
        <SyntaxHighlighter
          language={language.toLowerCase()}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '3rem',
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.8'
          }}
        >
          {code}
        </SyntaxHighlighter>

        <AnimatePresence>
          {(status === 'improving' || status === 'learning') && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-10"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-sakura animate-spin" />
                <span className="text-xs font-black uppercase tracking-[0.5em] text-sakura sakura-text-glow">{t.typing}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 flex flex-wrap items-center justify-between gap-6 border-t-2 border-sakura/20 bg-zinc-950">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleImprove}
            disabled={status !== 'idle'}
            className="flex items-center gap-3 px-8 py-4 bg-sakura hover:bg-sakura/80 text-white rounded-2xl transition-all disabled:opacity-50 shadow-[0_10px_20px_rgba(236,72,153,0.3)] border border-white/20 active:translate-y-1"
          >
            <Sparkles className={cn("w-5 h-5", status === 'improving' && "animate-pulse")} />
            <span className="text-xs font-black uppercase tracking-widest">{t.improve}</span>
          </button>
          
          <button 
            onClick={handleLearn}
            disabled={status !== 'idle'}
            className="flex items-center gap-3 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-sakura rounded-2xl transition-all disabled:opacity-50 border-2 border-sakura/40 shadow-xl active:translate-y-1"
          >
            <GraduationCap className={cn("w-5 h-5", status === 'learning' && "animate-bounce")} />
            <span className="text-xs font-black uppercase tracking-widest">{t.learn}</span>
          </button>
        </div>
        
        {explanation && (
          <button 
            onClick={() => setIsExplanationVisible(!isExplanationVisible)} 
            className="p-4 bg-sakura/10 border border-sakura/30 text-sakura rounded-2xl hover:bg-sakura/20 transition-all shadow-lg"
          >
            {isExplanationVisible ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isExplanationVisible && explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t-2 border-sakura/20 bg-zinc-900 relative"
          >
            <button 
              onClick={() => setIsExplanationVisible(false)}
              className="absolute top-8 right-8 text-sakura/40 hover:text-sakura transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-sakura text-white flex items-center justify-center shadow-2xl border border-white/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-sakura uppercase tracking-[0.3em]">{t.analysisNode}</h4>
              </div>
              <div className="prose prose-invert prose-sakura max-w-none text-[16px] text-zinc-100 leading-relaxed whitespace-pre-wrap font-normal">
                {explanation}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
