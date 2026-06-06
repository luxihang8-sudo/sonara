import { useEffect, useRef, useState } from 'react';
import { Track } from '../types';

export function useAudioSynth() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.6);
  const [analyserData, setAnalyserData] = useState<number[]>(new Array(32).fill(0));

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const currentNotesRef = useRef<number[]>([]);
  const stepRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Keep tracking state in refs to avoid stale closures in requestAnimationFrame loop
  const isPlayingRef = useRef(false);
  const activeTrackAudioUrlRef = useRef<string | undefined>(undefined);
  const volumeRef = useRef(volume);

  // Initialize Audio Context on demand (lazy loading to prevent autoplay lockups)
  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      const analyser = ctx.createAnalyser();

      analyser.fftSize = 64; // Small fft for clean visualizer dots
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);

      analyser.connect(masterGain);
      masterGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
      analyserRef.current = analyser;

      // Initialize HTML5 Audio element
      if (!audioRef.current) {
        const audio = new Audio();
        audio.loop = true;
        audio.crossOrigin = "anonymous";
        audioRef.current = audio;

        try {
          const source = ctx.createMediaElementSource(audio);
          source.connect(analyser);
        } catch (err) {
          console.warn("Could not route HTML5 Audio element to the Web Audio graph:", err);
        }
      }

      // Live Polling of Analyser Data for Visualizers
      const updateAnalyser = () => {
        if (analyserRef.current && isPlayingRef.current) {
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);
          const normData = Array.from(dataArray).map(v => v / 255);
          setAnalyserData(normData);
        } else {
          setAnalyserData(new Array(32).fill(0.03));
        }
        animationFrameRef.current = requestAnimationFrame(updateAnalyser);
      };
      animationFrameRef.current = requestAnimationFrame(updateAnalyser);

      // Web Audio API browser security auto-resume on first interaction
      const resumeAudio = () => {
        if (ctx.state === 'suspended') {
          ctx.resume().catch(e => console.warn("AudioContext auto-resume error:", e));
        }
      };
      window.addEventListener('click', resumeAudio, { once: true });
      window.addEventListener('touchstart', resumeAudio, { once: true });
      window.addEventListener('mousedown', resumeAudio, { once: true });
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser or environment", e);
    }
  };

  // Sync Volume
  useEffect(() => {
    volumeRef.current = volume;
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(
        volume,
        audioCtxRef.current.currentTime + 0.1
      );
    }
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Stop currently playing sound or loops
  const stopLoop = () => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsPlaying(false);
    isPlayingRef.current = false;
    activeTrackAudioUrlRef.current = undefined;
    setActiveTrackId(null);
  };

  // Main soundscape trigger loop
  const playSynthesizerLoop = (track: Track) => {
    initAudio();
    const ctx = audioCtxRef.current;
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    // Direct synchronous resume to keep user gestural authorization context
    if (ctx.state === 'suspended') {
      ctx.resume().catch(err => console.warn("AudioContext resume failed:", err));
    }

    // Stop current playing loop before launching new one (to prevent multiple running parallel loops)
    stopLoop();

    setIsPlaying(true);
    isPlayingRef.current = true;
    activeTrackAudioUrlRef.current = undefined;
    setActiveTrackId(track.id);
    stepRef.current = 0;

    const theme = track.synthTheme;

    // Define MIDI notes for melody and bass based on synth themes
    let notes: number[] = [];
    const baseFreqs = {
      house: [110, 137.5, 165, 220],
      disco: [130.81, 164.81, 196, 261.63],
      ambient: [146.83, 196, 220, 293.66],
      techno: [110, 116.54, 130.81, 146.83],
      acid: [55, 65.41, 73.42, 87.31],
      future: [146.83, 164.81, 220, 261.63],
    };

    const fallbackTheme = theme as keyof typeof baseFreqs;
    notes = baseFreqs[fallbackTheme] || baseFreqs.ambient;
    currentNotesRef.current = notes;

    const tempo = track.bpm || 120;
    const stepDuration = 60 / tempo / 2; // Eighth notes

    // Start scheduling slightly in the future relative to the fresh live currentTime
    let nextStepTime = ctx.currentTime + 0.05;

    const scheduler = () => {
      if (!isPlayingRef.current) return;

      try {
        const current = ctx.currentTime;
        // Catch-up mechanism if the scheduler falls behind (e.g. browser tab suspended / backgrounded)
        // to prevent freeze-ups or explosive multi-note triggers
        if (nextStepTime < current) {
          nextStepTime = current + 0.05;
        }

        while (nextStepTime < current + 0.15) {
          scheduleLegacyNote(stepRef.current, nextStepTime, fallbackTheme);
          advanceStep();
          nextStepTime += stepDuration;
        }
        timerIdRef.current = window.setTimeout(scheduler, 25);
      } catch (err) {
        console.warn("Sequencer scheduler error:", err);
      }
    };

    timerIdRef.current = window.setTimeout(scheduler, 0);
  };

  const advanceStep = () => {
    stepRef.current = (stepRef.current + 1) % 16;
  };

  const scheduleLegacyNote = (step: number, time: number, theme: 'house' | 'disco' | 'ambient' | 'techno' | 'acid' | 'future') => {
    const ctx = audioCtxRef.current;
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    try {
      // 1. Kick Drum
      if (theme !== 'ambient' && step % 4 === 0) {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.connect(kickGain);
        kickGain.connect(analyser);

        kickOsc.frequency.setValueAtTime(150, time);
        kickOsc.frequency.exponentialRampToValueAtTime(0.01, time + 0.2);

        kickGain.gain.setValueAtTime(0.7, time);
        kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

        kickOsc.start(time);
        kickOsc.stop(time + 0.25);
      }

      // 2. Hi-hat
      if ((theme === 'house' || theme === 'disco' || theme === 'techno') && (step % 4 === 2)) {
        const hatSource = ctx.createBufferSource();
        const bufferSize = ctx.sampleRate * 0.05;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        hatSource.buffer = buffer;

        const hatFilter = ctx.createBiquadFilter();
        hatFilter.type = 'highpass';
        hatFilter.frequency.setValueAtTime(8000, time);

        const hatGain = ctx.createGain();
        hatGain.gain.setValueAtTime(0.12, time);
        hatGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

        hatSource.connect(hatFilter);
        hatFilter.connect(hatGain);
        hatGain.connect(analyser);

        hatSource.start(time);
        hatSource.stop(time + 0.05);
      }

      // 3. Synth voice
      const notes = currentNotesRef.current;
      let shouldPlaySynth = false;
      let noteIndex = 0;
      let noteLength = 0.15;
      let glide = false;
      let filterCutoffStart = 800;
      let filterQ = 1;

      if (theme === 'house') {
        shouldPlaySynth = [0, 2, 3, 5, 6, 8, 10, 11, 14].includes(step);
        noteIndex = (step * 3) % notes.length;
        noteLength = 0.12;
        filterCutoffStart = 600;
      } else if (theme === 'techno') {
        shouldPlaySynth = true;
        noteIndex = step % 3 === 0 ? 0 : step % 4 === 1 ? 1 : 2;
        noteLength = 0.08;
        filterCutoffStart = 400;
      } else if (theme === 'acid') {
        shouldPlaySynth = [0, 1, 3, 4, 6, 7, 8, 10, 12, 13, 15].includes(step);
        noteIndex = (step * 7) % notes.length;
        noteLength = 0.18;
        glide = true;
        filterCutoffStart = Math.max(150, 400 + Math.sin(step * 0.5) * 350);
        filterQ = 12;
      } else if (theme === 'disco') {
        shouldPlaySynth = true;
        noteIndex = step % 2 === 0 ? 0 : 2;
        noteLength = 0.14;
        filterCutoffStart = 1000;
      } else if (theme === 'ambient') {
        shouldPlaySynth = step === 0 || step === 8;
        noteIndex = step === 0 ? 0 : 2;
        noteLength = 2.5;
        filterCutoffStart = 400;
        filterQ = 2;
      } else if (theme === 'future') {
        shouldPlaySynth = [0, 4, 6, 8, 12].includes(step);
        noteIndex = (step * 2) % notes.length;
        noteLength = 0.4;
        filterCutoffStart = 1500;
      }

      if (shouldPlaySynth && notes.length > 0) {
        try {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(analyser);

          const freq = notes[noteIndex];

          if (theme === 'techno' || theme === 'acid') {
            osc1.type = 'sawtooth';
            osc2.type = 'square';
            osc2.frequency.setValueAtTime(freq * 0.5, time);
          } else if (theme === 'ambient') {
            osc1.type = 'sine';
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(freq * 1.5, time);
          } else {
            osc1.type = 'square';
            osc2.type = 'sawtooth';
            osc2.frequency.setValueAtTime(freq * 0.99, time);
          }

          osc1.frequency.setValueAtTime(freq, time);

          if (glide && step > 0) {
            osc1.frequency.exponentialRampToValueAtTime(notes[(noteIndex + 1) % notes.length], time + noteLength);
          }

          filter.type = 'lowpass';
          filter.Q.setValueAtTime(filterQ, time);
          filter.frequency.setValueAtTime(filterCutoffStart, time);
          filter.frequency.exponentialRampToValueAtTime(filterCutoffStart * 0.2, time + noteLength);

          gain.gain.setValueAtTime(0, time);
          if (theme === 'ambient') {
            gain.gain.linearRampToValueAtTime(0.35, time + 1.0);
            gain.gain.exponentialRampToValueAtTime(0.001, time + noteLength);
          } else {
            gain.gain.linearRampToValueAtTime(0.24, time + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, time + noteLength);
          }

          osc1.start(time);
          osc2.start(time);
          osc1.stop(time + noteLength);
          osc2.stop(time + noteLength);
        } catch (e) {
          console.warn("Could not schedule audio synth voice:", e);
        }
      }
    } catch (err) {
      console.warn("Error in scheduleLegacyNote:", err);
    }
  };

  const playTrack = (track: Track) => {
    initAudio();
    const ctx = audioCtxRef.current;
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(err => {
        console.warn("Failed to resume context on play:", err);
      });
    }

    stopLoop();

    setIsPlaying(true);
    isPlayingRef.current = true;
    setActiveTrackId(track.id);

    if (track.audioUrl) {
      activeTrackAudioUrlRef.current = track.audioUrl;
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.volume = volume;
        audioRef.current.play().catch(e => {
          console.warn("Audio autoplay was prevented or failed to load: ", e);
        });
      }
    } else {
      activeTrackAudioUrlRef.current = undefined;
      // Synthesize soundscape sequence
      playSynthesizerLoop(track);
    }
  };

  const togglePlayPause = (track: Track) => {
    if (isPlaying && activeTrackId === track.id) {
      stopLoop();
    } else {
      playTrack(track);
    }
  };

  useEffect(() => {
    return () => {
      stopLoop();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isPlaying,
    activeTrackId,
    playTrack,
    stopTrack: stopLoop,
    togglePlayPause,
    volume,
    setVolume,
    analyserData,
  };
}
