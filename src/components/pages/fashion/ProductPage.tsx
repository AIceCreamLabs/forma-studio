import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS } from '@/lib/products';
import { useCart } from '@/context/CartContext';

gsap.registerPlugin(ScrollTrigger);

export default function ProductPage() {
  const { slug }  = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const { add }   = useCart();

  const product = PRODUCTS.find(p => p.slug === slug);

  // outer tall container — gives scroll room
  const outerRef    = useRef<HTMLDivElement>(null);
  const headRef     = useRef<HTMLHeadingElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);
  const descRef     = useRef<HTMLParagraphElement>(null);
  const detailsRef  = useRef<HTMLUListElement>(null);
  const layerRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const [size,  setSize]  = useState('');
  const [added, setAdded] = useState(false);

  // ── Entrance ────────────────────────────────────────────
  useEffect(() => {
    if (!product) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo(layerRefs.current[0],
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.1 }, 0)
     .fromTo(headRef.current,
      { clipPath: 'inset(0 0 100% 0)', y: 24 },
      { clipPath: 'inset(0 0 0% 0)',   y: 0,  duration: 1.0 }, 0.3)
     .fromTo([metaRef.current, descRef.current, detailsRef.current],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0,  duration: 0.7, stagger: 0.1 }, 0.5);
    return () => { tl.kill(); };
  }, [slug]);

  // ── Scroll-driven image reveals ─────────────────────────
  useEffect(() => {
    if (!product || !outerRef.current) return;

    const imgCount = product.imgs.length; // usually 3
    const triggers: ScrollTrigger[] = [];

    product.imgs.forEach((_, i) => {
      if (i === 0) return;

      const layer = layerRefs.current[i];
      if (!layer) return;

      // Each subsequent image occupies a slice of the scroll range
      // e.g. for 3 images: img1 at 30-50%, img2 at 60-80%
      const sliceSize = 0.25;
      const startPct  = (i / imgCount) * 0.9;        // 0→33%, 0→67%…
      const endPct    = startPct + sliceSize;

      gsap.fromTo(layer,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: outerRef.current,
            start: `${startPct * 100}% top`,
            end:   `${endPct   * 100}% top`,
            scrub: 1.5,
          },
        }
      );

      triggers.push(
        ScrollTrigger.getAll().slice(-1)[0]
      );
    });

    ScrollTrigger.refresh();
    return () => { triggers.forEach(t => t?.kill()); };
  }, [slug, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 font-mono text-xs tracking-widest uppercase mb-6">Product not found</p>
          <button onClick={() => navigate('/catalog')} className="text-white/60 font-mono text-xs tracking-widest uppercase underline">
            Back to collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white">

      {/* ── Back ── */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-8 z-50 font-mono text-[9px] tracking-[0.28em] uppercase text-white/30 hover:text-white transition-colors duration-200"
      >
        ← Back
      </button>

      {/*
        Tall outer container — this is what ScrollTrigger measures.
        Inner panel is sticky so it stays in view while the outer scrolls.
        Height = 100vh (base) + 120vh per extra image.
      */}
      <div
        ref={outerRef}
        style={{ height: `${100 + (product.imgs.length - 1) * 120}vh` }}
      >
        <div className="sticky top-0 h-screen grid grid-cols-1 md:grid-cols-2">

          {/* Left — stacked image layers */}
          <div className="relative overflow-hidden bg-[#0a0a0a]">
            {product.imgs.map((src, i) => (
              <div
                key={i}
                ref={el => { layerRefs.current[i] = el; }}
                className="absolute inset-0"
                style={{
                  zIndex: i + 1,
                  clipPath: i === 0 ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)',
                }}
              >
                <img
                  src={src}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  style={{ filter: 'grayscale(0.15)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </div>
            ))}

            {/* Image counter */}
            <div className="absolute bottom-6 left-6 z-20 flex gap-3">
              {product.imgs.map((_, i) => (
                <span key={i} className="font-mono text-[8px] tracking-[0.22em] uppercase text-white/30">
                  0{i + 1}
                </span>
              ))}
            </div>
          </div>

          {/* Right — product info, scrollable inside */}
          <div className="overflow-y-auto flex flex-col px-8 md:px-14 pt-24 pb-16 bg-[#080808] md:border-l border-white/5">

            <div ref={metaRef} className="flex flex-wrap gap-5 mb-7">
              {[product.category, product.season, product.material].map(m => (
                <span key={m} className="font-mono text-[8px] tracking-[0.26em] uppercase text-white/30">{m}</span>
              ))}
            </div>

            <h1
              ref={headRef}
              className="font-black leading-[0.86] tracking-[-0.06em] uppercase mb-3"
              style={{ fontSize: 'clamp(32px, 4.5vw, 68px)', clipPath: 'inset(0 0 100% 0)' }}
            >
              {product.name}
            </h1>

            <p className="text-white/40 mb-10 tracking-[-0.01em]" style={{ fontSize: 'clamp(16px, 1.6vw, 22px)', fontWeight: 300 }}>
              {product.price}
            </p>

            <p
              ref={descRef}
              className="text-white/50 mb-10 leading-[1.85] max-w-sm"
              style={{ fontSize: 'clamp(12px, 1.1vw, 14px)', fontWeight: 300 }}
            >
              {product.desc}
            </p>

            <div className="grid grid-cols-2 gap-4 py-7 mb-7 border-t border-b border-white/[0.06]">
              {([['Cut', product.cut], ['Fit', product.fit]] as [string, string][]).map(([l, v]) => (
                <div key={l}>
                  <p className="font-mono text-[7px] tracking-[0.26em] uppercase text-white/25 mb-1">{l}</p>
                  <p className="text-white/50 text-xs font-light leading-relaxed">{v}</p>
                </div>
              ))}
            </div>

            <ul ref={detailsRef} className="mb-10 space-y-0">
              {product.details.map((d, i) => (
                <li key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] text-xs text-white/40 font-light">
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>

            <div className="mb-7">
              <p className="font-mono text-[8px] tracking-[0.26em] uppercase text-white/30 mb-3">Select size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="w-12 h-12 font-mono text-[9px] tracking-wide transition-all duration-200"
                    style={{
                      border:     `1px solid ${size === s ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.12)'}`,
                      background: size === s ? '#fff' : 'transparent',
                      color:      size === s ? '#000' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (!size) return;
                add(product, size);
                setAdded(true);
                setTimeout(() => setAdded(false), 2400);
              }}
              className="h-14 font-mono text-[9px] tracking-[0.3em] uppercase transition-all duration-300"
              style={{
                background: size ? '#fff' : 'rgba(255,255,255,0.06)',
                color:      size ? '#000' : 'rgba(255,255,255,0.2)',
                cursor:     size ? 'pointer' : 'default',
              }}
            >
              {added ? '— Added —' : size ? 'Add to bag' : 'Select a size'}
            </button>

            <button
              onClick={() => navigate('/catalog')}
              className="mt-5 font-mono text-[8px] tracking-[0.24em] uppercase text-white/20 hover:text-white/50 transition-colors duration-200 text-center"
            >
              View full collection
            </button>
          </div>

        </div>
      </div>

      {/* ── Next product ── */}
      {(() => {
        const idx  = PRODUCTS.findIndex(p => p.slug === slug);
        const next = PRODUCTS[(idx + 1) % PRODUCTS.length];
        return (
          <div
            className="group relative overflow-hidden cursor-pointer border-t border-white/[0.06]"
            style={{ height: '50vh' }}
            onClick={() => navigate(`/product/${next.slug}`)}
          >
            <img
              src={next.img}
              alt={next.name}
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 scale-[1.04] group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors duration-700" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-white/30">Next piece</p>
              <p className="font-black uppercase tracking-[-0.05em] text-white" style={{ fontSize: 'clamp(24px, 4vw, 56px)' }}>
                {next.name}
              </p>
              <p className="font-mono text-[8px] tracking-[0.2em] text-white/30 mt-1">{next.price}</p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
