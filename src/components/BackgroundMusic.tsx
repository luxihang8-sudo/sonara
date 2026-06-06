import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, SkipBack, SkipForward, Music } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

const BGM_TRACKS = [
  { name: 'Stream 1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { name: 'Stream 2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { name: 'Stream 3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { name: 'Stream 4', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
];

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { t } = useLanguage();

  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // setIsPlaying(true); // Don't auto-force play on first click, let user choose
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play error:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev - 1 + BGM_TRACKS.length) % BGM_TRACKS.length);
    setIsPlaying(true);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % BGM_TRACKS.length);
    setIsPlaying(true);
  };

  const currentTrack = BGM_TRACKS[currentTrackIndex];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-black/80 backdrop-blur-md px-3 py-2 border border-white/10 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all hover:bg-black/90">
      <audio 
        ref={audioRef} 
        src={currentTrack.url}
        loop 
      />
      
      <div className="flex flex-col items-start pr-2 border-r border-white/10">
        <span className="text-[9px] uppercase font-mono tracking-widest text-[#BAFF39]">
          {t('BGM')}
        </span>
        <span className="text-[10px] uppercase font-mono tracking-widest text-white truncate max-w-[80px]">
          {currentTrack.name}
        </span>
      </div>

      <div className="flex items-center space-x-1 pl-1">
        <button 
          onClick={handlePrev}
          className="text-white hover:text-[#BAFF39] transition-colors p-1"
          title="Previous Track"
        >
          <SkipBack size={12} />
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
          className={`text-white hover:text-[#BAFF39] transition-colors flex items-center justify-center p-1.5 rounded-full ${!isPlaying ? 'text-[#BAFF39]/80' : 'text-[#BAFF39]'}`}
          title={isPlaying ? t('Pause Music') : t('Play Music')}
        >
          {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        <button 
          onClick={handleNext}
          className="text-white hover:text-[#BAFF39] transition-colors p-1"
          title="Next Track"
        >
          <SkipForward size={12} />
        </button>
      </div>

      {isPlaying && (
        <div className="flex items-center gap-0.5 ml-1">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ scaleY: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
              className="w-[2px] h-[10px] bg-[#BAFF39] rounded-full origin-bottom"
            />
          ))}
        </div>
      )}
    </div>
  );
}
