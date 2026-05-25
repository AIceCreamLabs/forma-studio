import { createContext, useCallback, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

interface TransitionCtx {
  navigateTo: (path: string) => void;
}

const Ctx = createContext<TransitionCtx>({ navigateTo: () => {} });
export const usePageTransition = () => useContext(Ctx);

const LINE_COUNT = 6;

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const navigate  = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const linesRef   = useRef<(HTMLDivElement | null)[]>([]);
  const busyRef    = useRef(false);

  const navigateTo = useCallback((path: string) => {
    if (busyRef.current) return;
    busyRef.current = true;

    const overlay = overlayRef.current;
    const lines   = linesRef.current.filter(Boolean) as HTMLDivElement[];
    if (!overlay || !lines.length) { navigate(path); busyRef.current = false; return; }

    gsap.set(overlay,  { opacity: 1, pointerEvents: 'all' });
    gsap.set(lines,    { scaleX: 0, transformOrigin: 'left center' });

    const tl = gsap.timeline();

    // Lines scan left → right (blueprint plotter)
    tl.to(lines, {
      scaleX:   1,
      duration: 0.55,
      stagger:  { each: 0.07, from: 'start' },
      ease:     'power3.inOut',
    })
    // Hold a beat — navigate while covered
    .add(() => navigate(path))
    .to({}, { duration: 0.12 })
    // Lines retract right → left
    .to(lines, {
      scaleX:          0,
      transformOrigin: 'right center',
      duration:        0.45,
      stagger:         { each: 0.06, from: 'end' },
      ease:            'power3.in',
    })
    // Overlay disappears
    .to(overlay, {
      opacity:  0,
      duration: 0.25,
      ease:     'power2.inOut',
      onComplete: () => {
        gsap.set(overlay, { pointerEvents: 'none' });
        busyRef.current = false;
      },
    }, '-=0.1');
  }, [navigate]);

  return (
    <Ctx.Provider value={{ navigateTo }}>
      {children}

      {/* ── Transition overlay ── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[8000] pointer-events-none"
        style={{ background: '#f5f2ed', opacity: 0 }}
      >
        {Array.from({ length: LINE_COUNT }, (_, i) => (
          <div
            key={i}
            ref={el => { linesRef.current[i] = el; }}
            className="absolute left-0 right-0"
            style={{
              top:             `${((i + 1) / (LINE_COUNT + 1)) * 100}%`,
              height:          '1px',
              background:      '#2d2c2a',
              transform:       'scaleX(0)',
              transformOrigin: 'left center',
            }}
          />
        ))}

        {/* Corner registration marks */}
        {[
          { top: '5%',  left: '5%',  borderTop: '1px solid', borderLeft:  '1px solid' },
          { top: '5%',  right: '5%', borderTop: '1px solid', borderRight: '1px solid' },
          { bottom: '5%', left: '5%',  borderBottom: '1px solid', borderLeft:  '1px solid' },
          { bottom: '5%', right: '5%', borderBottom: '1px solid', borderRight: '1px solid' },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute w-4 h-4"
            style={{ ...s, borderColor: 'rgba(45,44,42,0.3)' }}
          />
        ))}
      </div>
    </Ctx.Provider>
  );
}
