'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { PROJECTS, type Project } from '@/lib/projects';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
}

type Category = 'All' | 'Residential' | 'Cultural' | 'Commercial' | 'Civic';
const CATS: Category[] = ['All', 'Residential', 'Cultural', 'Commercial', 'Civic'];

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [cat, setCat]   = useState<Category>('All');
  const [hovered, setHovered] = useState<Project | null>(null);

  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  const titleRef         = useRef<HTMLHeadingElement>(null);
  const labelRef         = useRef<HTMLParagraphElement>(null);
  const listRef          = useRef<HTMLDivElement>(null);
  const previewRef       = useRef<HTMLDivElement>(null);
  const barRef           = useRef<HTMLDivElement>(null);
  const btnRefs          = useRef<(HTMLButtonElement | null)[]>([]);
  const splitRef         = useRef<SplitText | null>(null);
  const smootherRef      = useRef<ScrollSmoother | null>(null);

  const filtered = cat === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === cat);

  // Cursor-following preview
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (previewRef.current) {
        gsap.to(previewRef.current, {
          x: e.clientX + 24,
          y: e.clientY - 80,
          duration: 0.55,
          ease: 'power2.out',
        });
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Fade preview in/out
  useEffect(() => {
    gsap.to(previewRef.current, {
      opacity: hovered ? 1 : 0,
      scale:   hovered ? 1 : 0.94,
      duration: 0.35,
      ease: 'power2.out',
    });
  }, [hovered]);

  // Slide the filter bar indicator
  function moveBar(idx: number) {
    const btn = btnRefs.current[idx];
    if (!btn || !barRef.current) return;
    const { left, width } = btn.getBoundingClientRect();
    const parentLeft = btn.parentElement!.getBoundingClientRect().left;
    gsap.to(barRef.current, { x: left - parentLeft, width, duration: 0.35, ease: 'power2.inOut' });
  }

  useLayoutEffect(() => {
    requestAnimationFrame(() => moveBar(CATS.indexOf(cat)));
  }, [cat]);

  // Main animation setup
  useEffect(() => {
    if (!smoothWrapperRef.current || !smoothContentRef.current) return;

    smootherRef.current = ScrollSmoother.create({
      wrapper:     smoothWrapperRef.current,
      content:     smoothContentRef.current,
      smooth:      4,
      effects:     false,
      smoothTouch: 2,
    });

    // Title SplitText reveal
    if (titleRef.current) {
      const split = new SplitText(titleRef.current, { type: 'chars' });
      splitRef.current = split;
      gsap.fromTo(split.chars,
        { clipPath: 'inset(0 0 100% 0)', y: 20 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.8, stagger: 0.04, ease: 'power3.out', delay: 0.1 }
      );
    }

    // Label fade
    gsap.fromTo(labelRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.05 }
    );

    // Row reveals
    if (listRef.current) {
      const rows  = listRef.current.querySelectorAll<HTMLElement>('.proj-row');
      const lines = listRef.current.querySelectorAll<HTMLElement>('.row-line');

      rows.forEach((row, i) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });

        tl.fromTo(lines[i],
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, 0
        ).fromTo(row.querySelectorAll('.row-text'),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, 0.15
        );
      });
    }

    return () => {
      splitRef.current?.revert();
      splitRef.current = null;
      smootherRef.current?.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [cat]);

  return (
    <>
      {/* Cursor image preview */}
      <div
        ref={previewRef}
        className="fixed top-0 left-0 pointer-events-none z-[500]"
        style={{ opacity: 0, width: 200, height: 260, willChange: 'transform' }}
      >
        {hovered && (
          <img
            src={hovered.img}
            alt={hovered.name}
            className="w-full h-full object-cover"
            style={{ boxShadow: '0 12px 40px rgba(26,26,26,0.15)' }}
          />
        )}
      </div>

      <div ref={smoothWrapperRef} id="smooth-wrapper" style={{ overflow: 'hidden' }}>
        <div ref={smoothContentRef} id="smooth-content">
          <div className="min-h-screen pt-14" style={{ background: '#f5f2ed', color: '#1a1a1a' }}>

            {/* Hero */}
            <div className="px-8 md:px-16 pt-24 pb-16">
              <p
                ref={labelRef}
                className="font-mono tracking-[0.22em] uppercase mb-6"
                style={{ fontSize: '9px', color: 'rgba(26,26,26,0.4)', opacity: 0 }}
              >
                Selected Works
              </p>
              <h1
                ref={titleRef}
                className="font-bold leading-[1.0] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(64px, 10vw, 140px)' }}
              >
                Projects
              </h1>
            </div>

            {/* Filter */}
            <div className="px-8 md:px-16 mb-4 relative inline-flex gap-8 pb-2">
              {CATS.map((c, i) => (
                <button
                  key={c}
                  ref={el => { btnRefs.current[i] = el; }}
                  onClick={() => setCat(c)}
                  className="font-mono tracking-[0.18em] uppercase transition-colors duration-200"
                  style={{ fontSize: '9px', color: cat === c ? 'rgba(26,26,26,0.9)' : 'rgba(26,26,26,0.3)' }}
                >
                  {c}
                </button>
              ))}
              <div
                ref={barRef}
                className="absolute bottom-0 left-0 h-px pointer-events-none"
                style={{ background: '#1a1a1a', width: 0 }}
              />
            </div>

            {/* Project list */}
            <div ref={listRef} className="mt-2">
              {filtered.map((project, i) => (
                <div
                  key={project.id}
                  className="proj-row relative cursor-pointer group"
                  onClick={() => navigate(`/project/${project.slug}`)}
                  onMouseEnter={() => setHovered(project)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Top border line */}
                  <div
                    className="row-line absolute top-0 left-0 h-px w-full origin-left"
                    style={{ background: 'rgba(26,26,26,0.1)', scaleX: 0 } as React.CSSProperties}
                  />

                  <div
                    className="flex items-center justify-between px-8 md:px-16 py-7 transition-colors duration-300"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,26,26,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Number */}
                    <span
                      className="row-text font-mono shrink-0 mr-8"
                      style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)', letterSpacing: '0.1em', width: '2.5ch' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Name */}
                    <h2
                      className="row-text font-bold flex-1 leading-none tracking-[-0.03em] transition-opacity duration-300 group-hover:opacity-60"
                      style={{ fontSize: 'clamp(22px, 3.5vw, 52px)' }}
                    >
                      {project.name}
                    </h2>

                    {/* Meta */}
                    <div className="row-text hidden md:flex flex-col items-end gap-1 shrink-0 ml-8">
                      <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(26,26,26,0.35)', letterSpacing: '0.08em' }}>
                        {project.year}
                      </span>
                      <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(26,26,26,0.3)', letterSpacing: '0.06em' }}>
                        {project.location}
                      </span>
                    </div>

                    {/* Arrow */}
                    <span
                      className="row-text ml-8 font-mono transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                      style={{ fontSize: '14px', color: 'rgba(26,26,26,0.35)' }}
                    >
                      →
                    </span>
                  </div>
                </div>
              ))}

              {/* Final border */}
              <div className="h-px mx-8 md:mx-16" style={{ background: 'rgba(26,26,26,0.1)' }} />
            </div>

            {/* Footer CTA */}
            <div className="px-8 md:px-16 py-28">
              <p className="font-mono tracking-[0.2em] uppercase mb-6" style={{ fontSize: '9px', color: 'rgba(26,26,26,0.35)' }}>
                New commission
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="group flex items-center gap-5 transition-opacity hover:opacity-50"
              >
                <span
                  className="font-bold leading-none tracking-[-0.03em]"
                  style={{ fontSize: 'clamp(28px, 3.5vw, 52px)' }}
                >
                  Start a project with us
                </span>
                <span className="font-mono text-2xl" style={{ color: 'rgba(26,26,26,0.4)' }}>→</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
