import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WATCHES } from '../data/watches';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';
import { useStore } from '../store/useStore';

export default function Watches() {
  const filters = useStore((s) => s.filters);

  const results = useMemo(() => {
    let list = WATCHES.filter((w) => {
      if (filters.search && !w.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.categories.length && !filters.categories.includes(w.category)) return false;
      if (filters.features.length && !filters.features.every((f) => w.features.includes(f))) return false;
      if (w.price > filters.priceRange[1]) return false;
      return true;
    });

    switch (filters.sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'release-date':
        list = [...list].sort((a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate));
        break;
      default:
        list = [...list].sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  }, [filters]);

  return (
    <section className="pt-28 pb-24 max-w-7xl mx-auto px-6 lg:px-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-2">The Collection</p>
        <h1 className="text-4xl sm:text-5xl font-geo">All Watches</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 flex-shrink-0">
          <FilterBar />
        </aside>

        <div className="flex-1">
          <p className="text-sm text-white/40 mb-6">{results.length} watches</p>
          <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {results.map((w) => (
                <ProductCard key={w.id} watch={w} />
              ))}
            </AnimatePresence>
          </motion.div>
          {results.length === 0 && (
            <p className="text-white/40 text-sm mt-10 text-center">No watches match those filters.</p>
          )}
        </div>
      </div>
    </section>
  );
}
