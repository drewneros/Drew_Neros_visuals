// Sidebar / left rail with brand, live clock, italic statement, nav, contact.
// Renders persistently and is the spine of the editorial layout.

const { useEffect: _useEffect, useState: _useState, useMemo: _useMemo } = React;

const cityMap = {
  Sydney:    { tz: "Australia/Sydney",     code: "AU" },
  Melbourne: { tz: "Australia/Melbourne",  code: "AU" },
  Belgrade:  { tz: "Europe/Belgrade",      code: "RS" },
  Lisbon:    { tz: "Europe/Lisbon",        code: "PT" },
  London:    { tz: "Europe/London",        code: "UK" },
  NYC:       { tz: "America/New_York",     code: "US" },
  LA:        { tz: "America/Los_Angeles",  code: "US" },
  Tokyo:     { tz: "Asia/Tokyo",           code: "JP" },
  Dubai:     { tz: "Asia/Dubai",           code: "AE" },
  Paris:     { tz: "Europe/Paris",         code: "FR" },
  Bali:      { tz: "Asia/Makassar",        code: "ID" },
  Istanbul:  { tz: "Europe/Istanbul",      code: "TR" },
};

function useClock({ format = "24h", seconds = true, tz, city, code }){
  const [now, setNow] = _useState(() => new Date());
  _useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const day = now.toLocaleDateString("en-US", { weekday: "short", timeZone: tz });
  const timeOpts = { hour: "2-digit", minute: "2-digit", hour12: format === "12h", timeZone: tz };
  if(seconds) timeOpts.second = "2-digit";
  const time = now.toLocaleTimeString("en-GB", timeOpts).toUpperCase();

  return { day, time, code, city };
}

