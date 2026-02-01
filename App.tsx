import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Globe, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

// --- Assets & Data ---

const ASSETS = {
  hero: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
  img1: "https://images.unsplash.com/photo-1614036634955-ae5e90f9b9eb?q=80&w=2670&auto=format&fit=crop",
  img2: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=80&w=2536&auto=format&fit=crop",
  img3: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2632&auto=format&fit=crop",
  bgPattern: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
};

const CONTENT = {
  en: {
    nav: { works: "Campaigns", services: "Solutions", about: "Agency", blog: "Insights", contact: "Contact", touch: "Start Project" },
    hero: { line1: "Ornen", line2: "Global.", sub: "The definitive marketing agency bridging the Chinese market with the world." },
    intro: { title: "Vision", text: "We don't just translate languages; we translate value. Helping Chinese brands go global, and global brands win in China." },
    services: {
      title: "Solutions",
      list: [
        { id: "01", title: "Cross-Border Strategy", desc: "Seamless market entry for Western and Eastern brands." },
        { id: "02", title: "Social Ecosystems", desc: "Mastery of WeChat, Xiaohongshu (Red), Douyin, and TikTok." },
        { id: "03", title: "AI-Driven Content", desc: "Generative creative assets and stock photography tailored to local tastes." },
        { id: "04", title: "Conversion Tech", desc: "Websites and Mini-programs designed to turn viewers into buyers." }
      ]
    },
    work: { 
      title: "Featured Campaigns", 
      case1: { title: "Silk Road Reborn", desc: "Rebranding a heritage tea brand for the Parisian luxury market." },
      case2: { title: "Neon Future", desc: "Launch strategy for a Shanghai EV startup entering North America." },
      case3: { title: "Urban Pulse", desc: "O2O retail experience for a global sneaker giant in Chengdu." }
    },
    footer: { mission: "Our Mission", missionText: "Making your brand popular in every corner of the globe.", rights: "© 2026 ORNEN Agency. All Rights Reserved." },
  },
  cn: {
    nav: { works: "营销案例", services: "解决方案", about: "关于我们", blog: "洞察", contact: "联系", touch: "开始项目" },
    hero: { line1: "Ornen", line2: "连接全球", sub: "连接中国与世界的顶级数字营销机构。" },
    intro: { title: "愿景", text: "我们不只是翻译语言，更是传递价值。助力中国品牌出海，帮助全球品牌扎根中国。" },
    services: {
      title: "核心服务",
      list: [
        { id: "01", title: "跨境品牌策略", desc: "为东西方品牌提供无缝的市场准入方案。" },
        { id: "02", title: "社交生态构建", desc: "精通微信、小红书、抖音及TikTok的全域运营。" },
        { id: "03", title: "AI 内容生成", desc: "定制化生成符合本土审美的创意资产与商业图库。" },
        { id: "04", title: "高转化技术", desc: "设计能将流量转化为销量的高效网站与小程序。" }
      ]
    },
    work: { 
      title: "精选案例", 
      case1: { title: "丝路新生", desc: "助力传统茶品牌重塑，打入巴黎奢侈品市场。" },
      case2: { title: "霓虹未来", desc: "上海电动汽车初创企业进军北美的发布策略。" },
      case3: { title: "城市脉搏", desc: "全球运动鞋巨头在成都的O2O零售体验。" }
    },
    footer: { mission: "我们的使命", missionText: "让您的品牌在世界的每一个角落流行。", rights: "© 2026 ORNEN. 版权所有。" },
  }
};

// --- Components ---

const OrnenLogo = ({ className = "h-12" }: { className?: string }) => (
  <svg viewBox="0 0 160 40" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="60%" dominantBaseline="central" textAnchor="middle" fontFamily="sans-serif" fontSize="38" fontWeight="900" letterSpacing="-0.04em">ORNEN</text>
  </svg>
);

