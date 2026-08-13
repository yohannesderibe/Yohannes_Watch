import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Watch } from '../types';
import { THEMES } from '../data/themes';
import { useStore } from '../store/useStore';

export default function ProductCard({ watch }: { watch: Watch }) {
  const theme = THEMES[watch.theme];
  const openQuickView = useStore((s) => s.openQuickView);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = watch.image && !imageFailed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="group relative rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden"
    >
      <Link to={`/watches/${watch.slug}`} className="block">
        <div
          className="h-56 flex items-center justify-center relative overflow-hidden"
          style={{ background: `radial-gradient(circle at 50% 30%, ${watch.colorway}22, transparent 70%)` }}
        >
          {showImage ? (
            <img
              src={watch.image}
              alt={watch.name}
              onError={() => setImageFailed(true)}
              className="w-36 h-36 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
              style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }}
            />
          ) : (
            <div
              className="w-28 h-28 rounded-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
              style={{
                background: `linear-gradient(135deg, ${watch.colorway}, #0b0b0f)`,
                boxShadow: `0 0 40px ${watch.colorway}33`,
              }}
            />
          )}

          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-black/50 border border-white/10 font-mono">
            {watch.status}
          </span>
        </div>

        <div className="p-5">
          <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1 font-mono">
            {watch.category}
          </p>
          <h3 className="text-lg font-medium mb-1">{watch.name}</h3>
          <div className="flex items-center justify-between mt-3">
            <span className="font-mono text-sm" style={{ color: theme.accent }}>
              ${watch.price.toLocaleString()}
            </span>
            <span className="text-xs text-white/30">{new Date(watch.releaseDate).getFullYear()}</span>
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          openQuickView(watch.slug);
        }}
        className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full"
        style={{ backgroundColor: theme.accent, color: '#000' }}
        aria-label={`Quick view ${watch.name}`}
      >
        <Eye size={14} />
      </button>
    </motion.div>
  );
}
