import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import Navbar from './components/Layout/Navbar';
import CartDrawer from './components/Layout/CartDrawer';
import Home from './pages/Home';
import Watches from './pages/Watches';
import Customizer from './pages/Customizer';
import About from './pages/About';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import QuickViewModal from './components/QuickViewModal';
import { useStore } from './store/useStore';
import { HERO_WATCHES } from './data/watches';
import { THEMES } from './data/themes';

export default function App() {
  const location = useLocation();
  const activeHeroIndex = useStore((s) => s.activeHeroIndex);
  const quickViewSlug = useStore((s) => s.quickViewSlug);

  const activeWatch = HERO_WATCHES[activeHeroIndex];
  const theme = useMemo(() => THEMES[activeWatch.theme], [activeWatch]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--focus-color', theme.accent);
  }, [theme]);

  return (
    <div
      className="min-h-screen relative transition-colors duration-700"
      style={{
        background: `radial-gradient(120% 100% at 50% -10%, ${theme.bgTo} 0%, ${theme.bgFrom} 55%, #000 100%)`,
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-700 bg-noise"
        aria-hidden
      />
      <div
        className="fixed -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-[160px] opacity-20 pointer-events-none transition-all duration-700"
        style={{ background: theme.bloom }}
        aria-hidden
      />
      <Navbar theme={theme} />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative z-10"
        >
          <Routes location={location}>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/watches" element={<Watches />} />
            <Route path="/watches/:slug" element={<ProductDetail />} />
            <Route path="/customizer" element={<Customizer />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <CartDrawer theme={theme} />
      <AnimatePresence>{quickViewSlug && <QuickViewModal slug={quickViewSlug} theme={theme} />}</AnimatePresence>
    </div>
  );
}