function Sidebar({ tweaks, setTweak, onNav, current, onOpenAdmin, slideIn = true }){
  const side = tweaks.menuSide === "right" ? "right" : "left";
  const [cityMenu, setCityMenu] = _useState(false);

  // Rail auto-minimizes once you scroll past the top region. Expands on hover,
  // on scroll-back-to-top, or when the user clicks the minimized tab to pin it.
  const [scrolled, setScrolled] = _useState(false);
  const [hover, setHover] = _useState(false);
  const [pinned, setPinned] = _useState(false); // user clicked the tab open
  const [isMobile, setIsMobile] = _useState(
    typeof window !== "undefined" && window.matchMedia("(max-width: 860px)").matches
  );
  const [mobileOpen, setMobileOpen] = _useState(false);

  const collapsed = !isMobile && scrolled && !hover && !pinned;

  _useEffect(() => {
    const THRESHOLD = 220; // px scrolled before the rail minimizes
    const onScroll = () => {
      const past = window.scrollY > THRESHOLD;
      setScrolled(past);
      if (!past) setPinned(false); // back at the top: forget the pin
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  _useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const on = () => { setIsMobile(mq.matches); if (!mq.matches) setMobileOpen(false); };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Mobile drawer: CSS (index.html, <=860px) owns the slide + width via a
  // .nav-open class on <html>. Doing it in CSS instead of inline style avoids
  // races with React re-renders and the intro's slideIn transform.
  _useEffect(() => {
    document.documentElement.classList.toggle("nav-open", mobileOpen);
    if (isMobile) document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.classList.remove("nav-open");
      document.body.style.overflow = "";
    };
  }, [isMobile, mobileOpen]);

  // Reflow <main> to reclaim the space (desktop only, via index.html rule).
  // Follows the minimized state so a hover/pin expand overlays content.
  _useEffect(() => {
    document.body.classList.toggle("rail-min", !isMobile && scrolled);
    return () => document.body.classList.remove("rail-min");
  }, [scrolled, isMobile]);

  // Auto-detect location from IP; falls back to manual clockCity tweak
  const [geo, setGeo] = _useState(null); // { city, code, tz }
  const [manualCity, setManualCity] = _useState(null); // set when user picks from menu

  _useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => {
        if (d && d.city && d.timezone) {
          setGeo({ city: d.city, code: d.country_code || "??", tz: d.timezone });
        }
      })
      .catch(() => {}); // silently fall back to manual
  }, []);

  // Resolve what to display: manual pick > geo > tweaks default
  const resolved = _useMemo(() => {
    if (manualCity) {
      const cfg = cityMap[manualCity];
      return cfg ? { city: manualCity, code: cfg.code, tz: cfg.tz } : null;
    }
    if (geo) return geo;
    const fallback = cityMap[tweaks.clockCity] || cityMap.Sydney;
    return { city: tweaks.clockCity || "Sydney", code: fallback.code, tz: fallback.tz };
  }, [manualCity, geo, tweaks.clockCity]);

  const clock = useClock({ format: tweaks.clockFormat, seconds: tweaks.clockSeconds, ...resolved });

  const items = [
    { id: "work",      label: "Work" },
    { id: "about",     label: "About" },
    { id: "services",  label: "Services" },
    { id: "contact",   label: "Contact" },
  ];

  const cities = ["Sydney","Melbourne","NYC","LA","London","Paris","Lisbon","Istanbul","Belgrade","Tokyo","Dubai","Bali"];

  return (
    <>
    {/* Mobile: hamburger toggle (CSS shows it only <=860px) */}
    <button
      className="mobile-menu-btn"
      aria-label={mobileOpen ? "Close menu" : "Open menu"}
      aria-expanded={mobileOpen}
      onClick={() => setMobileOpen(v => !v)}
      style={{
        position:"fixed", top:14, [side]:14, zIndex:50,
        width:44, height:44, borderRadius:12,
        display:"none", alignItems:"center", justifyContent:"center",
        gap:4, flexDirection:"column",
        background:"var(--bg)", border:"1px solid var(--line-strong)",
      }}
    >
      {[0,1,2].map(i => (
        <span key={i} style={{
          width:18, height:1.5, background:"var(--fg)",
          transition:"transform .25s ease, opacity .2s ease",
          transform: mobileOpen
            ? (i === 0 ? "translateY(5.5px) rotate(45deg)" : i === 2 ? "translateY(-5.5px) rotate(-45deg)" : "none")
            : "none",
          opacity: mobileOpen && i === 1 ? 0 : 1,
        }}/>
      ))}
    </button>

    {/* Mobile drawer backdrop */}
    {isMobile && (
      <div onClick={() => setMobileOpen(false)} style={{
        position:"fixed", inset:0, zIndex:39,
        background:"rgba(10,10,9,.4)",
        opacity: mobileOpen ? 1 : 0,
        pointerEvents: mobileOpen ? "auto" : "none",
        transition:"opacity .3s ease",
      }}/>
    )}

    <aside
      className="sidebar-desktop"
      onMouseEnter={() => !isMobile && setHover(true)}
      onMouseLeave={() => !isMobile && setHover(false)}
      onClick={() => { if (!isMobile && collapsed) setPinned(true); }}
      style={{
        position:"fixed", top:0, [side]:0, height:"100vh",
        width: isMobile ? "min(320px, 82vw)" : (collapsed ? "56px" : "var(--rail-w)"),
        padding: collapsed ? "32px 8px 28px" : "32px 36px 28px", boxSizing:"border-box",
        display:"flex", flexDirection:"column",
        background:"var(--bg)",
        borderRight: side === "left" ? "1px solid var(--line)" : "none",
        borderLeft: side === "right" ? "1px solid var(--line)" : "none",
        overflow:"hidden",
        cursor: (!isMobile && collapsed) ? "pointer" : "default",
        zIndex:40,
        boxShadow: (isMobile && mobileOpen) ? "0 0 60px rgba(0,0,0,.25)" : "none",
        transform: slideIn ? "translateX(0)" : (side === "left" ? "translateX(-100%)" : "translateX(100%)"),
        transition: "transform .4s cubic-bezier(.2,.7,.2,1), width .4s cubic-bezier(.2,.7,.2,1), padding .4s ease",
        willChange:"transform, width",
      }}
    >
      {/* Minimized tab — the clickable affordance when collapsed */}
      <div aria-hidden={!collapsed} style={{
        position:"absolute", inset:0, zIndex:1,
        display:"flex", flexDirection:"column", alignItems:"center",
        paddingTop:34, gap:14,
        opacity: collapsed ? 1 : 0,
        pointerEvents:"none",
        transition:"opacity .25s ease",
      }}>
        <span className="display" style={{fontSize:18, fontWeight:600, letterSpacing:"-0.045em"}}>
          D<span style={{opacity:.35}}>_</span>N
        </span>
        <span title="Open menu" style={{
          display:"flex", flexDirection:"column", alignItems:"center", gap:4,
          padding:"8px 7px", borderRadius:9,
          border:"1px solid var(--line-strong)",
        }}>
          {[0,1,2].map(i => (
            <span key={i} style={{width:16, height:1.5, background:"var(--fg)", opacity:.65}}/>
          ))}
        </span>
      </div>

      {/* Full rail content — fades out when collapsed */}
      <div style={{
        display:"flex", flexDirection:"column", flex:"1 1 auto", minHeight:0,
        opacity: collapsed ? 0 : 1,
        pointerEvents: collapsed ? "none" : "auto",
        transition:"opacity .2s ease",
      }}>
      {/* Pinned-open: small control to re-collapse (desktop, scrolled) */}
      {!isMobile && pinned && scrolled && (
        <button
          onClick={(e) => { e.stopPropagation(); setPinned(false); setHover(false); }}
          className="meta"
          style={{
            position:"absolute", top:8, [side === "left" ? "right" : "left"]:8, zIndex:2,
            width:26, height:26, borderRadius:8,
            display:"flex", alignItems:"center", justifyContent:"center",
            border:"1px solid var(--line-strong)", color:"var(--fg-soft)",
          }}
          title="Minimize menu"
        >{side === "left" ? "‹" : "›"}</button>
      )}
      {/* Clock row + clickable city */}
      <div className="meta" style={{display:"flex",gap:14,alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontVariantNumeric:"tabular-nums"}}>{clock.day} <span style={{opacity:.4,margin:"0 4px"}}>·</span> {clock.time}</span>
        <button
          onClick={() => setCityMenu(!cityMenu)}
          className="meta"
          style={{
            display:"inline-flex", alignItems:"center", gap:6,
            color:"var(--fg)", opacity:.85,
            padding:"3px 8px", borderRadius:999,
            background: cityMenu ? "color-mix(in oklch, var(--fg) 10%, transparent)" : "transparent",
            transition:"background .2s",
          }}
          title="Change city"
        >
          {clock.city} · {clock.code}
          <span style={{fontSize:9, opacity:.6}}>▾</span>
        </button>
      </div>

      {/* City menu */}
      {cityMenu && (
        <div style={{
          marginTop:10, padding:8,
          background:"color-mix(in oklch, var(--fg) 5%, transparent)",
          borderRadius:8,
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:4,
        }}>
          <button onClick={() => { setManualCity(null); setCityMenu(false); }}
            className="meta"
            style={{
              textAlign:"left", padding:"6px 8px", borderRadius:6, gridColumn:"1/-1",
              color: !manualCity ? "var(--fg)" : "var(--fg-soft)",
              background: !manualCity ? "color-mix(in oklch, var(--fg) 8%, transparent)" : "transparent",
            }}>Auto-detect {geo ? `(${geo.city})` : ""}</button>
          {cities.map(c => (
            <button key={c} onClick={() => { setManualCity(c); setCityMenu(false); }}
              className="meta"
              style={{
                textAlign:"left", padding:"6px 8px", borderRadius:6,
                color: manualCity === c ? "var(--fg)" : "var(--fg-soft)",
                background: manualCity === c ? "color-mix(in oklch, var(--fg) 8%, transparent)" : "transparent",
              }}
            >{c}</button>
          ))}
        </div>
      )}

      {/* Brand */}
      <div style={{marginTop:44}}>
        <button onClick={() => { onNav && onNav("top"); setMobileOpen(false); }} style={{textAlign:"left"}}>
          <div className="display" style={{fontSize:36, lineHeight:1, letterSpacing:"-0.045em", fontWeight:600}}>
            Drew<span style={{opacity:.35, margin:"0 1px"}}>_</span>Neros<span style={{opacity:.5}}>.</span>
          </div>
          <div className="meta" style={{marginTop:14}}>Photographer / Retoucher</div>
        </button>
      </div>

      {/* Italic statement */}
      <p style={{
        marginTop:36, fontFamily:"var(--sans)", fontStyle:"italic",
        fontSize:14, lineHeight:1.5, color:"var(--fg-soft)", maxWidth:"24ch",
        margin:"36px 0 0",
      }}>
        I don't just take photos.<br/>I shape how you're seen.
      </p>

      {/* Nav */}
      <nav style={{marginTop:36, display:"flex", flexDirection:"column", gap:4}}>
        {items.map((it, i) => {
          const active = current === it.id;
          return (
            <button key={it.id}
              onClick={() => { onNav && onNav(it.id); setMobileOpen(false); }}
              style={{
                display:"flex", alignItems:"center", gap:14,
                padding:"6px 0",
                color:"var(--fg)",
                textAlign:"left",
                opacity: active ? 1 : .85,
                transition:"opacity .2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = active ? 1 : .85}
            >
              <span className="meta" style={{width:22, textAlign:"left", color:"var(--fg-faint)"}}>
                {String(i+1).padStart(2,"0")}
              </span>
              <span style={{
                fontFamily:"var(--sans)", fontSize:18, fontWeight:500, letterSpacing:"-0.02em",
              }}>{it.label}</span>
              <span style={{
                marginLeft:"auto",
                transition:"transform .35s ease, opacity .35s ease",
                transform: active ? "translateX(0)" : "translateX(-6px)",
                opacity: active ? 1 : 0,
                fontSize:13,
              }}>—</span>
            </button>
          );
        })}
      </nav>

      <div style={{marginTop:"auto", display:"flex", flexDirection:"column", gap:18}}>
        {/* Status pill */}
        <div className="meta" style={{display:"flex",alignItems:"center",gap:8,color:"var(--fg-soft)"}}>
          <span className="dot blink" style={{width:7,height:7,borderRadius:999,background:"var(--film-olive)"}}/>
          <span>Booking — Summer '26</span>
        </div>
      </div>
      </div>
    </aside>
    </>
  );
}

Object.assign(window, { Sidebar, useClock });
