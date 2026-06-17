// About + Services + Clients marquee + FAQ.

function About() {
  return (
    <section id="about" data-screen-label="02 About" style={{ padding: "96px 56px 56px" }}>
      <div className="meta" style={{ marginBottom: 32 }}>02 — About</div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(260px, 380px) 1fr",
        gap: 64, alignItems: "start",
        marginBottom: 96
      }}>
        <PortraitSlot />

        <div>
          <h2 className="display" style={{
            margin: "0 0 28px", fontSize: "clamp(56px, 7vw, 104px)",
            letterSpacing: "-0.045em", fontWeight: 500, lineHeight: .95
          }}>
            Drew<span style={{ opacity: .3, margin: "0 0.04em" }}>_</span>Neros<span style={{ opacity: .5 }}>.</span>
          </h2>

          <p style={{ fontSize: 18, lineHeight: 1.45, margin: "0 0 16px", maxWidth: "48ch" }}>
            I'm a photographer and retoucher based in Sydney, working between Australia, Europe and Asia. I make pictures with stillness in them, the kind you keep looking at after you've already scrolled past.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-soft)", margin: "0 0 24px", maxWidth: "56ch" }}>
            Eight years on set — studios, apartments, streets figuring out the version of a person that only shows up after the third frame. I work small, fast, and honest. Clients trust me to deliver the look they imagined, and to know when to push past it.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-soft)", margin: "0 0 24px", maxWidth: "56ch" }}>
            With a background in modeling myself, I understand what agencies need before the brief is even written.
          </p>

          <div style={{ display: "flex", gap: 36, marginTop: 36, flexWrap: "wrap" }}>
            <Stat n="60+" label="Editorials" />
            <Stat n="120+" label="Campaigns" />
            <Stat n="8" label="Years working" />
          </div>
        </div>
      </div>

      <Marquee />
      <Services />
      <Faq />
    </section>
  );
}

// Replaceable portrait slot. Click to pick a file or drop one in — the
// image is stored in localStorage so it survives reload.
const PORTRAIT_STORAGE_KEY = "drew.portrait.dataurl";

