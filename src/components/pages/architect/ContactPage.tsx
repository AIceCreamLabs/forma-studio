'use client';

import { useRef, useState } from 'react';

const ENQUIRY_TYPES = ['New Build', 'Renovation', 'Interior Architecture', 'Masterplan', 'Feasibility Study', 'Other'];

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent,  setSent]  = useState(false);
  const [type,  setType]  = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const inputStyle: React.CSSProperties = {
    width:           '100%',
    background:      'transparent',
    border:          'none',
    borderBottom:    '1px solid rgba(26,26,26,0.2)',
    padding:         '12px 0',
    fontSize:        '16px',
    color:           '#1a1a1a',
    outline:         'none',
    fontFamily:      "'Space Grotesk', sans-serif",
    fontWeight:      300,
    lineHeight:      1.5,
  };

  const labelStyle: React.CSSProperties = {
    display:       'block',
    fontFamily:    "'Space Mono', monospace",
    fontSize:      '8px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color:         'rgba(26,26,26,0.4)',
    marginBottom:  '6px',
  };

  return (
    <div style={{ background: '#f5f2ed', color: '#1a1a1a' }}>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Left — info */}
        <div className="px-8 md:px-16 pt-36 pb-20 flex flex-col justify-between">
          <div>
            <p className="font-mono tracking-[0.2em] uppercase mb-6" style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)' }}>
              Commission
            </p>
            <h1
              className="font-bold leading-[1.05] tracking-[-0.03em] mb-10"
              style={{ fontSize: 'clamp(36px, 4.5vw, 64px)' }}
            >
              Every project begins with a conversation.
            </h1>
            <p className="leading-[1.75] max-w-sm" style={{ fontSize: 'clamp(16px, 1.3vw, 18px)', color: 'rgba(26,26,26,0.6)' }}>
              We take on a small number of projects each year to ensure each one receives the full attention of the founding team. Tell us about yours.
            </p>
          </div>

          <div className="mt-16 space-y-8">
            <div>
              <p className="font-mono tracking-[0.15em] uppercase mb-2" style={{ fontSize: '8px', color: 'rgba(26,26,26,0.35)' }}>
                Studio
              </p>
              <p style={{ fontSize: '15px', color: 'rgba(26,26,26,0.7)' }}>
                12 Bartholomew Close<br />
                London EC1A 7HN<br />
                United Kingdom
              </p>
            </div>
            <div>
              <p className="font-mono tracking-[0.15em] uppercase mb-2" style={{ fontSize: '8px', color: 'rgba(26,26,26,0.35)' }}>
                Contact
              </p>
              <p style={{ fontSize: '15px', color: 'rgba(26,26,26,0.7)' }}>
                studio@formalondon.com<br />
                +44 20 7726 4440
              </p>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="px-8 md:px-16 pt-36 pb-20" style={{ borderLeft: '1px solid rgba(26,26,26,0.08)' }}>
          {sent ? (
            <div className="flex flex-col justify-center h-full">
              <p className="font-mono tracking-[0.2em] uppercase mb-4" style={{ fontSize: '9px', color: 'rgba(26,26,26,0.4)' }}>
                Received
              </p>
              <h2
                className="font-bold leading-[1.0] tracking-[-0.02em] mb-6"
                style={{ fontSize: 'clamp(28px, 3vw, 44px)' }}
              >
                Thank you.
              </h2>
              <p style={{ fontSize: '16px', color: 'rgba(26,26,26,0.55)', lineHeight: 1.7 }}>
                We will review your enquiry and be in touch within two working days.
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
              <div>
                <label style={labelStyle}>Full name</label>
                <input type="text" required placeholder="Your name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email address</label>
                <input type="email" required placeholder="your@email.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Project location</label>
                <input type="text" placeholder="City, Country" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Enquiry type</label>
                <div className="flex flex-wrap gap-2 pt-3">
                  {ENQUIRY_TYPES.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className="transition-all duration-200"
                      style={{
                        padding:       '7px 14px',
                        border:        `1px solid ${type === t ? 'rgba(26,26,26,0.8)' : 'rgba(26,26,26,0.18)'}`,
                        background:    type === t ? '#1a1a1a' : 'transparent',
                        color:         type === t ? '#f5f2ed' : 'rgba(26,26,26,0.6)',
                        fontFamily:    "'Space Mono', monospace",
                        fontSize:      '8px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        cursor:        'pointer',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Brief description</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your project — site, programme, scale, timeline…"
                  style={{ ...inputStyle, resize: 'none', borderBottom: '1px solid rgba(26,26,26,0.2)' }}
                />
              </div>

              <button
                type="submit"
                className="group flex items-center gap-4 transition-opacity hover:opacity-60"
              >
                <span className="font-mono tracking-[0.22em] uppercase" style={{ fontSize: '9px' }}>
                  Submit enquiry
                </span>
                <span className="font-mono text-lg" style={{ color: 'rgba(26,26,26,0.4)' }}>→</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
