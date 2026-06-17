// Contact + footer section.

function Contact(){
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [project, setProject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const valid = name.trim() && email.includes("@") && message.trim().length > 5;

  const submit = (e) => {
    e.preventDefault();
    if(!valid) return;
    setSent(true);
    setTimeout(() => { setSent(false); setName(""); setEmail(""); setProject(""); setMessage(""); }, 4200);
  };

  return (
    <section id="contact" data-screen-label="05 Contact" style={{
      padding:"72px 56px 40px",
    }}>
      <div className="meta" style={{marginBottom:24}}>05 — Get in touch</div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"start"}} className="grid-2col">
        <div>
          <h2 className="display" style={{
            margin:"0 0 28px", fontSize:"clamp(36px, 4vw, 58px)",
            letterSpacing:"-0.04em", lineHeight:1, fontWeight:600,
          }}>
            Let's make something<br/><span className="italic" style={{opacity:.7, fontWeight:400}}>worth looking at.</span>
          </h2>

          <div style={{display:"flex", flexDirection:"column", gap:0}}>
            <ContactLine label="EMAIL" value="drew@nerosvisuals.com" href="mailto:drew@nerosvisuals.com"/>
            <ContactLine label="INSTAGRAM" value="@drewnerosph" href="https://www.instagram.com/drewnerosph/"/>
            <ContactLine label="BEHANCE" value="DrewNeros" href="https://www.behance.net/DrewNeros"/>
            <ContactLine label="REPRESENTATION" value="Open — direct only"/>
          </div>
        </div>

        <form onSubmit={submit} style={{display:"flex", flexDirection:"column", gap:18}}>
          <Field label="Your name" value={name} onChange={setName}/>
          <Field label="Email" value={email} onChange={setEmail} type="email"/>
          <Field label="Project type" value={project} onChange={setProject} placeholder="Editorial · Campaign · Portrait · Agency / Model Development · Other"/>
          <Field label="Tell me about the project" value={message} onChange={setMessage} textarea/>

          <div style={{display:"flex", gap:12, alignItems:"center", flexWrap:"wrap", marginTop:8}}>
            <button type="submit" disabled={!valid || sent} style={{
              alignSelf:"flex-start",
              display:"inline-flex", alignItems:"center", gap:12,
              height:48, padding:"0 24px", borderRadius:999,
              background: sent ? "var(--film-olive)" : (valid ? "var(--fg)" : "color-mix(in oklch, var(--fg) 8%, transparent)"),
              color: sent || valid ? "var(--bg)" : "var(--fg-soft)",
              fontFamily:"var(--sans)", fontSize:14, letterSpacing:".01em", fontWeight:500,
              transition:"all .3s ease",
              cursor: valid && !sent ? "pointer" : "default",
            }}>
              {sent ? <>Message sent ✓</> : <>Send message</>}
            </button>
            <a href="https://tally.so/r/BzD4YK" target="_blank" rel="noopener noreferrer"
              className="meta" style={{color:"var(--fg-soft)", display:"inline-flex", alignItems:"center", gap:6}}>
              Or use booking form
            </a>
          </div>
        </form>
      </div>

      <Footer/>
    </section>
  );
}

function ContactLine({label, value, href}){
  const Inner = (
    <div style={{
      display:"grid", gridTemplateColumns:"120px 1fr",
      padding:"10px 0",
      alignItems:"center", gap:16,
    }}>
      <span className="meta" style={{color:"var(--fg-faint)"}}>{label}</span>
      <span style={{fontFamily:"var(--sans)", fontSize:15, fontWeight:500, letterSpacing:"-0.01em"}}>{value}</span>
    </div>
  );
  if(href) return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{Inner}</a>;
  return <div>{Inner}</div>;
}

function Field({label, value, onChange, textarea, type="text", placeholder}){
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{
      display:"flex", flexDirection:"column", gap:8,
      padding:"14px 16px",
      background:"color-mix(in oklch, var(--fg) 3%, transparent)",
      borderRadius:8,
      cursor:"text",
      transition:"background .25s",
      ...(focus ? {background:"color-mix(in oklch, var(--fg) 6%, transparent)"} : {}),
    }}>
      <span className="meta" style={{color: focus ? "var(--fg)" : "var(--fg-soft)", transition:"color .2s"}}>
        {label}{focus && <span className="blink" style={{marginLeft:4}}>_</span>}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          placeholder={placeholder || "…"}
          rows={4}
          style={{
            border:0, outline:0, background:"transparent", color:"var(--fg)",
            fontFamily:"var(--sans)", fontSize:16, resize:"vertical", padding:0,
          }}
        />
      ) : (
        <input
          type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          placeholder={placeholder || "…"}
          style={{
            border:0, outline:0, background:"transparent", color:"var(--fg)",
            fontFamily:"var(--sans)", fontSize:18, padding:0,
          }}
        />
      )}
    </label>
  );
}

function Footer(){
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if(el){ const y = el.getBoundingClientRect().top + window.scrollY - 24; window.scrollTo({top:y, behavior:"smooth"}); }
  };

  const nav = [
    { label:"Work",     id:"work" },
    { label:"About",    id:"about" },
    { label:"Services", id:"services" },
    { label:"Contact",  id:"contact" },
  ];

  const elsewhere = [
    { label:"Instagram", href:"https://www.instagram.com/drewnerosph/" },
    { label:"Behance",   href:"https://www.behance.net/DrewNeros" },
    { label:"Email",     href:"mailto:drew@nerosvisuals.com" },
  ];

  return (
    <div style={{
      marginTop:96, paddingTop:24,
      display:"grid", gridTemplateColumns:"1.2fr 1fr 1fr 1fr", gap:32,
      color:"var(--fg-soft)",
    }} className="footer-grid">
      <div className="display" style={{fontSize:22, color:"var(--fg)", letterSpacing:"-0.03em", fontWeight:600}}>
        Drew<span style={{opacity:.3}}>_</span>Neros<span style={{opacity:.5}}>.</span>
        <div className="meta" style={{color:"var(--fg-faint)", marginTop:6}}>Photographer / Retoucher</div>
      </div>

      <div>
        <div className="meta" style={{color:"var(--fg-faint)", marginBottom:10}}>Navigate</div>
        {nav.map(l => (
          <button key={l.label} onClick={() => scrollTo(l.id)}
            style={{
              display:"block", padding:"3px 0", fontSize:13,
              color:"var(--fg-soft)", textAlign:"left",
              transition:"color .2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--fg)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--fg-soft)"}
          >{l.label}</button>
        ))}
      </div>

      <div>
        <div className="meta" style={{color:"var(--fg-faint)", marginBottom:10}}>Elsewhere</div>
        {elsewhere.map(l => (
          <a key={l.label} href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            style={{
              display:"block", padding:"3px 0", fontSize:13,
              color:"var(--fg-soft)", transition:"color .2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--fg)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--fg-soft)"}
          >{l.label}</a>
        ))}
      </div>

      <div>
        <div className="meta" style={{color:"var(--fg-faint)", marginBottom:10}}>Colophon</div>
        <div style={{fontSize:13, lineHeight:1.55}}>
          Built by Drew Neros · 2026.<br/>
          © All images reserved.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Contact });
