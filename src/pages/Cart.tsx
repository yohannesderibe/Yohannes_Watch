import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Tag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { WATCHES } from '../data/watches';

const VALID_CODES: Record<string, number> = {
  VANGUARD10: 0.1,
  CHRONOS20: 0.2,
};

type Step = 'cart' | 'shipping' | 'payment' | 'confirmed';

export default function Cart() {
  const cart = useStore((s) => s.cart);
  const [step, setStep] = useState<Step>('cart');
  const [promo, setPromo] = useState('');
  const [promoState, setPromoState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [discount, setDiscount] = useState(0);

  const [shipping, setShipping] = useState({ name: '', address: '', city: '', zip: '' });
  const [payment, setPayment] = useState({ card: '', expiry: '', cvc: '' });

  const items = cart
    .map((c) => ({ ...c, watch: WATCHES.find((w) => w.id === c.watchId)! }))
    .filter((c) => c.watch);
  const subtotal = items.reduce((sum, i) => sum + i.watch.price * i.quantity, 0);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (VALID_CODES[code]) {
      setDiscount(VALID_CODES[code]);
      setPromoState('valid');
    } else {
      setDiscount(0);
      setPromoState('invalid');
    }
  };

  if (items.length === 0 && step === 'cart') {
    return (
      <section className="pt-40 pb-24 max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-3xl font-geo mb-4">Your bag is empty</h1>
        <p className="text-white/50">Explore the collection to find your next Vanguard.</p>
      </section>
    );
  }

  const steps: Step[] = ['cart', 'shipping', 'payment', 'confirmed'];
  const stepIndex = steps.indexOf(step);

  return (
    <section className="pt-28 pb-24 max-w-3xl mx-auto px-6 lg:px-12">
      <div className="flex items-center gap-3 mb-10">
        {['Bag', 'Shipping', 'Payment', 'Done'].map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono ${
                i <= stepIndex ? 'bg-white text-black' : 'bg-white/10 text-white/40'
              }`}
            >
              {i < stepIndex ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-xs uppercase tracking-widest ${i <= stepIndex ? 'text-white' : 'text-white/30'}`}>
              {label}
            </span>
            {i < 3 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'cart' && (
          <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.watchId + item.colorway} className="flex justify-between items-center border-b border-white/8 pb-4">
                  <div>
                    <p className="text-sm">{item.watch.name} × {item.quantity}</p>
                    <p className="text-xs text-white/40 font-mono">{item.colorway}</p>
                  </div>
                  <span className="font-mono text-sm">${(item.watch.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mb-8">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  value={promo}
                  onChange={(e) => {
                    setPromo(e.target.value);
                    setPromoState('idle');
                  }}
                  placeholder="Promo code (try VANGUARD10)"
                  className="w-full bg-black/30 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-white/30"
                />
              </div>
              <button
                onClick={applyPromo}
                className="px-5 py-2 rounded-full text-xs uppercase tracking-widest border border-white/20 hover:border-white/50"
              >
                Apply
              </button>
            </div>
            {promoState === 'valid' && (
              <p className="text-xs text-green-400 mb-6">Promo applied — {discount * 100}% off.</p>
            )}
            {promoState === 'invalid' && <p className="text-xs text-red-400 mb-6">Invalid promo code.</p>}

            <div className="space-y-2 mb-8 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span className="font-mono">-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-lg pt-2 border-t border-white/8">
                <span>Total</span>
                <span className="font-mono">${total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setStep('shipping')}
              className="w-full py-3 rounded-full text-sm uppercase tracking-widest font-medium bg-white text-black"
            >
              Continue to Shipping
            </button>
          </motion.div>
        )}

        {step === 'shipping' && (
          <motion.form
            key="shipping"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              setStep('payment');
            }}
            className="space-y-4"
          >
            {(['name', 'address', 'city', 'zip'] as const).map((field) => (
              <div key={field}>
                <label className="text-xs uppercase tracking-widest text-white/40 font-mono block mb-2">
                  {field}
                </label>
                <input
                  required
                  value={shipping[field]}
                  onChange={(e) => setShipping({ ...shipping, [field]: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-white/30"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3 rounded-full text-sm uppercase tracking-widest font-medium bg-white text-black mt-4"
            >
              Continue to Payment
            </button>
          </motion.form>
        )}

        {step === 'payment' && (
          <motion.form
            key="payment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              setStep('confirmed');
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs uppercase tracking-widest text-white/40 font-mono block mb-2">Card Number</label>
              <input
                required
                placeholder="•••• •••• •••• ••••"
                value={payment.card}
                onChange={(e) => setPayment({ ...payment, card: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs uppercase tracking-widest text-white/40 font-mono block mb-2">Expiry</label>
                <input
                  required
                  placeholder="MM/YY"
                  value={payment.expiry}
                  onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-white/30"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs uppercase tracking-widest text-white/40 font-mono block mb-2">CVC</label>
                <input
                  required
                  placeholder="•••"
                  value={payment.cvc}
                  onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
            <p className="text-xs text-white/30">This is a simulated checkout — no real payment is processed.</p>
            <button
              type="submit"
              className="w-full py-3 rounded-full text-sm uppercase tracking-widest font-medium bg-white text-black mt-4"
            >
              Confirm Order — ${total.toLocaleString()}
            </button>
          </motion.form>
        )}

        {step === 'confirmed' && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Check size={24} />
            </div>
            <h2 className="text-2xl font-geo mb-2">Order Confirmed</h2>
            <p className="text-white/50 text-sm">
              Your Vanguard is being prepared. A confirmation has been sent to your inbox.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
