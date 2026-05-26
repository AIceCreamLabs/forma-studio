/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera } from '@react-three/drei';

import { usePageTransition } from '@/context/TransitionContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';

import { getPositionClasses } from '@/lib/variant-2/utils';
import { scenePerspectives } from '@/lib/variant-2/scene-data';

import * as THREE from 'three';
import Loader from '@/components/loader';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
}

// ── Wireframe architect building ──────────────────────────────────────────────
function ArchitectBuilding() {
  const { scene } = useGLTF('./cyberpunk_skyscraper.glb');

  useEffect(() => {
    if (!scene) return;
    scene.scale.set(3, 3, 3);
    scene.position.set(0, 0, 0);

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      // Near-transparent fill provides depth/occlusion without colour
      mesh.material = new THREE.MeshBasicMaterial({
        color:       new THREE.Color('#f5f2ed'),
        transparent: true,
        opacity:     0.92,
        depthWrite:  true,
      });

      // Only hard structural edges (threshold 25°) — clean architectural lines
      const edges = new THREE.EdgesGeometry(mesh.geometry, 25);
      const lines = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: new THREE.Color('#2d2c2a') })
      );
      mesh.add(lines);
    });
  }, [scene]);

  return <primitive object={scene} />;
}

// ── Camera ────────────────────────────────────────────────────────────────────
function AnimatedCamera({ cameraAnimRef, targetAnimRef }: any) {
  const cameraRef = useRef<any>(null);
  const { set } = useThree();

  useEffect(() => {
    if (cameraRef.current) set({ camera: cameraRef.current });
  }, [set]);

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(cameraAnimRef.current.x, cameraAnimRef.current.y, cameraAnimRef.current.z);
      cameraRef.current.lookAt(targetAnimRef.current.x, targetAnimRef.current.y, targetAnimRef.current.z);
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={45} near={1} far={1000} position={[0, 5, 10]} />;
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene({ cameraAnimRef, targetAnimRef }: any) {
  const { scene } = useThree();

  useEffect(() => {
    if (!scene) return;
    scene.fog        = new THREE.Fog(new THREE.Color('#f5f2ed'), 22, 55);
    scene.background = new THREE.Color('#f5f2ed');
  }, [scene]);

  return (
    <>
      <AnimatedCamera cameraAnimRef={cameraAnimRef} targetAnimRef={targetAnimRef} />
      <ambientLight intensity={2.0} />
      <directionalLight position={[15, 25, 10]} intensity={0.3} />
      <ArchitectBuilding />
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function CinematicSceneShowcase() {
  const { navigateTo }     = usePageTransition();
  const containerRef       = useRef<HTMLDivElement>(null);
  const smoothWrapperRef   = useRef<HTMLDivElement>(null);
  const smoothContentRef   = useRef<HTMLDivElement>(null);
  const textRefs           = useRef<(HTMLDivElement | null)[]>([]);
  const cameraAnimRef      = useRef({ x: -20, y: 0,  z: 0  });
  const targetAnimRef      = useRef({ x: 0,   y: 15, z: 0  });
  const rotationAnimRef    = useRef({ useRotation: false });
  const progressBarRef     = useRef<HTMLDivElement>(null);
  const progressTextRef    = useRef<HTMLSpanElement>(null);
  const splitInstancesRef  = useRef<SplitText[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [atEnd,     setAtEnd]     = useState(false);

  useEffect(() => {
    if (!containerRef.current || !smoothWrapperRef.current || !smoothContentRef.current) return;

    const loadingTimer = setTimeout(() => setIsLoading(false), 1500);

    document.fonts.ready.then(() => {
      ScrollSmoother.create({
        wrapper:     smoothWrapperRef.current!,
        content:     smoothContentRef.current!,
        smooth:      4,
        effects:     false,
        smoothTouch: 2,
      });

      const setProgressWidth = gsap.quickSetter(progressBarRef.current, 'width', '%');
      const setProgressText  = gsap.quickSetter(progressTextRef.current, 'textContent');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   true,
          onUpdate: (self) => {
            const pct = self.progress * 100;
            setProgressWidth(pct);
            setProgressText(Math.round(pct).toString().padStart(3, '0') + '%');
            setAtEnd(pct >= 88);
          },
        },
      });

      scenePerspectives.forEach((perspective) => {
        const s = perspective.scrollProgress.start / 100;
        const e = perspective.scrollProgress.end   / 100;
        tl.to(cameraAnimRef.current,   { x: perspective.camera.x, y: perspective.camera.y, z: perspective.camera.z, duration: e - s, ease: 'none' }, s);
        tl.to(targetAnimRef.current,   { x: perspective.target.x, y: perspective.target.y, z: perspective.target.z, duration: e - s, ease: 'none' }, s);
        tl.to(rotationAnimRef.current, { useRotation: false, duration: e - s, ease: 'none' }, s);
      });

      scenePerspectives.forEach((perspective, index) => {
        const textEl = textRefs.current[index];
        if (!textEl) return;

        if (perspective.hideText) {
          gsap.set(textEl, { opacity: 0, pointerEvents: 'none' });
          return;
        }

        const titleEl    = textEl.querySelector('h2');
        const subtitleEl = textEl.querySelector('p');
        if (!titleEl || !subtitleEl) return;

        const titleSplit    = new SplitText(titleEl,    { type: 'chars' });
        const subtitleSplit = new SplitText(subtitleEl, { type: 'chars' });
        splitInstancesRef.current.push(titleSplit, subtitleSplit);

        const textTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start:   `${perspective.scrollProgress.start}% top`,
            end:     `${perspective.scrollProgress.end}% top`,
            scrub:   0.5,
          },
        });

        const isLast = index === scenePerspectives.length - 1;

        if (index === 0) {
          gsap.set([titleSplit.chars, subtitleSplit.chars], { x: 0, opacity: 1 });
          textTl.to([subtitleSplit.chars, titleSplit.chars], {
            x: 100, opacity: 0, duration: 1, stagger: -0.02, ease: 'power2.in',
          });
        } else {
          textTl
            .fromTo([subtitleSplit.chars, titleSplit.chars],
              { x: -100, opacity: 0 },
              { x: 0, opacity: 1, duration: isLast ? 0.2 : 0.25, stagger: isLast ? -0.01 : -0.02, ease: 'power2.out' }
            )
            .to({}, { duration: isLast ? 1.0 : 0.5 })
            .to([subtitleSplit.chars, titleSplit.chars], {
              x: 100, opacity: 0, duration: 0.25, stagger: -0.02, ease: 'power2.in',
            });
        }
      });
    });

    return () => {
      clearTimeout(loadingTimer);
      splitInstancesRef.current.forEach(s => s.revert());
      splitInstancesRef.current = [];
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <Loader isLoading={isLoading} className="bg-[#f5f2ed]" classNameLoader="bg-[#1a1a1a]" />

      {/* ── Canvas ── */}
      <div className="fixed inset-0 w-full h-svh z-0">
        <Canvas
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          style={{ background: '#f5f2ed' }}
        >
          <Scene cameraAnimRef={cameraAnimRef} targetAnimRef={targetAnimRef} />
        </Canvas>
      </div>

      {/* ── Wordmark ── */}
      <div className="fixed top-7 left-8 z-30 pointer-events-none select-none">
        <span style={{
          fontFamily:    "'Space Grotesk', sans-serif",
          fontWeight:    700,
          fontSize:      'clamp(14px, 1.1vw, 17px)',
          letterSpacing: '-0.01em',
          color:         'rgba(26,26,26,0.85)',
        }}>
          Forma
        </span>
      </div>

      {/* ── Nav ── */}
      <div className="fixed top-7 right-8 z-30 pointer-events-auto flex items-center gap-6">
        <button onClick={() => navigateTo('/projects')} className="font-mono text-[8px] tracking-[0.24em] uppercase transition-colors duration-300" style={{ color: 'rgba(26,26,26,0.4)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(26,26,26,0.9)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,26,0.4)')}>
          Projects
        </button>
        <button onClick={() => navigateTo('/about')} className="font-mono text-[8px] tracking-[0.24em] uppercase transition-colors duration-300" style={{ color: 'rgba(26,26,26,0.4)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(26,26,26,0.9)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,26,0.4)')}>
          About
        </button>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
        <div className="flex flex-col items-center gap-4">
          <svg width="24" height="32" viewBox="0 0 24 32">
            <path d="M 12 4 L 12 24 M 12 24 L 8 20 M 12 24 L 16 20"
              stroke="rgba(26,26,26,0.35)" strokeWidth="0.8" fill="none" />
          </svg>
          <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(26,26,26,0.25)' }} />
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-[13svh] z-40 pointer-events-none w-[250px]">
        <div className="absolute -top-3 left-0 w-3 h-3 border-l border-t" style={{ borderColor: 'rgba(26,26,26,0.15)' }} />
        <div className="absolute -top-3 right-0 w-3 h-3 border-r border-t" style={{ borderColor: 'rgba(26,26,26,0.15)' }} />
        <div className="relative h-px" style={{ background: 'rgba(26,26,26,0.1)' }}>
          <div ref={progressBarRef} className="absolute left-0 top-0 h-full" style={{ width: '0%', background: 'rgba(26,26,26,0.6)' }} />
        </div>
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <span ref={progressTextRef} className="font-mono tracking-[0.2em]" style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)' }}>
            000%
          </span>
        </div>
      </div>

      {/* ── Text overlays ── */}
      <div className="fixed inset-0 pointer-events-none z-30">
        {scenePerspectives.map((perspective, index) => {
          const isEnter = perspective.title === 'ENTER';
          return (
            <div
              key={index}
              ref={el => { textRefs.current[index] = el; }}
              className={`absolute max-md:w-full ${getPositionClasses(perspective.position)}`}
              style={isEnter ? { pointerEvents: 'auto', cursor: 'pointer' } : {}}
              onClick={isEnter ? () => navigateTo('/projects') : undefined}
            >
              <h2
                className="max-md:text-2xl font-bold leading-[1.0] mb-3 tracking-[-0.02em]"
                style={{ fontSize: '4vw', color: '#1a1a1a' }}
              >
                {perspective.title}
              </h2>
              <p
                className="max-md:text-base font-light leading-[1.5]"
                style={{ fontSize: '1.1vw', color: 'rgba(26,26,26,0.55)' }}
              >
                {perspective.subtitle}
              </p>
              {isEnter && atEnd && (
                <p className="font-mono text-[9px] tracking-[0.3em] uppercase mt-4" style={{ color: 'rgba(26,26,26,0.35)' }}>
                  Click to enter →
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Scroll spacer ── */}
      <div ref={smoothWrapperRef} id="smooth-wrapper" className="relative z-20">
        <div ref={smoothContentRef} id="smooth-content">
          <div ref={containerRef} style={{ height: '900svh' }} />
        </div>
      </div>
    </>
  );
}

useGLTF.preload('./cyberpunk_skyscraper.glb');
