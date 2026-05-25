import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  { n: '01', t: 'Form', b: 'Every silhouette is a decision. The body is not dressed — it is redefined. We start with the question: what does this cloth want to become?' },
  { n: '02', t: 'Material', b: 'Wool from Yorkshire mills. Poplin from France. Denim from Japan. We do not choose fabric — we are chosen by it. Each season begins in the same place: the hand.' },
  { n: '03', t: 'Time', b: 'A coat should age better than its wearer. Our pieces resist the calendar. Seasons are irrelevant. Buy once. Buy right. Wear until it knows you.' },
  { n: '04', t: 'Restraint', b: 'We make what we cannot find. We remove what we do not need. Design is editing. The finished garment is 90% deletions.' },
];

export default function AboutPage() {
  const navigate  = useNavigate();
  const heroRef   = useRef<HTMLDivElement>(null);
  const pillarRefs= useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.querySelectorAll('.h'),
        { clipPath: 'inset(0 0 100% 0)', y: 20 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, stagger: 0.1, duration: 1.0, ease: 'expo.out', delay: 0.1 }
      );
    }

    pillarRefs.current.forEach((el, i) => {
      if (!el) return;
      ScrollTrigger.create({
        trigger: el, start: 'top 85%',
        onEnter: () => gsap.fromTo(el,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.08 }
        ),
      });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-8 z-50 font-mono text-[9px] tracking-[0.28em] uppercase text-white/30 hover:text-white transition-colors duration-200"
      >
        ← Home
      </button>

      {/* ── Hero split ── */}
      <div ref={heroRef} className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="flex flex-col justify-end px-8 md:px-16 pt-32 pb-16 border-b md:border-b-0 md:border-r border-white/[0.06]">
          <p className="h font-mono text-[8px] tracking-[0.3em] uppercase text-white/30 mb-6" style={{ clipPath: 'inset(0 0 100% 0)' }}>
            Est. 2019 — London
          </p>
          <h1
            className="h font-black uppercase leading-[0.88] tracking-[-0.06em] mb-8"
            style={{ fontSize: 'clamp(44px, 8vw, 110px)', clipPath: 'inset(0 0 100% 0)' }}
          >
            Where form<br />meets its<br />own undoing.
          </h1>
          <p
            className="h text-white/40 font-light leading-relaxed max-w-sm"
            style={{ fontSize: 'clamp(12px, 1.1vw, 14px)', clipPath: 'inset(0 0 100% 0)' }}
          >
            Noir House was founded on a single premise: that clothing is architecture, and architecture is silent argument. We make menswear for people who do not need to be noticed.
          </p>
        </div>
        <div className="hidden md:block overflow-hidden bg-[#080808]">
          <img
            src="./img/img5.webp"
            alt=""
            className="w-full h-full object-cover grayscale-[0.3] scale-[1.02]"
          />
        </div>
      </div>

      {/* ── Manifesto ── */}
      <div className="px-8 md:px-16 py-24 border-t border-white/[0.06]">
        <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/25 mb-16">Manifesto</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
          {PILLARS.map((p, i) => (
            <div key={p.n} ref={el => { pillarRefs.current[i] = el; }} className="opacity-0">
              <p className="font-mono text-[7px] tracking-[0.24em] uppercase text-white/20 mb-5">{p.n}</p>
              <h3 className="font-black uppercase tracking-[-0.05em] leading-[0.88] mb-5" style={{ fontSize: 'clamp(28px, 3.5vw, 52px)' }}>
                {p.t}
              </h3>
              <p className="text-white/40 font-light leading-relaxed" style={{ fontSize: 'clamp(12px, 1.0vw, 13px)' }}>{p.b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/[0.06]">
        {[['12', 'Pieces AW25'], ['6', 'Countries sourced'], ['1', 'Collection per year'], ['100%', 'European made']].map(([n, l]) => (
          <div key={n} className="py-10 px-8 border-r border-white/[0.06] last:border-r-0">
            <p className="font-black leading-[0.86] tracking-[-0.07em] mb-2" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>{n}</p>
            <p className="font-mono text-[7px] tracking-[0.24em] uppercase text-white/25">{l}</p>
          </div>
        ))}
      </div>

      {/* ── Stockists ── */}
      <div className="px-8 md:px-16 py-20 border-t border-white/[0.06]">
        <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/25 mb-10">Stockists</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/[0.06]">
          {['Dover Street Market — London', 'Ssense — Montreal', 'H. Lorenzo — LA', 'Browns — London', 'Isetan — Tokyo', 'Antonioli — Milan'].map(s => (
            <div key={s} className="bg-black p-6">
              <p className="text-white/40 font-light text-sm leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
