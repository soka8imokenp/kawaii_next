'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  HelpCircle, 
  Tv, 
  BookOpen, 
  Compass, 
  ArrowUpRight, 
  Scale,
  Code
} from 'lucide-react';
import Ferrofluid from './Ferrofluid';
import StaggeredMenu from './StaggeredMenu';

// ==========================================
// 1. PROJECT DATA
// ==========================================
const PLATFORMS = [
  {
    id: 'bot',
    title: 'Search Bot',
    subdomain: 'bot.kawaii.uz',
    description: "Telegramdagi o'zbek anime fandub jamoalari tomonidan ovozlashtirilgan va ommaviy kanallarga yuklangan anime qismlarini izlash va tomosha qilish uchun qulay avtomatlashtirilgan platforma.",
    status: 'Aktiv',
    icon: Bot,
    url: 'https://bot.kawaii.uz'
  },
  {
    id: 'service',
    title: 'Support Service',
    subdomain: 'service.kawaii.uz',
    description: "Rasmiy maskot personajimiz Sumire boshchiligidagi platformamizning qo'llab-quvvatlash bo'limi.",
    status: 'Aktiv',
    icon: HelpCircle,
    url: 'https://service.kawaii.uz'
  },
  {
    id: 'anime',
    title: 'Anime Portal',
    subdomain: 'anime.kawaii.uz',
    description: "MyAnimeList bazasidagi animelarning o'zbek tilidagi eng to'liq ensiklopediyasi va ijtimoiy platformasi. Sevimli animelaringizni bir nechta fandub jamoalari ovozida ko'p variantli tanlov asosida tomosha qiling. Fandublar mehnati yagona \"Kawaii Pass\" obunasi orqali adolatli monetizatsiya qilinadi.",
    status: 'Tez orada',
    icon: Tv,
    url: '#'
  },
  {
    id: 'manga',
    title: 'Manga Reader',
    subdomain: 'manga.kawaii.uz',
    description: "Manga, manhva va manhua asarlarining o'zbek tilidagi birinchi va eng yirik raqamli kutubxonasi. Qulay mutolaa pleyeri va keng muhokama maydoniga ega tizim. Tarjimon jamoalarning tunlarni o'tkazib qilgan og'ir mehnati yagona \"Kawaii Pass\" obunasi orqali to'liq qo'llab-quvvatlanadi va monetizatsiya...",
    status: 'Tez orada',
    icon: BookOpen,
    url: '#'
  },
  {
    id: 'wiki',
    title: 'Kawaii Wiki',
    subdomain: 'wiki.kawaii.uz',
    description: "Platformamiz va umumiy anime olamining eng mukammal bilimlar bazasi (Wiki). Bu yerda anime janrlari, sahna ortidagi xodimlar (staff) vazifalari, platformadagi nishonlar (badgelar) tarixi hamda sevimli maskot personajimiz haqidagi barcha yashirin ma'lumotlar jamlanadi.",
    status: 'Tez orada',
    icon: Compass,
    url: '#'
  },
  {
    id: 'api',
    title: 'Kawaii API',
    subdomain: 'api.kawaii.uz',
    description: "Dasturchilar va tashqi loyihalar uchun ekotizimimizning ochiq va yuqori tezlikdagi ma'lumotlar ombori (REST API). MyAnimeList ensiklopediyasi, manga kutubxonasi va fandub jamoalari ma'lumotlarini o'z loyihalaringizga integratsiya qiling.",
    status: 'Tez orada',
    icon: Code,
    url: '#'
  }
];

// ============================================================================
// MASCOT CONFIGURATION (Adjust size, offsets, and positions here manually!)
// ============================================================================
const MASCOT_CONFIG = {
  desktop: {
    src: '/sumire/sumire.webp',
    width: 'w-[55%]',              // Width of the absolute container (increased to allow larger scale)
    height: 'h-[135vh]',           // Increased height significantly to scale up image
    maxHeight: 'max-h-[145vh]',    // Increased max height constraint
    verticalAlign: 'items-start',  // Align to top so bottom (skirt) overflows down
    topOffset: 'pt-4',             // Minimal top padding to place ears at menu level
    bottomOffset: 'pb-0',          // Bottom padding/offset (not needed for items-start)
    rightPadding: 'pr-12 lg:pr-20', // Right padding from the edge
    translateX: '3%',              // Horizontal translation (negative to shift left, positive to right)
    zIndex: 'z-[5]',               // Layer depth (z-[5] sits behind text so it doesn't block readability)
  },
  mobile: {
    src: '/sumire/sumire_mobile.webp',
    width: 'w-[100%]',              // Width of the absolute container
    height: 'h-[60vh]',            // Height of the image relative to viewport height (vh)
    bottomOffset: 'pb-0',          // Bottom padding/offset
    translateX: '15%',             // Horizontal translation (positive shifts it off-screen to the right)
    zIndex: 'z-[5]',               // Layer depth (z-[5] sits behind text, z-10 sits in front)
  }
};

