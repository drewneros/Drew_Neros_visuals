// About + Services + Clients marquee + FAQ.

function About() {
  return (
    <section id="about" data-screen-label="02 About" className="section">
      <div className="about-grid">
        <PortraitSlot />

        <div>
          {/* The name is the heading. It replaced an "02 — About" label sitting
              above a heading that already said the same thing. */}
          <h2 className="display t-title about-name">
            Drew<span style={{ opacity: .3, margin: "0 0.04em" }}>_</span>Neros<span style={{ opacity: .5 }}>.</span>
          </h2>

          <p className="t-sub about-lead">
            I photograph people in cities I don't live in.
          </p>
          <p className="t-body measure about-body">
            Based in Sydney, working between Australia, Europe and Asia. Eight years on set, in studios, apartments and streets, looking for the version of a person that only shows up after the third frame. I work small, fast and honest.
          </p>
          <p className="t-body measure about-body">
            I modelled before I shot, so I know what an agency needs before the brief is written.
          </p>

          <div className="about-stats">
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

function PortraitSlot({ src }) {
  const stored = src || (() => { try { return localStorage.getItem("drew.portrait.dataurl"); } catch { return null; } })();
  if (stored) {
    return (
      <div style={{ position: "relative", aspectRatio: "4/5" }}>
        <img src={stored} alt="Drew Neros — portrait" style={{
          width: "100%", height: "100%", objectFit: "cover", display: "block"
        }} />
      </div>
    );
  }
  return (
    <Placeholder
      shot={{ label: "Drew Neros", code: "DN", aw: 4, ah: 5, tone: "warm", year: "" }}
      hoverable={false} />
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="display" style={{ fontSize: "var(--t-sub)", letterSpacing: "-0.04em", fontWeight: 500 }}>{n}</div>
      <div className="meta" style={{ marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Marquee() {
  const items = window.CLIENTS;
  const list = [...items, ...items];
  return (
    <div className="marquee-wrap" style={{
      marginInline: "calc(-1 * var(--pad))",
      paddingBlock: "var(--s-4)",
      overflow: "hidden"
    }}>
      <div className="meta" style={{ paddingInline: "var(--pad)", marginBottom: 14, color: "var(--fg-faint)" }}>
        Selected clients & press
      </div>
      <div style={{
        display: "flex", gap: 48, whiteSpace: "nowrap",
        animation: "marq 50s linear infinite",
        width: "max-content"
      }}>
        {list.map((c, i) => (
          <span key={i} className="display" style={{
            fontSize: "var(--t-sub)", letterSpacing: "-0.035em", color: "var(--fg)", fontWeight: 500,
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
    <div id="services" data-screen-label="03 Services" className="services-block">
      <h3 className="display t-title services-head">What I shoot.</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
        {window.SERVICES.map((s, i) => (
          <ServiceRow key={s.id} idx={i + 1} {...s} />
        ))}
      </div>
    </div>
  );
}

// The row used to animate its own padding on hover, which reflows the list.
// The indent is a transform now, so the row slides instead of shoving.
function ServiceRow({ idx, name, line }) {
  return (
    <div className="service-row">
      <span className="display t-sub service-name">{name}</span>
      <span className="service-row-desc t-body">{line}</span>
    </div>
  );
}

function Faq() {
  return (
    <div className="faq-grid">
      <div>
        <h3 className="display t-title" style={{ margin: 0 }}>
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
        <span style={{ fontFamily: "var(--sans)", fontSize: "var(--t-lead)", fontWeight: 500, letterSpacing: "-0.01em" }}>{q}</span>
        <span style={{
          fontSize: "var(--t-lead)", transition: "transform .35s ease",
          transform: open ? "rotate(45deg)" : "rotate(0)",
          color: "var(--fg-soft)"
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? 200 : 0, overflow: "hidden",
        transition: "max-height .5s cubic-bezier(.4,0,.2,1)"
      }}>
        <p style={{ margin: "0 0 18px", color: "var(--fg-soft)", lineHeight: 1.6, maxWidth: "var(--measure)", fontSize: "var(--t-body)" }}>{a}</p>
      </div>
    </div>
  );
}

Object.assign(window, { About, PortraitSlot });
