import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Star, Zap, Filter, Headphones, Music, Mic2, Radio, Disc3, RadioReceiver } from 'lucide-react';
import { TRACKS } from '../data/tracks';
import { Track } from '../types';

const getValidCover = (url: string, trackId: string) => {
  return url;
};

const GENRES = [
  { id: 'pop', name: 'Pop', filterStrings: ['pop'], icon: <Star size={24} />, color: '#3B82F6' },
  { id: 'rock', name: 'Rock', filterStrings: ['rock'], icon: <Zap size={24} />, color: '#EF4444' },
  { id: 'folk', name: 'Folk', filterStrings: ['folk'], icon: <Headphones size={24} />, color: '#10B981' },
  { id: 'electronic', name: 'Electronic', filterStrings: ['electronic'], icon: <Disc3 size={24} />, color: '#D946EF' },
  { id: 'soundtrack', name: 'Soundtrack', filterStrings: ['soundtrack'], icon: <Music size={24} />, color: '#8B5CF6' },
  { id: 'hiphop', name: 'Hip-Hop / Rap', filterStrings: ['hip-hop'], icon: <Mic2 size={24} />, color: '#EC4899' },
  { id: 'alternative', name: 'Alternative', filterStrings: ['alternative'], icon: <Radio size={24} />, color: '#F59E0B' },
];

const TAGS = [
  'All',
  '1990s',
  '2000s',
  '2010s',
  '2020s'
];

