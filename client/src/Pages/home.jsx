import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SearchBus from './SearchBus';
import SearchBusByName from './SearchBusByName';
import PopularRoutes from './PopularRoutes';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ── Scroll-reveal hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Animated Counter ── */
function AnimatedCounter({ end, duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal(0.3);
  useEffect(() => {
    if (!visible || end === 0) return;
    let startTime = null;
    const animate = (now) => {
      if (!startTime) startTime = now;
      const p = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [visible, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}</span>;
}

/* ── Kolkata Cityscape SVG (mobile-optimised) ── */
function KolkataCityscape() {
  return (
    <svg
      viewBox="0 0 800 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="groundG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
        <linearGradient id="rivG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity=".6" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity=".4" />
        </linearGradient>
      </defs>

      {/* Sun */}
      <circle cx="72" cy="34" r="28" fill="#fffbeb" className="sun-pulse" />
      <circle cx="72" cy="34" r="18" fill="#fef3c7" />

      {/* Clouds */}
      <g className="cloud1">
        <ellipse cx="260" cy="28" rx="55" ry="16" fill="white" opacity=".92" />
        <ellipse cx="290" cy="18" rx="34" ry="14" fill="white" opacity=".9" />
        <ellipse cx="234" cy="22" rx="27" ry="12" fill="white" opacity=".85" />
      </g>
      <g className="cloud2">
        <ellipse cx="580" cy="22" rx="60" ry="17" fill="white" opacity=".88" />
        <ellipse cx="615" cy="12" rx="38" ry="14" fill="white" opacity=".84" />
        <ellipse cx="545" cy="16" rx="30" ry="12" fill="white" opacity=".8" />
      </g>
      <g className="cloud3">
        <ellipse cx="750" cy="30" rx="46" ry="14" fill="white" opacity=".9" />
        <ellipse cx="778" cy="20" rx="30" ry="12" fill="white" opacity=".86" />
      </g>

      {/* Buildings left */}
      <rect x="0"   y="95"  width="28" height="65" fill="#ede9fe" rx="1" />
      <rect x="30"  y="108" width="22" height="52" fill="white"   rx="1" opacity=".9" />
      <rect x="54"  y="82"  width="34" height="78" fill="#f5f3ff" rx="1" />
      <rect x="90"  y="98"  width="26" height="62" fill="white"   rx="1" opacity=".88" />
      <rect x="118" y="88"  width="36" height="72" fill="#ede9fe" rx="1" />
      <rect x="156" y="104" width="24" height="56" fill="white"   rx="1" opacity=".9" />

      {/* Buildings right */}
      <rect x="622" y="90"  width="30" height="70" fill="#ede9fe" rx="1" />
      <rect x="654" y="102" width="24" height="58" fill="white"   rx="1" opacity=".9" />
      <rect x="680" y="78"  width="36" height="82" fill="#f5f3ff" rx="1" />
      <rect x="718" y="96"  width="28" height="64" fill="white"   rx="1" opacity=".88" />
      <rect x="748" y="84"  width="32" height="76" fill="#ede9fe" rx="1" />
      <rect x="782" y="106" width="18" height="54" fill="white"   rx="1" opacity=".9" />

      {/* Howrah bridge deck */}
      <rect x="140" y="128" width="520" height="8" fill="#7c3aed" rx="2" />

      {/* Left tower */}
      <rect x="192" y="68" width="18" height="68" fill="#6d28d9" rx="1" />
      <rect x="187" y="64" width="28" height="8"  fill="#7c3aed" rx="1" />
      <rect x="193" y="56" width="16" height="10" fill="#8b5cf6" rx="1" />

      {/* Right tower */}
      <rect x="592" y="68" width="18" height="68" fill="#6d28d9" rx="1" />
      <rect x="587" y="64" width="28" height="8"  fill="#7c3aed" rx="1" />
      <rect x="593" y="56" width="16" height="10" fill="#8b5cf6" rx="1" />

      {/* Catenary */}
      <path d="M201,72 Q400,102 601,72" fill="none" stroke="#6d28d9" strokeWidth="2" opacity=".7" />

      {/* Hangers */}
      {[250, 310, 370, 430, 490, 548].map((x) => (
        <line key={x} x1={x} y1={x === 370 || x === 430 ? 97 : x === 310 || x === 490 ? 93 : 86}
          x2={x} y2="128" stroke="#8b5cf6" strokeWidth=".8" opacity=".4" />
      ))}

      {/* Bridge lamps */}
      {[220, 280, 340, 400, 460, 520, 580].map((x) => (
        <circle key={x} cx={x} cy="126" r="3" fill="white" opacity=".9" />
      ))}

      {/* Window blinks */}
      <rect x="9"   y="102" width="5" height="4" fill="#7c3aed" rx=".5" opacity=".35" className="wb wb0" />
      <rect x="9"   y="112" width="5" height="4" fill="#7c3aed" rx=".5" opacity=".28" className="wb wb1" />
      <rect x="60"  y="90"  width="5" height="4" fill="#7c3aed" rx=".5" opacity=".3"  className="wb wb2" />
      <rect x="125" y="94"  width="5" height="4" fill="#7c3aed" rx=".5" opacity=".32" className="wb wb0" />
      <rect x="688" y="86"  width="5" height="4" fill="#7c3aed" rx=".5" opacity=".3"  className="wb wb1" />
      <rect x="688" y="98"  width="5" height="4" fill="#7c3aed" rx=".5" opacity=".28" className="wb wb2" />
      <rect x="754" y="92"  width="5" height="4" fill="#7c3aed" rx=".5" opacity=".32" className="wb wb0" />

      {/* River */}
      <rect x="0" y="136" width="800" height="40" fill="url(#rivG)" opacity=".6" />
      <ellipse cx="200" cy="148" rx="60" ry="3" fill="white" opacity=".25" className="rip rip0" />
      <ellipse cx="500" cy="152" rx="70" ry="3" fill="white" opacity=".2"  className="rip rip1" />
      <ellipse cx="700" cy="148" rx="50" ry="2.5" fill="white" opacity=".22" className="rip rip2" />

      {/* Ground */}
      <rect x="0" y="174" width="800" height="26" fill="url(#groundG)" />
      <line x1="0" y1="176" x2="800" y2="176" stroke="#a78bfa" strokeWidth=".8" strokeDasharray="4 3" opacity=".5" />

      {/* Tram 1 — left to right */}
      <g className="tram1">
        <rect x="-110" y="162" width="88" height="13" fill="#7c3aed" rx="3" />
        <rect x="-108" y="164" width="84" height="10" fill="#6d28d9" rx="2" />
        <rect x="-103" y="165" width="11" height="7" fill="white" rx="1.5" opacity=".92" />
        <rect x="-88"  y="165" width="11" height="7" fill="white" rx="1.5" opacity=".88" />
        <rect x="-73"  y="165" width="11" height="7" fill="white" rx="1.5" opacity=".88" />
        <rect x="-58"  y="165" width="11" height="7" fill="white" rx="1.5" opacity=".88" />
        <circle cx="-94" cy="175" r="5" fill="#5b21b6" stroke="white" strokeWidth="1" />
        <circle cx="-38" cy="175" r="5" fill="#5b21b6" stroke="white" strokeWidth="1" />
        <line x1="-66" y1="162" x2="-66" y2="158" stroke="#c4b5fd" strokeWidth="1.5" />
        <circle cx="-22" cy="168" r="4" fill="white" opacity=".9" />
      </g>

      {/* Tram 2 — right to left */}
      <g className="tram2">
        <rect x="-90" y="164" width="72" height="11" fill="#8b5cf6" rx="3" />
        <rect x="-88" y="166" width="68" height="8"  fill="#7c3aed" rx="2" />
        <rect x="-84" y="167" width="9"  height="5"  fill="white"   rx="1" opacity=".88" />
        <rect x="-71" y="167" width="9"  height="5"  fill="white"   rx="1" opacity=".85" />
        <rect x="-58" y="167" width="9"  height="5"  fill="white"   rx="1" opacity=".85" />
        <circle cx="-76" cy="175" r="4" fill="#5b21b6" stroke="white" strokeWidth="1" />
        <circle cx="-28" cy="175" r="4" fill="#5b21b6" stroke="white" strokeWidth="1" />
        <circle cx="-1"  cy="169" r="3" fill="white" opacity=".88" />
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   MAIN HOME COMPONENT
══════════════════════════════════════════════ */
export default function Home() {
  const [heroVisible, setHeroVisible]     = useState(false);
  const [counts, setCounts]               = useState({ users: 0, buses: 0, searches: 0 });
  const [countsLoading, setCountsLoading] = useState(true);
  const [searchMode, setSearchMode]       = useState('route');
  const navigate = useNavigate();

  const [statsRef,  statsVisible]  = useReveal(0.12);
  const [routesRef, routesVisible] = useReveal(0.08);
  const [ctaRef,    ctaVisible]    = useReveal(0.12);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [u, b, s] = await Promise.all([
          axios.get(`${API_URL}/api/counts/users`),
          axios.get(`${API_URL}/api/counts/buses`),
          axios.get(`${API_URL}/api/counts/search`),
        ]);
        setCounts({
          users:   u.data.totalUsers   || 0,
          buses:   b.data.totalBuses   || 0,
          searches: s.data.totalSearches || 0,
        });
      } catch { /* silent */ }
      finally  { setCountsLoading(false); }
    })();
  }, []);

  const fadeUp = (visible, delay = 0) => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  /* ── inline styles (grouped for readability) ── */
  const S = {
    hero: {
      minHeight: '100svh',
      background: 'linear-gradient(155deg,#ffffff 0%,#f5f3ff 55%,#ede9fe 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(3.5rem,8vw,5.5rem) 1rem clamp(2rem,5vw,3.5rem)',
      position: 'relative', overflow: 'hidden',
    },
    blob1: {
      position: 'absolute', top: '-80px', right: '-80px',
      width: 'clamp(180px,35vw,320px)', height: 'clamp(180px,35vw,320px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle,#ede9fe,transparent 70%)',
      pointerEvents: 'none',
    },
    blob2: {
      position: 'absolute', bottom: '-60px', left: '-60px',
      width: 'clamp(150px,28vw,260px)', height: 'clamp(150px,28vw,260px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle,#ddd6fe,transparent 70%)',
      pointerEvents: 'none',
    },
    cityscapeWrap: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 'clamp(120px,30vw,260px)',
      opacity: 0.28, pointerEvents: 'none', zIndex: 0,
    },
    badge: {
      display: 'inline-block',
      background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
      borderRadius: '8px', padding: '4px 14px', marginBottom: '1rem',
    },
    h1: {
      fontSize: 'clamp(2.4rem,9vw,5.8rem)',
      fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.05,
      marginBottom: '.75rem',
      background: 'linear-gradient(135deg,#5b21b6 0%,#7c3aed 50%,#a78bfa 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    },
    heroP: {
      fontSize: 'clamp(.88rem,2.5vw,1.1rem)', color: '#6d28d9',
      fontWeight: 300, maxWidth: '420px', margin: '0 auto 2rem', lineHeight: 1.7,
    },
    searchCard: {
      width: '100%', maxWidth: '780px', position: 'relative', zIndex: 1,
      background: 'white', borderRadius: 'clamp(14px,3vw,20px)',
      border: '1.5px solid #ede9fe',
      padding: 'clamp(1rem,4vw,2rem) clamp(.9rem,4vw,2rem)',
      boxShadow: '0 4px 24px rgba(124,58,237,.09)',
      ...fadeUp(heroVisible, 0.2),
    },
    tabWrap: {
      display: 'inline-flex', padding: '4px', borderRadius: '999px',
      background: '#f5f3ff', border: '1px solid #e9d5ff',
      marginBottom: '1.2rem', gap: '4px', flexWrap: 'wrap',
    },
    tabActive: {
      border: 'none', borderRadius: '999px',
      padding: 'clamp(.5rem,2vw,.7rem) clamp(.8rem,2.5vw,1.2rem)',
      background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
      color: '#fff', fontWeight: 600, cursor: 'pointer',
      fontSize: 'clamp(.78rem,2vw,.88rem)',
      transition: 'all .22s ease',
      boxShadow: '0 8px 20px rgba(124,58,237,.22)',
      fontFamily: 'inherit', whiteSpace: 'nowrap',
    },
    tabInactive: {
      border: 'none', borderRadius: '999px',
      padding: 'clamp(.5rem,2vw,.7rem) clamp(.8rem,2.5vw,1.2rem)',
      background: 'transparent', color: '#6d28d9',
      fontWeight: 600, cursor: 'pointer',
      fontSize: 'clamp(.78rem,2vw,.88rem)',
      transition: 'all .22s ease',
      fontFamily: 'inherit', whiteSpace: 'nowrap',
    },
  };

  return (
    <div style={{ fontFamily: "'Outfit','Segoe UI',sans-serif", background: '#fff', overflowX: 'hidden' }}>

      {/* ═══════ HERO ═══════ */}
      <section style={S.hero}>
        <div style={S.blob1} />
        <div style={S.blob2} />

        {/* Cityscape pinned to bottom of hero */}
        <div style={S.cityscapeWrap}>
          <KolkataCityscape />
        </div>

        {/* Brand */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, ...fadeUp(heroVisible, 0) }}>
          <div style={S.badge}>
            <span style={{ color: '#fff', fontSize: '.68rem', letterSpacing: '.2em', fontWeight: 600, textTransform: 'uppercase' }}>
              Kolkata · City of Joy
            </span>
          </div>
          <h1 style={S.h1}>ZipX Bus</h1>
          <p style={S.heroP}>Find buses across Kolkata — fast, reliable, made for your journey.</p>
        </div>

        {/* Search card */}
        <div style={S.searchCard}>
          {/* Tab toggle */}
          <div style={S.tabWrap}>
            {[
              { key: 'route', label: 'Search by Route' },
              { key: 'name',  label: 'Search by Bus Name' },
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => setSearchMode(mode.key)}
                style={searchMode === mode.key ? S.tabActive : S.tabInactive}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Search panels */}
          <div style={{ minHeight: 'clamp(160px,30vw,220px)' }}>
            {searchMode === 'route' ? <SearchBus compact /> : <SearchBusByName compact />}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: '2rem', textAlign: 'center', position: 'relative', zIndex: 1, ...fadeUp(heroVisible, 0.48) }}>
          <div className="scroll-hint">
            <div className="scroll-dot" />
          </div>
          <p style={{ color: '#a78bfa', fontSize: '.65rem', marginTop: '6px', letterSpacing: '.14em' }}>
            SCROLL TO EXPLORE
          </p>
        </div>
      </section>

      {/* ═══════ WHY CHOOSE US ═══════ */}
      <section style={{
        background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
        padding: '3.5rem 1rem 2rem', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 'clamp(1.4rem,4vw,2.4rem)', fontWeight: 700, color: '#fff', marginBottom: '.4rem', letterSpacing: '-.02em' }}>
          Why Choose Us?
        </h2>
        <p style={{ color: '#ddd6fe', fontSize: 'clamp(.85rem,2vw,.98rem)', fontWeight: 300 }}>
          Trusted by thousands of Kolkata commuters every day
        </p>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section ref={statsRef} style={{ background: '#f5f3ff', padding: '2.5rem 1rem 4rem', ...fadeUp(statsVisible, 0) }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {countsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div style={{
                width: '40px', height: '40px',
                border: '3px solid #ede9fe', borderTopColor: '#7c3aed',
                borderRadius: '50%', animation: 'spin .8s linear infinite',
              }} />
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
              gap: '1rem',
            }}>
              {[
                { icon: '🚌', count: counts.buses,    label: 'Buses Available',    color: '#7c3aed', delay: 0    },
                { icon: '🔍', count: counts.searches, label: 'Searches Performed', color: '#5b21b6', delay: 0.1  },
                { icon: '👥', count: counts.users,    label: 'Contributors',        color: '#6d28d9', delay: 0.2  },
              ].map(({ icon, count, label, color, delay }) => (
                <div
                  key={label}
                  style={{
                    background: '#fff', border: '1.5px solid #ede9fe',
                    borderRadius: '16px',
                    padding: 'clamp(1rem,3vw,1.75rem) clamp(.9rem,2.5vw,1.4rem)',
                    textAlign: 'center', cursor: 'default',
                    transition: 'transform .28s, box-shadow .28s',
                    ...fadeUp(statsVisible, delay),
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(124,58,237,.13)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: 'clamp(1.6rem,4vw,2rem)', marginBottom: '.6rem' }}>{icon}</div>
                  <div style={{ fontSize: 'clamp(1.8rem,5vw,2.6rem)', fontWeight: 800, color, marginBottom: '.25rem' }}>
                    <AnimatedCounter end={count} />
                  </div>
                  <div style={{ color: '#8b5cf6', fontSize: 'clamp(.78rem,2vw,.88rem)' }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ POPULAR ROUTES ═══════ */}
      <section ref={routesRef} style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) 1rem', ...fadeUp(routesVisible, 0) }}>
        <div className="container mx-auto">
          <PopularRoutes />
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section ref={ctaRef} style={{
        background: 'linear-gradient(135deg,#6d28d9,#7c3aed,#8b5cf6)',
        padding: 'clamp(3rem,7vw,5rem) 1rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        ...fadeUp(ctaVisible, 0),
      }}>
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '180px', height: '180px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.07)', pointerEvents: 'none' }} />
        <h2 style={{ fontSize: 'clamp(1.4rem,4vw,2.4rem)', fontWeight: 700, color: '#fff', marginBottom: '.8rem', letterSpacing: '-.02em', position: 'relative', zIndex: 1 }}>
          Ready for Your Next Journey?
        </h2>
        <p style={{ color: '#ddd6fe', fontSize: 'clamp(.85rem,2vw,.98rem)', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
          Explore buses and plan your next Kolkata adventure
        </p>
        <button
          onClick={() => navigate('/allbuses')}
          style={{
            padding: 'clamp(11px,2.5vw,14px) clamp(28px,6vw,46px)',
            background: '#fff', color: '#6d28d9',
            fontWeight: 700, fontSize: 'clamp(.88rem,2vw,1rem)',
            borderRadius: '999px', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', position: 'relative', zIndex: 1,
            transition: 'transform .18s, box-shadow .18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = 'none'; }}
        >
          Explore Buses Now
        </button>
      </section>

      {/* ═══════ GLOBAL STYLES ═══════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');

        /* Only animate when the device allows it — saves battery & prevents jank on low-end phones */
        @media (prefers-reduced-motion: no-preference) {
          .sun-pulse { animation: sunP 5s ease-in-out infinite; }
          .cloud1 { animation: cd1 90s linear infinite; }
          .cloud2 { animation: cd2 110s linear infinite; }
          .cloud3 { animation: cd1 80s linear infinite; animation-delay: -25s; }
          .tram1  { animation: t1A 28s linear infinite; }
          .tram2  { animation: t2A 40s linear infinite; animation-delay: -16s; }
          .wb     { animation: wbA 5s ease-in-out infinite; }
          .rip    { animation: ripA 4s ease-in-out infinite; }
          .scroll-dot { animation: sdA 1.8s ease-in-out infinite; }
        }

        @keyframes sunP  { 0%,100%{opacity:1} 50%{opacity:.82} }
        @keyframes cd1   { from{transform:translateX(0)} to{transform:translateX(160px)} }
        @keyframes cd2   { from{transform:translateX(0)} to{transform:translateX(-120px)} }
        @keyframes t1A   { from{transform:translateX(-120px)} to{transform:translateX(110vw)} }
        @keyframes t2A   {
          from { transform: translateX(110vw)  scaleX(-1); }
          to   { transform: translateX(-120px) scaleX(-1); }
        }
        @keyframes wbA   { 0%,88%,100%{opacity:.4} 93%{opacity:.07} }
        @keyframes ripA  { 0%,100%{opacity:.3} 50%{opacity:.08} }
        @keyframes sdA   { 0%{transform:translateY(0);opacity:1} 80%{transform:translateY(16px);opacity:0} 100%{transform:translateY(0);opacity:0} }
        @keyframes spin  { to{transform:rotate(360deg)} }

        .wb0 { animation-delay: 0s; }
        .wb1 { animation-delay: 1.6s; }
        .wb2 { animation-delay: 3.2s; }
        .rip0 { animation-delay: 0s; }
        .rip1 { animation-delay: 1.4s; }
        .rip2 { animation-delay: 2.8s; }

        .scroll-hint {
          width: 24px; height: 40px;
          border: 2px solid #c4b5fd; border-radius: 12px;
          margin: 0 auto; display: flex;
          align-items: flex-start; justify-content: center; padding-top: 6px;
        }
        .scroll-dot {
          width: 4px; height: 4px;
          background: #7c3aed; border-radius: 50%;
        }

        /* Prevent double-tap zoom on buttons for iOS */
        button { touch-action: manipulation; }
      `}</style>
    </div>
  );
}