// Hero: full-bleed image with center "Look closer." text.
// The hero is positioned to fill the viewport on first load. On scroll the
// image parallaxes upward, the text scales slightly, and the page below
// reveals against the sticky sidebar.

const { useEffect: _ueh, useRef: _urh, useState: _ush } = React;

function Hero(){
  const imgRef = _urh(null);
  const textRef = _urh(null);
  const wrapRef = _urh(null);
  const [scrolled, setScrolled] = _ush(false);

  _ueh(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      if(imgRef.current){
        // gentle parallax + scale, capped
        const t = Math.min(y / vh, 1);
        imgRef.current.style.transform = `translate3d(0, ${-y * 0.35}px, 0) scale(${1 + t * 0.06})`;
        imgRef.current.style.filter = `brightness(${1 - t * 0.25})`;
      }
      if(textRef.current){
        const t = Math.min(y / (vh * 0.9), 1);
        textRef.current.style.transform = `translate3d(0, ${-y * 0.65}px, 0) scale(${1 - t * 0.12})`;
        textRef.current.style.letterSpacing = `${-0.02 + t * 0.04}em`;
        textRef.current.style.opacity = String(1 - t * 0.4);
      }
      setScrolled(y > 30);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={wrapRef}
      data-screen-label="00 Hero"
      style={{
        position:"relative", height:"100vh", minHeight:680,
        overflow:"hidden",
        background:"#0c0c0a",
        color:"#fff",
      }}
    >
      {/* Image */}
      <div ref={imgRef} style={{
        position:"absolute", inset:0,
        transformOrigin:"center center",
        willChange:"transform",
      }}>
        <Placeholder
          shot={{label:"Cover — Mira / Look 03", code:"N_001", aw:16, ah:9, tone:"shadow", year:2025}}
          hoverable={false}
          style={{
            position:"absolute", inset:0, width:"100%", height:"100%",
            aspectRatio:"auto",
          }}
        />
        {/* Vignette */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background:"radial-gradient(120% 80% at 50% 60%, transparent 0%, rgba(0,0,0,.55) 100%)",
        }}/>
      </div>

      {/* Top + bottom film bars */}
      <div style={{position:"absolute", top:0, left:0, right:0, height:48, background:"#000"}}/>
      <div style={{position:"absolute", bottom:0, left:0, right:0, height:48, background:"#000"}}/>

      {/* Top meta strip */}
      <div className="meta" style={{
        position:"absolute", top:18, left:36, right:36,
        display:"flex", justifyContent:"space-between", alignItems:"center",
        color:"rgba(255,255,255,.7)",
      }}>
        <span>NEROS / VISUALS — VOL. 06</span>
        <span style={{display:"flex",gap:18}}>
          <span>F 1.4</span><span>1/200s</span><span>ISO 400</span><span>35mm</span>
        </span>
        <span>EST. 2019</span>
      </div>

      {/* Bottom meta strip */}
      <div className="meta" style={{
        position:"absolute", bottom:18, left:36, right:36,
        display:"flex", justifyContent:"space-between", alignItems:"center",
        color:"rgba(255,255,255,.6)",
      }}>
        <span>↓ Scroll</span>
        <span>Cover — Mira / Look 03 · 2025</span>
        <span>01 / 06</span>
      </div>

      {/* Centered "Look closer." */}
      <div
        ref={textRef}
        style={{
          position:"absolute", inset:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          willChange:"transform",
          pointerEvents:"none",
        }}
      >
        <h1 className="display italic" style={{
          margin:0,
          fontSize:"clamp(80px, 16vw, 240px)",
          color:"#F4F1EA",
          fontWeight:500,
          letterSpacing:"-0.05em",
          lineHeight:.9,
          mixBlendMode:"difference",
          textShadow:"0 2px 30px rgba(0,0,0,.3)",
          whiteSpace:"nowrap",
        }}>
          Look closer<span style={{fontStyle:"normal"}}>.</span>
        </h1>
      </div>

      {/* Scroll hint */}
      <div className="meta" style={{
        position:"absolute", bottom:74, left:"50%", transform:"translateX(-50%)",
        color:"rgba(255,255,255,.7)",
        display:"flex", flexDirection:"column", alignItems:"center", gap:8,
        opacity: scrolled ? 0 : 1, transition:"opacity .4s ease",
      }}>
        <div style={{width:1, height:36, background:"rgba(255,255,255,.45)"}}/>
        <span>Scroll to enter</span>
      </div>
    </section>
  );
}

Object.assign(window, { Hero });
