import { Canvas } from '@react-three/fiber';
import { useRef, useCallback, useEffect } from 'react';
import WatchRing from './WatchRing';
import { HERO_WATCHES } from '../../data/watches';
import { useStore } from '../../store/useStore';

export default function HeroScene() {
  const activeHeroIndex = useStore((s) => s.activeHeroIndex);
  const setActiveHeroIndex = useStore((s) => s.setActiveHeroIndex);

  const dragging = useRef(false);
  const accum = useRef(0);
  const scrollLock = useRef(false);

  const count = HERO_WATCHES.length;
  const anglePer = (Math.PI * 2) / count;
  const targetRotation = -activeHeroIndex * anglePer;

  const step = useCallback(
    (dir: 1 | -1) => {
      setActiveHeroIndex(activeHeroIndex + dir);
    },
    [activeHeroIndex, setActiveHeroIndex]
  );

  // Vertical drag rotation
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    accum.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    accum.current += e.movementY;
  };
  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (accum.current > 40) step(-1);
    else if (accum.current < -40) step(1);
  };

  const onWheel = (e: React.WheelEvent) => {
    if (scrollLock.current) return;
    if (Math.abs(e.deltaY) < 12) return;
    scrollLock.current = true;
    step(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => (scrollLock.current = false), 450);
  };

  // touch swipe support (vertical)
  const touchStartY = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (dy > 40) step(-1);
    else if (dy < -40) step(1);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step]);

  return (
    <div
      className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label="3D watch showcase, drag vertically or scroll to rotate"
    >
      <Canvas camera={{ position: [0, 0, 5.4], fov: 42 }} dpr={[1, 1.5]}>
        <WatchRing watches={HERO_WATCHES} targetRotation={targetRotation} activeIndex={activeHeroIndex} />
      </Canvas>
    </div>
  );
}
