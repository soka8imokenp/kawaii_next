'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  HelpCircle, 
  Tv, 
  BookOpen, 
  Compass, 
  ArrowUpRight, 
  Scale, 
  Command,
  Heart
} from 'lucide-react';
import LiquidEther from './LiquidEther';

// ==========================================
// 1. ДАННЫЕ ПРОЕКТОВ (НИЖНИЕ ПАНЕЛЬКИ)
// ==========================================
const PLATFORMS = [
  {
    id: 'bot',
    title: 'Search Bot',
    status: 'Aktiv',
    icon: Bot,
    color: 'text-sky-500',
    hoverRing: 'hover:border-sky-400 hover:shadow-[0_10px_30px_rgba(56,189,248,0.2)]',
    url: 'https://bot.kawaii.uz'
  },
  {
    id: 'service',
    title: 'Support',
    status: 'Aktiv',
    icon: HelpCircle,
    color: 'text-indigo-500',
    hoverRing: 'hover:border-indigo-400 hover:shadow-[0_10px_30px_rgba(99,102,241,0.2)]',
    url: 'https://service.kawaii.uz'
  },
  {
    id: 'anime',
    title: 'Anime Portal',
    status: 'Tez orada',
    icon: Tv,
    color: 'text-rose-500',
    hoverRing: 'hover:border-rose-400 hover:shadow-[0_10px_30px_rgba(251,113,133,0.2)]',
    url: '#'
  },
  {
    id: 'manga',
    title: 'Manga Reader',
    status: 'Tez orada',
    icon: BookOpen,
    color: 'text-amber-500',
    hoverRing: 'hover:border-amber-400 hover:shadow-[0_10px_30px_rgba(251,191,36,0.2)]',
    url: '#'
  },
  {
    id: 'wiki',
    title: 'Kawaii Wiki',
    status: 'Tez orada',
    icon: Compass,
    color: 'text-emerald-500',
    hoverRing: 'hover:border-emerald-400 hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)]',
    url: '#'
  }
];

// ==========================================
// 2. АНИМАЦИИ (ОПТИМИЗИРОВАННЫЕ)
// ==========================================
const MASCOT_FLOAT = {
  animate: {
    y: [0, -25, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
  }
};

const MODAL_VARIANTS = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20 }
};

