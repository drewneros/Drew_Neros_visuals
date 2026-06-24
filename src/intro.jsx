// Cinematic intro / loading sequence.
//
// Timeline:
//   0.0s  black
//   0.2s  full-screen image fades in
//   0.9s  "Look closer." text rises in — perfectly centered, no sidebar
//   2.4s  "Scroll to enter" hint appears
//   user  scroll / click → overlay slides up, site is revealed

const { useState: _is, useEffect: _ie, useRef: _ir } = React;

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
        <img src="images/hero_bw.jpg" alt=""
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center center" }}/>
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