interface HeaderProps {
  lang: 'en' | 'cn';
  setLang: (lang: 'en' | 'cn') => void;
  t: typeof CONTENT['en'];
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, t }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between mix-blend-difference text-white"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-12">
          <a href="#" className="flex items-center gap-2 z-50 relative group">
            {/* Logo made slightly bigger and better positioned */}
            <OrnenLogo className="h-12 md:h-16 text-white transition-transform duration-300 group-hover:scale-105" />
            <span className="sr-only">Ornen</span>
          </a>
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
            {['works', 'services', 'about', 'blog'].map((item) => (
              <a key={item} href={`#${item}`} className="hover:text-stone-300 transition-colors uppercase text-xs tracking-widest font-bold">{t.nav[item as keyof typeof t.nav]}</a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'en' ? 'cn' : 'en')}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 hover:bg-white hover:text-black transition-all backdrop-blur-md"
          >
            <Globe size={14} />
            <span className="text-xs font-bold uppercase">{lang === 'en' ? 'CN' : 'EN'}</span>
          </button>
          
          <a href="#contact" className="hidden md:flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {t.nav.touch}
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden z-50">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center gap-8 text-white"
          >
            {['works', 'services', 'about', 'contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item}`} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-serif italic"
              >
                {t.nav[item as keyof typeof t.nav]}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = ({ t }: { t: typeof CONTENT['en'] }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img src={ASSETS.hero} className="w-full h-full object-cover opacity-50" alt="Hero" />
      </motion.div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10" />

      <motion.div 
        style={{ opacity }}
        className="relative z-20 text-center text-white px-4 max-w-7xl mx-auto flex flex-col items-center"
      >
        <div className="flex items-center gap-4 mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
           <Sparkles size={14} className="text-yellow-400" />
           <span className="text-xs font-bold tracking-widest uppercase">Marketing for the New Era</span>
        </div>
        
        <h1 className="text-[15vw] leading-[0.8] font-bold tracking-tighter mix-blend-overlay uppercase">
          {t.hero.line1}
        </h1>
        <h1 className="text-[15vw] leading-[0.8] font-serif tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-stone-500 italic">
          {t.hero.line2}
        </h1>
        <div className="mt-12 flex flex-col items-center gap-6">
          <p className="max-w-lg text-lg font-light tracking-wide text-white/80">
            {t.hero.sub}
          </p>
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-24 bg-gradient-to-b from-white to-transparent" 
          />
        </div>
      </motion.div>
    </section>
  );
};

interface StickySectionProps {
  img: string;
  number: string;
  title: string;
  desc: string;
  align?: 'left' | 'right';
}

const StickySection: React.FC<StickySectionProps> = ({ img, number, title, desc, align = 'left' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center py-24 px-4 md:px-12 bg-black text-white relative border-t border-white/5">
      <div className={`flex flex-col md:flex-row items-center w-full max-w-7xl mx-auto gap-12 md:gap-24 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>
        
        <div className="flex-1 space-y-8 relative z-10">
          <span className="text-xs font-bold border border-white/20 rounded-full px-3 py-1 uppercase tracking-widest text-white/60">
            {number}
          </span>
          <h2 className="text-5xl md:text-7xl font-serif italic">{title}</h2>
          <p className="text-lg md:text-xl text-white/70 max-w-md leading-relaxed">{desc}</p>
          <button className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest hover:text-stone-400 transition-colors mt-8">
            View Project <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
          </button>
        </div>

        <div className="flex-1 w-full relative">
          <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm">
            <motion.div style={{ y }} className="absolute inset-0 -top-[20%] -bottom-[20%]">
              <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />
            </motion.div>
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-500" />
          </div>
        </div>

      </div>
    </div>
  );
};

const ServicesList = ({ t }: { t: typeof CONTENT['en'] }) => {
  return (
    <section className="py-32 bg-stone-100 text-black px-4 md:px-12 rounded-t-[40px] -mt-10 relative z-30" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-24">
          <div>
            <span className="block text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">{(t.intro.title)}</span>
            <h2 className="text-6xl md:text-8xl font-serif tracking-tighter">{t.services.title}</h2>
          </div>
          <p className="mt-8 md:mt-0 max-w-sm text-xl leading-relaxed text-stone-600 font-light">
            {t.intro.text}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-stone-300 border border-stone-300">
          {t.services.list.map((service, i) => (
            <div key={i} className="bg-stone-100 p-8 md:p-16 hover:bg-white transition-colors duration-500 group cursor-pointer relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12">
                <span className="text-sm font-bold text-stone-400 font-mono">({service.id})</span>
                <h3 className="text-3xl md:text-5xl font-medium flex-1 group-hover:translate-x-4 transition-transform duration-500">
                  {service.title}
                </h3>
                <p className="text-stone-500 md:max-w-xs text-sm md:text-base mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {service.desc}
                </p>
                <div className="md:ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:rotate-45">
                    <ArrowUpRight size={32} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ t }: { t: typeof CONTENT['en'] }) => {
  return (
    <footer className="bg-black text-white pt-32 pb-12 px-4 md:px-12 rounded-t-[40px] relative z-40" id="contact">
      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[60vh]">
        
        <div className="flex flex-col md:flex-row justify-between gap-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-8">
              <OrnenLogo className="h-8 md:h-10 text-white" />
            </div>
            <h5 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-8">{t.footer.mission}</h5>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              {t.footer.missionText}
            </h2>
            <div className="mt-12 flex gap-4">
              <input 
                type="email" 
                placeholder="Business Email" 
                className="bg-transparent border-b border-white/20 py-4 w-full md:w-96 text-lg focus:outline-none focus:border-white transition-colors placeholder:text-stone-700"
              />
              <button className="py-4 border-b border-white/20 hover:text-stone-400 uppercase text-xs font-bold tracking-widest whitespace-nowrap">
                Get Popular
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:text-right">
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">Platforms</h5>
              <a href="#" className="block hover:text-white text-stone-400 transition-colors">WeChat 微信</a>
              <a href="#" className="block hover:text-white text-stone-400 transition-colors">XiaoHongShu 小红书</a>
              <a href="#" className="block hover:text-white text-stone-400 transition-colors">Douyin 抖音</a>
              <a href="#" className="block hover:text-white text-stone-400 transition-colors">Instagram</a>
            </div>
            <div className="space-y-3 mt-8">
              <h5 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">Global Hubs</h5>
              <p className="text-stone-400">Shanghai, CN</p>
              <p className="text-stone-400">London, UK</p>
              <p className="text-stone-400">New York, USA</p>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <OrnenLogo className="h-6 opacity-50" />
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main App Component ---

const App = () => {
  const [lang, setLang] = useState<'en' | 'cn'>('en');
  const t = CONTENT[lang];

  useEffect(() => {
    // Load ElevenLabs Widget Script
    const scriptId = 'elevenlabs-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    // Smooth Scroll
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => { 
      document.documentElement.style.scrollBehavior = 'auto'; 
    };
  }, []);

  return (
    <div className="bg-black min-h-screen selection:bg-white selection:text-black font-sans">
      <Header lang={lang} setLang={setLang} t={t} />
      
      <main>
        <Hero t={t} />
        
        <div id="works">
          <StickySection 
            img={ASSETS.img1}
            number="01" 
            title={t.work.case1.title}
            desc={t.work.case1.desc}
          />
          
          <StickySection 
            align="right"
            img={ASSETS.img2}
            number="02" 
            title={t.work.case2.title}
            desc={t.work.case2.desc}
          />
          
          <StickySection 
            img={ASSETS.img3}
            number="03" 
            title={t.work.case3.title}
            desc={t.work.case3.desc}
          />
        </div>

        <ServicesList t={t} />
        
        <section className="h-[80vh] flex items-center justify-center bg-white text-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 mix-blend-multiply">
             <img src={ASSETS.bgPattern} className="w-full h-full object-cover" alt="Background" />
          </div>
          <div className="relative z-10 text-center space-y-8 px-4 max-w-4xl mx-auto">
             <span className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">
                Turn Viewers Into Buyers
             </span>
             <h2 className="text-6xl md:text-8xl font-serif tracking-tighter leading-tight">
               Make your brand <br/> <span className="italic text-stone-500">unforgettable.</span>
             </h2>
             <div className="pt-8">
               <a 
                 href="#contact" 
                 className="inline-flex items-center gap-4 px-12 py-5 bg-black text-white rounded-full hover:bg-stone-800 transition-all duration-300 text-sm font-bold uppercase tracking-widest hover:scale-105"
               >
                 {t.nav.touch} <ArrowRight size={16} />
               </a>
             </div>
          </div>
        </section>
      </main>

      <Footer t={t} />

      {/* Text Agent - Positioned to the left */}
      <elevenlabs-convai 
        agent-id="agent_5901kgcax88hfn9v9q383d23rn8k"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '90px', // Offset to allow space for the voice agent
          zIndex: 50,
          transform: 'scale(0.8)',
          transformOrigin: 'bottom right'
        }}
      ></elevenlabs-convai>
      
      {/* Voice Chat Agent - Positioned to the right */}
      <elevenlabs-convai 
        agent-id="agent_0501kgcaby7tepa8tvnv548g3mkp"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 50,
          transform: 'scale(0.8)',
          transformOrigin: 'bottom right'
        }}
      ></elevenlabs-convai>
    </div>
  );
};

export default App;