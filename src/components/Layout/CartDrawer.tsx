import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { WATCHES } from '../../data/watches';
import { WatchTheme } from '../../types';

export default function CartDrawer({ theme }: { theme: WatchTheme }) {
  const cartOpen = useStore((s) => s.cartOpen);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const cart = useStore((s) => s.cart);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);

  const items = cart
    .map((c) => ({ ...c, watch: WATCHES.find((w) => w.id === c.watchId)! }))
    .filter((c) => c.watch);
  const subtotal = items.reduce((sum, i) => sum + i.watch.price * i.quantity, 0);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-[#0c0c11] border-l border-white/10 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
              <h2 className="font-geo uppercase text-sm tracking-[0.2em]">Your Bag</h2>
              <button onClick={() => setCartOpen(false)} aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {items.length === 0 && (
                <p className="text-white/40 text-sm mt-10 text-center">
                  Your bag is empty. Time to change that.
                </p>
              )}
              {items.map((item) => (
                <div key={item.watchId + item.colorway} className="flex gap-4">
                  <div
                    className="w-20 h-20 rounded-lg flex-shrink-0"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${item.colorway}55, #111 70%)`,
                      border: `1px solid ${item.colorway}55`,
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.watch.name}</p>
                    <p className="text-xs text-white/40 font-mono">{item.colorway}</p>
                    <p className="text-sm mt-1" style={{ color: theme.accent }}>
                      ${item.watch.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        className="w-6 h-6 rounded border border-white/15 flex items-center justify-center hover:bg-white/10"
                        onClick={() => updateQuantity(item.watchId, item.colorway, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-mono w-4 text-center">{item.quantity}</span>
                      <button
                        className="w-6 h-6 rounded border border-white/15 flex items-center justify-center hover:bg-white/10"
                        onClick={() => updateQuantity(item.watchId, item.colorway, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        className="ml-auto text-white/30 hover:text-white/70"
                        onClick={() => removeFromCart(item.watchId, item.colorway)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/10 px-6 py-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span className="font-mono">${subtotal.toLocaleString()}</span>
                </div>
                <Link
                  to="/cart"
                  onClick={() => setCartOpen(false)}
                  className="block text-center w-full py-3 rounded-full text-sm uppercase tracking-widest font-medium transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: theme.accent, color: '#000' }}
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
