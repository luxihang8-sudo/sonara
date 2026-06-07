import React, { useState } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { TRACKS } from '../data/tracks';
import { ARTISTS } from '../data/artists';
import { Play, Share2, Heart, Award, ArrowLeft, Disc3, Calendar, Newspaper, Twitter, Instagram } from 'lucide-react';

// Use import.meta.glob to load all local images dynamically to prevent blank covers
const localImages = import.meta.glob('../assets/images/*.png', { eager: true, import: 'default' });
const imageList = Object.values(localImages) as string[];

const getValidCover = (url: string, trackId: string) => {
  return url;
};

export default function ArtistProfile() {
  const { name } = useParams<{ name: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const coverOverride = searchParams.get('cover');
  const [activeTab, setActiveTab] = useState<'discography' | 'news'>('discography');
  
  const decodedName = name ? decodeURIComponent(name) : 'Unknown Artist';
  
  const isMatch = (trackArtist: string, query: string) => {
    const t = trackArtist.toLowerCase();
    const q = query.toLowerCase();
    if (q === 'justin hurwitz') {
      return t.includes('ryan gosling') || t.includes('original cast');
    }
    return t.includes(q) || q.includes(t);
  };
  
  const artistTracks = TRACKS.filter(t => isMatch(t.artist, decodedName));
  
  // Provide mock generic data if artist has no tracks in our small DB
  const displayTracks = artistTracks.length > 0 ? artistTracks : [TRACKS[0], TRACKS[1], TRACKS[2]];
  const artistName = artistTracks.length > 0 ? decodedName : TRACKS[0].artist;

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 lg:px-24 max-w-[1200px] mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors mb-12 group border border-white/10 px-4 py-2 rounded-full focus:outline-none">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase tracking-widest text-xs font-semibold">Back</span>
      </button>

      {/* Artist Header */}
      <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-neutral-900 shadow-[0_0_50px_rgba(186,255,57,0.15)] relative"
        >
          <img 
            src={coverOverride || getValidCover(displayTracks[0].coverUrl, displayTracks[0].id)} 
            alt={artistName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
              {artistName}
            </h1>
            <div className="p-2 bg-[#BAFF39]/10 text-[#BAFF39] rounded-full" title="Verified Artist">
              <Award size={24} />
            </div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <button className="px-8 py-3 bg-[#BAFF39] hover:bg-[#a6ec27] text-black font-bold uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(186,255,57,0.2)] transition-colors">
              Follow
            </button>
            <div className="flex gap-2">
              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                <Share2 size={18} />
              </button>
              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-neutral-400 hover:text-white">
                <Twitter size={18} />
              </button>
            </div>
          </div>

          <div className="prose prose-invert max-w-2xl text-neutral-400 font-light text-sm md:text-base leading-relaxed">
            <p>
              {ARTISTS[artistName]?.bio || `A seminal figure in the modern music landscape, ${artistName} blends synthetic soundscapes with organic textures. Originating from the underground scenes, their trajectory has influenced a generation of independent creators. Known for intricate production and deeply emotive performances, they continue to redefine the boundaries of ${displayTracks[0].genre}.`}
            </p>
          </div>
          <div className="flex items-center gap-6 mt-6">
            <div>
              <span className="block text-xl font-mono text-white">142K</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1 block">Monthly Listeners</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <span className="block text-xl font-mono text-white">68K</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1 block">Followers</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/10 mb-8">
        <button 
          className={`pb-4 text-sm font-bold uppercase tracking-widest relative ${activeTab === 'discography' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          onClick={() => setActiveTab('discography')}
        >
          Discography
          {activeTab === 'discography' && (
            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BAFF39]" />
          )}
        </button>
        <button 
          className={`pb-4 text-sm font-bold uppercase tracking-widest relative ${activeTab === 'news' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          onClick={() => setActiveTab('news')}
        >
          News & Updates
          {activeTab === 'news' && (
            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BAFF39]" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'discography' ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2 text-white">
                <Disc3 size={20} className="text-[#BAFF39]" />
                Latest Releases
              </h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono">Albums</span>
                <span className="px-3 py-1 border border-white/10 rounded-full text-xs font-mono text-neutral-500">Singles</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayTracks.map((track, i) => {
                const cover = i === 0 && coverOverride ? coverOverride : getValidCover(track.coverUrl, track.id);
                return (
                <Link to={`/album/${track.id}?cover=${encodeURIComponent(cover)}`} key={i} className="group flex flex-col">
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-neutral-900 border border-white/5">
                    <img 
                      src={cover} 
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#BAFF39] text-black flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform shadow-[0_0_20px_rgba(186,255,57,0.5)]">
                        <Play fill="currentColor" size={20} className="ml-1" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-white group-hover:text-[#BAFF39] transition-colors truncate">
                    {track.title}
                  </h3>
                  <p className="text-xs font-medium text-neutral-400 mt-1 uppercase tracking-wider">
                    {track.releaseYear} • {track.genre}
                  </p>
                </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl">
            {[
              {
                date: 'OCT 24, 2026',
                title: 'New Album "Synthetic Horizon" Announced',
                excerpt: 'The highly anticipated follow-up project exploring the intersection of biological and synthetic frequencies will be available next month.'
              },
              {
                date: 'SEP 12, 2026',
                title: 'Live Performance at Neon Fest',
                excerpt: 'Join us for an immersive 3D audio-visual experience in Berlin. Exclusive vinyl pressings will be available at the merch booth.'
              },
              {
                date: 'AUG 05, 2026',
                title: 'Studio Session Drop',
                excerpt: 'A behind-the-scenes look at the analog synthesizers used to craft the latest single. Raw patches and sequences.'
              }
            ].map((news, i) => (
              <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-xl p-6 hover:bg-neutral-900 hover:border-white/10 transition-colors group">
                <div className="flex items-center gap-2 text-neutral-500 font-mono text-xs mb-3">
                  <Calendar size={14} />
                  <span>{news.date}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#BAFF39] transition-colors">{news.title}</h3>
                <p className="text-neutral-400 text-sm font-light leading-relaxed mb-4">{news.excerpt}</p>
                <button className="text-xs font-bold uppercase tracking-widest text-[#BAFF39] flex items-center gap-1 group-hover:underline">
                  Read More
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
