'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
}

const STATS = [
  { value: '2008', label: 'Founded' },
  { value: '84',   label: 'Projects' },
  { value: '12',   label: 'Countries' },
  { value: '3×',   label: 'Stirling Prize' },
];

const PILLARS = [
  {
    num:   '01',
    title: 'Restraint',
    body:  'We do not add. We remove — until only the essential argument of the building remains visible. Every surface, every material, every proportion is earned.',
  },
  {
    num:   '02',
    title: 'Material honesty',
    body:  'Concrete does not pretend to be stone. Steel does not apologise for being steel. The character of a building comes from the truth of what it is made of.',
  },
  {
    num:   '03',
    title: 'Time',
    body:  "Buildings outlive clients, architects, intentions. We design for the building's centenary — not for the press release. Permanence is a discipline.",
  },
];

const TEAM = [
  { name: 'Elspeth Raine',   role: 'Founding Partner'          },
  { name: 'Marcus Aldridge', role: 'Design Director'           },
  { name: 'Yuki Tanaka',     role: 'Technical Director'        },
  { name: 'Chiara Fontana',  role: 'Associate, Interiors'      },
  { name: 'Reuben Osei',     role: 'Associate, Structures'     },
  { name: 'Petra Holtz',     role: 'Associate, Sustainability' },
];

