// App root: wires everything together. Applies theme + accent + grain to
// document, owns nav state, mounts the admin overlay, mounts tweaks.

const { useEffect: _aue, useState: _aus, useCallback: _auc } = React;

function App(){
  const [tweaks, setTweak] = window.useTweaks(window.__TWEAK_DEFAULTS__);
  const [adminOpen, setAdminOpen] = _aus(false);
  const [current, setCurrent] = _aus("work");
  const [introDone, setIntroDone] = _aus(false);

  // Apply theme + accent + grain to :root
  _aue(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme);
    const accents = {
      ochre: "oklch(0.74 0.08 75)",
      red:   "oklch(0.58 0.10 28)",
      teal:  "oklch(0.55 0.05 205)",
    };
    document.documentElement.style.setProperty("--film-ochre", accents[tweaks.accent] || accents.ochre);
    document.documentElement.style.setProperty("--grain-opacity", tweaks.grain ? ".045" : "0");
  }, [tweaks.theme, tweaks.accent, tweaks.grain]);

  // Lock page scroll while the intro overlay is up; release on enter.
  _aue(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
    if (introDone) window.scrollTo(0, 0);
    return () => { document.body.style.overflow = ""; };
  }, [introDone]);

  // ⌘U / Ctrl-U opens admin
  _aue(() => {
    const onKey = (e) => {
      if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "u"){
        e.preventDefault();
        setAdminOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // intersection observer for nav highlight
  _aue(() => {
    const sections = ["work","about","services","contact"]
      .map(id => document.getElementById(id))
      .filter(Boolean);
    if(!sections.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting && e.intersectionRatio > 0.3) setCurrent(e.target.id);
      });
    }, { threshold: [0.3, 0.6] });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  // run reveal observer
  window.useReveal();

  const onNav = _auc((id) => {
    if(id === "top"){ window.scrollTo({top:0, behavior:"smooth"}); return; }
    const el = document.getElementById(id);
    if(el){
      const y = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({top: y, behavior:"smooth"});
    }
  }, []);

  const side = tweaks.menuSide === "right" ? "right" : "left";

  return (
    <>
      {/* Cinematic intro — full-screen until user scrolls/clicks */}
      {!introDone && <Intro tweaks={tweaks} onDone={() => setIntroDone(true)}/>}

      <Sidebar tweaks={tweaks} setTweak={setTweak} onNav={onNav} current={current} onOpenAdmin={() => setAdminOpen(true)} slideIn={introDone}/>

      {/* Main scroll area, offset by sidebar. The intro overlay above acts as
          the hero — once it slides up, the site begins at the work gallery. */}
      <main style={{
        marginLeft: side === "left" ? "var(--rail-w)" : 0,
        marginRight: side === "right" ? "var(--rail-w)" : 0,
      }}>
        <GallerySection tweaks={tweaks}/>
        <About/>
        <Contact/>
      </main>

      {adminOpen && <AdminFlow onClose={() => setAdminOpen(false)} />}

      <Tweaks tweaks={tweaks} setTweak={setTweak}/>

      {/* small floating "owner" button bottom-right */}
      <OwnerFab onClick={() => setAdminOpen(true)}/>
    </>
  );
}

function OwnerFab({onClick}){
  return (
    <button onClick={onClick} title="Open owner upload console (⌘U)"
      style={{
        position:"fixed", bottom:24, right:24, zIndex:40,
        height:42, padding:"0 14px", borderRadius:999,
        background:"var(--fg)", color:"var(--bg)",
        display:"inline-flex", alignItems:"center", gap:10,
        fontFamily:"var(--mono)", fontSize:11, letterSpacing:".08em", textTransform:"uppercase",
        boxShadow:"0 14px 40px -10px rgba(0,0,0,.35)",
      }}>
      <span style={{width:6,height:6, borderRadius:999, background:"var(--film-olive)"}}/>
      Owner · Upload
      <span style={{opacity:.5, marginLeft:6}}>⌘U</span>
    </button>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);

Object.assign(window, { App });
