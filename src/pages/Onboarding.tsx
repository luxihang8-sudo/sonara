import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Upload, Music, Image as ImageIcon, Settings, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isHoveringDropzone, setIsHoveringDropzone] = useState(false);

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 lg:px-24 max-w-[1000px] mx-auto">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase">
          Artist Portal
        </h1>
        <p className="text-neutral-400 font-light text-lg">
          Upload your tracks, manage your digital twins, and reach a global audience of collectors.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Col: Steps / Form */}
        <div className="flex-1">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-neutral-800 -z-10" />
            
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                  step >= s ? 'bg-[#BAFF39] text-black shadow-[0_0_15px_rgba(186,255,57,0.3)]' : 'bg-neutral-900 border border-neutral-700 text-neutral-500'
                }`}
              >
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-neutral-900 border border-white/10 p-6 md:p-8 rounded-2xl"
              >
                <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-6">1. Audio Upload</h2>
                
                <div 
                  className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all ${
                    isHoveringDropzone ? 'border-[#BAFF39] bg-[#BAFF39]/5' : 'border-neutral-700 hover:border-neutral-500'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsHoveringDropzone(true); }}
                  onDragLeave={() => setIsHoveringDropzone(false)}
                  onDrop={(e) => { e.preventDefault(); setIsHoveringDropzone(false); }}
                >
                  <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-6 text-[#BAFF39]">
                    <Upload size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Drag & Drop your WAV/FLAC files</h3>
                  <p className="text-neutral-500 text-sm mb-6 max-w-sm">
                    Upload high-resolution master files. We support 24-bit/48kHz minimum for physical pressing requirements.
                  </p>
                  <button className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-full hover:bg-neutral-200 transition-colors text-sm">
                    Browse Files
                  </button>
                </div>

                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={() => setStep(2)}
                    className="px-8 py-3 bg-[#BAFF39] text-black font-bold uppercase tracking-wider rounded-full hover:bg-[#a6ec27] transition-all flex items-center gap-2 group"
                  >
                    Next Step
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-neutral-900 border border-white/10 p-6 md:p-8 rounded-2xl"
              >
                <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-6">2. Metadata & Artwork</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">Release Title</label>
                    <input type="text" className="w-full bg-black border border-neutral-800 rounded-lg p-4 text-white focus:outline-none focus:border-[#BAFF39] transition-colors" placeholder="e.g. Synthetic Horizon" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">Genre</label>
                      <select className="w-full bg-black border border-neutral-800 rounded-lg p-4 text-white focus:outline-none focus:border-[#BAFF39] transition-colors appearance-none">
                        <option>Electronic</option>
                        <option>Ambient</option>
                        <option>Techno</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">BPM</label>
                      <input type="number" className="w-full bg-black border border-neutral-800 rounded-lg p-4 text-white focus:outline-none focus:border-[#BAFF39] transition-colors" placeholder="120" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">Cover Artwork (3000x3000px)</label>
                    <div className="border border-dashed border-neutral-700 rounded-lg p-4 flex items-center gap-4 hover:border-neutral-500 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">Upload Image</p>
                        <p className="text-xs text-neutral-500 mt-1">JPG, PNG (Max 15MB)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-6 py-3 text-neutral-400 font-bold uppercase tracking-wider hover:text-white transition-colors text-sm"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="px-8 py-3 bg-[#BAFF39] text-black font-bold uppercase tracking-wider rounded-full hover:bg-[#a6ec27] transition-all flex items-center gap-2 group"
                  >
                    Review
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-neutral-900 border border-white/10 p-6 md:p-8 rounded-2xl"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-[#BAFF39]/10 text-[#BAFF39] flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={32} />
                  </div>
                  <h2 className="text-2xl font-bold uppercase tracking-widest text-white mb-2">Ready for Review</h2>
                  <p className="text-neutral-400 text-sm">Your submission will be reviewed by our curation team within 48 hours for quality assurance.</p>
                </div>
                
                <div className="bg-black rounded-xl p-6 border border-neutral-800 mb-8">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">Submission Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Audio Files</span>
                      <span className="text-white">syn-horizon-master.wav</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Release Title</span>
                      <span className="text-white">Synthetic Horizon</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Genre</span>
                      <span className="text-white">Electronic</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button 
                    onClick={() => setStep(2)}
                    className="px-6 py-3 text-neutral-400 font-bold uppercase tracking-wider hover:text-white transition-colors text-sm"
                  >
                    Edit Details
                  </button>
                  <button 
                    onClick={() => alert('Submission successful!')}
                    className="px-8 py-3 bg-[#BAFF39] text-black font-bold uppercase tracking-wider rounded-full hover:bg-[#a6ec27] transition-all shadow-[0_0_20px_rgba(186,255,57,0.2)]"
                  >
                    Submit Release
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Col: Info/Guidelines */}
        <div className="lg:w-80">
          <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <Zap size={16} className="text-[#BAFF39]" />
              Artist Guidelines
            </h3>
            
            <div className="space-y-6">
              {[
                { title: 'Audio Quality', desc: 'Masters must be at least 24-bit/48kHz WAV or FLAC. No MP3s accepted.' },
                { title: 'Original Content', desc: 'You must own 100% of the rights to the uploaded masters and compositions.' },
                { title: 'Artwork Standards', desc: 'Cover art must be minimum 3000x3000px, without excessive text or social handles.' }
              ].map((rule, i) => (
                <div key={i}>
                  <h4 className="text-sm font-bold text-white mb-1">{rule.title}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-[10px] uppercase font-mono text-neutral-500 mb-2">Need Help?</p>
              <a href="#" className="text-xs text-[#BAFF39] hover:underline">Contact Curation Support →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
