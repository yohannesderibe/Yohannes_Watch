import { motion, AnimatePresence } from 'framer-motion';
import { Watch, WatchTheme } from '../../types';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

const fontClass: Record<WatchTheme['headingFont'], string> = {
  geo: 'font-geo',
  mono: 'font-mono',
  serif: 'font-serif italic',
};

export default function HeroContent({ watch, theme }: { watch: Watch; theme: WatchTheme }) {
  const openQuickView = useStore((s) => s.openQuickView);
  const navigate = useNavigate();

  return (
    <div className="max-w-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={watch.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <p
            className="uppercase text-xs tracking-[0.35em] mb-4 font-mono"
            style={{ color: theme.accent }}
          >
            {watch.line}
          </p>
          <h1 className={`text-5xl sm:text-6xl lg:text-7xl mb-6 text-balance leading-[1.02] ${fontClass[theme.headingFont]}`}>
            {watch.name}
          </h1>
          <p className="text-white/60 text-base mb-8 max-w-md">{watch.description}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {watch.features.map((f) => (
              <span
                key={f}
                className="text-[11px] uppercase tracking-wide px-3 py-1 rounded-full border font-mono"
                style={{ borderColor: theme.accentSoft, color: theme.accent, backgroundColor: theme.accentSoft }}
              >
                {f}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 mb-10">
            <span className="text-2xl font-mono">${watch.price.toLocaleString()}</span>
            <span className="text-xs uppercase tracking-widest text-white/40">{watch.status}</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => openQuickView(watch.slug)}
              className="px-7 py-3 rounded-full text-sm uppercase tracking-widest font-medium transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: theme.accent, color: '#000' }}
            >
              Quick View
            </button>
            <button
              onClick={() => navigate(`/watches/${watch.slug}`)}
              className="px-7 py-3 rounded-full text-sm uppercase tracking-widest font-medium border border-white/20 hover:border-white/50 transition-colors"
            >
              Pre-Order
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
