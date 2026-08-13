export type WatchCategory = 'Quantum' | 'Mechanical-Digital Hybrid' | 'Holographic' | 'Minimalist';

// export type ThemeId = 'neon-kinetic' | 'titanium-core' | 'quantum-void' | 'core-minimal';

export type ThemeId = 'neon-kinetic' | 'titanium-core' | 'quantum-void' | 'core-minimal' | 'kinetic-mono' | 'quantum-void-home';
export interface WatchTheme {
  id: ThemeId;
  bgFrom: string;
  bgTo: string;
  accent: string;
  accentSoft: string;
  bloom: string;
  headingFont: 'geo' | 'mono' | 'serif';
  ringColor: string;
}

export interface Watch {
  id: string;
  slug: string;
  name: string;
  line: string;
  theme: ThemeId;
  category: WatchCategory;
  price: number;
  releaseDate: string; // ISO
  popularity: number; // 0-100
  colorway: string; // hex primary
  specs: {
    display: string;
    movement: string;
    caseMaterial: string;
    waterResistance: string;
    battery: string;
    connectivity: string;
  };
  features: string[]; // tags e.g. 'Waterproof 1000m'
  description: string;
  status: 'In Stock' | 'Limited' | 'Pre-Order';
  colorways: { name: string; hex: string }[];
  image?: string; // path to primary product image (public or src asset)
  gallery?: string[]; // optional additional image paths
}

export interface CartItem {
  watchId: string;
  quantity: number;
  colorway: string;
}
