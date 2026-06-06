import React from 'react';
import { motion } from 'motion/react';

export default function FluidBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black font-sans pointer-events-none">
      
      {/* Deep Dark Ambient Overlay to keep it subtle and not steal the show */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-black/80 to-[#050505]/95 pointer-events-none" />
      
      {/* Subtle Fluid Blobs to blend with the video */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] border-none"
        style={{
          background: 'radial-gradient(circle, rgba(186,255,57,0.06) 0%, rgba(186,255,57,0) 70%)',
        }}
      />
      <motion.div
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] border-none"
        style={{
          background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, rgba(20,184,166,0) 70%)',
        }}
      />

      {/* Subtle Noise Grain */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
    </div>
  );
}
