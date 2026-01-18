
import React, { useState } from 'react';
import { X, Mail, Lock, User, Shield, CheckCircle2, Key } from 'lucide-react';
import { User as UserType } from '../../types';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { TRANSLATIONS, LanguageCode } from '../../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
  onLogin: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, lang, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const t = TRANSLATIONS[lang].auth;

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'register' && !name)) {
      toast({ variant: "destructive", title: "Campos Incompletos", description: "Preencha todos os protocolos de acesso." });
      return;
    }
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 800);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    
    const usersRaw = localStorage.getItem('sakura_registry');
    const users: UserType[] = usersRaw ? JSON.parse(usersRaw) : [];

    setTimeout(() => {
      if (mode === 'register') {
        const userExists = users.find(u => u.email === email);
        if (userExists) {
          toast({
            variant: "destructive",
            title: "Erro de Registro",
            description: "Este e-mail já está vinculado a um enclave master.",
          });
          setIsLoading(false);
          setStep(1);
          return;
        }

        const newUser: UserType = {
          id: Math.random().toString(36).substring(2, 11),
          email,
          name,
          isLoggedIn: true
        };
        
        localStorage.setItem('sakura_registry', JSON.stringify([...users, newUser]));
        finalizeAuth(newUser);
      } else {
        const user = users.find(u => u.email === email);
        if (user) {
          finalizeAuth(user);
        } else {
          toast({
            variant: "destructive",
            title: "Falha na Sincronização",
            description: "Operador não encontrado na base de dados SAKURA.",
          });
          setIsLoading(false);
          setStep(1);
        }
      }
    }, 1200);
  };

  const finalizeAuth = (userData: UserType) => {
    setIsSuccess(true);
    setTimeout(() => {
      onLogin(userData);
      setIsLoading(false);
      setIsSuccess(false);
      setStep(1);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-[420px] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-zinc-400 hover:text-sakura transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 md:p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-24 h-24 rounded-3xl bg-sakura/10 flex items-center justify-center text-sakura mb-8 shadow-inner">
              {isSuccess ? (
                <CheckCircle2 className="w-12 h-12 animate-in zoom-in text-green-500" />
              ) : step === 1 ? (
                <Shield className="w-12 h-12" />
              ) : (
                <Key className="w-12 h-12" />
              )}
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">
              {isSuccess ? t.enclaveActive : step === 1 ? (mode === 'login' ? t.login : t.register) : t.validation}
            </h2>
            <p className="text-zinc-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">
              {isSuccess ? t.syncComplete : t.protocol}
            </p>
          </div>

          {!isSuccess && step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              {mode === 'register' && (
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-sakura transition-colors" />
                  <input
                    type="text" required placeholder={t.name}
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-sakura/20 text-zinc-900 dark:text-white transition-all text-sm font-medium placeholder:text-zinc-400"
                  />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-sakura transition-colors" />
                <input
                  type="email" required placeholder={t.email}
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-sakura/20 text-zinc-900 dark:text-white transition-all text-sm font-medium placeholder:text-zinc-400"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-sakura transition-colors" />
                <input
                  type="password" required placeholder={t.password}
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-sakura/20 text-zinc-900 dark:text-white transition-all text-sm font-medium placeholder:text-zinc-400"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-8 rounded-2xl font-black text-xs uppercase tracking-[0.3em] mt-8 bg-sakura hover:bg-sakura/90 text-white shadow-xl shadow-sakura/20"
              >
                {isLoading ? t.analyzing : t.syncButton}
              </Button>
            </form>
          )}

          {!isSuccess && step === 2 && (
            <div className="flex flex-col items-center space-y-10 animate-in slide-in-from-right-4">
              <p className="text-xs text-center text-zinc-600 dark:text-gray-500 font-medium px-6 leading-relaxed">
                {t.otpDesc}
              </p>
              <InputOTP maxLength={6} value={otp} onChange={setOtp} onComplete={handleSubmit}>
                <InputOTPGroup className="gap-3">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <InputOTPSlot key={i} index={i} className="w-12 h-16 rounded-xl border-zinc-200 dark:border-zinc-700 font-black text-lg text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <Button 
                variant="ghost" 
                onClick={() => setStep(1)}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-sakura"
              >
                {t.back}
              </Button>
            </div>
          )}

          {!isSuccess && (
            <div className="mt-12 pt-10 border-t border-gray-100 dark:border-zinc-800 text-center">
              <button 
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setStep(1); }}
                className="text-[10px] font-black text-zinc-500 dark:text-gray-400 hover:text-sakura uppercase tracking-[0.3em] transition-colors"
              >
                {mode === 'login' ? t.requestNew : t.hasAccess}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