export default function Discover() {
  const [activeTag, setActiveTag] = useState('All');
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const displayTracks = React.useMemo(() => {
    let result = [...TRACKS];
    if (activeTag !== 'All') {
      const decadeStr = activeTag.replace('s', '');
      const decadeStart = parseInt(decadeStr, 10);
      result = result.filter(t => t.releaseYear >= decadeStart && t.releaseYear < decadeStart + 10);
    }
    if (activeGenre) {
      const genreObj = GENRES.find(g => g.id === activeGenre);
      if (genreObj) {
        result = result.filter(t => {
          const gLower = t.genre.toLowerCase();
          return genreObj.filterStrings.some(s => gLower.includes(s));
        });
      }
    }
    return result;
  }, [activeTag, activeGenre]);

  const weeklyBestSellers = TRACKS.slice(0, 5);
  const newReleases = TRACKS.slice(5, 10);
  const editorsPicks = TRACKS.slice(10, 15);

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase">
          Discover
        </h1>
        <p className="text-neutral-400 font-light text-lg max-w-2xl">
          Explore curated genres, find rare vinyls, and discover independent artists from across the globe.
        </p>
      </motion.div>

      {/* Tag Filtering Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex mb-12 overflow-x-auto pb-4 scrollbar-hide space-x-3 items-center"
      >
        <div className="flex-shrink-0 text-neutral-500 mr-2 flex items-center">
          <Filter size={16} className="mr-2" />
          <span className="text-xs font-mono uppercase tracking-widest">Filter</span>
        </div>
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTag === tag
                ? 'bg-[#BAFF39] text-black shadow-[0_0_15px_rgba(186,255,57,0.4)]'
                : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      {/* Genre Hubs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-6">Genre Hubs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setActiveGenre(activeGenre === genre.id ? null : genre.id)}
              className={`relative group overflow-hidden rounded-xl aspect-[4/3] flex flex-col items-center justify-center transition-all ${
                activeGenre === genre.id
                  ? 'bg-white/10 ring-2 ring-[#BAFF39] shadow-[0_0_30px_rgba(186,255,57,0.15)]'
                  : 'bg-black border border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" 
                style={{ background: `radial-gradient(circle at center, ${genre.color}, transparent 70%)` }}
              />
              <div className={`mb-3 transition-transform group-hover:scale-110 duration-500 ${activeGenre === genre.id ? 'text-[#BAFF39]' : 'text-neutral-400 group-hover:text-white'}`}>
                {genre.icon}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest relative z-10 ${activeGenre === genre.id ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`}>
                {genre.name}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content Area: Filtered Albums */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h2 className="text-xl font-bold tracking-tight text-white uppercase">
              {activeTag === 'All' ? 'Curated Catalog' : activeTag}
            </h2>
            <span className="text-xs font-mono text-neutral-500">{displayTracks.length} Results</span>
          </div>

          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {displayTracks.map((track, i) => (
                <motion.div
                  layout
                  key={track.id}
                  initial={{ opacity: 0, scale: 0.8, y: 30, rotateX: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20, filter: 'blur(10px)' }}
                  transition={{ 
                    duration: 0.5, 
                    delay: i * 0.03, // faster stagger
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  className="group relative flex flex-col perspective-1000"
                >
                  <Link 
                    to={`/album/${track.id}?cover=${encodeURIComponent(getValidCover(track.coverUrl, track.id))}`} 
                    className="flex flex-col bg-neutral-900/40 border border-white/5 rounded-xl overflow-hidden transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgba(186,255,57,0.15)] hover:border-white/10 hover:-translate-y-2 h-full"
                  >
                    <div className="relative aspect-square overflow-hidden bg-black">
                      <motion.img 
                        src={getValidCover(track.coverUrl, track.id)} 
                        alt={track.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                        referrerPolicy="no-referrer"
                        whileHover={{ rotateZ: 2 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[#BAFF39] flex items-center justify-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out shadow-[0_0_30px_rgba(186,255,57,0.6)] group-hover:scale-110 hover:bg-[#BAFF39] hover:text-black">
                          <Play fill="currentColor" size={24} className="ml-1" />
                        </div>
                      </div>
                      {/* Decorative Elements */}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {i % 3 === 0 && (
                          <span className="bg-black/80 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-white/10 group-hover:bg-[#BAFF39] group-hover:text-black transition-colors duration-300">
                            Vinyl
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <div>
                        <h3 className="text-sm font-bold tracking-tight text-white group-hover:text-[#BAFF39] transition-colors truncate drop-shadow-md">
                          {track.title}
                        </h3>
                        <p className="text-xs font-medium text-neutral-400 mt-1 uppercase tracking-wider truncate">
                          {track.artist}
                        </p>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-600 mt-4 flex items-center space-x-2">
                         <span className="w-2 h-2 rounded-full inline-block" style={{ background: track.color || '#BAFF39', boxShadow: `0 0 10px ${track.color || '#BAFF39'}` }} />
                         <span>{track.genre}</span>
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Sidebar: Charts / Leaderboards */}
        <div className="lg:col-span-4 space-y-12">
          {/* Weekly Best Sellers */}
          <ChartSection title="Weekly Best Sellers" icon={<TrendingUp size={16} className="text-[#BAFF39]" />} tracks={weeklyBestSellers} />
          
          {/* New Releases */}
          <ChartSection title="New Releases" icon={<Zap size={16} className="text-[#06B6D4]" />} tracks={newReleases} />
          
          {/* Editor's Picks */}
          <ChartSection title="Editor's Picks" icon={<Star size={16} className="text-[#EC4899]" />} tracks={editorsPicks} />
        </div>
      </div>
    </div>
  );
}

function ChartSection({ title, icon, tracks }: { title: string, icon: React.ReactNode, tracks: Track[] }) {
  return (
    <div className="bg-neutral-900/50 rounded-2xl border border-white/5 p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-widest text-white">{title}</h3>
      </div>
      <div className="space-y-4">
        {tracks.map((track, i) => (
          <Link key={track.id} to={`/album/${track.id}?cover=${encodeURIComponent(getValidCover(track.coverUrl, track.id))}`} className="group flex items-center space-x-4">
            <span className="text-xs font-mono font-bold text-neutral-600 group-hover:text-white transition-colors w-4">{i + 1}</span>
            <div className="w-12 h-12 bg-neutral-800 rounded flex-shrink-0 overflow-hidden relative">
              <img 
                src={getValidCover(track.coverUrl, track.id)} 
                alt={track.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-neutral-200 group-hover:text-[#BAFF39] transition-colors truncate">
                {track.title}
              </h4>
              <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mt-0.5 truncate">
                {track.artist}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <button className="w-full mt-6 py-3 px-4 border border-white/10 rounded-lg text-xs font-bold text-neutral-400 uppercase tracking-widest hover:border-white/30 hover:text-white transition-all flex justify-between items-center group">
        <span>View Full Chart</span>
        <span className="text-[#BAFF39] transition-transform group-hover:translate-x-1">→</span>
      </button>
    </div>
  );
}
