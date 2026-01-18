
import React from 'react';
import { CodeBlock } from '../Chat/CodeBlock';
import { Badge } from '../ui/badge';
import { Terminal, Code, Layers, Shield, Sparkles, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { TRANSLATIONS, LanguageCode } from '../../constants';

interface DemoPageProps {
  lang: LanguageCode;
}

const DEMO_EXAMPLES_RAW = [
  {
    language: 'typescript',
    code: `import { Request, Response } from 'express';
import { CreateUserUseCase } from '../use-cases/create-user';

export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password, name } = req.body;
    
    try {
      const user = await this.createUser.execute({ email, password, name });
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}`
  },
  {
    language: 'python',
    code: `from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import SessionLocal, engine

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)`
  },
  {
    language: 'go',
    code: `package main

import (
	"fmt"
	"sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	for j := range jobs {
		fmt.Printf("worker %d processing job %d\\n", id, j)
		results <- j * 2
	}
}

func main() {
	jobs := make(chan int, 100)
	results := make(chan int, 100)
	var wg sync.WaitGroup

	for w := 1; w <= 3; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	for j := 1; j <= 5; j++ {
		jobs <- j
	}
	close(jobs)
	wg.Wait()
}`
  },
  {
    language: 'rust',
    code: `fn main() {
    let s1 = String::from("Sakura Master");
    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
} // Here, s goes out of scope. But because it does not have ownership, 
  // nothing happens to the string.`
  }
];

export const DemoPage: React.FC<DemoPageProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].demoPage;
  const commonT = TRANSLATIONS[lang];
  
  // Combina dados brutos de código com títulos traduzidos
  const examples = DEMO_EXAMPLES_RAW.map((ex, i) => ({
    ...ex,
    title: t.exampleTitles[i] || 'Technical Node'
  }));

  return (
    <div className="max-w-6xl mx-auto px-8 py-32 space-y-32 no-scrollbar overflow-y-auto h-full pb-64">
      <div className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="text-sakura border-sakura/20 uppercase tracking-[0.4em] px-8 py-3 rounded-full mb-8">
            {t.badge}
          </Badge>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white"
        >
          {t.title.split(' ')[0]} <span className="text-sakura italic font-light">{t.title.split(' ')[1] || ''}</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-zinc-700 dark:text-zinc-500 max-w-3xl mx-auto leading-relaxed"
        >
          {t.desc}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-32">
        {examples.map((example, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-sakura/10 text-sakura flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                  {idx === 0 ? <Layers className="w-7 h-7" /> : idx === 1 ? <Shield className="w-7 h-7" /> : idx === 2 ? <Cpu className="w-7 h-7" /> : <Terminal className="w-7 h-7" />}
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">{example.title}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] mt-2">{t.optimization}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-sakura/10 text-sakura border-sakura/20 font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-xl">{example.language}</Badge>
                <Badge className="bg-blue-400/10 text-blue-400 border-blue-400/20 font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-xl">{t.production}</Badge>
              </div>
            </div>
            <CodeBlock lang={lang} code={example.code} language={example.language} title={`${example.language.toUpperCase()} NODE`} />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-sakura rounded-[4rem] p-16 md:p-24 text-white text-center space-y-12 shadow-3xl shadow-sakura/40 relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{commonT.ready}</h2>
        <p className="text-xl md:text-2xl opacity-95 max-w-2xl mx-auto font-medium leading-relaxed">
          {commonT.elevate}
        </p>
        <button className="px-16 py-10 bg-zinc-950 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl flex items-center gap-4 mx-auto">
          {commonT.startCore} <Sparkles className="w-6 h-6 text-sakura" />
        </button>
      </motion.div>
    </div>
  );
};
