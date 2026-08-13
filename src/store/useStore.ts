import { create } from 'zustand';
import { CartItem, WatchCategory } from '../types';
import { HERO_WATCHES, WATCHES } from '../data/watches';

interface Filters {
  search: string;
  categories: WatchCategory[];
  features: string[];
  priceRange: [number, number];
  sort: 'price-asc' | 'price-desc' | 'popularity' | 'release-date';
}

export interface CustomizerState {
  strap: 'Titanium' | 'Carbon Fiber' | 'Cyber-Leather';
  caseFinish: 'Matte Black' | 'Brushed Silver' | 'Gunmetal';
  glowColor: string;
}

interface StoreState {
  activeHeroIndex: number;
  setActiveHeroIndex: (i: number) => void;

  quickViewSlug: string | null;
  openQuickView: (slug: string) => void;
  closeQuickView: () => void;

  cart: CartItem[];
  addToCart: (watchId: string, colorway: string) => void;
  removeFromCart: (watchId: string, colorway: string) => void;
  updateQuantity: (watchId: string, colorway: string, quantity: number) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  filters: Filters;
  setFilters: (f: Partial<Filters>) => void;
  resetFilters: () => void;

  customizer: CustomizerState;
  setCustomizer: (c: Partial<CustomizerState>) => void;
}

const defaultFilters: Filters = {
  search: '',
  categories: [],
  features: [],
  priceRange: [0, 10000],
  sort: 'popularity',
};

export const useStore = create<StoreState>((set, get) => ({
  activeHeroIndex: 0,
  setActiveHeroIndex: (i) =>
    set({ activeHeroIndex: ((i % HERO_WATCHES.length) + HERO_WATCHES.length) % HERO_WATCHES.length }),

  quickViewSlug: null,
  openQuickView: (slug) => set({ quickViewSlug: slug }),
  closeQuickView: () => set({ quickViewSlug: null }),

  cart: [],
  addToCart: (watchId, colorway) =>
    set((state) => {
      const existing = state.cart.find((c) => c.watchId === watchId && c.colorway === colorway);
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.watchId === watchId && c.colorway === colorway ? { ...c, quantity: c.quantity + 1 } : c
          ),
          cartOpen: true,
        };
      }
      return { cart: [...state.cart, { watchId, colorway, quantity: 1 }], cartOpen: true };
    }),
  removeFromCart: (watchId, colorway) =>
    set((state) => ({
      cart: state.cart.filter((c) => !(c.watchId === watchId && c.colorway === colorway)),
    })),
  updateQuantity: (watchId, colorway, quantity) =>
    set((state) => ({
      cart: state.cart
        .map((c) => (c.watchId === watchId && c.colorway === colorway ? { ...c, quantity } : c))
        .filter((c) => c.quantity > 0),
    })),
  cartOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),

  filters: defaultFilters,
  setFilters: (f) => set((state) => ({ filters: { ...state.filters, ...f } })),
  resetFilters: () => set({ filters: defaultFilters }),

  customizer: {
    strap: 'Titanium',
    caseFinish: 'Matte Black',
    glowColor: '#00f6ff',
  },
  setCustomizer: (c) => set((state) => ({ customizer: { ...state.customizer, ...c } })),
}));

export const getCartTotal = () => {
  const { cart } = useStore.getState();
  return cart.reduce((sum: number, item: CartItem) => {
    const watch = WATCHES.find((w) => w.id === item.watchId);
    return sum + (watch ? watch.price * item.quantity : 0);
  }, 0);
};
