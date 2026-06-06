/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  color: string; // Tailwind glow class/hex
  glowGradient: string; // CSS radial gradient colors
  twinId: string; // Web3 Sona Digital Twin ID
  releaseYear: number;
  duration: string;
  synthTheme: 'house' | 'disco' | 'ambient' | 'techno' | 'acid' | 'future';
  description: string;
  coverUrl: string;
  audioUrl?: string;
}

export interface CanvasItem {
  id: string;
  track: Track;
  gridX: number; // grid column (e.g. 1 to 5)
  gridY: number; // grid row (e.g. 1 to 4)
  offsetX: number; // fine parallax offset adjustment config (px)
  offsetY: number; // fine parallax offset adjustment config (px)
  scatterX?: number; // Custom scatter X coordinate (randomly arranged)
  scatterY?: number; // Custom scatter Y coordinate (randomly arranged)
  zDepth?: number; // 3D depth factor (0.0: deep background, 1.0: foreground)
}
