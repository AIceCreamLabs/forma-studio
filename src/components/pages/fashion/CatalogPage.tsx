import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { PRODUCTS } from '@/lib/products';

gsap.registerPlugin(ScrollTrigger, Flip);

type Gender = 'all' | 'men' | 'women';
const CATS = ['All', 'Outerwear', 'Trousers', 'Tops', 'Knitwear', 'Tailoring'];

function Card({ product, delay }: { product: typeof PRODUCTS[0]; delay: number }) {
  const ref      = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ref.current) return;
    const st = ScrollTrigger.create({
      trigger: ref.current, start: 'top 92%',
      onEnter: () => gsap.fromTo(ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay }
      ),
    });
    return () => st.kill();
  }, [delay]);

  return (
    <div
      ref={ref}
      data-id={product.id}
      onClick={() => navigate(`/product/${product.slug}`)}
      className="prod-card group cursor-pointer opacity-0"
    >
      <div className="overflow-hidden aspect-[2/3] bg-[#111] mb-4">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 ease-out grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="font-mono text-[7px] tracking-[0.24em] uppercase text-white/25 mb-1">{product.category}</p>
          <p className="font-bold text-sm tracking-[-0.02em] uppercase leading-tight">{product.name}</p>
        </div>
        <p className="font-mono text-[10px] tracking-[0.1em] text-white/35 shrink-0 pt-5">{product.price}</p>
      </div>
      <p className="font-mono text-[7px] tracking-[0.2em] uppercase text-white/15 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {product.material}
      </p>
    </div>
  );
}

