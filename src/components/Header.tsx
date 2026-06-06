import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { items } = useCart();
  const { language, setLanguage, t } = useLanguage();

  // Show/Hide Header on dynamic scrolling
  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - prevScroll;
    if (latest < 50) {
      setHidden(false);
    } else if (diff > 15) {
      // Scrolling down -> hide
      setHidden(true);
    } else if (diff < -10) {
      // Scrolling up -> show
      setHidden(false);
    }
    setPrevScroll(latest);
  });

  const categoryLink = (text: string, to: string, colorClass = "text-[#BAFF39] hover:text-[#BAFF39]/85") => {
    return (
      <Link
        to={to}
        className={`group relative flex items-center space-x-0.5 text-xs font-medium uppercase tracking-[0.08em] ${colorClass} transition-all duration-300`}
      >
        <span className="relative overflow-hidden pr-1">
          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-px">{text}</span>
        </span>
        <span className="inline-block transition-transform duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#BAFF39] text-[10px]">
          ↗
        </span>
      </Link>
    );
  };

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full z-50 bg-transparent h-16 flex items-center px-6 md:px-12 justify-between"
      >
        {/* Left: Brand Logo */}
        <div className="flex items-center space-x-12">
          <Link
            to="/"
            className="text-2xl font-black lowercase tracking-tighter text-[#FFFFFF] select-none hover:opacity-90 transition-opacity flex items-center space-x-1.5"
          >
            <span className="text-[#BAFF39]">sonara</span>
            <span className="w-1.5 h-1.5 bg-[#BAFF39] rounded-full"></span>
          </Link>

          {/* Middle Left: Category links */}
          <nav className="hidden lg:flex items-center space-x-6 border-l border-[#262626] pl-12">
            {categoryLink(t('Discover'), '/discover')}
            {categoryLink(items.length > 0 ? `${t('Cart (')}${items.length})` : t('Cart'), '/cart')}
          </nav>
        </div>

        {/* Middle Right Links & Right Section */}
        <div className="flex items-center space-x-8">
          <nav className="hidden md:flex items-center space-x-6">
            {categoryLink(t('For Artists'), '/artists', 'text-[#BAFF39] hover:text-[#BAFF39]/85')}
            <button
              onClick={() => setShowAbout(true)}
              className="group relative flex items-center space-x-0.5 text-xs font-medium uppercase tracking-[0.08em] text-[#BAFF39] hover:text-[#BAFF39]/85 transition-all duration-300"
            >
              <span className="relative overflow-hidden pr-1">
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-px">{t('About')}</span>
              </span>
              <span className="inline-block transition-transform duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#BAFF39] text-[10px]">
                ↗
              </span>
            </button>
          </nav>

          <div className="flex items-center space-x-6">
            {/* Slogan & UI indicator */}
            <span className="hidden xl:inline-block text-[10px] text-[#737373] tracking-widest uppercase text-end font-mono leading-none border-r border-[#262626] pr-6">
              {t('Better music')} <br />
              {t('streaming for everyone.')}
            </span>

            {categoryLink(t('Login'), '/login', 'text-[#BAFF39] hover:text-[#BAFF39]/85')}
            
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1 text-[#BAFF39] hover:text-[#BAFF39]/80 transition-colors"
              >
                <Globe size={18} />
              </button>
              
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-4 w-40 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl py-2 flex flex-col z-[100]"
                  >
                    {[
                      { code: 'en', label: 'English' },
                      { code: 'zh-CN', label: '简体中文' },
                      { code: 'zh-TW', label: '繁體中文' },
                      { code: 'fr', label: 'Français' },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as Language);
                          setShowLangMenu(false);
                        }}
                        className={`px-4 py-2 text-left text-xs uppercase tracking-widest font-mono transition-colors ${
                          language === lang.code 
                            ? 'bg-[#BAFF39]/10 text-[#BAFF39]' 
                            : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40"
            onClick={() => setShowAbout(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center max-w-2xl px-6"
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase text-white hover:text-[#BAFF39] transition-colors cursor-default">sonara</h1>
              <p className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed cursor-default">
                {t('about_desc')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