function PortraitSlot({ src }) {
  const [stored, setStored] = React.useState(() => {
    if (src) return src;
    try { return localStorage.getItem(PORTRAIT_STORAGE_KEY) || null; } catch (e) { return null; }
  });
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef(null);

  const acceptFile = (file) => {
    if (!file || !file.type || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result;
      setStored(url);
      try { localStorage.setItem(PORTRAIT_STORAGE_KEY, url); } catch (err) {}
    };
    reader.readAsDataURL(file);
  };

  const onPick = () => inputRef.current && inputRef.current.click();
  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    acceptFile(file);
  };
  const onRemove = (e) => {
    e.stopPropagation();
    setStored(null);
    try { localStorage.removeItem(PORTRAIT_STORAGE_KEY); } catch (err) {}
  };

  return (
    <div
      onClick={onPick}
      onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(); } }}
      style={{
        position: "relative",
        aspectRatio: "4/5",
        cursor: "pointer",
        outline: dragOver ? "2px solid var(--fg)" : "none",
        outlineOffset: -2,
        transition: "outline .2s ease"
      }}>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files && e.target.files[0];
          acceptFile(f);
          e.target.value = "";
        }} />

      {stored ? (
        <>
          <img src={stored} alt="Drew Neros — portrait" style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block"
          }} />
          <div className="portrait-hover" style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,.55) 100%)",
            opacity: 0, transition: "opacity .2s ease",
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            padding: "0 14px 14px"
          }}>
            <span className="meta" style={{
              color: "rgba(255,255,255,.95)",
              background: "rgba(0,0,0,.55)",
              padding: "6px 12px", borderRadius: 999, backdropFilter: "blur(4px)"
            }}>Click to replace</span>
            <button
              onClick={onRemove}
              className="meta"
              style={{
                color: "rgba(255,255,255,.95)",
                background: "rgba(0,0,0,.55)",
                padding: "6px 12px", borderRadius: 999, backdropFilter: "blur(4px)"
              }}>
              Remove
            </button>
          </div>
          <style>{`[role="button"]:hover .portrait-hover{ opacity:1 }`}</style>
        </>
      ) : (
        <>
          <Placeholder
            shot={{
              label: "Portrait — click or drop", code: "YOU", aw: 4, ah: 5,
              tone: "warm", year: ""
            }}
            hoverable={false} />

          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 8, pointerEvents: "none"
          }}>
            <div className="meta" style={{
              background: dragOver ? "var(--fg)" : "rgba(0,0,0,.6)",
              color: dragOver ? "var(--bg)" : "rgba(255,255,255,.95)",
              padding: "8px 14px", borderRadius: 999, backdropFilter: "blur(4px)",
              transition: "all .2s ease"
            }}>
              {dragOver ? "Drop to set" : "Click or drop your portrait"}
            </div>
            <div className="meta" style={{
              color: "rgba(255,255,255,.7)", background: "rgba(0,0,0,.4)",
              padding: "4px 10px", borderRadius: 999, fontSize: 9
            }}>
              JPG / PNG · stored locally
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="display" style={{ fontSize: 44, letterSpacing: "-0.04em", fontWeight: 500 }}>{n}</div>
      <div className="meta" style={{ marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Marquee() {
  const items = window.CLIENTS;
  const list = [...items, ...items];
  return (
    <div style={{
      marginInline: -56,
      paddingBlock: 24,
      overflow: "hidden"
    }}>
      <div className="meta" style={{ paddingInline: 56, marginBottom: 14, color: "var(--fg-faint)" }}>
        Selected clients & press
      </div>
      <div style={{
        display: "flex", gap: 48, whiteSpace: "nowrap",
        animation: "marq 50s linear infinite",
        width: "max-content"
      }}>
        {list.map((c, i) => (
          <span key={i} className="display" style={{
            fontSize: 40, letterSpacing: "-0.035em", color: "var(--fg)", fontWeight: 500,
            fontStyle: i % 4 === 0 ? "italic" : "normal",
            opacity: .88
          }}>{c}<span style={{ margin: "0 24px", color: "var(--fg-faint)" }}>·</span></span>
        ))}
      </div>
      <style>{`@keyframes marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

function Services() {
  return (
    <div id="services" data-screen-label="03 Services" style={{ marginTop: 88 }}>
      <div className="meta" style={{ marginBottom: 24 }}>03 — Services</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
        {window.SERVICES.map((s, i) => (
          <ServiceRow key={s.id} idx={i + 1} {...s} />
        ))}
      </div>
    </div>
  );
}

function ServiceRow({ idx, name, line }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "grid", gridTemplateColumns: "48px 1fr 1fr",
        alignItems: "center", padding: "20px 0",
        transition: "padding .25s ease, background .25s ease",
        paddingLeft: hover ? 12 : 0, paddingRight: hover ? 12 : 0,
        background: hover ? "color-mix(in oklch, var(--fg) 3%, transparent)" : "transparent",
        borderRadius: 6
      }}>
      <span className="meta" style={{ color: "var(--fg-faint)" }}>{String(idx).padStart(2, "0")}</span>
      <span className="display" style={{
        fontSize: 42, letterSpacing: "-0.035em", fontWeight: 500,
        fontStyle: hover ? "italic" : "normal", transition: "font-style .2s"
      }}>{name}</span>
      <span style={{ fontSize: 13, color: "var(--fg-soft)" }}>{line}</span>
    </div>
  );
}

function Faq() {
  return (
    <div style={{ marginTop: 96, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
      <div>
        <div className="meta" style={{ marginBottom: 20 }}>04 — Common questions</div>
        <h3 className="display" style={{ margin: 0, fontSize: 48, letterSpacing: "-0.04em", fontWeight: 500 }}>
          The boring<br /><span className="italic" style={{ opacity: .7 }}>but useful</span> bits.
        </h3>
      </div>
      <div>
        {window.FAQ.map((f, i) => (
          <FaqItem key={i} {...f} />
        ))}
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--line)" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 0", textAlign: "left"
      }}>
        <span style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 500, letterSpacing: "-0.01em" }}>{q}</span>
        <span style={{
          fontSize: 18, transition: "transform .35s ease",
          transform: open ? "rotate(45deg)" : "rotate(0)",
          color: "var(--fg-soft)"
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? 200 : 0, overflow: "hidden",
        transition: "max-height .5s cubic-bezier(.4,0,.2,1)"
      }}>
        <p style={{ margin: "0 0 18px", color: "var(--fg-soft)", lineHeight: 1.6, maxWidth: "60ch", fontSize: 14 }}>{a}</p>
      </div>
    </div>
  );
}

Object.assign(window, { About, PortraitSlot });
