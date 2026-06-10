// Cinematic intro / loading sequence.
//
// Timeline:
//   0.0s  black
//   0.2s  full-screen image fades in
//   0.9s  "Look closer." text rises in — perfectly centered, no sidebar
//   2.4s  sidebar slides in from the left; text smoothly shifts right
//         to stay centered in the remaining canvas
//   3.8s  "Scroll to enter" hint appears
//   user  scroll / click → overlay slides up, site is revealed
//
// The sidebar rendered inside the overlay is a read-only replica so it
// looks identical to the real one without any side-effects.

const { useState: _is, useEffect: _ie, useRef: _ir } = React;

// Minimal read-only sidebar replica used only during the intro.
function IntroSidebar({ tweaks }){
  const side = (tweaks && tweaks.menuSide) === "right" ? "right" : "left";
  const [now, setNow] = _is(() => new Date());
  _ie(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const city = (tweaks && tweaks.clockCity) || "Sydney";
  const cityMap = {
    Sydney:"Australia/Sydney", Melbourne:"Australia/Melbourne", Belgrade:"Europe/Belgrade",
    Lisbon:"Europe/Lisbon", London:"Europe/London", NYC:"America/New_York",
    LA:"America/Los_Angeles", Tokyo:"Asia/Tokyo", Dubai:"Asia/Dubai",
    Paris:"Europe/Paris", Bali:"Asia/Makassar",
  };
  const tz = cityMap[city] || "Australia/Sydney";
  const day  = now.toLocaleDateString("en-US",  { weekday:"short", timeZone:tz });
  const time = now.toLocaleTimeString("en-GB",  { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false, timeZone:tz }).toUpperCase();

  const navItems = [
    { id:"work",      label:"Work" },
    { id:"about",     label:"About" },
    { id:"services",  label:"Services" },
    { id:"contact",   label:"Contact" },
  ];

  return (
    <div style={{
      position:"absolute", top:0, [side]:0, height:"100%", width:"var(--rail-w)",
      padding:"32px 36px 28px", boxSizing:"border-box",
      display:"flex", flexDirection:"column",
      background:"var(--bg)",
      userSelect:"none", pointerEvents:"none",
    }}>
      {/* Clock */}
      <div className="meta" style={{display:"flex",justifyContent:"space-between",color:"var(--fg-soft)"}}>
        <span style={{fontVariantNumeric:"tabular-nums"}}>{day} · {time}</span>
        <span>{city}</span>
      </div>

      {/* Brand */}
      <div style={{marginTop:44}}>
        <div className="display" style={{fontSize:36, lineHeight:1, letterSpacing:"-0.045em", fontWeight:600}}>
          Drew<span style={{opacity:.35, margin:"0 1px"}}>_</span>Neros<span style={{opacity:.5}}>.</span>
        </div>
        <div className="meta" style={{marginTop:14}}>Photographer / Retoucher</div>
      </div>

      {/* Tagline */}
      <p style={{
        marginTop:36, fontFamily:"var(--sans)", fontStyle:"italic",
        fontSize:14, lineHeight:1.5, color:"var(--fg-soft)", maxWidth:"24ch",
        margin:"36px 0 0",
      }}>
        I don't just take photos.<br/>I shape how you're seen.
      </p>

      {/* Nav */}
      <nav style={{marginTop:36, display:"flex", flexDirection:"column", gap:4}}>
        {navItems.map((it, i) => (
          <div key={it.id} style={{
            display:"flex", alignItems:"center", gap:14,
            padding:"6px 0",
          }}>
            <span className="meta" style={{width:22, textAlign:"left", color:"var(--fg-faint)"}}>
              {String(i+1).padStart(2,"0")}
            </span>
            <span style={{fontFamily:"var(--sans)", fontSize:18, fontWeight:500, letterSpacing:"-0.02em"}}>
              {it.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{marginTop:"auto", display:"flex", flexDirection:"column", gap:18}}>
        <div className="meta" style={{display:"flex",alignItems:"center",gap:8,color:"var(--fg-soft)"}}>
          <span style={{width:7,height:7,borderRadius:999,background:"var(--film-olive)",display:"inline-block"}}/>
          <span>Booking — Summer '26</span>
        </div>
      </div>
    </div>
  );
}

function Intro({ tweaks, onDone }){
  // phase: "blank" → "image" → "text" → "ready" → "exit"
  const [phase, setPhase] = _is("blank");

  _ie(() => {
    const ts = [
      setTimeout(() => setPhase("image"),  150),
      setTimeout(() => setPhase("text"),   850),
      setTimeout(() => setPhase("ready"),  2200),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const doExit = _ir(null);
  _ie(() => {
    doExit.current = () => {
      setPhase(p => {
        if (p !== "ready") return p;
        setTimeout(onDone, 850);
        return "exit";
      });
    };
  });

  _ie(() => {
    if (phase !== "ready") return;
    const fn = () => doExit.current && doExit.current();
    window.addEventListener("wheel",    fn, { once: true, passive: true });
    window.addEventListener("touchmove",fn, { once: true, passive: true });
    window.addEventListener("keydown",  fn, { once: true });
    return () => {
      window.removeEventListener("wheel",    fn);
      window.removeEventListener("touchmove",fn);
      window.removeEventListener("keydown",  fn);
    };
  }, [phase]);

  const textVis = phase === "text" || phase === "ready" || phase === "exit";
  const hintVis = phase === "ready";
  const isExit  = phase === "exit";

  return (
    <div
      onClick={() => doExit.current && doExit.current()}
      style={{
        position:"fixed", inset:0, zIndex:500,
        overflow:"hidden",
        background:"#0c0c0a",
        transform: isExit ? "translateY(-100%)" : "translateY(0)",
        transition: isExit ? "transform .9s cubic-bezier(.4,0,.2,1)" : "none",
        cursor: phase === "ready" ? "n-resize" : "default",
      }}
    >
      {/* Full-screen image */}
      <div style={{
        position:"absolute", inset:0,
        opacity: phase === "blank" ? 0 : 1,
        transition:"opacity 1.3s ease",
      }}>
        <Placeholder
          shot={{ label:"Cover — Mira / Look 03", code:"N_001", aw:16, ah:9, tone:"shadow", year:2025 }}
          hoverable={false} hideMark={true} hideLabel={true}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", aspectRatio:"auto" }}
        />
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background:"radial-gradient(120% 80% at 50% 60%, transparent 0%, rgba(0,0,0,.6) 100%)",
        }}/>
      </div>

      {/* Film strip top */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:44, background:"#000",
        opacity: phase === "blank" ? 0 : 1, transition:"opacity 1.2s ease",
        display:"flex", alignItems:"center",
      }}>
        <div className="meta" style={{
          width:"100%", padding:"0 36px",
          display:"flex", justifyContent:"space-between",
          color:"rgba(255,255,255,.5)",
          opacity: textVis ? 1 : 0, transition:"opacity .8s ease",
        }}>
          <span>NEROS / VISUALS — VOL. 06</span>
          <span style={{display:"flex",gap:18}}>
            <span>F 1.4</span><span>1/200s</span><span>ISO 400</span><span>35mm</span>
          </span>
          <span>EST. 2019</span>
        </div>
      </div>

      {/* Film strip bottom */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:44, background:"#000",
        opacity: phase === "blank" ? 0 : 1, transition:"opacity 1.2s ease",
        display:"flex", alignItems:"center",
      }}>
        <div className="meta" style={{
          width:"100%", padding:"0 36px",
          display:"flex", justifyContent:"space-between",
          color:"rgba(255,255,255,.5)",
          opacity: textVis ? 1 : 0, transition:"opacity .8s ease",
        }}>
          <span>Cover — Mira / Look 03 · 2025</span>
          <span>01 / 06</span>
        </div>
      </div>

      {/* "Look closer." — stays perfectly centered throughout */}
      <div style={{
        position:"absolute", inset:0,
        display:"flex", alignItems:"center", justifyContent:"center",
        pointerEvents:"none",
      }}>
        <h1 className="display italic" style={{
          margin:0,
          fontSize:"clamp(72px, 13vw, 220px)",
          color:"#F4F1EA",
          fontWeight:500,
          letterSpacing:"-0.05em",
          lineHeight:.9,
          textShadow:"0 2px 40px rgba(0,0,0,.4)",
          whiteSpace:"nowrap",
          opacity: textVis ? 1 : 0,
          transform: textVis ? "translateY(0)" : "translateY(18px)",
          transition:"opacity .9s ease, transform .9s cubic-bezier(.2,.7,.2,1)",
          transitionDelay: textVis ? ".15s" : "0s",
        }}>
          Look closer<span style={{fontStyle:"normal"}}>.</span>
        </h1>
      </div>

      {/* Scroll hint */}
      <div style={{
        position:"absolute", bottom:60, left:"50%", transform:"translateX(-50%)",
        display:"flex", flexDirection:"column", alignItems:"center", gap:10,
        opacity: hintVis ? 1 : 0,
        transition:"opacity .7s ease",
        pointerEvents:"none",
      }}>
        <span className="meta" style={{color:"rgba(255,255,255,.55)", letterSpacing:".1em"}}>
          Scroll to enter
        </span>
        <div style={{width:1, height:32, background:"rgba(255,255,255,.35)"}}/>
      </div>
    </div>
  );
}

Object.assign(window, { Intro });
