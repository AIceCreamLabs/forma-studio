'use client';

import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '@/lib/projects';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectDetailPage() {
  const { slug }    = useParams<{ slug: string }>();
  const navigate    = useNavigate();
  const outerRef    = useRef<HTMLDivElement>(null);
  const project     = PROJECTS.find(p => p.slug === slug);
  const nextProject = project ? PROJECTS[(PROJECTS.indexOf(project) + 1) % PROJECTS.length] : null;

  useEffect(() => {
    if (!outerRef.current || !project) return;

    const imgLayers = Array.from(outerRef.current.querySelectorAll<HTMLElement>('.img-layer'));
    if (imgLayers.length === 0) return;

    gsap.set(imgLayers[0], { clipPath: 'inset(0% 0 0 0)' });
    const layers = imgLayers.slice(1);
    layers.forEach(l => gsap.set(l, { clipPath: 'inset(100% 0 0 0)' }));

    const n = layers.length;
    if (n === 0) return;

    const trigger = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        const progress = self.progress;
        const segSize = 1 / n;
        layers.forEach((layer, i) => {
          const s = i * segSize;
          const e = (i + 1) * segSize;
          let pct: number;
          if (progress <= s)      pct = 100;
          else if (progress >= e) pct = 0;
          else                    pct = (1 - (progress - s) / (e - s)) * 100;
          layer.style.clipPath = `inset(${pct}% 0 0 0)`;
        });
      },
    });

    return () => { trigger.kill(); };
  }, [slug, project]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f2ed' }}>
        <p style={{ color: '#1a1a1a' }}>Project not found.</p>
      </div>
    );
  }

  const extraImages = project.imgs.length - 1;
  const outerHeight = `${100 + extraImages * 120}vh`;

  return (
    <div style={{ background: '#f5f2ed', color: '#1a1a1a' }}>
      {/* Scroll-driven image reveal */}
      <div ref={outerRef} style={{ height: outerHeight }}>
        <div className="sticky top-0 h-screen grid grid-cols-1 md:grid-cols-2">
          {/* Left: stacked image layers */}
          <div className="relative overflow-hidden h-full">
            {project.imgs.map((src, i) => (
              <div
                key={i}
                className="img-layer absolute inset-0"
                style={{ zIndex: i + 1 }}
              >
                <img
                  src={src}
                  alt={`${project.name} — view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Right: project info */}
          <div className="overflow-y-auto h-full pt-28 pb-16 px-10 md:px-14 flex flex-col justify-between">
            <div>
              {/* Back */}
              <button
                onClick={() => navigate('/projects')}
                className="font-mono tracking-[0.2em] uppercase mb-10 block transition-opacity hover:opacity-60"
                style={{ fontSize: '9px', color: 'rgba(26,26,26,0.4)' }}
              >
                ← All Projects
              </button>

              {/* Title */}
              <h1
                className="font-bold leading-[1.0] tracking-[-0.03em] mb-6"
                style={{ fontSize: 'clamp(32px, 3.5vw, 52px)' }}
              >
                {project.name}
              </h1>

              {/* Description */}
              <p
                className="leading-[1.7] mb-8"
                style={{ fontSize: 'clamp(16px, 1.3vw, 18px)', color: 'rgba(26,26,26,0.7)' }}
              >
                {project.desc}
              </p>

              {/* Divider */}
              <div className="w-12 h-px mb-8" style={{ background: 'rgba(26,26,26,0.15)' }} />

              {/* Challenge */}
              <p className="font-mono tracking-[0.15em] uppercase mb-2" style={{ fontSize: '8px', color: 'rgba(26,26,26,0.4)' }}>
                Design Challenge
              </p>
              <p className="leading-[1.65] mb-10" style={{ fontSize: '15px', color: 'rgba(26,26,26,0.6)' }}>
                {project.challenge}
              </p>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                {[
                  { label: 'Year',      value: project.year.toString() },
                  { label: 'Typology',  value: project.typology },
                  { label: 'Location',  value: project.location },
                  { label: 'Category',  value: project.category },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-mono tracking-[0.15em] uppercase mb-1" style={{ fontSize: '8px', color: 'rgba(26,26,26,0.35)' }}>
                      {label}
                    </p>
                    <p style={{ fontSize: '14px' }}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <p className="font-mono tracking-[0.15em] uppercase mb-3" style={{ fontSize: '8px', color: 'rgba(26,26,26,0.35)' }}>
                  Materials
                </p>
                <ul className="space-y-1">
                  {project.materials.map(m => (
                    <li key={m} style={{ fontSize: '14px', color: 'rgba(26,26,26,0.65)' }}>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <p className="font-mono tracking-[0.15em] uppercase mb-3" style={{ fontSize: '8px', color: 'rgba(26,26,26,0.35)' }}>
                  Scale
                </p>
                <ul className="space-y-1">
                  {project.sizes.map(s => (
                    <li key={s} style={{ fontSize: '14px', color: 'rgba(26,26,26,0.65)' }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Project */}
      {nextProject && (
        <div
          className="px-8 md:px-16 py-20 cursor-pointer group"
          style={{ borderTop: '1px solid rgba(26,26,26,0.1)' }}
          onClick={() => navigate(`/project/${nextProject.slug}`)}
        >
          <p className="font-mono tracking-[0.2em] uppercase mb-4" style={{ fontSize: '9px', color: 'rgba(26,26,26,0.35)' }}>
            Next Project
          </p>
          <div className="flex items-end justify-between">
            <h2
              className="font-bold leading-[1.0] tracking-[-0.03em] group-hover:opacity-60 transition-opacity duration-300"
              style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
            >
              {nextProject.name}
            </h2>
            <span className="font-mono text-2xl mb-1" style={{ color: 'rgba(26,26,26,0.3)' }}>→</span>
          </div>
        </div>
      )}
    </div>
  );
}