export default function AboutPage() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  const heroHeadRef      = useRef<HTMLHeadingElement>(null);
  const heroBioRef       = useRef<HTMLParagraphElement>(null);
  const statsRef         = useRef<HTMLDivElement>(null);
  const pillarsRef       = useRef<HTMLDivElement>(null);
  const teamRef          = useRef<HTMLDivElement>(null);
  const splitRefs        = useRef<SplitText[]>([]);

  useEffect(() => {
    if (!smoothWrapperRef.current || !smoothContentRef.current) return;

    const smoother = ScrollSmoother.create({
      wrapper:     smoothWrapperRef.current,
      content:     smoothContentRef.current,
      smooth:      4,
      effects:     false,
      smoothTouch: 2,
    });

    // Hero heading — scroll-scrubbed char reveal
    if (heroHeadRef.current) {
      const split = new SplitText(heroHeadRef.current, { type: 'chars, words' });
      splitRefs.current.push(split);
      gsap.fromTo(split.chars,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0 0% 0)', opacity: 1,
          duration: 0.9, stagger: 0.025, ease: 'power3.out',
          scrollTrigger: {
            trigger: heroHeadRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Hero bio fade
    gsap.fromTo(heroBioRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: heroBioRef.current, start: 'top 82%', toggleActions: 'play none none none' },
      }
    );

    // Stats — clip from bottom
    if (statsRef.current) {
      const items = statsRef.current.querySelectorAll<HTMLElement>('.stat-item');
      items.forEach((el, i) => {
        gsap.fromTo(el,
          { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
          {
            clipPath: 'inset(0 0 0% 0)', opacity: 1,
            duration: 0.7, ease: 'power3.out', delay: i * 0.08,
            scrollTrigger: { trigger: statsRef.current, start: 'top 80%', toggleActions: 'play none none none' },
          }
        );
      });
    }

    // Pillars — heading SplitText + body fade per section
    if (pillarsRef.current) {
      const sections = pillarsRef.current.querySelectorAll<HTMLElement>('.pillar-section');
      sections.forEach(section => {
        const head = section.querySelector<HTMLElement>('.pillar-head');
        const body = section.querySelector<HTMLElement>('.pillar-body');
        const num  = section.querySelector<HTMLElement>('.pillar-num');

        if (head) {
          const split = new SplitText(head, { type: 'chars' });
          splitRefs.current.push(split);
          gsap.fromTo(split.chars,
            { clipPath: 'inset(0 0 100% 0)' },
            {
              clipPath: 'inset(0 0 0% 0)',
              duration: 0.7, stagger: 0.03, ease: 'power3.out',
              scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' },
            }
          );
        }

        if (num) {
          gsap.fromTo(num,
            { opacity: 0, x: -10 },
            {
              opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
              scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' },
            }
          );
        }

        if (body) {
          gsap.fromTo(body,
            { opacity: 0, y: 16 },
            {
              opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.25,
              scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' },
            }
          );
        }
      });
    }

    // Team rows — staggered slide-in
    if (teamRef.current) {
      const rows = teamRef.current.querySelectorAll<HTMLElement>('.team-row');
      rows.forEach((row, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: -20 },
          {
            opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.06,
            scrollTrigger: { trigger: teamRef.current, start: 'top 82%', toggleActions: 'play none none none' },
          }
        );
      });
    }

    return () => {
      splitRefs.current.forEach(s => s.revert());
      splitRefs.current = [];
      smoother.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={smoothWrapperRef} id="smooth-wrapper" style={{ overflow: 'hidden' }}>
      <div ref={smoothContentRef} id="smooth-content">
        <div style={{ background: '#f5f2ed', color: '#1a1a1a' }}>

          {/* Hero */}
          <div className="min-h-screen flex flex-col justify-end px-8 md:px-16 pb-24 pt-36">
            <p className="font-mono tracking-[0.22em] uppercase mb-8" style={{ fontSize: '9px', color: 'rgba(26,26,26,0.4)' }}>
              About Forma
            </p>
            <h1
              ref={heroHeadRef}
              className="font-bold leading-[1.05] tracking-[-0.03em] max-w-5xl"
              style={{ fontSize: 'clamp(32px, 5vw, 76px)' }}
            >
              Form, material, light — the three arguments of architecture.
            </h1>
            <p
              ref={heroBioRef}
              className="mt-12 max-w-lg leading-[1.8]"
              style={{ fontSize: 'clamp(16px, 1.3vw, 19px)', color: 'rgba(26,26,26,0.6)', opacity: 0 }}
            >
              Forma was founded in London in 2008 on the belief that architecture is not decoration but argument. Each project is a proposition about how people should inhabit space, move through light, and understand material.
            </p>
          </div>

          {/* Marquee strip */}
          <div
            className="overflow-hidden py-5 select-none"
            style={{ borderTop: '1px solid rgba(26,26,26,0.08)', borderBottom: '1px solid rgba(26,26,26,0.08)' }}
          >
            <div
              className="whitespace-nowrap font-mono tracking-[0.3em] uppercase"
              style={{
                fontSize: '9px',
                color: 'rgba(26,26,26,0.25)',
                animation: 'marquee 24s linear infinite',
              }}
            >
              {Array(6).fill('Form · Material · Light · Structure · Permanence · Restraint · ').join('')}
            </div>
          </div>

          {/* Stats */}
          <div className="px-8 md:px-16 py-24" style={{ borderBottom: '1px solid rgba(26,26,26,0.08)' }}>
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {STATS.map(({ value, label }) => (
                <div key={label} className="stat-item" style={{ opacity: 0 }}>
                  <p
                    className="font-bold leading-none tracking-[-0.03em] mb-3"
                    style={{ fontSize: 'clamp(48px, 5vw, 80px)' }}
                  >
                    {value}
                  </p>
                  <p className="font-mono tracking-[0.18em] uppercase" style={{ fontSize: '8px', color: 'rgba(26,26,26,0.4)' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pillars */}
          <div ref={pillarsRef} className="px-8 md:px-16 py-24">
            <p className="font-mono tracking-[0.22em] uppercase mb-16" style={{ fontSize: '9px', color: 'rgba(26,26,26,0.4)' }}>
              How we work
            </p>
            <div className="space-y-0">
              {PILLARS.map(({ num, title, body }) => (
                <div
                  key={num}
                  className="pillar-section grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-6 md:gap-16 py-14"
                  style={{ borderTop: '1px solid rgba(26,26,26,0.08)' }}
                >
                  <span
                    className="pillar-num font-mono self-start"
                    style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)', letterSpacing: '0.1em', paddingTop: '6px' }}
                  >
                    {num}
                  </span>
                  <h3
                    className="pillar-head font-bold leading-[1.0] tracking-[-0.03em] self-start"
                    style={{ fontSize: 'clamp(28px, 3vw, 48px)' }}
                  >
                    {title}
                  </h3>
                  <p
                    className="pillar-body leading-[1.75] self-start"
                    style={{ fontSize: 'clamp(15px, 1.2vw, 17px)', color: 'rgba(26,26,26,0.6)' }}
                  >
                    {body}
                  </p>
                </div>
              ))}
              <div className="h-px" style={{ background: 'rgba(26,26,26,0.08)' }} />
            </div>
          </div>

          {/* Team */}
          <div className="px-8 md:px-16 py-24" style={{ borderTop: '1px solid rgba(26,26,26,0.08)' }}>
            <p className="font-mono tracking-[0.22em] uppercase mb-14" style={{ fontSize: '9px', color: 'rgba(26,26,26,0.4)' }}>
              Studio
            </p>
            <div ref={teamRef} className="max-w-2xl">
              {TEAM.map(({ name, role }) => (
                <div
                  key={name}
                  className="team-row flex items-center justify-between py-5"
                  style={{ borderBottom: '1px solid rgba(26,26,26,0.08)', opacity: 0 }}
                >
                  <p className="font-bold" style={{ fontSize: 'clamp(16px, 1.4vw, 20px)' }}>{name}</p>
                  <p className="font-mono tracking-[0.12em] uppercase" style={{ fontSize: '8px', color: 'rgba(26,26,26,0.4)' }}>
                    {role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Legal footer */}
          <div className="px-8 md:px-16 py-14" style={{ borderTop: '1px solid rgba(26,26,26,0.08)' }}>
            <p
              className="max-w-lg leading-[1.7]"
              style={{ fontSize: '13px', color: 'rgba(26,26,26,0.4)' }}
            >
              Forma is a registered architectural practice in England and Wales (ARB ref. 4821-A). We hold full professional indemnity insurance and operate under the RIBA Code of Professional Conduct.
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
