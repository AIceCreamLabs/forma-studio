import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const navigate           = useNavigate();
  const { items, remove, count, total } = useCart();
  const headRef            = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headRef.current) return;
    gsap.fromTo(headRef.current.querySelectorAll('.h'),
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', stagger: 0.08, duration: 0.9, ease: 'expo.out', delay: 0.1 }
    );
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-8 z-50 font-mono text-[9px] tracking-[0.28em] uppercase text-white/30 hover:text-white transition-colors duration-200"
      >
        ← Back
      </button>

      {/* Header */}
      <div ref={headRef} className="pt-28 pb-10 px-8 md:px-16 border-b border-white/[0.06]">
        <p className="h font-mono text-[8px] tracking-[0.3em] uppercase text-white/30 mb-4" style={{ clipPath: 'inset(0 0 100% 0)' }}>
          {count} {count === 1 ? 'item' : 'items'}
        </p>
        <h1
          className="h font-black uppercase leading-[0.86] tracking-[-0.07em]"
          style={{ fontSize: 'clamp(48px, 10vw, 130px)', clipPath: 'inset(0 0 100% 0)' }}
        >
          Your Bag
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[55vh] gap-8">
          <p className="text-white/30 font-light text-center leading-relaxed" style={{ fontSize: 'clamp(13px, 1.2vw, 16px)' }}>
            Your bag is empty.<br />Something is missing.
          </p>
          <button
            onClick={() => navigate('/men')}
            className="font-mono text-[8px] tracking-[0.28em] uppercase text-white/40 hover:text-white/70 transition-colors duration-200 border-b border-white/20 pb-1"
          >
            Browse the collection →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] min-h-[60vh]">

          {/* Items */}
          <div className="md:border-r border-white/[0.06]">
            {items.map(item => (
              <div
                key={`${item.product.slug}-${item.size}`}
                className="grid grid-cols-[80px_1fr_auto] gap-5 px-8 md:px-16 py-7 border-b border-white/[0.06] items-center"
              >
                <div className="overflow-hidden bg-[#0f0f0f] aspect-[2/3]">
                  <img src={item.product.img} alt={item.product.name} className="w-full h-full object-cover grayscale-[0.3]" />
                </div>
                <div>
                  <p className="font-mono text-[7px] tracking-[0.22em] uppercase text-white/25 mb-2">{item.product.category}</p>
                  <p className="font-bold text-sm tracking-[-0.02em] uppercase mb-2 leading-tight">{item.product.name}</p>
                  <p className="font-mono text-[8px] tracking-[0.2em] text-white/25">Size: {item.size} · Qty: {item.qty}</p>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <p className="font-mono text-[10px] tracking-[0.1em] text-white/40">{item.product.price}</p>
                  <button
                    onClick={() => remove(item.product.slug, item.size)}
                    className="font-mono text-[7px] tracking-[0.22em] uppercase text-white/15 hover:text-white/50 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="px-8 md:px-10 py-10 sticky top-0 h-fit">
            <p className="font-mono text-[8px] tracking-[0.28em] uppercase text-white/30 mb-8">Summary</p>
            <div className="space-y-3 mb-8">
              {items.map(i => (
                <div key={`${i.product.slug}-${i.size}`} className="flex justify-between gap-4">
                  <p className="text-xs font-light text-white/35 truncate flex-1">{i.product.name} × {i.qty}</p>
                  <p className="font-mono text-[9px] text-white/25 shrink-0">{i.product.price}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.06] pt-5 mb-8 flex justify-between">
              <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-white/40">Total</p>
              <p className="font-mono text-sm tracking-[0.08em]">{total}</p>
            </div>
            <button className="w-full h-14 bg-white text-black font-mono text-[9px] tracking-[0.3em] uppercase hover:bg-white/90 transition-colors duration-200">
              Checkout
            </button>
            <p className="font-mono text-[7px] tracking-[0.2em] uppercase text-white/15 text-center mt-4">
              Free delivery on all orders
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