// ==========================================
// 3. ГЛАВНАЯ СТРАНИЦА (PREMIUM HERO)
// ==========================================
export default function Home() {
  const [isDmcaOpen, setIsDmcaOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      
      {/* --- ИНТЕРАКТИВНЫЙ ФОН LIQUID ETHER --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LiquidEther 
          colors={['#5227FF', '#FF9FFC', '#B497CF']}
          mouseForce={25}
          cursorSize={120}
          resolution={0.4} // Слегка снижено для идеального баланса графики и FPS
          iterationsPoisson={16}
          BFECC={false} // Отключено для избежания фризов
          autoDemo={true}
          autoSpeed={0.3}
        />
        {/* Осветляющий матовый слой, чтобы сайт был белым и чистым */}
        <div className="absolute inset-0 bg-white/70 z-10" />
      </div>

      {/* --- PREMIUM NAVBAR --- */}
      <header className="relative z-50 w-full px-6 md:px-12 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Command className="w-6 h-6 text-indigo-600" />
          <span className="font-black text-2xl tracking-tighter text-slate-900">
            KAWA<span className="text-indigo-600">II</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
          <span onClick={() => setIsDmcaOpen(true)} className="hover:text-slate-900 transition-colors cursor-pointer">
            Legal (DMCA)
          </span>
        </nav>
      </header>

      {/* --- CENTRAL HERO 3D SHOWCASE --- */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center w-full px-4 mt-4 md:mt-0 min-h-[65vh]">
        
        {/* Гигантский текст на ЗАДНЕМ плане (создает 3D эффект) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center w-full z-10 pointer-events-none">
          <h1 className="text-[18vw] md:text-[14vw] font-black text-slate-900 tracking-tighter leading-none opacity-90">
            KAWA<span className="text-indigo-600">II</span><span className="text-rose-500">.UZ</span>
          </h1>
          <p className="text-sm md:text-xl font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.4em] mt-2 md:mt-4">
            Anime ishqibozlari uchun raqamli platforma
          </p>
        </div>

        {/* Крупный Маскот на ПЕРЕДНЕМ плане (перекрывает текст) */}
        <motion.div 
          variants={MASCOT_FLOAT}
          animate="animate"
          className="relative z-20 h-[45vh] md:h-[65vh] w-full flex justify-center transform-gpu"
        >
          {/* Мягкое белое свечение прямо за маскотом, чтобы отделить его от текста */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-white/80 blur-[80px] rounded-full -z-10" />
          
          <img 
            src="/sumire/sumire.webp" 
            alt="Sumire Mascot" 
            className="h-full object-contain drop-shadow-[0_30px_60px_rgba(82,39,255,0.25)] pointer-events-none select-none"
          />
        </motion.div>

      </main>

      {/* --- НИЖНИЕ ИНТЕРАКТИВНЫЕ ПАНЕЛЬКИ --- */}
      <section className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-12 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          
          {PLATFORMS.map((node) => {
            const isAktiv = node.status === 'Aktiv';
            
            return (
              <motion.a
                key={node.id}
                href={node.url}
                target={isAktiv ? "_blank" : undefined}
                rel="noopener noreferrer"
                whileHover={isAktiv ? { y: -8, scale: 1.02 } : {}}
                className={`relative flex flex-col justify-between h-36 md:h-44 bg-white/90 border border-slate-200 rounded-[28px] p-5 shadow-sm cursor-pointer group transition-all duration-300 ${isAktiv ? node.hoverRing : 'opacity-70'} overflow-hidden transform-gpu`}
              >
                <div className="flex justify-between items-start z-10">
                  <div className={`w-10 h-10 rounded-[14px] bg-slate-50 border border-slate-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${node.color}`}>
                    <node.icon className="w-5 h-5" />
                  </div>
                  {isAktiv ? (
                    <span className="flex h-2 w-2 relative mt-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  ) : (
                    <span className="text-[8px] font-black uppercase tracking-wider text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                      Yaqinda
                    </span>
                  )}
                </div>

                <div className="z-10 mt-auto">
                  <h3 className="text-sm md:text-base font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {node.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] font-bold text-slate-400">
                      {isAktiv ? "Kirish" : "Kutish"}
                    </span>
                    {isAktiv && (
                      <ArrowUpRight className={`w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ${node.color}`} />
                    )}
                  </div>
                </div>
              </motion.a>
            )
          })}

        </div>
      </section>

      {/* --- МИНИМАЛИСТИЧНЫЙ БЕЛЫЙ ФУТЕР --- */}
      <footer className="relative z-20 w-full bg-white border-t border-slate-100 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            &copy; 2026 KAWAII.UZ. Barcha huquqlar himoyalangan.
          </p>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            O&apos;zbekistonda <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> bilan yaratildi
          </div>
        </div>
      </footer>

      {/* --- ИДЕАЛЬНО ОПТИМИЗИРОВАННОЕ МОДАЛЬНОЕ ОКНО --- */}
      <AnimatePresence>
        {isDmcaOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* ОЧЕНЬ ВАЖНО: Убран backdrop-blur-sm. Теперь это просто сплошная заливка. Это спасает FPS! */}
            <motion.div 
              className="absolute inset-0 bg-slate-900/80 cursor-pointer" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsDmcaOpen(false)} 
            />
            <motion.div 
              className="relative w-full max-w-lg bg-white border border-slate-100 rounded-[32px] shadow-2xl p-8 z-10" 
              variants={MODAL_VARIANTS}
              initial="initial" 
              animate="animate" 
              exit="exit"
            >
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-600" /> Mualliflik Huquqlari
                </h2>
                <button onClick={() => setIsDmcaOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold transition-colors">✕</button>
              </div>
              <div className="space-y-4 mt-6 text-sm text-slate-600 font-medium leading-relaxed">
                <p>{"Kawaii.uz platformasi xalqaro qonunchilikka muvofiq axborot vositachisi hisoblanadi. Hech qanday media fayllar o'z serverlarimizda saqlanmaydi."}</p>
                <p>{"bot.kawaii.uz moduli ochiq guruhlardagi resurslar havolalarini indekslaydi va uchinchi tomon serverlaridagi fayllar uchun yuridik javobgarlikni o'z zimmasiga olmaydi."}</p>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mt-4">
                  <span className="block font-black text-slate-900 mb-1 text-xs uppercase tracking-widest">Aloqa uchun:</span>
                  <a href="mailto:kawaii.uz.official@gmail.com" className="font-mono text-indigo-600 font-bold hover:underline">kawaii.uz.official@gmail.com</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}