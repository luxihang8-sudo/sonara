import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { TRACKS } from '../data/tracks';
import { Track, CanvasItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

const getAlbumCoverUrl = (item: CanvasItem): string => {
  return item.track.coverUrl;
};

// Static, unmoving 4x6 constellation layout grid (24 positions: Col 1-6, Row 1-4)
// These dots act as control inputs distributed evenly over the viewer's entire window
interface GridDot {
  id: string;
  gridX: number; // Col 1 to 6
  gridY: number; // Row 1 to 4
}

const GRID_DOTS: GridDot[] = Array.from({ length: 24 }).map((_, idx) => {
  const gridX = (idx % 6) + 1; // 1 to 6
  const gridY = Math.floor(idx / 6) + 1; // 1 to 4
  return {
    id: `dot-${idx + 1}`,
    gridX,
    gridY,
  };
});

// A highly dense, overlapping canvas layout with scattered album covers
// Completely randomized with no regular shape, bleeding heavily outside the main screen area
const SCATTERED_ALBUMS: CanvasItem[] = Array.from({ length: 56 }).map((_, i) => {
  const trackIndex = i % TRACKS.length;
  const track = TRACKS[trackIndex];
  
  // Use fully deterministic math based on ID seed to keep coordinates completely stable on re-renders
  const seedX = (i + 1) * 31519.83;
  const seedY = (i + 1) * 73291.64;
  const seedZ = (i + 1) * 98451.27;
  
  const randX = (Math.sin(seedX) + 1) / 2; // stable 0 to 1
  const randY = (Math.sin(seedY) + 1) / 2; // stable 0 to 1
  const zDepth = (Math.sin(seedZ) + 1) / 2; // stable 0 to 1 (depth layers: 0 is furthest back, 1 is in front)
  
  // Condensed to make it feel significantly more crowded, clustered, and overlapping,
  // gathering them closer to the center while still keeping them organic and dynamic.
  // Overlapping cascade: offset foreground cards slightly to create beautiful physical layering stacks!
  const scatterX = 100 + randX * 3800 + (zDepth * 140);
  const scatterY = 100 + randY * 2600 + (zDepth * 140);
  
  return {
    id: `album-${i + 1}`,
    track,
    gridX: 0,
    gridY: 0,
    offsetX: 0,
    offsetY: 0,
    scatterX,
    scatterY,
    zDepth,
  };
});

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  const { t } = useLanguage();

  // Selected/Focused Canvas item
  const [selectedItem, setSelectedItem] = useState<CanvasItem | null>(null);

  // Smooth blurred background image tracking state
  const [backgroundCoverUrl, setBackgroundCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedItem?.track?.coverUrl) {
      setBackgroundCoverUrl(selectedItem.track.coverUrl);
    }
  }, [selectedItem]);
  
  // Visually clicked grid dot item that controls the selection
  const [clickedDotItem, setClickedDotItem] = useState<GridDot | null>(null);

  const [viewportSize, setViewportSize] = useState({ w: 1200, h: 800 });
  const mouseNormRef = useRef({ x: 0, y: 0 });

  // Smooth Parallax coordinate states (linear interpolation)
  const [pan, setPan] = useState({ x: 0, y: 0, z: 0.42 });
  const panRef = useRef({ x: 0, y: 0, scale: 0.42 });
  const targetPanRef = useRef({ x: 0, y: 0, scale: 0.42 });

  // Grid dimensions
  const gridWidth = 4000;
  const gridHeight = 2800;

  // Track viewport size dynamically
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ w: window.innerWidth, h: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Support responsive dragging/swiping on mobile/trackpads & desktop mice
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragHasMoved = useRef(false);

  const startDrag = (clientX: number, clientY: number) => {
    if (selectedItem) return;
    setIsDragging(true);
    dragHasMoved.current = false;
    dragStart.current = {
      x: clientX - dragOffset.current.x,
      y: clientY - dragOffset.current.y
    };
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (selectedItem || !isDragging) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    
    // Check if user has actually moved the cursor past a threshold to distinguish drag from clicks
    if (Math.abs(dx - dragOffset.current.x) > 6 || Math.abs(dy - dragOffset.current.y) > 6) {
      dragHasMoved.current = true;
    }
    dragOffset.current = { x: dx, y: dy };
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only drag on primary left click
    startDrag(e.clientX, e.clientY);
  };

  const handleMouseMoveGlobal = (e: MouseEvent) => {
    if (isDragging) {
      moveDrag(e.clientX, e.clientY);
    } else {
      // Normal subtle mouse parallax updates
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;
      mouseNormRef.current = { x: normX, y: normY };
      
      if (!selectedItem) {
        const isMobile = viewportSize.w < 768;
        const fitScale = isMobile ? 0.28 : 0.42;
        const centerCanvasX = gridWidth / 2;
        const centerCanvasY = gridHeight / 2;
        const baselineX = (window.innerWidth / 2) - centerCanvasX * fitScale;
        const baselineY = (window.innerHeight / 2) - centerCanvasY * fitScale;
        
        const driftX = -normX * 380 * fitScale;
        const driftY = -normY * 380 * fitScale;

        targetPanRef.current = {
          x: baselineX + driftX + dragOffset.current.x,
          y: baselineY + driftY + dragOffset.current.y,
          scale: fitScale
        };
      }
    }
  };

  const handleMouseUpGlobal = () => {
    endDrag();
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  // Bind mouse move and mouse up listeners globally during active dragging
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMoveGlobal);
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging, selectedItem]);

  // Adjust canvas matrix center based on state transitions or viewport resizing
  useEffect(() => {
    if (selectedItem) {
      // Center the camera directly on the focused album cover's scatter coordinate
      const itemX = selectedItem.scatterX ?? 2000;
      const itemY = selectedItem.scatterY ?? 1400;
      
      const zoom = viewportSize.w < 768 ? 0.75 : 0.95;
      const targetX = (viewportSize.w / 2) - itemX * zoom;
      // Shift target camera slightly higher up (e.g., divide height by 3.6 for mobile, or 2.3 for desktop) to stay clear of bottom drawer
      const targetY = (viewportSize.w < 768 ? viewportSize.h / 3.6 : viewportSize.h / 2.3) - itemY * zoom;

      targetPanRef.current = {
        x: targetX,
        y: targetY,
        scale: zoom
      };
    } else {
      // Premium organic zoom level that keeps covers beautiful while letting them bleed off the screen edges
      const isMobile = viewportSize.w < 768;
      const fitScale = isMobile ? 0.28 : 0.42;
      
      // Center the camera on the middle of the massive coordinate system so the initial spread looks beautiful
      const centerCanvasX = gridWidth / 2;
      const centerCanvasY = gridHeight / 2;
      
      const baselineX = (viewportSize.w / 2) - centerCanvasX * fitScale;
      const baselineY = (viewportSize.h / 2) - centerCanvasY * fitScale;

      // Add responsive micro-parallax drift based on mouse positioning
      const driftX = -mouseNormRef.current.x * 380 * fitScale;
      const driftY = -mouseNormRef.current.y * 380 * fitScale;

      targetPanRef.current = {
        x: baselineX + driftX + dragOffset.current.x,
        y: baselineY + driftY + dragOffset.current.y,
        scale: fitScale
      };
    }
  }, [selectedItem, viewportSize, isDragging]);

  // High performance Animation Frame Loop (lerping with damping factor)
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;
      
      const speed = selectedItem ? 0.08 : 0.05; // Snappier transitions on focusing
      
      // Stop recalculations when scrolled past the viewport
      const isOffscreen = window.scrollY > window.innerHeight * 1.5;
      
      if (!isOffscreen) {
        // X coordinate interpolation
        const dx = targetPanRef.current.x - panRef.current.x;
        panRef.current.x += dx * speed;
        
        // Y coordinate interpolation
        const dy = targetPanRef.current.y - panRef.current.y;
        panRef.current.y += dy * speed;
        
        // Scale / Zoom interpolation
        const ds = targetPanRef.current.scale - panRef.current.scale;
        panRef.current.scale += ds * speed;

        // Throttle pan state updates to only fire when the camera is actively moving significantly
        const isMoving = Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001 || Math.abs(ds) > 0.0001;
        
        if (isMoving) {
          if (containerRef.current) {
             containerRef.current.style.transform = `translate3d(${panRef.current.x.toFixed(2)}px, ${panRef.current.y.toFixed(2)}px, 0) scale(${panRef.current.scale.toFixed(4)})`;
          }
          
          // Directly mutate the 3D parallax layers of all children without React render cycle
          if (itemsContainerRef.current) {
            const children = itemsContainerRef.current.children;
            for (let i = 0; i < children.length; i++) {
              const child = children[i] as HTMLElement;
              const item = SCATTERED_ALBUMS[i];
              if (!item) continue;
              
              const zDepth = item.zDepth ?? 0.5;
              const isCurrent = selectedItem?.id === item.id;
              
              if (!isCurrent) {
                const parallaxFactor = 1.6;
                const px = (panRef.current.x * (zDepth - 0.6) * parallaxFactor) / panRef.current.scale;
                const py = (panRef.current.y * (zDepth - 0.6) * parallaxFactor) / panRef.current.scale;
                child.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`;
              } else {
                child.style.transform = `translate3d(0px, 0px, 0)`;
              }
            }
          }
        } else {
           // Snap to exact target to completely halt drifting calculations when close enough
           panRef.current.x = targetPanRef.current.x;
           panRef.current.y = targetPanRef.current.y;
           panRef.current.scale = targetPanRef.current.scale;
        }
      }

      requestAnimationFrame(tick);
    };

    tick();
    return () => {
      active = false;
    };
  }, [selectedItem]);

  // Handle Grid Dot Click (Triggers focusing a random album cover)
  const selectDot = (dotItem: GridDot) => {
    setClickedDotItem(dotItem);
    
    // Pick an album completely randomly from SCATTERED_ALBUMS
    // Exclude currently playing one to make it feel fresh
    const pool = SCATTERED_ALBUMS.filter(it => it.id !== selectedItem?.id);
    const selectionPool = pool.length > 0 ? pool : SCATTERED_ALBUMS;
    const randomItem = selectionPool[Math.floor(Math.random() * selectionPool.length)];
    
    setSelectedItem(randomItem);
  };

  // Handle Album Selection
  const selectItem = (item: CanvasItem) => {
    setSelectedItem(item);
    
    // Dynamically match selection to a corresponding dot index for high-precision laser visual feedback
    const index = parseInt(item.id.replace('album-', '')) - 1;
    const correspondingDot = GRID_DOTS[index % GRID_DOTS.length];
    setClickedDotItem(correspondingDot);
  };

  // Close selection
  const closeSelection = () => {
    setSelectedItem(null);
    setClickedDotItem(null);
  };

  // Calculate coordinates matching organic random placement
  const getItemCoords = (item: CanvasItem) => {
    // 380px cards: offset coordinate is centered around scatterX and scatterY
    const left = (item.scatterX ?? 3000) - 190;
    const top = (item.scatterY ?? 2000) - 190;
    return { left, top };
  };

  // Get screen pixel coordinate for the unmoving static grid dots in the viewport overlay (distributed over the ENTIRE viewport)
  const getDotScreenCoords = (item: { gridX: number; gridY: number }) => {
    const isMobile = viewportSize.w < 768;
    const paddingX = isMobile ? 40 : 120;
    const paddingY = isMobile ? 60 : 120;
    
    const usableWidth = viewportSize.w - paddingX * 2;
    // Distribute fully across screen height, leaving a tiny safe cushion
    const usableHeight = viewportSize.h - paddingY * 2;
    
    const colWidth = usableWidth / 5; // 6 columns has 5 divisions
    const rowHeight = usableHeight / 3; // 4 rows has 3 divisions
    
    const x = paddingX + (item.gridX - 1) * colWidth;
    const y = paddingY + (item.gridY - 1) * rowHeight;
    
    return { x, y };
  };

  // Get standard screen coord for deep background album (accounts for transform scale and layout pan matrices)
  const getAlbumScreenCoords = (item: CanvasItem) => {
    const albumX = item.scatterX ?? 2000;
    const albumY = item.scatterY ?? 1400;
    
    const screenX = panRef.current.x + albumX * panRef.current.scale;
    const screenY = panRef.current.y + albumY * panRef.current.scale;
    
    return { x: screenX, y: screenY };
  };

  return (
    <section 
      id="sona-hero-interactive-canvas-section"
      className="relative w-full h-[100vh] overflow-hidden bg-transparent select-none border-b border-white/5"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Backdrop Ambient Glow & Blurred Cover Art Background */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ease-in-out overflow-hidden bg-transparent">
        {/* Dynamic Big Blurred Cover Background Layer */}
        {backgroundCoverUrl && (
          <div 
            className="absolute inset-0 transition-opacity duration-[1000ms] ease-in-out bg-cover bg-center scale-105"
            style={{ 
              backgroundImage: `url(${backgroundCoverUrl})`,
              filter: 'blur(35px) brightness(0.4) saturate(1.5)',
              opacity: selectedItem ? 0.75 : 0,
            }}
          />
        )}

        {selectedItem ? (
          <div 
            className="absolute inset-0 transition-opacity duration-[1000ms]"
            style={{ 
              background: `radial-gradient(circle at center, ${selectedItem.track.color}40 0%, transparent 60%)`,
              opacity: 0.6
            }}
          />
        ) : null}
        
        {/* Smooth dynamic radial gradient - becomes softer when an album is selected to let the blurred cover bloom */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_25%,rgba(0,0,0,0.7)_100%)]" 
          style={{ opacity: selectedItem ? 0.3 : 0.4 }}
        />
        {/* Retro blueprint overlay grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
      </div>

      {/* 2. Interactive Canvas Matrix (Fanning/Zooming underneath layers) */}
      <div 
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
        style={{
          width: `${gridWidth}px`,
          height: `${gridHeight}px`,
          transform: `translate3d(${panRef.current.x}px, ${panRef.current.y}px, 0) scale(${panRef.current.scale})`,
          transformOrigin: '0px 0px',
        }}
      >
        <div ref={itemsContainerRef} className="absolute inset-0">
        {/* 3D Album Cover Cards Frame (Dense random scatter, underneath the static dashboard overlay) */}
        {SCATTERED_ALBUMS.map((item) => {
          const { left, top } = getItemCoords(item);
          const isCurrent = selectedItem?.id === item.id;
          const isIdle = selectedItem === null;
          
          const zDepth = item.zDepth ?? 0.5;
          
          // 1. Z-index strictly determined by depth layer so closer objects overlap further ones
          const zIndexValue = isCurrent ? 120 : 10 + Math.floor(zDepth * 100);
          
          // 2. Align them straight: rotation angle set to 0 ("都摆正")
          const stableRotation = 0;
          
          // 3. Dynamic 3D Parallax: Background shifts very slowly, foreground shifts extremely fast matching real depth physics!
          // We set it to 0 when it's selected (isCurrent) to ensure it locks onto camera tracking focus.
          const parallaxFactor = 1.6;
          const parallaxX = isCurrent ? 0 : (panRef.current.x * (zDepth - 0.6) * parallaxFactor) / panRef.current.scale;
          const parallaxY = isCurrent ? 0 : (panRef.current.y * (zDepth - 0.6) * parallaxFactor) / panRef.current.scale;
          
          // 4. Staggered size variety ("有大有小"): Create organic rhythm with moderate but distinct variance
          const idNum = parseInt(item.id.replace('album-', ''));
          // Moderate scale jumps for an elegant, structured feel (large: 1.6, medium: ~1.15, small: ~0.8)
          const sizeIdFactor = idNum % 5 === 0 ? 1.6 : (idNum % 3 === 0 ? 1.15 : 0.7 + ((idNum * 19) % 30) / 100); 
          const depthScale = isCurrent ? 1.25 : (0.18 + zDepth * 1.15) * sizeIdFactor;
          
          // 5. Cinematic lens Depth of Field (DoF) & focus bokeh
          const dofBlur = isCurrent ? 0 : Math.pow(1 - zDepth, 1.5) * 8; // Reduced max blur from 32px to 8px for performance
          
          // Cinematic atmospheric lighting (darker depth, crisp vivid foreground)
          const brightnessFactor = isCurrent ? 1.0 : (0.2 + zDepth * 0.8);
          // Removed expensive blur() and contrast() filters to fix severe scroll/animation stutter
          const filterStyle = `brightness(${brightnessFactor.toFixed(2)})`;
          
          // Layer opacities
          const baseOpacity = isCurrent 
            ? 1.0 
            : isIdle 
              ? (0.32 + zDepth * 0.68) 
              : (0.01 + zDepth * 0.12);
          
          // Matte translucent borders that do not show harsh white edges or white glows
          const borderStyleClass = isCurrent 
            ? 'border-[#BAFF39]/50 shadow-[0_30px_70px_rgba(0,0,0,0.95)]' 
            : 'border-transparent group-hover:border-[#BAFF39]/50';
          
          return (
            <div
              key={item.id}
              className="absolute group will-change-transform"
              data-zdepth={zDepth}
              data-current={isCurrent}
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: '380px',
                height: '380px',
                zIndex: zIndexValue,
                opacity: baseOpacity,
                transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
                transition: isDragging ? 'opacity 0.2s' : 'opacity 0.2s',
              }}
            >
              {/* 3D Album Cover Card */}
              <div
                className="relative w-full h-full cursor-pointer perspective-1000 select-none animate-fade-in will-change-transform"
                style={{
                  filter: filterStyle,
                  transition: 'filter 0.3s ease-out, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                onClick={(e) => {
                  // Only expand if the mouse wasn't doing a real drag operation
                  if (dragHasMoved.current) {
                    e.stopPropagation();
                    return;
                  }
                  if (isCurrent) {
                    closeSelection();
                  } else {
                    selectItem(item);
                  }
                }}
              >
                <div 
                  className={`w-full h-full bg-[#0a0a0a] border ${borderStyleClass} rounded-2xl overflow-hidden transition-all duration-500 transform-3d`}
                  style={{
                    transform: isCurrent 
                      ? 'translateZ(50px) scale(1.08)' 
                      : `rotateY(0deg) rotateX(0deg) rotateZ(${stableRotation}deg) translateZ(0) scale(${depthScale})`,
                    boxShadow: isCurrent 
                      ? `0 25px 55px -12px ${item.track.color}45` 
                      : (zDepth > 0.65 ? '0 16px 36px rgba(0,0,0,0.85)' : '0 4px 12px rgba(0,0,0,0.5)'),
                    animation: isCurrent ? 'spin-y 5s linear infinite' : 'none',
                  }}
                >
                  {/* Real-world Album Cover Image Body with HUD overlays */}
                  <div className="relative w-full h-full bg-neutral-950 overflow-hidden">
                    <img 
                      src={getAlbumCoverUrl(item)} 
                      alt={item.track.title}
                      referrerPolicy="no-referrer"
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                        isCurrent 
                          ? 'opacity-100 grayscale-0' 
                          : 'opacity-70 grayscale group-hover:opacity-100'
                      }`}
                    />
                    
                    {/* Dark gradient shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15 z-10 pointer-events-none" />

                    {/* Generative synth theme vector wireframe overlay on top of album */}
                    <div className="absolute inset-0 pointer-events-none opacity-25 flex items-center justify-center overflow-hidden z-10">
                      {item.track.synthTheme === 'acid' && (
                        <svg width="280" height="280" viewBox="0 0 100 100" fill="none" className="animate-spin text-[#BAFF39]" style={{ animationDuration: '32s' }}>
                          <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" stroke="currentColor" strokeWidth="0.4" />
                        </svg>
                      )}
                      
                      {item.track.synthTheme === 'techno' && (
                        <div className="w-48 h-48 border border-zinc-500/20 rounded-md transform rotate-45 grid grid-cols-4 gap-2.5 p-4">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className="bg-zinc-400/5 rounded-xs" />
                          ))}
                        </div>
                      )}

                      {item.track.synthTheme === 'house' && (
                        <svg width="300" height="300" viewBox="0 0 100 100" fill="none" className="text-cyan-500/30">
                          <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.3" />
                          <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.2" strokeDasharray="3 2" />
                        </svg>
                      )}

                      {item.track.synthTheme === 'disco' && (
                        <svg width="260" height="260" viewBox="0 0 100 100" fill="none" className="text-pink-500/30">
                          <rect x="15" y="15" width="70" height="70" stroke="currentColor" strokeWidth="0.3" />
                          <path d="M15,50 Q50,5 85,50" stroke="currentColor" strokeWidth="0.2" />
                          <path d="M15,50 Q50,95 85,50" stroke="currentColor" strokeWidth="0.2" />
                        </svg>
                      )}

                      {item.track.synthTheme === 'ambient' && (
                        <div 
                          className="w-48 h-48 rounded-full opacity-45 transition-opacity"
                          style={{
                            background: `radial-gradient(circle, ${item.track.color}40 0%, transparent 60%)`
                          }}
                        />
                      )}

                      {item.track.synthTheme === 'future' && (
                        <div className="flex flex-col space-y-1.5 opacity-25">
                          {Array.from({ length: 4 }).map((_, idx) => (
                            <div 
                              key={idx} 
                              className="h-1 bg-indigo-500 rounded-sm"
                              style={{ width: `${80 + Math.sin(idx + 1) * 20}px` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Cover art reactive micro visualizer overlay has been removed */}
                  </div>
                </div>
              </div>
              
              {/* Floating Text Info Overlay */}
              <AnimatePresence>
                {isCurrent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="absolute inset-0 flex flex-col justify-start items-end text-right p-4 md:p-5 pointer-events-none z-50"
                    style={{
                      transform: 'translateZ(80px)',
                    }}
                  >
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#BAFF39]" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)' }}>
                      {item.track.title}
                    </h3>
                    <h4 className="text-[10px] md:text-xs text-white font-medium/90 uppercase tracking-widest mt-0.5" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>
                      {item.track.artist}
                    </h4>
                    <Link
                      to={`/album/${item.track.id}?cover=${encodeURIComponent(getAlbumCoverUrl(item))}`}
                      className="mt-6 pointer-events-auto px-6 py-2 bg-[#BAFF39]/90 hover:bg-[#BAFF39] text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(186,255,57,0.3)] transition-all hover:scale-105"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('Detail & Buy')}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        </div>
      </div>



      {/* Grid Dots Layer Removed for minimalism (If requested later, we can restore it) */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {GRID_DOTS.map((dot) => {
          const coords = getDotScreenCoords(dot);
          const isDotCurrent = clickedDotItem?.id === dot.id;

          return (
            <div 
              key={dot.id}
              className="absolute pointer-events-auto cursor-pointer hidden md:block"
              style={{
                left: `${coords.x}px`,
                top: `${coords.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                selectDot(dot);
              }}
            >
              <div 
                className={`rounded-full transition-all duration-350 ${
                  isDotCurrent 
                    ? 'w-3 h-3 bg-white shadow-[0_0_12px_rgba(255,255,255,1)]' 
                    : 'w-2.5 h-2.5 bg-[#BAFF39] hover:bg-white hover:scale-125 select-none shadow-[0_0_8px_rgba(186,255,57,0.8)]'
                }`}
              />
            </div>
          );
        })}
      </div>

    </section>
  );
}
