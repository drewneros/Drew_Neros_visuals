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
    <aside
      className="sidebar-desktop"
      style={{
        position:"fixed", top:0, [side]:0, height:"100vh", width:"var(--rail-w)",
        padding:"32px 36px 28px", boxSizing:"border-box",
        display:"flex", flexDirection:"column",
        background:"var(--bg)",
        zIndex:30,
        transform: slideIn ? "translateX(0)" : (side === "left" ? "translateX(-100%)" : "translateX(100%)"),
        transition: slideIn ? "transform .85s cubic-bezier(.2,.7,.2,1)" : "none",
        willChange:"transform",
      }}
    >
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
        <button onClick={() => onNav && onNav("top")} style={{textAlign:"left"}}>
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
              onClick={() => onNav && onNav(it.id)}
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
    </aside>
  );
}

Object.assign(window, { Sidebar, useClock });
