import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Twitter, Instagram, ArrowUpRight, Check, Sparkles, Youtube, Layers } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1000);
  };

  const footerLinksLeft = [
    { name: 'Twitter', url: '#', icon: <Twitter size={12} /> },
    { name: 'Instagram', url: '#', icon: <Instagram size={12} /> },
    { name: 'Discord', url: '#', icon: <Layers size={12} /> },
  ];

  const footerLinksRight = [
    { name: 'Media Kit', url: '#' },
    { name: 'FAQ & Docs', url: '#' },
    { name: 'Terms of Use', url: '#' },
    { name: 'Privacy Policy', url: '#' },
  ];

  // Marquee vectors (Grainy Lo-fi stage elements drawn as elegant SVGs to ensure immediate, lightweight load)
  const marqueeItems = [
    { title: 'VINYL PRESS', desc: 'Analog lathe cutting', accent: '#BAFF39' },
    { title: 'STAGE FLOOD', desc: 'Sona Live Showcase', accent: '#06B6D4' },
    { title: 'SIGNAL FEED', desc: 'Eurorack modular wall', accent: '#EC4899' },
    { title: 'STUDIO BOOTH', desc: 'Vocal capturing 96kHz', accent: '#8B5CF6' },
    { title: 'MASTER DECK', desc: 'SSL 9000J Console', accent: '#F97316' },
  ];

  return (
    <footer className="relative bg-black text-[#737373] border-t border-[#111] overflow-hidden">
      
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Call to Action */}
        <div className="col-span-1 md:col-span-7 flex flex-col justify-center space-y-6">
          <span className="text-xs font-mono text-[#BAFF39] tracking-widest uppercase flex items-center space-x-2">
            <Sparkles size={12} className="animate-spin text-[#BAFF39]" style={{ animationDuration: '4s' }} />
            <span>THE NEXT MATRIX GENERATION</span>
          </span>

          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">
            The future <br />
            sounds <span className="text-[#BAFF39]">good</span>.
          </h2>

          <p className="text-sm text-[#A3A3A3] max-w-md font-medium leading-relaxed">
            Subscribe below to receive notification channels upon protocol genesis, live-stage event lineups, and active record drop cycles.
          </p>

          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form 
                  key="opt-in-form"
                  onSubmit={handleSubmit}
                  className="flex items-center bg-black border border-[#222] focus-within:border-[#BAFF39] rounded-md overflow-hidden transition-all h-12 pr-1"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-sm text-white px-4 outline-none font-medium placeholder-[#525252]"
                  />
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="h-10 bg-white hover:bg-[#BAFF39] text-black font-semibold uppercase px-5 rounded text-xs tracking-widest font-mono cursor-pointer transition-colors flex-shrink-0 flex items-center justify-center"
                  >
                    {submitting ? '...' : 'SUBSCRIBE'}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="opt-in-success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#BAFF39]/5 border border-[#BAFF39]/20 p-4 rounded-md flex items-center space-x-3 text-[#BAFF39] font-mono text-xs"
                >
                  <Check size={16} strokeWidth={3.5} />
                  <span>TRANSACTION INTEGRATED: WE WILL REACH OUT</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Black-and-White Lo-fi running Marquee (Vertical Scrolling Tape) */}
        <div className="col-span-1 md:col-span-5 h-[320px] bg-[#050505] border border-[#161616] rounded-2xl relative overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
          
          {/* Moving tape list container */}
          <div className="w-full h-full flex flex-col justify-around relative">
            <motion.div 
              animate={{ y: [0, -400] }}
              transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
              className="absolute w-full space-y-4"
            >
              {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-[#0b0b0b] border border-[#1e1e1e] rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.accent }} />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white">{item.title}</h4>
                      <p className="text-[10px] text-[#525252] font-mono mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-[#404040]">LIVE_FEED</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>

      {/* Bottom Legal, Links & Copyright Section */}
      <div className="border-t border-[#111] bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Social Links on left */}
          <div className="flex items-center space-x-6">
            {footerLinksLeft.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                onClick={(e) => e.preventDefault()}
                className="hover:text-white transition-colors duration-250 font-mono text-xs uppercase tracking-wider flex items-center space-x-1.5"
              >
                {link.icon}
                <span>{link.name}</span>
              </a>
            ))}
          </div>

          {/* Quick links on middle right */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinksRight.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                onClick={(e) => e.preventDefault()}
                className="hover:text-white transition-colors duration-250 font-mono text-[11px] uppercase tracking-wider"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Core watermark label */}
          <div className="text-[10px] font-mono text-[#525252] tracking-wider text-center sm:text-right">
            <span>© 2026 Sona Inc. ALL PLATFORM AUTONOMY COMMITTED.</span>
          </div>

        </div>
      </div>

    </footer>
  );
}
