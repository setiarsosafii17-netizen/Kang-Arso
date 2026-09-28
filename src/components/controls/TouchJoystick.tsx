import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface TouchJoystickProps {
  onMove: (vector: { x: number; y: number }) => void;
  onJump: () => void;
  onInteract: () => void;
  onOpenMap: () => void;
  onOpenInventory: () => void;
  onOpenHelp: () => void;
}

export const TouchJoystick: React.FC<TouchJoystickProps> = ({
  onMove,
  onJump,
  onInteract,
  onOpenMap,
  onOpenInventory,
  onOpenHelp,
}) => {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [activeTouchId, setActiveTouchId] = useState<number | null>(null);

  const maxRadius = 46;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (activeTouchId !== null) return;
    const touch = e.changedTouches[0];
    setActiveTouchId(touch.identifier);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (activeTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === activeTouchId) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const resetJoystick = useCallback(() => {
    setActiveTouchId(null);
    setKnobPos({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  }, [onMove]);

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (activeTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchId) {
        resetJoystick();
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const dist = Math.hypot(deltaX, deltaY);

    if (dist === 0) {
      setKnobPos({ x: 0, y: 0 });
      onMove({ x: 0, y: 0 });
      return;
    }

    const angle = Math.atan2(deltaY, deltaX);
    const clampedDist = Math.min(dist, maxRadius);
    const posX = Math.cos(angle) * clampedDist;
    const posY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: posX, y: posY });
    // Invert Y for 3D forward/backward (up is -Z in 3D camera coordinate)
    onMove({
      x: posX / maxRadius,
      y: posY / maxRadius,
    });
  };

  useEffect(() => {
    const handleGlobalEnd = () => {
      if (activeTouchId !== null) resetJoystick();
    };
    window.addEventListener('touchend', handleGlobalEnd);
    window.addEventListener('touchcancel', handleGlobalEnd);
    return () => {
      window.removeEventListener('touchend', handleGlobalEnd);
      window.removeEventListener('touchcancel', handleGlobalEnd);
    };
  }, [activeTouchId, resetJoystick]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top right quick shortcuts for TV & Tablet */}
      <div className="flex justify-end gap-2 pointer-events-auto">
        <button
          onClick={onOpenMap}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-semibold shadow-lg active:scale-95 transition-all"
          title="Peta Wilayah [M]"
        >
          <Compass className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Peta [M]</span>
        </button>

        <button
          onClick={onOpenInventory}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-semibold shadow-lg active:scale-95 transition-all"
          title="Inventori Kristal [I]"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Kristal [I]</span>
        </button>

        <button
          onClick={onOpenHelp}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-amber-400 hover:text-white hover:bg-slate-800 font-bold text-sm shadow-lg active:scale-95 transition-all"
          title="Bantuan & Petunjuk [H]"
        >
          ?
        </button>
      </div>

      {/* Bottom Area: Left Virtual Joystick, Right Action Buttons */}
      <div className="flex items-end justify-between w-full">
        {/* Virtual Joystick */}
        <div
          ref={baseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="relative w-32 h-32 rounded-full bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50 shadow-2xl flex items-center justify-center pointer-events-auto touch-none"
        >
          {/* Direction indicators */}
          <span className="absolute top-1 text-[10px] font-mono text-slate-400">W</span>
          <span className="absolute bottom-1 text-[10px] font-mono text-slate-400">S</span>
          <span className="absolute left-1.5 text-[10px] font-mono text-slate-400">A</span>
          <span className="absolute right-1.5 text-[10px] font-mono text-slate-400">D</span>

          {/* Joystick Knob */}
          <div
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
              transition: activeTouchId === null ? 'transform 0.15s ease-out' : 'none',
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 border-2 border-white/80 shadow-lg flex items-center justify-center"
          >
            <div className="w-4 h-4 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Action Buttons: Jump & Interact */}
        <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
          {/* Jump Button */}
          <button
            onClick={onJump}
            className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-game font-bold text-base sm:text-lg border-2 border-emerald-300 shadow-xl active:scale-90 hover:brightness-110 transition-all"
            title="Lompat [Spasi]"
          >
            <span className="text-xl">▲</span>
            <span className="text-[11px] font-mono uppercase tracking-tight">Lompat</span>
          </button>

          {/* Interact Button */}
          <button
            onClick={onInteract}
            className="flex flex-col items-center justify-center w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-game font-bold text-base sm:text-lg border-2 border-amber-300 shadow-2xl active:scale-90 hover:brightness-110 transition-all animate-pulse"
            title="Interaksi [E / Enter]"
          >
            <span className="text-xl sm:text-2xl font-mono">E</span>
            <span className="text-[11px] font-mono uppercase tracking-tight">Aksi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
