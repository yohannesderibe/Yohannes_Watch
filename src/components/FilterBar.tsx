import { Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { WatchCategory } from '../types';

const CATEGORIES: WatchCategory[] = ['Quantum', 'Mechanical-Digital Hybrid', 'Holographic', 'Minimalist'];
const FEATURE_TAGS = ['Waterproof 1000m', 'Solar Kinetic', 'AR Preview'];

export default function FilterBar() {
  const filters = useStore((s) => s.filters);
  const setFilters = useStore((s) => s.setFilters);
  const resetFilters = useStore((s) => s.resetFilters);

  const toggleCategory = (cat: WatchCategory) => {
    const has = filters.categories.includes(cat);
    setFilters({
      categories: has ? filters.categories.filter((c) => c !== cat) : [...filters.categories, cat],
    });
  };

  const toggleFeature = (feat: string) => {
    const has = filters.features.includes(feat);
    setFilters({
      features: has ? filters.features.filter((f) => f !== feat) : [...filters.features, feat],
    });
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 space-y-6">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          placeholder="Search watches..."
          className="w-full bg-black/30 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-white/30"
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-mono">Category</p>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="accent-current"
              />
              <span className="text-white/70">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-mono">
          Price — up to ${filters.priceRange[1].toLocaleString()}
        </p>
        <input
          type="range"
          min={0}
          max={10000}
          step={200}
          value={filters.priceRange[1]}
          onChange={(e) => setFilters({ priceRange: [0, Number(e.target.value)] })}
          className="w-full accent-current"
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-mono">Features</p>
        <div className="flex flex-wrap gap-2">
          {FEATURE_TAGS.map((feat) => (
            <button
              key={feat}
              onClick={() => toggleFeature(feat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filters.features.includes(feat)
                  ? 'border-white/60 bg-white/10'
                  : 'border-white/10 text-white/50 hover:border-white/30'
              }`}
            >
              {feat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-mono">Sort</p>
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ sort: e.target.value as typeof filters.sort })}
          className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option value="popularity">Popularity</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="release-date">Release Date</option>
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="w-full text-xs uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors py-2"
      >
        Reset Filters
      </button>
    </div>
  );
}
