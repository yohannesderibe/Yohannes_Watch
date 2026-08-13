import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { WatchTheme } from '../../types';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/watches', label: 'Collection' },
  { to: '/customizer', label: 'Customizer' },
  { to: '/about', label: 'Craftsmanship' },
];

export default function Navbar({ theme }: { theme: WatchTheme }) {
  const [open, setOpen] = useState(false);
  const cart = useStore((s) => s.cart);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const itemCount = cart.reduce((n, c) => n + c.quantity, 0);

  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-black/30 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-geo tracking-[0.2em] text-sm uppercase flex items-center gap-3">
          <span style={{ color: theme.accent }}>Yohannes</span>
          <span className="text-[10px] tracking-[0.3em] text-white/60">ATELIER</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `uppercase text-xs tracking-[0.15em] transition-colors ${
                  isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
            aria-label={`Open cart, ${itemCount} items`}
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono"
                style={{ backgroundColor: theme.accent, color: '#000' }}
              >
                {itemCount}
              </span>
            )}
          </button>
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-4 bg-black/60">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className="uppercase text-xs tracking-[0.15em] text-white/70"
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
