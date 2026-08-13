import { useStore } from '../store/useStore';
import { HERO_WATCHES } from '../data/watches';
import HeroContent from '../components/Hero/HeroContent';
import WatchArc from '../components/Hero/WatchArc';
import { WatchTheme } from '../types';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function Home({ theme }: { theme: WatchTheme }) {
  const activeHeroIndex = useStore((s) => s.activeHeroIndex);
  const setActiveHeroIndex = useStore((s) => s.setActiveHeroIndex);
  const activeWatch = HERO_WATCHES[activeHeroIndex];

  return (
    <section className="min-h-screen pt-16 flex flex-col lg:flex-row items-center max-w-7xl mx-auto px-6 lg:px-12 gap-8">
      <div className="w-full lg:w-1/2 order-2 lg:order-1">
        <HeroContent watch={activeWatch} theme={theme} />
      </div>

      <div className="w-full lg:w-1/2 h-[460px] sm:h-[560px] lg:h-[680px] order-1 lg:order-2 relative flex items-center gap-4">
        <div
          className="flex-1 h-full relative rounded-3xl overflow-hidden"
          style={{
            background: `radial-gradient(circle at 15% 50%, ${activeWatch?.colorway ?? theme.accent}14, transparent 65%)`,
          }}
        >
          <WatchArc
            watches={HERO_WATCHES}
            activeIndex={activeHeroIndex}
            onSelect={setActiveHeroIndex}
            accent={activeWatch?.colorway ?? theme.accent}
          />
        </div>

        <div className="hidden sm:flex flex-col items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setActiveHeroIndex(activeHeroIndex - 1)}
            className="p-2 rounded-full border border-white/15 hover:border-white/40 transition-colors"
            aria-label="Previous watch"
          >
            <ChevronUp size={16} />
          </button>
          <div className="flex flex-col gap-2">
            {HERO_WATCHES.map((w, i) => (
              <button
                key={w.id}
                onClick={() => setActiveHeroIndex(i)}
                aria-label={`Show ${w.name}`}
                className="w-2 rounded-full transition-all"
                style={{
                  backgroundColor: i === activeHeroIndex ? theme.accent : 'rgba(255,255,255,0.25)',
                  height: i === activeHeroIndex ? '20px' : '8px',
                }}
              />
            ))}
          </div>
          <button
            onClick={() => setActiveHeroIndex(activeHeroIndex + 1)}
            className="p-2 rounded-full border border-white/15 hover:border-white/40 transition-colors"
            aria-label="Next watch"
          >
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="sm:hidden absolute bottom-2 inset-x-0 flex items-center justify-center gap-3">
          {HERO_WATCHES.map((w, i) => (
            <button
              key={w.id}
              onClick={() => setActiveHeroIndex(i)}
              aria-label={`Show ${w.name}`}
              className="h-2 rounded-full transition-all"
              style={{
                backgroundColor: i === activeHeroIndex ? theme.accent : 'rgba(255,255,255,0.25)',
                width: i === activeHeroIndex ? '20px' : '8px',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
