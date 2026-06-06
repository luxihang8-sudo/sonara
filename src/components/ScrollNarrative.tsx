import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Mail, Disc, Smartphone, HelpCircle, ArrowUpRight, Check, Heart, Trophy, Percent, ShieldCheck 
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

export default function ScrollNarrative() {
  // Setup nice scroll bounds animations
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Section 1 Email onboarding hooks
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState('');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Generate a nice retro receipt transaction ID
      const txId = 'SONA-ETH-' + Math.floor(100000 + Math.random() * 900000);
      setTicketNo(txId);
    }, 1200);
  };

  // Section 3: Vinyl and matrix interactive states
  const [vinylRpm, setVinylRpm] = useState(33); // 33 for normal, 45 for spin-out, 0 for paused
  const [gridMorphRatio, setGridMorphRatio] = useState(9); // Dot matrix (9 -> 6 -> 9)

  // Toggle dot matrix between 9 and 6 dots
  useEffect(() => {
    const timer = setInterval(() => {
      setGridMorphRatio(prev => (prev === 9 ? 6 : 9));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const artists = [
    {
      name: 'Gavin Turek',
      role: 'Nu-Disco Sovereign',
      city: 'Los Angeles, CA',
      tag: 'COLLABORATOR',
      color: 'from-pink-500/20 to-indigo-500/10',
      avatar: 'G'
    },
    {
      name: 'Cakes da Killa',
      role: 'Vogue-Rap Icon',
      city: 'Brooklyn, NY',
      tag: 'CURATOR',
      color: 'from-orange-500/20 to-red-500/10',
      avatar: 'C'
    },
    {
      name: 'Life On Planets',
      role: 'Deep House Alchemist',
      city: 'Baltimore, MD',
      tag: 'EARLY PIONEER',
      color: 'from-cyan-500/20 to-blue-500/10',
      avatar: 'L'
    }
  ];

  return (
    <div ref={sectionRef} className="relative bg-transparent text-white w-full overflow-hidden">
      
      {/* SECTION 1: 平台引言 (Platform Intro) */}
      <section className="relative min-h-[90vh] flex flex-col justify-center py-16 px-6 md:px-12 border-b border-white/5 z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          
          {/* Left Side: Interactive Simulated Digital iPhone */}
          <div className="col-span-1 md:col-span-6 flex justify-center">
            <motion.div 
              whileHover={{ rotateY: 5, rotateX: -5 }}
              style={{ perspective: 1200 }}
              className="relative w-[280px] h-[560px] md:w-[320px] md:h-[620px] bg-[#0A0A0A] border-[6px] border-[#1f1f1f] rounded-[40px] p-4 shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(186,255,57,0.03)] flex flex-col justify-between overflow-hidden"
            >
              {/* Dynamic status nodes */}
              <div className="w-full flex justify-between items-center px-4 font-mono text-[9px] text-[#525252] pt-2">
                <span>06:58 PM</span>
                <div className="w-20 h-4 bg-black border border-[#1f1f1f] rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BAFF39] animate-ping" />
                </div>
                <span>5G 🔋</span>
              </div>

              {/* Sona Phone UI Display Viewports */}
              <div className="flex-grow flex flex-col justify-center items-center py-6 mt-2 relative">
                {/* Simulated Spinning Vinyl on Phone */}
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border border-[#222] bg-gradient-to-br from-[#121212] via-black to-[#1a1a1a] shadow-[0_12px_24px_rgba(0,0,0,0.5)] flex items-center justify-center p-6 mb-8 group overflow-hidden">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-white/5 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] opacity-80"
                  />
                  {/* Decorative record ridges */}
                  <div className="absolute inset-2 rounded-full border border-zinc-800/20" />
                  <div className="absolute inset-5 rounded-full border border-zinc-800/40" />
                  <div className="absolute inset-8 rounded-full border border-zinc-800/60" />
                  <div className="absolute inset-12 rounded-full border border-zinc-700/80" />
                  
                  {/* Central Album graphics */}
                  <div className="w-16 h-16 rounded-full bg-[#BAFF39] flex items-center justify-center z-10 relative shadow-inner">
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                      <span className="text-[7.5px] text-[#BAFF39] font-mono">SONA</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Audio Spectrum Waves */}
                <div className="flex items-center space-x-[3px] h-8 justify-center w-full px-6">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [12, 12 + Math.sin(i * 0.5) * 16, 12]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2 + (i % 3) * 0.2,
                        ease: "easeInOut"
                      }}
                      className="w-[3px] rounded-t-full bg-[#BAFF39]/80"
                    />
                  ))}
                </div>

                {/* Active song detail HUD */}
                <div className="mt-6 text-center">
                  <span className="text-[9px] font-mono tracking-widest text-[#BAFF39] uppercase">NOW STREAMING</span>
                  <p className="text-sm font-black uppercase text-white tracking-widest mt-0.5">High Road</p>
                  <p className="text-xs text-[#737373] mt-0.5 font-medium">TOKiMONSTA</p>
                </div>
              </div>

              {/* Integrated Bottom Sona Action Buttons on Phone */}
              <div className="h-10 border-t border-[#1a1a1a] flex items-center justify-around text-xs font-mono text-[#525252] px-4">
                <span className="text-[#BAFF39]">● STREAM</span>
                <span>FAQ</span>
                <span>VOL: 70%</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Better Music copy & cofounder notes */}
          <div className="col-span-1 md:col-span-6 flex flex-col justify-center">
            {/* Tag indicator */}
            <span className="text-xs font-mono text-[#BAFF39] tracking-widest uppercase mb-4">
              // Co-Founded by DJ TOKiMONSTA
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-[0.95] mb-6">
              {t('Better music')} <br />
              <span className="text-[#BAFF39]">streaming</span> <br />
              {t('streaming for everyone.')}
            </h2>
            <div className="space-y-4 text-sm md:text-base text-[#D4D4D4] leading-relaxed font-normal">
              <p>
                Conventional streaming networks pay artists fractions of pennies per play. Sona breaks down this model by utilizing decentralized digital twin collection systems. 
              </p>
              <p>
                Founded by Grammy-nominated electronic music pioneer <strong className="text-white">DJ TOKiMONSTA</strong>, Sona unites artists, collectors, and fans directly in an elegant, audio-centric ecosystem. No middle-tier agencies. Fully transparent tokenomics.
              </p>
            </div>

            {/* Email collecting Form with premium feedback UI */}
            <div className="mt-8 relative max-w-md w-full">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    key="onboarding-form"
                    onSubmit={handleSubscribe}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col relative"
                  >
                    <label className="text-[10px] uppercase font-mono tracking-widest text-[#737373] mb-2.5 block">
                      Connect to our early system ledger:
                    </label>
                    <div className="relative flex items-center overflow-hidden bg-black border border-[#262626] focus-within:border-[#BAFF39] rounded-md transition-colors">
                      <Mail size={16} className="text-[#525252] ml-4 flex-shrink-0" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full text-sm font-medium tracking-wide text-white bg-transparent h-12 px-3 outline-none placeholder-[#404040]"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-full bg-[#111] hover:bg-[#BAFF39] hover:text-black text-white font-mono px-6 font-bold tracking-widest text-xs border-l border-[#262626] cursor-pointer flex items-center justify-center uppercase space-x-1 transition-colors flex-shrink-0"
                      >
                        {isSubmitting ? (
                          <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>{t('Join')}</span>
                            <span className="text-[10px] font-bold">↗</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success-receipt"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-[#BAFF39]/30 bg-[#BAFF39]/5 p-5 md:p-6 rounded-md font-mono"
                  >
                    <div className="flex items-center space-x-3 text-[#BAFF39]">
                      <div className="w-6 h-6 rounded-full bg-[#BAFF39]/20 flex items-center justify-center">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-xs uppercase tracking-widest font-bold">REGISTRATION COMMITTED</span>
                    </div>
                    
                    <h4 className="text-sm font-bold text-white mt-4 uppercase">SYSTEM RECEIPT # {ticketNo}</h4>
                    <p className="text-[11px] text-[#A3A3A3] mt-2 select-all">
                      BLOCKCHAIN RECORD COMPLETED FOR <strong className="text-[#BAFF39]">{email}</strong>. YOU HAVE JOINED SONA STREAMING NETWORK PORTAL.
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#262626] pt-3 text-[10px] text-[#525252] uppercase">
                      <span>TIMESTAMP: 2026-05-31</span>
                      <span>STATUS: CONFIRMED</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: 利益分配机制 (For Artists) */}
      <section className="relative min-h-[90vh] flex flex-col justify-center py-16 px-6 md:px-12 bg-transparent border-b border-white/5 z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          
          {/* Left: Headline & Manifesto */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
            className="col-span-1 md:col-span-6"
          >
            <span className="text-xs font-mono text-[#BAFF39] tracking-widest uppercase mb-4 block">
              // Artist autonomy & economics
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-[0.95] mb-6">
              {t('Free for you,')} <br />
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-[#BAFF39] inline-block"
              >
                freedom
              </motion.span> {t('freedom for artists.').replace('freedom ', '')}
            </h2>
            <div className="space-y-4 text-sm md:text-base text-[#A3A3A3] leading-relaxed max-w-xl">
              <p>
                Immediate payouts. 70% straight to creators.
              </p>
            </div>

            {/* List of high-contrast platform highlights */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
              className="mt-8 grid grid-cols-1 gap-4 max-w-md"
            >
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
                }}
                whileHover={{ scale: 1.02, x: 10, borderColor: "rgba(186,255,57,0.5)" }}
                className="flex items-start space-x-3 bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-xl cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#BAFF39]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Percent size={14} className="text-[#BAFF39]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-white">70% Split payout</h4>
                  <p className="text-[11px] text-[#737373] mt-1 leading-relaxed">Direct artists payout, setting unmatched streaming standards.</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side: Media flow. Dynamic, glowing custom graphics carousel */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="col-span-1 md:col-span-6"
          >
            <div className="text-right font-mono text-[9px] text-[#525252] pr-2 tracking-widest uppercase mb-6">
              // PARTNER SPOTLIGHTS
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {artists.slice(0, 6).map((artist, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, rotateY: 30 },
                    visible: { opacity: 1, scale: 1, rotateY: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                  whileHover={{ y: -4, scale: 1.02, borderColor: '#BAFF39' }}
                  className="bg-black/40 backdrop-blur-md border border-[#1a1a1a] rounded-xl overflow-hidden flex flex-col justify-between h-[180px] p-5 transition-all relative group shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="absolute right-0 top-0 w-24 h-24 rounded-bl-full bg-gradient-to-bl blur-3xl opacity-30 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `linear-gradient(${artist.color})` }} />
                  
                  <div className="flex justify-between items-start z-10">
                    <span className="w-10 h-10 rounded-full bg-[#111] border border-[#222] font-mono text-xs flex items-center justify-center font-bold text-[#BAFF39] shadow-inner">{artist.avatar}</span>
                    <span className="text-[9px] font-mono border border-white/10 bg-white/5 text-[#d4d4d4] px-2 py-0.5 rounded-full uppercase">{artist.tag}</span>
                  </div>

                  <div className="z-10 mt-auto transform group-hover:translate-x-1 transition-transform duration-300">
                    <h4 className="text-lg font-black uppercase text-white tracking-widest leading-tight">{artist.name}</h4>
                    <p className="text-[9px] text-[#BAFF39] font-mono mt-1 uppercase tracking-widest">{artist.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 3: 音乐收藏与权益 (For Collectors) */}
      <section className="relative min-h-[90vh] flex flex-col justify-center py-16 px-6 md:px-12 border-b border-white/5 z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          
          {/* Left Side: Modular Interactive Widgets */}
          <div className="col-span-1 md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Widget A: Dynamic Dot Matrix morphing graphics (9 dots scaling to 6) */}
            <div className="bg-[#050505] border border-[#1a1a1a] p-6 rounded-2xl flex flex-col justify-between h-[280px]">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-[#525252] uppercase tracking-[0.2em]">DOT_MATRIX MORPHER</span>
                <span className="px-2 py-0.5 border border-[#BAFF39]/30 rounded-full font-mono text-[8px] text-[#BAFF39]">{gridMorphRatio} POINT STATE</span>
              </div>

              {/* Grid interactive visual point area */}
              <div className="flex items-center justify-center py-8">
                <div className="grid grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => {
                    // Decide if dot is hidden inside "6 dots state" (hide indices 2, 5, 8 if ratio set to 6)
                    const isHiddenIn6 = [2, 5, 8].includes(i);
                    const shouldDisplay = gridMorphRatio === 9 || !isHiddenIn6;

                    return (
                      <motion.div
                        key={i}
                        animate={{
                          scale: shouldDisplay ? 1 : 0.1,
                          opacity: shouldDisplay ? 1 : 0,
                          backgroundColor: shouldDisplay ? '#BAFF39' : '#1A1A1A'
                        }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="w-4 h-4 rounded-full shadow-[0_0_8px_rgba(186,255,57,0.3)]"
                      />
                    );
                  })}
                </div>
              </div>

              <p className="text-[10px] text-[#737373] leading-relaxed font-mono">
                Visual representation of decentralized Sona node cluster structures.
              </p>
            </div>

            {/* Widget B: Rotating Black Vinyl Pitch Controller */}
            <div className="bg-[#050505] border border-[#1a1a1a] p-6 rounded-2xl flex flex-col justify-between h-[280px]">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-[#525252] uppercase tracking-[0.2em]">VINYL SPEED CTL</span>
                <span className="px-2 py-0.5 border border-[#3B82F6]/30 rounded-full font-mono text-[8px] text-[#3B82F6]">{vinylRpm} RPM UNIT</span>
              </div>

              {/* Vinyl Graphic visual */}
              <div className="flex items-center justify-center relative my-4">
                <motion.div 
                  animate={vinylRpm > 0 ? { rotate: 360 } : {}}
                  transition={{ 
                    repeat: Infinity, 
                    duration: vinylRpm === 45 ? 1.5 : vinylRpm === 33 ? 2.5 : 0, 
                    ease: "linear" 
                  }}
                  className="w-24 h-24 rounded-full bg-[#111] border-[4px] border-zinc-800 flex items-center justify-center relative overflow-hidden shadow-xl"
                >
                  <div className="absolute inset-1 rounded-full border border-black" />
                  <div className="absolute inset-2 rounded-full border border-zinc-700/50" />
                  <div className="absolute inset-4 rounded-full border border-zinc-700/80" />
                  <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  </div>
                </motion.div>
                
                {/* Vinyl ToneArm vector */}
                <div className="absolute top-2 right-12 w-1.5 h-12 bg-zinc-600 origin-top transform rotate-[15deg] pointer-events-none rounded-sm border border-black/40" />
              </div>

              {/* Multi RPM toggle pads */}
              <div className="flex space-x-2">
                {[0, 33, 45].map((rpm) => (
                  <button
                    key={rpm}
                    onClick={() => setVinylRpm(rpm)}
                    className={`flex-grow h-7 rounded text-[10px] font-bold font-mono border transition-all cursor-pointer ${
                      vinylRpm === rpm 
                        ? 'bg-white text-black border-white' 
                        : 'bg-black text-[#525252] border-[#222] hover:border-[#737373]'
                    }`}
                  >
                    {rpm === 0 ? 'STOP' : `${rpm} RPM`}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Side: Text & collectors manifesto */}
          <div className="col-span-1 md:col-span-6">
            <span className="text-xs font-mono text-[#BAFF39] tracking-widest uppercase mb-4 block">
              // Music ownership reborn (For Collectors)
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-[0.95] mb-6">
              {t('For the love')} <br />
              {t('of music.').replace('music.', '')} <span className="text-emerald-400">music</span>.
            </h2>
            <div className="space-y-4 text-sm md:text-base text-[#A3A3A3] leading-relaxed">
              <p>
                By collecting an artist’s song "Digital Twin," you acquire high-purity audio rights. Sona collectors retain 70% of the ongoing platform subscription payout generated by that specific song’s stream activity.
              </p>
              <p>
                Sona allows fans to do more than just listen — it unlocks true digital patronage. You support the creators you love while participating in the growth of their streaming presence. An authentic win-win music landscape.
              </p>
            </div>

            {/* Collector quote or detail */}
            <div className="mt-8 border-l-2 border-[#BAFF39] pl-6 py-1 select-text">
              <p className="text-sm italic text-[#D4D4D4] leading-relaxed">
                "Collecting digital twins on Sona isn't speculation — it is true, sustainable sponsorship that builds a symbiotic loop with early-stage indie talent."
              </p>
              <span className="text-[10px] uppercase font-mono text-[#737373] mt-2 block tracking-widest">— TOKiMONSTA, Sona Co-founder</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