export default function CatalogPage() {
  const navigate = useNavigate();
  const heroRef  = useRef<HTMLDivElement>(null);
  const gridRef  = useRef<HTMLDivElement>(null);
  const barRef   = useRef<HTMLDivElement>(null);
  const menBtnRef   = useRef<HTMLButtonElement>(null);
  const womenBtnRef = useRef<HTMLButtonElement>(null);

  const [gender, setGender] = useState<Gender>('all');
  const [cat,    setCat]    = useState('All');

  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const prevGender   = useRef<Gender>('all');
  const prevCat      = useRef('All');

  // Header entrance
  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(heroRef.current.querySelectorAll('.h'),
      { clipPath: 'inset(0 0 100% 0)', y: 20 },
      { clipPath: 'inset(0 0 0% 0)', y: 0, stagger: 0.1, duration: 1.0, ease: 'expo.out', delay: 0.1 }
    );
  }, []);

  // Sliding indicator on gender toggle
  useEffect(() => {
    if (!barRef.current || !menBtnRef.current || !womenBtnRef.current) return;
    const target = gender === 'men'   ? menBtnRef.current
                 : gender === 'women' ? womenBtnRef.current
                 : null;

    if (!target) {
      gsap.to(barRef.current, { opacity: 0, duration: 0.3 });
    } else {
      const bar = barRef.current;
      const rect = target.getBoundingClientRect();
      const parent = target.parentElement!.getBoundingClientRect();
      gsap.to(bar, {
        x: rect.left - parent.left,
        width: rect.width,
        opacity: 1,
        duration: 0.55,
        ease: 'power3.inOut',
      });
    }
  }, [gender]);

  // Capture Flip state before filter change
  function changeGender(g: Gender) {
    if (gridRef.current) {
      flipStateRef.current = Flip.getState(
        gridRef.current.querySelectorAll('.prod-card')
      );
    }
    prevGender.current = gender;
    setGender(g);
  }

  function changeCat(c: string) {
    if (gridRef.current) {
      flipStateRef.current = Flip.getState(
        gridRef.current.querySelectorAll('.prod-card')
      );
    }
    prevCat.current = cat;
    setCat(c);
  }

  // Run Flip after each filter re-render
  useLayoutEffect(() => {
    if (!flipStateRef.current || !gridRef.current) return;

    Flip.from(flipStateRef.current, {
      duration: 0.75,
      ease: 'power4.inOut',
      stagger: { each: 0.035, from: 'center' },
      absolute: true,
      onLeave: (els) => gsap.to(els, {
        opacity: 0, scale: 0.86, y: -12,
        duration: 0.3, ease: 'power2.in',
      }),
      onEnter: (els) => gsap.fromTo(els,
        { opacity: 0, scale: 0.94, y: 16 },
        { opacity: 1, scale: 1,    y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.04 }
      ),
    });

    flipStateRef.current = null;
  }, [gender, cat]);

  const list = PRODUCTS.filter(p => {
    const matchG = gender === 'all' || p.gender === gender;
    const matchC = cat === 'All'    || p.category === cat;
    return matchG && matchC;
  });

  const headingText = gender === 'men' ? 'Men'
                    : gender === 'women' ? 'Women'
                    : 'Catalog';

  return (
    <div className="min-h-screen bg-black text-white">

      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-8 z-50 font-mono text-[9px] tracking-[0.28em] uppercase text-white/30 hover:text-white transition-colors duration-200"
      >
        ← Home
      </button>

      {/* ── Header ── */}
      <div ref={heroRef} className="pt-28 pb-10 px-8 md:px-16 border-b border-white/[0.06]">
        <p className="h font-mono text-[8px] tracking-[0.3em] uppercase text-white/30 mb-5" style={{ clipPath: 'inset(0 0 100% 0)' }}>
          AW25 Collection
        </p>
        <h1
          className="h font-black uppercase leading-[0.86] tracking-[-0.07em] mb-6"
          style={{ fontSize: 'clamp(56px, 12vw, 160px)', clipPath: 'inset(0 0 100% 0)' }}
        >
          {headingText}
        </h1>

        {/* ── Gender toggle ── */}
        <div className="h relative flex items-center gap-0 mb-0" style={{ clipPath: 'inset(0 0 100% 0)' }}>
          {/* Sliding background bar */}
          <div
            ref={barRef}
            className="absolute bottom-0 h-px bg-white pointer-events-none"
            style={{ opacity: 0, width: 40 }}
          />

          {(['all', 'men', 'women'] as Gender[]).map(g => (
            <button
              key={g}
              ref={g === 'men' ? menBtnRef : g === 'women' ? womenBtnRef : undefined}
              onClick={() => changeGender(g)}
              className="px-5 py-3 font-mono text-[9px] tracking-[0.28em] uppercase transition-colors duration-300"
              style={{ color: gender === g ? '#fff' : 'rgba(255,255,255,0.22)' }}
            >
              {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}

          <span className="ml-4 font-mono text-[8px] tracking-[0.22em] uppercase text-white/15">
            {list.length} pieces
          </span>
        </div>
      </div>

      {/* ── Category filter ── */}
      <div className="flex overflow-x-auto border-b border-white/[0.06] px-8 md:px-16">
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => changeCat(c)}
            className="shrink-0 py-4 px-4 font-mono text-[8px] tracking-[0.22em] uppercase transition-colors duration-200 -mb-px"
            style={{
              color:        cat === c ? '#fff' : 'rgba(255,255,255,0.25)',
              borderBottom: cat === c ? '1px solid #fff' : '1px solid transparent',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      <div
        ref={gridRef}
        className="grid gap-x-4 gap-y-14 p-8 md:p-16"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(180px, 24vw, 300px), 1fr))' }}
      >
        {list.map((p, i) => (
          <Card key={p.id} product={p} delay={(i % 4) * 0.07} />
        ))}
      </div>

      {list.length === 0 && (
        <div className="flex items-center justify-center py-32">
          <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/20">No pieces match this selection</p>
        </div>
      )}

      {/* ── Footer strip ── */}
      <div className="border-t border-white/[0.06] px-8 md:px-16 py-8 flex justify-between items-center">
        <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-white/20">Noir House © AW25</p>
        <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-white/10">Made in England / Italy / Portugal</p>
      </div>
    </div>
  );
}
