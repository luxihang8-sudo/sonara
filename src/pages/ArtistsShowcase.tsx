import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ARTISTS } from '../data/artists';
import { Link } from 'react-router-dom';

const artistsList = Object.values(ARTISTS);

export default function ArtistsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="text-white relative bg-transparent min-h-screen">
      <div className="pt-28 pb-12 px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto text-center sticky top-0 z-10 bg-black/40 backdrop-blur-md border-b border-white/5">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
          Featured Artists
        </h1>
        <p className="text-neutral-400 font-light text-lg">
          The brilliant minds and creators behind the sounds of sonara.
        </p>
      </div>

      <div ref={containerRef} className="relative mt-8">
        {artistsList.slice(0, 6).map((artist, index) => (
          <ArtistCard key={artist.name} artist={artist} index={index} total={Math.min(6, artistsList.length)} />
        ))}
      </div>
      <div className="h-32 bg-transparent"></div>
    </div>
  );
}

const ArtistCard: React.FC<{ artist: any; index: number; total: number }> = ({ artist, index, total }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start']
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <div 
      ref={cardRef} 
      className="sticky top-40 h-[70vh] min-h-[500px] w-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-center mb-12 origin-top"
      style={{ zIndex: index }}
    >
      <motion.div 
        style={{ scale, opacity }}
        className="w-full h-full bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col-reverse md:flex-row shadow-[0_-20px_50px_rgba(0,0,0,0.8)] relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#BAFF39]/10 rounded-full blur-[100px] pointer-events-none"></div>
        {/* Left Side: Info */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-[#BAFF39]"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#BAFF39]">Artist Showcase</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">
            {artist.name}
          </h2>
          <p className="text-neutral-300 md:text-lg font-light leading-relaxed mb-10 max-w-xl">
            {artist.bio}
          </p>
          <div>
            <Link 
              to={`/artist/${encodeURIComponent(artist.name)}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-wider rounded-full hover:bg-[#BAFF39] transition-colors group"
            >
              Explore Discography
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Portrait */}
        <div className="flex-1 relative h-64 md:h-full bg-black">
          <img 
            src={artist.portraitUrl} 
            alt={artist.name} 
            className="w-full h-full object-cover border-l border-white/5 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-neutral-900 to-transparent"></div>
        </div>
      </motion.div>
    </div>
  );
}
