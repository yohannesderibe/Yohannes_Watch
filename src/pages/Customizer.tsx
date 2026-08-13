import { motion } from 'framer-motion';
import { useStore, CustomizerState } from '../store/useStore';

const STRAPS: CustomizerState['strap'][] = ['Titanium', 'Carbon Fiber', 'Cyber-Leather'];
const FINISHES: CustomizerState['caseFinish'][] = ['Matte Black', 'Brushed Silver', 'Gunmetal'];
const GLOWS = ['#00f6ff', '#a855f7', '#ffb020', '#e879f9', '#7dd3fc', '#22ff88'];

const FINISH_COLORS: Record<CustomizerState['caseFinish'], string> = {
  'Matte Black': '#1a1a1e',
  'Brushed Silver': '#c7cbd1',
  Gunmetal: '#2a2d33',
};

const STRAP_TEXTURES: Record<CustomizerState['strap'], string> = {
  Titanium: 'repeating-linear-gradient(90deg, #8a8f96 0px, #8a8f96 2px, #6c7076 2px, #6c7076 4px)',
  'Carbon Fiber':
    'repeating-linear-gradient(45deg, #1c1c1e 0px, #1c1c1e 4px, #050505 4px, #050505 8px)',
  'Cyber-Leather': 'linear-gradient(135deg, #2b1f14, #17110b)',
};

const dialTicks = Array.from({ length: 12 }).map((_, i) => {
  const angle = (i * 30 * Math.PI) / 180;
  const isCardinal = i % 3 === 0;
  const outerR = 88;
  const innerR = isCardinal ? 72 : 78;
  return {
    x1: 100 + outerR * Math.sin(angle),
    y1: 100 - outerR * Math.cos(angle),
    x2: 100 + innerR * Math.sin(angle),
    y2: 100 - innerR * Math.cos(angle),
    key: i,
  };
});

const hourHandAngle = (315 * Math.PI) / 180; // ~10:30 position
const minuteHandAngle = (60 * Math.PI) / 180;
const hourHand = {
  x: 100 + 45 * Math.sin(hourHandAngle),
  y: 100 - 45 * Math.cos(hourHandAngle),
};
const minuteHand = {
  x: 100 + 65 * Math.sin(minuteHandAngle),
  y: 100 - 65 * Math.cos(minuteHandAngle),
};

export default function Customizer() {
  const customizer = useStore((s) => s.customizer);
  const setCustomizer = useStore((s) => s.setCustomizer);

  return (
    <section className="pt-28 pb-24 max-w-6xl mx-auto px-6 lg:px-12">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-2">Configure Yours</p>
      <h1 className="text-4xl sm:text-5xl font-geo mb-10">Watch Customizer</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="h-[420px] rounded-3xl border border-white/8 flex items-center justify-center relative"
          style={{ background: `radial-gradient(circle at 50% 30%, ${customizer.glowColor}22, #08080b 75%)` }}
        >
          <motion.div
            animate={{ filter: `drop-shadow(0 0 40px ${customizer.glowColor}55)` }}
            transition={{ duration: 0.4 }}
            className="relative w-52 flex flex-col items-center"
          >
            {/* top strap — sits behind the case, overlapped by it */}
            <div
              className="w-16 h-20 rounded-t-xl relative z-0"
              style={{ background: STRAP_TEXTURES[customizer.strap], marginBottom: '-32px' }}
            />
            {/* case */}
            <div
              className="w-52 h-52 rounded-[2.5rem] relative z-10 flex items-center justify-center border-4"
              style={{
                backgroundColor: FINISH_COLORS[customizer.caseFinish],
                borderColor: `${customizer.glowColor}66`,
              }}
            >
              {/* dial (SVG for accurate geometry) */}
              <svg viewBox="0 0 200 200" className="w-36 h-36">
                <circle cx="100" cy="100" r="94" fill="#050508" />
                <circle cx="100" cy="100" r="94" fill="none" stroke={customizer.glowColor} strokeOpacity="0.2" strokeWidth="2" />
                {dialTicks.map((t) => (
                  <line
                    key={t.key}
                    x1={t.x1}
                    y1={t.y1}
                    x2={t.x2}
                    y2={t.y2}
                    stroke={customizer.glowColor}
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                ))}
                <line x1="100" y1="100" x2={hourHand.x} y2={hourHand.y} stroke="#f2f2f2" strokeWidth="5" strokeLinecap="round" />
                <line x1="100" y1="100" x2={minuteHand.x} y2={minuteHand.y} stroke="#cfcfcf" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="100" cy="100" r="6" fill={customizer.glowColor} />
              </svg>
              {/* crown */}
              <div
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-5 rounded-sm"
                style={{ backgroundColor: FINISH_COLORS[customizer.caseFinish], boxShadow: '1px 0 2px rgba(0,0,0,0.4)' }}
              />
            </div>
            {/* bottom strap */}
            <div
              className="w-16 h-20 rounded-b-xl relative z-0"
              style={{ background: STRAP_TEXTURES[customizer.strap], marginTop: '-32px' }}
            />
          </motion.div>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-mono">Strap Material</p>
            <div className="grid grid-cols-3 gap-3">
              {STRAPS.map((s) => (
                <button
                  key={s}
                  onClick={() => setCustomizer({ strap: s })}
                  className={`rounded-xl border p-3 text-xs text-center transition-colors ${
                    customizer.strap === s ? 'border-white/60 bg-white/10' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="h-8 rounded-md mb-2" style={{ background: STRAP_TEXTURES[s] }} />
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-mono">Case Finish</p>
            <div className="grid grid-cols-3 gap-3">
              {FINISHES.map((f) => (
                <button
                  key={f}
                  onClick={() => setCustomizer({ caseFinish: f })}
                  className={`rounded-xl border p-3 text-xs text-center transition-colors ${
                    customizer.caseFinish === f ? 'border-white/60 bg-white/10' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="h-8 rounded-md mb-2" style={{ backgroundColor: FINISH_COLORS[f] }} />
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-mono">Dial LED Glow</p>
            <div className="flex gap-3">
              {GLOWS.map((g) => (
                <button
                  key={g}
                  onClick={() => setCustomizer({ glowColor: g })}
                  aria-label={`Glow color ${g}`}
                  className="w-9 h-9 rounded-full border-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: g, borderColor: customizer.glowColor === g ? '#fff' : 'transparent' }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/8">
            <p className="text-sm text-white/50 mb-1">Your configuration</p>
            <p className="font-mono text-sm">
              {customizer.strap} · {customizer.caseFinish} · Glow {customizer.glowColor}
            </p>
          </div>

          <button
            className="w-full py-3 rounded-full text-sm uppercase tracking-widest font-medium"
            style={{ backgroundColor: customizer.glowColor, color: '#000' }}
          >
            Save Configuration
          </button>
        </div>
      </div>
    </section>
  );
}