const MODAL_VARIANTS = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, damping: 30, stiffness: 400 } },
  exit: { opacity: 0, scale: 0.98, y: 10 }
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDmcaOpen, setIsDmcaOpen] = useState(false);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // Clean up any remaining dark mode states from previous sessions
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);

  // Dynamic colors for the Ferrofluid WebGL shader
  const getFluidColors = () => {
    switch (hoveredPlatform) {
      case 'bot':
        return ['#a5f3fc', '#bae6fd', '#f0f9ff']; // Cyan-blue luxury pastel
      case 'service':
        return ['#c7d2fe', '#ddd6fe', '#f5f3ff']; // Indigo-purple luxury pastel
      case 'anime':
        return ['#fecdd3', '#ffe4e6', '#fff5f5']; // Rose-pink luxury pastel
      case 'manga':
        return ['#ffccd5', '#fecdd3', '#fff5f5']; // Peach-orange luxury pastel
      case 'wiki':
        return ['#fef3c7', '#fde68a', '#fffbeb']; // Amber-gold luxury pastel
      case 'api':
        return ['#a7f3d0', '#ccfbf1', '#f0fdf4']; // Mint-emerald luxury pastel
      default:
        return ['#d9d2c5', '#e9e2d5', '#fbf9f4']; // Warm luxury champagne / silver gold
    }
  };

  const socialItems = [
    { label: 'Telegram', link: 'https://t.me/kawaii_uz_official' },
    { label: 'Email', link: 'mailto:kawaii.uz.official@gmail.com' }
  ];

  return (
    <div 
      onCopy={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
      className="relative min-h-screen bg-[#fcfbf9] text-neutral-800 font-sans overflow-x-hidden flex flex-col justify-between"
    >
      
      {/* --- BACKGROUND FERROFLUID --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Ferrofluid
          colors={getFluidColors()}
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.1}
          rimWidth={0.2}
          sharpness={2.5}
          shimmer={1.5}
          glow={2}
          flowDirection="down"
          opacity={0.8}
          mouseInteraction
          mouseStrength={1}
          mouseRadius={0.35}
        />
        {/* Soft luxury champagne masking layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fcfbf9]/50 via-[#fcfbf9]/75 to-[#fcfbf9] z-10 pointer-events-none" />
      </div>

      {/* --- MENU BACKDROP OVERLAY --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 bg-[#fcfbf9]/60 backdrop-blur-md z-30 pointer-events-auto cursor-pointer"
            onClick={() => {
              // Click away will be handled by the click handler outside the panel in StaggeredMenu
            }}
          />
        )}
      </AnimatePresence>

      {/* --- STAGGERED MENU & LOGO --- */}
      <StaggeredMenu
        position="right"
        items={[]}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#000000"
        openMenuButtonColor="#000000"
        changeMenuColorOnOpen={true}
        colors={['#eae8e4', '#fcfbf9']}
        logoUrl="/sumire/logo.svg"
        accentColor="#000000"
        isFixed={true}
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}
        onLegalClick={(doc) => {
          if (doc === 'dmca') {
            setIsDmcaOpen(true);
          }
        }}
      />

      {/* --- HERO MAIN INTERACTIVE WORKSPACE --- */}
      <main id="ecosystem" className="relative z-10 flex-grow flex flex-col justify-start md:justify-center w-full px-6 md:px-12 max-w-7xl mx-auto min-h-[calc(100vh-100px)] py-12 mt-16 md:mt-0">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-12 w-full relative">
          
          {/* LEFT COLUMN: BRAND IDENT & ACCORDION STACK */}
          <div className="w-full md:w-[48%] flex flex-col justify-center z-20">
            
            {/* Giant Typographic Mark - Abril Fatface */}
            <div className="relative">
              <h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-black text-black tracking-normal leading-none select-none font-serif-title italic">
                kawaii
              </h1>
            </div>

            <p className="text-xs text-neutral-500 font-medium uppercase tracking-[0.15em] mt-3 max-w-md font-sans">
              O&apos;zbekistondagi anime va manga ixlosmandlari uchun raqamli ekotizim.
            </p>

            {/* LUXURY ANIMATED ACCORDION PANELS */}
            <div className="w-full space-y-0 border-t border-black/5 mt-10">
              {PLATFORMS.map((node, index) => {
                const isAktiv = node.status === 'Aktiv';
                const isOpen = activeAccordion === node.id;
                
                return (
                  <div
                    key={node.id}
                    className="border-b border-black/5 py-5 accordion-line overflow-hidden group/item"
                    onMouseEnter={() => {
                      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                        setHoveredPlatform(node.id);
                        setActiveAccordion(node.id);
                      }
                    }}
                    onMouseLeave={() => {
                      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                        setHoveredPlatform(null);
                        setActiveAccordion(null);
                      }
                    }}
                  >
                    {/* Header bar */}
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
                          setActiveAccordion(prev => prev === node.id ? null : node.id);
                        } else if (isAktiv) {
                          window.open(node.url, '_blank');
                        }
                      }}
                    >
                      <div className="flex items-center gap-6">
                        <span className="font-serif-luxury text-xs text-neutral-300 group-hover/item:text-neutral-800 transition-colors font-bold">
                          {`0${index + 1}`}
                        </span>
                        <h3 className="text-lg font-medium font-serif-title italic text-neutral-800 group-hover/item:text-black transition-colors flex items-center gap-3">
                          {node.title}
                          {isAktiv ? (
                            <span className="text-[7px] font-bold tracking-widest text-neutral-800 border border-neutral-800/10 bg-[#f5f4f0] px-1.5 py-0.5 rounded uppercase font-sans">
                              Aktiv
                            </span>
                          ) : (
                            <span className="text-[7px] font-bold tracking-widest text-neutral-400 border border-neutral-400/10 bg-[#fbfbf9] px-1.5 py-0.5 rounded uppercase font-sans">
                              Tez orada
                            </span>
                          )}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider hidden sm:inline">
                          {node.subdomain}
                        </span>
                        {isAktiv && (
                          <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover/item:text-black transition-all duration-300 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                        )}
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden font-sans"
                    >
                      <div className="pt-4 pl-10 pr-4 space-y-4">
                        <p className="text-xs text-neutral-500 leading-relaxed max-w-md">
                          {node.description}
                        </p>

                        {isAktiv ? (
                          <button 
                            onClick={() => window.open(node.url, '_blank')}
                            className="mt-2 px-5 py-2 bg-neutral-900 hover:bg-black text-white transition-colors text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer font-sans"
                          >
                            Platformaga o'tish
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="mt-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-sans">
                            Tez orada ishga tushadi . . .
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </div>

          </div>

          {/* RIGHT COLUMN (SPACER FOR DESKTOP ABSOLUTE IMAGES) */}
          <div className="w-full md:w-[48%] hidden md:block" />

        </div>
      </main>

      {/* --- DESKTOP MASCOT: ALIGNED TO THE ENTIRE RIGHT VIEWPORT (STATIC, NO BOBBING, HIDES INSTANTLY ON MENU OPEN) --- */}
      <div className={`hidden md:block absolute top-0 right-0 ${MASCOT_CONFIG.desktop.width} h-full ${MASCOT_CONFIG.desktop.zIndex} pointer-events-none overflow-hidden transition-all duration-200 ${
        isMenuOpen ? 'opacity-0 scale-95 pointer-events-none invisible' : 'opacity-100 scale-100'
      }`}>
        <div className={`w-full h-full flex ${MASCOT_CONFIG.desktop.verticalAlign} justify-end relative ${MASCOT_CONFIG.desktop.rightPadding} ${MASCOT_CONFIG.desktop.topOffset} ${MASCOT_CONFIG.desktop.bottomOffset}`}>
          <img 
            src={MASCOT_CONFIG.desktop.src} 
            alt="Sumire Mascot" 
            className={`${MASCOT_CONFIG.desktop.height} ${MASCOT_CONFIG.desktop.maxHeight} object-contain select-none pointer-events-none transform-gpu`}
            style={{
              transform: `translateX(${MASCOT_CONFIG.desktop.translateX})`,
              transformOrigin: 'top right'
            }}
          />
        </div>
      </div>

      {/* --- MOBILE MASCOT (ABSOLUTE FOR SMALL SCREENS, POSITIONED AT THE BOTTOM, SLIGHTLY SHIFTED RIGHT) --- */}
      <div className={`block md:hidden absolute bottom-0 right-0 ${MASCOT_CONFIG.mobile.width} ${MASCOT_CONFIG.mobile.height} ${MASCOT_CONFIG.mobile.zIndex} pointer-events-none overflow-hidden transition-all duration-200 ${
        isMenuOpen ? 'opacity-0 scale-95 pointer-events-none invisible' : 'opacity-100 scale-100'
      }`}>
        <div className={`w-full h-full flex items-end justify-end relative ${MASCOT_CONFIG.mobile.bottomOffset}`}>
          <img 
            src={MASCOT_CONFIG.mobile.src} 
            alt="Sumire Mobile Mascot" 
            className="h-full object-contain select-none pointer-events-none"
            style={{
              transform: `translateX(${MASCOT_CONFIG.mobile.translateX})`,
              transformOrigin: 'bottom right'
            }}
          />
        </div>
      </div>

      {/* --- LEGAL MODAL --- */}
      <AnimatePresence>
        {isDmcaOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              className="absolute inset-0 bg-black/40 cursor-pointer backdrop-blur-sm" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsDmcaOpen(false)} 
            />
            <motion.div 
              className="relative w-full max-w-xl bg-[#fcfbf9] border border-black/5 rounded-3xl shadow-2xl p-8 z-10 luxury-glass" 
              variants={MODAL_VARIANTS}
              initial="initial" 
              animate="animate" 
              exit="exit"
            >
              <div className="flex items-center justify-between pb-5 border-b border-black/5">
                <h2 className="text-lg font-bold font-serif-title text-neutral-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-neutral-800" /> Huquqiy ma’lumot va Siyosat
                </h2>
                <button 
                  onClick={() => setIsDmcaOpen(false)} 
                  className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 flex items-center justify-center font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-6 mt-6 text-xs text-neutral-600 font-medium leading-relaxed font-sans max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <h3 className="font-serif-title font-bold text-neutral-950 text-sm mb-1">1. Kawaii platformasi haqida</h3>
                  <p>{"Kawaii.uz — anime, manga va geek-madaniyat ixlosmandlari uchun mo‘ljallangan zamonaviy, ko‘p funksiyali SaaS-platforma va interaktiv ekotizimdir. Platforma foydalanuvchilarga chatlarda muloqot qilish, yangiliklar almashish, musiqa tinglash, bloglar yuritish uchun texnik vositalarni taqdim etadi, shuningdek, kontentni tizimlashtirish uchun disk maydoni va pleyer xizmatini ko‘rsatadi."}</p>
                </div>
                <div>
                  <h3 className="font-serif-title font-bold text-neutral-950 text-sm mb-1">2. Kontentning joylashtirilishi (UGC)</h3>
                  <p>{"Platforma UGC (User Generated Content), ya’ni foydalanuvchilar tomonidan yaratilgan kontent prinsipi asosida ishlaydi. Barcha multimedia materiallari (video va grafik fayllar, manga tarjimalari va musiqiy treklar) platformaga faqatgina uchinchi shaxslar — ro‘yxatdan o‘tgan foydalanuvchilar hamda mustaqil ijodiy uyushmalar (dublyaj jamoalari, tarjimonlar) tomonidan o‘z-o‘zini nashr etish asosida joylashtiriladi. Kawaii administratsiyasi faqatgina materiallarni ijro etish o‘z texnik infratuzilmasini taqdim etadi va kontentni yuklash bilan maqsadli ravishda shug‘ullanmaydi."}</p>
                </div>
                <div>
                  <h3 className="font-serif-title font-bold text-neutral-950 text-sm mb-1">3. Mualliflar va huquq egalari bilan hamkorlik</h3>
                  <p>{"Biz intellektual mulk huquqiga, shuningdek, mustaqil mualliflar, tarjimonlar va mahalliylashtirish jamoalarining (fandaub/fansub hamjamiyatlarining) ulkan mehnatiga chuqur hurmat bilan qaraymiz. Kawaii platformasi barcha ishtirokchilarning manfaatlari hisobga olingan yagona, do‘stona va jipslashgan anime-hamjamiyatini rivojlantirishga intiladi."}</p>
                  <p className="mt-2">{"Agar siz kontentning rasmiy huquq egasi bo‘lsangiz yoki ijodiy uyushma (ovozlashtirish/tarjima jamoasi) vakili bo‘lsangiz va platformamizda foydalanuvchilar tomonidan joylashtirilgan materiallarga kirishni cheklash bo‘yicha savollaringiz yoki asosli istaklaringiz boشان yoki asosli istaklaringiz bo‘lsa, biz har doim ochiq muloqotga tayyormiz."}</p>
                  <p className="mt-2">{"Barcha savollar va murojaatlar bo‘yicha to‘g‘ridan-to‘g‘ri bizning elektron pochtamiz orqali bog‘lanishingiz mumkin. Administratsiya o‘zaro manfaatli va murosali qarorga kelish maqsadida har bir murojaatni individual tartibda ko‘rib chiqadi."}</p>
                </div>
                <div className="p-4 bg-[#fbfaf8] border border-black/5 rounded-2xl mt-4">
                  <span className="block font-black text-neutral-900 mb-1 text-[10px] uppercase tracking-widest">Murojaatlar uchun elektron posta:</span>
                  <a href="mailto:kawaii.uz.official@gmail.com" className="font-mono text-neutral-800 font-bold hover:underline text-xs">kawaii.uz.official@gmail.com</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}