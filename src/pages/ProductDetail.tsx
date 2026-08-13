import { useParams, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { WATCHES } from '../data/watches';
import { THEMES } from '../data/themes';
import { useStore } from '../store/useStore';
import { Scan } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const watch = WATCHES.find((w) => w.slug === slug);
  const addToCart = useStore((s) => s.addToCart);
  const [colorway, setColorway] = useState(watch?.colorways[0].hex ?? '');
  const [arMode, setArMode] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  if (!watch) return <Navigate to="/watches" replace />;
  const theme = THEMES[watch.theme];
  const showImage = watch.image && !imageFailed;

  const specRows = Object.entries(watch.specs);

  return (
    <section className="pt-28 pb-24 max-w-6xl mx-auto px-6 lg:px-12">
      <Link to="/watches" className="text-xs uppercase tracking-widest text-white/40 hover:text-white/70">
        ← Back to Collection
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 mt-8">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-[420px] rounded-3xl flex items-center justify-center relative overflow-hidden border border-white/8"
            style={{ background: `radial-gradient(circle at 50% 30%, ${colorway}33, #08080b 75%)` }}
          >
            {showImage ? (
              <img
                src={watch.image}
                alt={watch.name}
                onError={() => setImageFailed(true)}
                className="max-w-[72%] max-h-[72%] object-contain"
                style={{ filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))' }}
              />
            ) : (
              <div
                className="w-56 h-56 rounded-[3rem] transition-colors duration-300"
                style={{ background: `linear-gradient(135deg, ${colorway}, #0b0b0f)`, boxShadow: `0 0 80px ${colorway}44` }}
              />
            )}
            {arMode && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                <Scan size={40} style={{ color: theme.accent }} className="mb-4 animate-pulse" />
                <p className="text-sm text-white/70">AR Try-On simulation — point your camera at your wrist</p>
                <p className="text-xs text-white/40 mt-1">(placeholder preview)</p>
              </div>
            )}
            <button
              onClick={() => setArMode(!arMode)}
              className="absolute bottom-4 right-4 text-xs px-4 py-2 rounded-full border border-white/20 hover:border-white/50 uppercase tracking-widest bg-black/40"
            >
              {arMode ? 'Exit AR' : 'Try-On / AR Preview'}
            </button>
          </motion.div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest font-mono mb-1" style={{ color: theme.accent }}>
            {watch.line} · {watch.category}
          </p>
          <h1 className="text-4xl font-geo mb-4">{watch.name}</h1>
          <p className="text-white/60 mb-6">{watch.description}</p>

          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-2 font-mono">Colorway</p>
            <div className="flex gap-2">
              {watch.colorways.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColorway(c.hex)}
                  className="w-9 h-9 rounded-full border-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: c.hex, borderColor: colorway === c.hex ? '#fff' : 'transparent' }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <span className="text-3xl font-mono">${watch.price.toLocaleString()}</span>
            <span className="text-xs uppercase tracking-widest text-white/40">{watch.status}</span>
          </div>

          <button
            onClick={() => addToCart(watch.id, colorway)}
            className="w-full py-3 rounded-full text-sm uppercase tracking-widest font-medium mb-10"
            style={{ backgroundColor: theme.accent, color: '#000' }}
          >
            Add to Bag
          </button>

          <table className="w-full text-sm">
            <tbody>
              {specRows.map(([key, value]) => (
                <tr key={key} className="border-t border-white/8">
                  <td className="py-3 text-white/40 capitalize font-mono text-xs">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </td>
                  <td className="py-3 text-right">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
