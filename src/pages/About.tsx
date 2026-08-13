import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const TIMELINE = [
  { year: '2023', title: 'First Prototype', text: 'The Vanguard concept case is machined from a single titanium billet.' },
  { year: '2024', title: 'Kinetic Breakthrough', text: 'Kinetic auto-charge movement passes 10,000-cycle durability testing.' },
  { year: '2025', title: 'Titanium Core Launch', text: 'Vanguard 02 ships with solar-kinetic power and a 1000m-rated case.' },
  { year: '2026', title: 'Quantum Void', text: 'The flagship Vanguard 03 debuts an entangled escapement movement.' },
];

const MATERIALS = [
  { name: 'Zero-G Titanium', detail: 'Aerospace-grade alloy, 45% lighter than steel, engineered for the case backbone.' },
  { name: 'Void Ceramic', detail: 'Scratch-resistant composite fired at 1,400°C for a matte, light-absorbing finish.' },
  { name: 'Holographic Film', detail: 'A layered thin-film optic that refracts ambient light across the dial.' },
];

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section>
      <div ref={heroRef} className="h-[70vh] flex items-center justify-center relative overflow-hidden pt-16">
        <motion.div style={{ y, opacity }} className="text-center px-6">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40 font-mono mb-4">Craftsmanship</p>
          <h1 className="text-5xl sm:text-7xl font-geo max-w-3xl mx-auto text-balance">
            Engineering time into something worth wearing
          </h1>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20">
        <h2 className="text-2xl font-geo mb-10">Release Timeline</h2>
        <div className="space-y-10 border-l border-white/10 pl-8">
          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative"
            >
              <span className="absolute -left-[38px] top-1 w-2.5 h-2.5 rounded-full bg-white/40" />
              <p className="font-mono text-sm text-white/40 mb-1">{item.year}</p>
              <h3 className="text-xl mb-2">{item.title}</h3>
              <p className="text-white/60 text-sm max-w-xl">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 pb-24">
        <h2 className="text-2xl font-geo mb-10">Material Breakdown</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {MATERIALS.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-6"
            >
              <h3 className="text-sm uppercase tracking-widest font-mono mb-3">{m.name}</h3>
              <p className="text-white/60 text-sm">{m.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
