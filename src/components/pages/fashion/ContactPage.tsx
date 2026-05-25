import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const TYPES = ['General', 'Press / Media', 'Wholesale', 'Stockists', 'Repairs', 'Other'];

export default function ContactPage() {
  const navigate    = useNavigate();
  const heroRef     = useRef<HTMLDivElement>(null);
  const [type, setType]         = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(heroRef.current.querySelectorAll('.h'),
      { clipPath: 'inset(0 0 100% 0)', y: 18 },
      { clipPath: 'inset(0 0 0% 0)', y: 0, stagger: 0.1, duration: 1.0, ease: 'expo.out', delay: 0.1 }
    );
  }, []);

  const iStyle = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontFamily: 'inherit', fontSize: '14px',
    fontWeight: 300, padding: '12px 0', outline: 'none',
  };
  const lStyle: React.CSSProperties = {
    fontFamily: 'monospace', fontSize: '7px', letterSpacing: '0.28em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
    display: 'block', marginBottom: '5px',
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-8 z-50 font-mono text-[9px] tracking-[0.28em] uppercase text-white/30 hover:text-white transition-colors duration-200"
      >
        ← Home
      </button>

      {/* Header */}
      <div ref={heroRef} className="pt-28 pb-14 px-8 md:px-16 border-b border-white/[0.06]">
        <p className="h font-mono text-[8px] tracking-[0.3em] uppercase text-white/30 mb-4" style={{ clipPath: 'inset(0 0 100% 0)' }}>
          Get in touch
        </p>
        <h1
          className="h font-black uppercase leading-[0.86] tracking-[-0.07em] mb-6"
          style={{ fontSize: 'clamp(48px, 10vw, 130px)', clipPath: 'inset(0 0 100% 0)' }}
        >
          Contact
        </h1>
        <p className="h text-white/35 font-light max-w-md leading-relaxed" style={{ fontSize: 'clamp(12px, 1.1vw, 14px)', clipPath: 'inset(0 0 100% 0)' }}>
          For press, wholesale, or a conversation about cloth — we are here. Response within two business days.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 px-8 md:px-16 py-20 gap-16 md:gap-24">

        {/* Form */}
        {submitted ? (
          <div className="pt-4">
            <h2 className="font-black uppercase leading-[0.88] tracking-[-0.06em] mb-6" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
              Received.
            </h2>
            <p className="text-white/35 font-light leading-relaxed text-sm">We will be in touch shortly.</p>
          </div>
        ) : (
          <form
            onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
            className="flex flex-col gap-8"
          >
            {/* Enquiry type */}
            <div>
              <label style={lStyle}>Enquiry type</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {TYPES.map(t => (
                  <button
                    key={t} type="button" onClick={() => setType(t)}
                    className="px-3 py-2 font-mono text-[7px] tracking-[0.2em] uppercase transition-all duration-200"
                    style={{
                      border:  `1px solid ${type === t ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)'}`,
                      color:    type === t ? '#fff' : 'rgba(255,255,255,0.3)',
                      background: type === t ? 'rgba(255,255,255,0.05)' : 'transparent',
                    }}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label style={lStyle}>First name</label>
                <input type="text" required style={iStyle} placeholder="—" />
              </div>
              <div>
                <label style={lStyle}>Last name</label>
                <input type="text" required style={iStyle} placeholder="—" />
              </div>
            </div>

            <div>
              <label style={lStyle}>Email</label>
              <input type="email" required style={iStyle} placeholder="—" />
            </div>

            <div>
              <label style={lStyle}>Message</label>
              <textarea required rows={5} style={{ ...iStyle, border: '1px solid rgba(255,255,255,0.1)', padding: '12px', resize: 'none' }} placeholder="—" />
            </div>

            <button
              type="submit"
              className="self-start px-10 h-13 bg-white text-black font-mono text-[9px] tracking-[0.3em] uppercase hover:bg-white/90 transition-colors duration-200"
              style={{ height: '52px' }}
            >
              Send
            </button>
          </form>
        )}

        {/* Info */}
        <div className="flex flex-col gap-12">
          {[
            { label: 'Studio', lines: ['Noir House Ltd.', '14 Beak Street', 'London W1F 9RG'] },
            { label: 'Press',  lines: ['press@noirhouse.com'] },
            { label: 'Trade',  lines: ['trade@noirhouse.com'] },
            { label: 'Hours',  lines: ['Monday — Friday', '10:00 — 18:00 GMT'] },
          ].map(s => (
            <div key={s.label}>
              <p className="font-mono text-[7px] tracking-[0.28em] uppercase text-white/20 mb-3">{s.label}</p>
              {s.lines.map(l => (
                <p key={l} className="text-white/40 font-light text-sm leading-relaxed">{l}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
