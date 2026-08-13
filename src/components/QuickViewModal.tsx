import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WATCHES } from '../data/watches';
import { useStore } from '../store/useStore';
import { WatchTheme } from '../types';

export default function QuickViewModal({ slug, theme }: { slug: string; theme: WatchTheme }) {
  const watch = WATCHES.find((w) => w.slug === slug);
  const closeQuickView = useStore((s) => s.closeQuickView);
  const addToCart = useStore((s) => s.addToCart);
  const [colorway, setColorway] = useState(watch?.colorways[0].hex ?? '');
  const [imageFailed, setImageFailed] = useState(false);

  if (!watch) return null;

  const showImage = watch.image && !imageFailed;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50"
        onClick={closeQuickView}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view of ${watch.name}`}
          className="pointer-events-auto relative w-full sm:w-[720px] max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0c0c11] p-6 sm:p-10"
        >
        <button
          onClick={closeQuickView}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10"
          aria-label="Close quick view"
        >
          <X size={18} />
        </button>

        <div className="grid sm:grid-cols-2 gap-8">
          <div
            className="h-64 sm:h-72 md:h-80 rounded-2xl flex items-center justify-center overflow-hidden p-6"
            style={{ background: `radial-gradient(circle at 50% 30%, ${colorway}33, transparent 70%)` }}
          >
            {showImage ? (
              <img
                src={watch.image}
                alt={watch.name}
                onError={() => setImageFailed(true)}
                className="max-w-full max-h-full w-auto h-auto object-contain"
                style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }}
              />
            ) : (
              <div
                className="w-40 h-40 rounded-[2rem] transition-colors duration-300"
                style={{ background: `linear-gradient(135deg, ${colorway}, #0b0b0f)`, boxShadow: `0 0 60px ${colorway}44` }}
              />
            )}
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-widest font-mono mb-1" style={{ color: theme.accent }}>
              {watch.line}
            </p>
            <h2 className="text-3xl font-geo mb-3">{watch.name}</h2>
            <p className="text-white/60 text-sm mb-6">{watch.description}</p>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-2 font-mono">Colorway</p>
              <div className="flex gap-2">
                {watch.colorways.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setColorway(c.hex)}
                    aria-label={c.name}
                    className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                    style={{ backgroundColor: c.hex, borderColor: colorway === c.hex ? '#fff' : 'transparent' }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 text-xs font-mono text-white/50">
              <div>Display: <span className="text-white/80">{watch.specs.display}</span></div>
              <div>Movement: <span className="text-white/80">{watch.specs.movement}</span></div>
              <div>Water: <span className="text-white/80">{watch.specs.waterResistance}</span></div>
              <div>Battery: <span className="text-white/80">{watch.specs.battery}</span></div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-mono">${watch.price.toLocaleString()}</span>
              <span className="text-xs uppercase tracking-widest text-white/40">{watch.status}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  addToCart(watch.id, colorway);
                  closeQuickView();
                }}
                className="flex-1 py-3 rounded-full text-sm uppercase tracking-widest font-medium"
                style={{ backgroundColor: theme.accent, color: '#000' }}
              >
                Add to Bag
              </button>
              <Link
                to={`/watches/${watch.slug}`}
                onClick={closeQuickView}
                className="flex-1 text-center py-3 rounded-full text-sm uppercase tracking-widest font-medium border border-white/20 hover:border-white/50"
              >
                Full Details
              </Link>
            </div>
          </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
