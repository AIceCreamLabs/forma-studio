'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onDone: () => void;
}

export default function Preloader({ onDone }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef   = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const letters = lettersRef.current.filter(Boolean);
    if (!letters.length) return;

    gsap.set(letters, { clipPath: 'inset(0 0 100% 0)' });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.inOut',
          onComplete: onDone,
        });
      },
    });

    tl.to(letters, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 0.6,
      stagger: 0.07,
      ease: 'power3.out',
    })
      .to({}, { duration: 0.9 })
      .to(letters, {
        clipPath: 'inset(100% 0 0% 0)',
        duration: 0.4,
        stagger: 0.025,
        ease: 'power3.in',
      });
  }, [onDone]);

  const word = 'FORMA';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#f5f2ed' }}
    >
      <div className="flex items-end gap-[0.04em]">
        {word.split('').map((char, i) => (
          <span
            key={i}
            ref={el => { if (el) lettersRef.current[i] = el; }}
            style={{
              fontFamily:    "'Space Grotesk', sans-serif",
              fontWeight:    700,
              fontSize:      'clamp(52px, 8vw, 96px)',
              letterSpacing: '-0.02em',
              color:         '#1a1a1a',
              lineHeight:    1,
              display:       'inline-block',
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className="mt-5 w-16 h-px" style={{ background: 'rgba(26,26,26,0.2)' }} />
      <p
        className="mt-3 font-mono tracking-[0.22em] uppercase"
        style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)' }}
      >
        London · Architecture · Est. 2008
      </p>
    </div>
  );
}
