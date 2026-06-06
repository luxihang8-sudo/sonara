import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { TRACKS } from '../data/tracks';
import { ARTISTS } from '../data/artists';
import { Track } from '../types';
import { motion } from 'motion/react';
import { Play, Pause, ShoppingCart, Disc, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function AlbumDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState<Track | null>(null);
  const coverOverride = searchParams.get('cover');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'DIGITAL' | 'VINYL' | 'CD'>('VINYL');
  const { addToCart } = useCart();

  useEffect(() => {
    const foundTrack = TRACKS.find(t => t.id === id);
    if (foundTrack) {
      setTrack(foundTrack);
    }
  }, [id]);

  if (!track) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
        <div className="text-xl text-neutral-400">Loading album details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <Link to="/" className="inline-flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors mb-12 group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase tracking-widest text-xs font-semibold">Back to Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Cover Art */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-32"
          >
            <div className="relative group rounded-lg overflow-hidden shadow-2xl" style={{ boxShadow: `0 20px 60px -15px ${track.color}40` }}>
              <img 
                src={coverOverride || track.coverUrl} 
                alt={track.title} 
                className="w-full aspect-square object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-6 px-2 text-neutral-400">
              <span className="font-mono text-xs tracking-widest">T-ID: {track.twinId}</span>
              <div className="flex space-x-4">
                <button className="hover:text-white transition-colors"><Heart size={20} /></button>
                <button className="hover:text-white transition-colors"><Share2 size={20} /></button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2 text-white">
                {track.title}
              </h1>
              <Link to={`/artist/${encodeURIComponent(track.artist)}?cover=${encodeURIComponent(coverOverride || track.coverUrl)}`} className="text-xl md:text-2xl text-neutral-400 font-light hover:text-[#BAFF39] transition-colors inline-block">
                {track.artist}
              </Link>
            </div>

            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-neutral-300">
                {track.releaseYear}
              </span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-neutral-300">
                {track.genre}
              </span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-[#BAFF39]">
                {track.bpm} BPM
              </span>
            </div>

            {/* Introduction */}
            <div className="prose prose-invert max-w-none mb-12">
              <p className="text-neutral-300 leading-relaxed font-light text-sm md:text-base">
                {track.description}
              </p>
            </div>

            {/* Pricing Configurator */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 md:p-8 mb-12">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-neutral-400 mb-6 flex items-center space-x-2">
                <Disc size={16} />
                <span>Full Album Formats</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { id: 'DIGITAL', label: 'Digital', price: '9.99' },
                  { id: 'VINYL', label: '12" Vinyl', price: '34.99', popular: true },
                  { id: 'CD', label: 'Audio CD', price: '14.99' }
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id as any)}
                    className={`relative p-4 rounded-xl border text-left transition-all ${
                      selectedFormat === format.id 
                        ? 'bg-white/10 border-[#BAFF39] text-white shadow-[0_0_20px_rgba(186,255,57,0.1)]' 
                        : 'bg-black border-white/5 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    {format.popular && (
                      <span className="absolute -top-3 right-4 bg-[#BAFF39] text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Popular
                      </span>
                    )}
                    <div className="text-sm font-medium mb-1">{format.label}</div>
                    <div className="text-lg font-mono">${format.price}</div>
                  </button>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    addToCart(track, selectedFormat === 'DIGITAL' ? 'Digital' : 'Vinyl', coverOverride || track.coverUrl);
                    navigate('/cart');
                  }}
                  className="flex-1 bg-[#BAFF39] hover:bg-[#a6ec27] text-black font-bold py-4 px-6 rounded-full transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>
                <button 
                  onClick={() => {
                    addToCart(track, selectedFormat === 'DIGITAL' ? 'Digital' : 'Vinyl', coverOverride || track.coverUrl);
                    navigate('/checkout');
                  }}
                  className="flex-1 bg-white hover:bg-neutral-200 text-black font-bold py-4 px-6 rounded-full transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Buy Full Album</span>
                </button>
              </div>
            </div>

            {/* Tracklist Preview & Track-level Purchasing */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-neutral-400 flex items-center space-x-2">
                  <Play size={16} />
                  <span>Tracklist & Preview</span>
                </h3>
                <span className="text-xs font-mono text-neutral-500">30s Audio Snippets</span>
              </div>
              
              <div className="space-y-2">
                {[
                  { no: 1, title: track.title, duration: track.duration, isPreview: true, price: '1.29' },
                  { no: 2, title: 'B-Side Continuation', duration: '4:12', isPreview: true, price: '1.29' },
                  { no: 3, title: 'Instrumental Mix', duration: '5:40', isPreview: true, price: '0.99' },
                  { no: 4, title: 'Radio Edit', duration: '3:15', isPreview: false, price: '0.99' },
                ].map((t) => (
                  <div key={t.no} className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-black/40 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all gap-4 sm:gap-0">
                    <div className="flex items-center space-x-4">
                      <span className="font-mono text-xs text-neutral-500 w-6 text-right hidden sm:block">{t.no}</span>
                      <button 
                        className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center transition-colors ${
                          t.isPreview ? 'bg-[#BAFF39]/20 text-[#BAFF39] hover:bg-[#BAFF39] hover:text-black' : 'bg-transparent text-neutral-600 block'
                        }`}
                        onClick={() => t.isPreview && setIsPlaying(!isPlaying)}
                        disabled={!t.isPreview}
                      >
                        {t.isPreview ? (isPlaying && t.no === 1 ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />) : <Play size={14} className="ml-0.5 opacity-50" />}
                      </button>
                      <div className="flex flex-col">
                        <span className={`text-sm ${t.isPreview ? 'text-white' : 'text-neutral-500'}`}>{t.title}</span>
                        {!t.isPreview && <span className="text-[10px] text-neutral-600 uppercase tracking-widest mt-0.5">Preview Unavailable</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto sm:space-x-6 pl-12 sm:pl-0">
                      <span className="font-mono text-xs text-neutral-500 hidden sm:block">{t.duration}</span>
                      <button className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-[#BAFF39] hover:text-[#BAFF39] transition-colors text-xs font-mono text-neutral-300">
                        <span>${t.price}</span>
                        <div className="w-px h-3 bg-white/20 mx-1"></div>
                        <ShoppingCart size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Artist Bio & Credits */}
            <div className="border-t border-white/10 pt-12 mt-12 pb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white tracking-tight">About {track.artist}</h3>
                <Link to={`/artist/${encodeURIComponent(track.artist)}?cover=${encodeURIComponent(coverOverride || track.coverUrl)}`} className="text-xs font-bold uppercase tracking-widest text-[#BAFF39] hover:underline">View Profile →</Link>
              </div>
              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-neutral-400 font-light text-sm leading-relaxed">
                  {ARTISTS[track.artist]?.bio || `An enigmatic presence in the ${track.genre.toLowerCase()} electronic scene, ${track.artist} brings a unique synthesis of organic instrumentation and brutalist synthesizer soundscapes. Their work continuously bridges the gap between retro-futurism and modern algorithmic composition, challenging the conventional structures of dance and ambient music.`}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <span className="text-neutral-500 block mb-1">Record Label</span>
                  <span className="text-neutral-300 font-medium">Sona Digital Recordings</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">Release Date</span>
                  <span className="text-neutral-300 font-mono">OCT 24, {track.releaseYear}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">Catalog Number</span>
                  <span className="text-neutral-300 font-mono text-xs tracking-widest">SDR-0{Math.floor(Math.random() * 90) + 10}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">Mastering</span>
                  <span className="text-neutral-300 font-medium">Analog Vault Studios</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
