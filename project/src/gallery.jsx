// Gallery: category sections with masonry layout. Header shows count + accent.
// Clicking an image opens a fullscreen lightbox with the AI-generated alt text.

const { useState: _gus, useEffect: _gue, useMemo: _gum } = React;

function GallerySection({ tweaks }){
  return (
    <section id="work" data-screen-label="01 Work" style={{padding:"72px 56px 80px"}}>
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"baseline",
        marginBottom:40,
      }}>
        <div>
          <div className="meta" style={{marginBottom:12}}>01 — Selected work</div>
          <h2 className="display" style={{
            margin:0, fontSize:"clamp(56px, 8vw, 120px)", letterSpacing:"-0.04em", fontWeight:500,
          }}>
            Work.
          </h2>
        </div>
        <div className="meta" style={{textAlign:"right", color:"var(--fg-soft)"}}>
          {window.ALL_SHOTS.length} works · {window.CATEGORIES.length} categories
        </div>
      </div>

      <CategoryGalleries tweaks={tweaks} />
    </section>
  );
}

function CategoryGalleries({ tweaks }){
  const [openShot, setOpenShot] = _gus(null);
  return (
    <div style={{display:"flex", flexDirection:"column", gap:72}}>
      {window.CATEGORIES.map((cat, idx) => (
        <CategoryBlock key={cat.id} cat={cat} idx={idx} density={tweaks.galleryDensity} onOpen={setOpenShot}/>
      ))}
      {openShot && <Lightbox shot={openShot} onClose={() => setOpenShot(null)}/>}
    </div>
  );
}

function CategoryBlock({ cat, idx, density, onOpen }){
  const shots = window.ALL_SHOTS.filter(s => s.cat === cat.id);
  // density: compact / balanced / loose
  const cols = density === "compact" ? 4 : density === "loose" ? 2 : 3;
  return (
    <div>
      <div style={{
        display:"grid", gridTemplateColumns:"auto 1fr auto",
        alignItems:"end", gap:24, marginBottom:20,
      }}>
        <div className="meta" style={{color:"var(--fg-faint)"}}>
          {String(idx+1).padStart(2,"0")} / {String(window.CATEGORIES.length).padStart(2,"0")}
        </div>
        <h3 className="display" style={{
          margin:0, fontSize:"clamp(36px, 4.5vw, 64px)", letterSpacing:"-0.035em", fontWeight:500,
        }}>
          {cat.name}
        </h3>
        <div style={{display:"flex", alignItems:"center", gap:14}}>
          <span className="chip">
            <span className="dot" style={{background:cat.accent}}/>
            {shots.length} frames
          </span>
        </div>
      </div>

      <p style={{
        fontSize:14, color:"var(--fg-soft)",
        maxWidth:"54ch", margin:"0 0 24px",
      }}>{cat.blurb}</p>

      <Masonry cols={cols} gap={12}>
        {shots.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onOpen(s)}
            style={{display:"block", border:0, padding:0, background:"transparent", textAlign:"left"}}
          >
            <Placeholder shot={s} accent={i === 0 ? cat.accent : null} hideLabel={true}/>
            <div style={{display:"flex", justifyContent:"space-between", marginTop:6}}>
              <span className="meta" style={{color:"var(--fg-soft)"}}>{s.label}</span>
              <span className="meta" style={{color:"var(--fg-faint)"}}>{s.code}</span>
            </div>
          </button>
        ))}
      </Masonry>
    </div>
  );
}

function Masonry({cols=3, gap=16, children}){
  // Distribute children across N columns by index for a simple masonry effect.
  const arr = React.Children.toArray(children);
  const columns = Array.from({length: cols}, () => []);
  arr.forEach((child, i) => columns[i % cols].push(child));
  return (
    <div style={{display:"grid", gridTemplateColumns:`repeat(${cols}, 1fr)`, gap}}>
      {columns.map((col, i) => (
        <div key={i} style={{display:"flex", flexDirection:"column", gap}}>{col}</div>
      ))}
    </div>
  );
}

function Lightbox({shot, onClose}){
  // Pretend AI-generated alt text — short, descriptive, SEO friendly
  const altText = React.useMemo(() => generateAlt(shot), [shot.id]);
  React.useEffect(() => {
    const onKey = (e) => { if(e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow=""; };
  }, []);
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:200,
      background:"rgba(8,8,7,.94)", color:"#F4F1EA",
      display:"grid", gridTemplateColumns:"1fr 340px", gap:0,
      animation:"fadeIn .35s ease",
    }}>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>

      {/* image side */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"center", padding:48,
      }}>
        <div style={{maxHeight:"86vh", maxWidth:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
          <Placeholder shot={shot} hoverable={false} style={{
            aspectRatio:`${shot.aw}/${shot.ah}`,
            height:"100%", maxHeight:"86vh", maxWidth:"100%",
          }}/>
        </div>
      </div>

      {/* meta side */}
      <div style={{
        padding:"40px 36px", borderLeft:"1px solid rgba(255,255,255,.12)",
        display:"flex", flexDirection:"column", gap:24,
      }}>
        <button onClick={onClose} className="meta" style={{
          alignSelf:"flex-end", color:"rgba(255,255,255,.7)",
          display:"flex", alignItems:"center", gap:8,
        }}>Close <span style={{fontSize:14}}>✕</span></button>

        <div className="meta" style={{color:"rgba(255,255,255,.5)"}}>{shot.code} · {shot.year}</div>
        <h4 className="display" style={{margin:0, fontSize:36, letterSpacing:"-0.02em"}}>{shot.label}</h4>

        <div>
          <div className="meta" style={{color:"rgba(255,255,255,.5)", marginBottom:10}}>AI-generated alt text</div>
          <p style={{fontSize:14, lineHeight:1.6, color:"rgba(244,241,234,.92)", margin:0}}>
            {altText}
          </p>
          <button className="meta" style={{
            marginTop:14, color:"rgba(255,255,255,.6)",
            textDecoration:"underline", textUnderlineOffset:3,
          }}>Edit alt text →</button>
        </div>

        <div style={{
          marginTop:"auto", borderTop:"1px solid rgba(255,255,255,.12)", paddingTop:20,
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:14,
        }}>
          <Tag label="ISO"   value="400"/>
          <Tag label="Shutter" value="1/200s"/>
          <Tag label="Aperture" value="f/2.0"/>
          <Tag label="Lens"  value="35mm"/>
        </div>
      </div>
    </div>
  );
}

function Tag({label,value}){
  return (
    <div>
      <div className="meta" style={{color:"rgba(255,255,255,.45)"}}>{label}</div>
      <div style={{fontFamily:"var(--mono)", fontSize:14, marginTop:4}}>{value}</div>
    </div>
  );
}

// ---------- Image analysis for alt text ----------
// We sample pixels from the actual uploaded image (or the procedural preview)
// and return concrete visual facts the LLM can describe accurately: dominant
// colors, monochrome vs colorful, where the subject sits in the frame.

function _rgbToName(r,g,b){
  // Map an RGB triple to a small set of plain color names.
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  const l = (max + min) / 2 / 255;
  const s = max === min ? 0 : (max - min) / (255 - Math.abs(2*max - 255));
  if (s < 0.10 || max - min < 22){
    if (l > 0.88) return "white";
    if (l > 0.65) return "light grey";
    if (l > 0.38) return "grey";
    if (l > 0.18) return "dark grey";
    return "black";
  }
  // hue
  let h;
  const d = max - min;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = h * 60; if (h < 0) h += 360;
  const isDark = l < 0.30;
  const isPale = l > 0.78 && s < 0.5;
  const prefix = isDark ? "dark " : isPale ? "pale " : "";
  if (h < 12)  return prefix + "red";
  if (h < 22)  return prefix + "warm red";
  if (h < 38)  return prefix + (l < 0.45 ? "brown" : "orange");
  if (h < 52)  return prefix + (l < 0.5 ? "ochre" : "yellow");
  if (h < 70)  return prefix + "yellow";
  if (h < 95)  return prefix + (l < 0.4 ? "olive" : "yellow-green");
  if (h < 160) return prefix + "green";
  if (h < 195) return prefix + "teal";
  if (h < 230) return prefix + (l < 0.4 ? "navy" : "blue");
  if (h < 265) return prefix + "blue";
  if (h < 290) return prefix + "purple";
  if (h < 330) return prefix + "magenta";
  return prefix + "red";
}

function _loadImg(src){
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

async function analyzeImage(src){
  if (!src) return null;
  let img;
  try { img = await _loadImg(src); }
  catch(e){ return null; }
  const W = 64, H = Math.max(8, Math.round(64 * (img.naturalHeight || 64) / (img.naturalWidth || 64)));
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  try { ctx.drawImage(img, 0, 0, W, H); }
  catch(e){ return null; }

  let data;
  try { data = ctx.getImageData(0, 0, W, H).data; }
  catch(e){ return null; }  // tainted (cross-origin) — give up

  // Quantize pixels into a small palette via 4-bit-per-channel bucketing.
  const buckets = new Map();
  let totalBright = 0, totalSat = 0, n = 0;
  for (let i = 0; i < data.length; i += 4){
    const r = data[i], g = data[i+1], b = data[i+2];
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    totalBright += (r+g+b)/3;
    totalSat += max === 0 ? 0 : (max - min) / max;
    n++;
    const key = (r>>4) + "_" + (g>>4) + "_" + (b>>4);
    const cur = buckets.get(key) || { r:0,g:0,b:0,c:0 };
    cur.r += r; cur.g += g; cur.b += b; cur.c += 1;
    buckets.set(key, cur);
  }
  const palette = [...buckets.values()]
    .sort((a,b) => b.c - a.c)
    .slice(0, 5)
    .map(p => ({
      r: Math.round(p.r/p.c), g: Math.round(p.g/p.c), b: Math.round(p.b/p.c),
      pct: p.c / n,
      name: _rgbToName(Math.round(p.r/p.c), Math.round(p.g/p.c), Math.round(p.b/p.c)),
    }));

  // De-dup color names while preserving order/weights.
  const seen = new Set();
  const namedColors = [];
  for (const p of palette){
    if (seen.has(p.name)) continue;
    seen.add(p.name);
    namedColors.push({ name: p.name, pct: p.pct });
    if (namedColors.length >= 3) break;
  }

  const avgBright = totalBright / n / 255; // 0..1
  const avgSat = totalSat / n;             // 0..1
  const monochrome = avgSat < 0.10;

  // Subject placement — where are the darkest (subject) pixels concentrated?
  let darkX = 0, darkY = 0, darkN = 0;
  for (let y = 0; y < H; y++){
    for (let x = 0; x < W; x++){
      const i = (y * W + x) * 4;
      const l = (data[i] + data[i+1] + data[i+2]) / 3;
      if (l < avgBright * 255 * 0.7){
        darkX += x; darkY += y; darkN++;
      }
    }
  }
  let framing = "centered";
  if (darkN > 0){
    const cx = (darkX / darkN) / W;     // 0..1
    const cy = (darkY / darkN) / H;
    const h = cx < 0.38 ? "left" : cx > 0.62 ? "right" : "center";
    const v = cy < 0.40 ? "upper" : cy > 0.66 ? "lower" : "middle";
    framing = `${v} ${h}`;
  }

  return {
    aspect: `${img.naturalWidth || W}:${img.naturalHeight || H}`,
    colors: namedColors,                  // [{name, pct}]
    monochrome,
    brightness: avgBright < 0.30 ? "dark" : avgBright > 0.70 ? "bright" : "mid-tone",
    framing,                              // e.g. "middle center" / "lower right"
  };
}

window.analyzeImage = analyzeImage;

function generateAlt(shot){
  // Plain, factual fallback caption — picks a fresh combo each call so the
  // Regenerate button shows variation even before the real model responds.
  const subjects = {
    "fashion-editorial": [
      "woman in a black dress standing against a textured wall",
      "model in tailored coat looking off to the side",
      "woman wearing layered knitwear, hands in pockets",
      "model in silk slip dress on a plain backdrop",
    ],
    "portraits": [
      "woman with dark hair looking at the camera",
      "man in a white shirt, soft window light on his face",
      "close-up of a woman wearing small gold earrings",
      "person leaning against a doorway, half in shadow",
    ],
    "models": [
      "model standing front-facing on a neutral seamless",
      "full-length test of a woman in jeans and a t-shirt",
      "profile shot of a man against a grey background",
      "model walking across a plain studio floor",
    ],
    "ecommerce": [
      "white linen shirt photographed on a model against a plain backdrop",
      "wool coat shown from the front, buttons fastened",
      "denim jacket on a model, sleeves rolled up",
      "knit sweater displayed on a figure, cropped at the waist",
    ],
    "lifestyle": [
      "two people talking near a window on a film set",
      "hands holding a coffee cup, blurred kitchen behind",
      "stylist adjusting a model's collar between shots",
      "crew member checking a camera on a tripod",
    ],
    "product": [
      "small glass perfume bottle on a stone surface",
      "leather handbag photographed from above on linen",
      "pair of gold earrings laid flat on grey paper",
      "ceramic cup with steam rising, plain background",
    ],
  }[shot.cat] || ["photograph"];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const sentence = pick(subjects);
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

// Resize + encode an image to a small base64 JPEG suitable for sending to a
// vision model. Returns { mediaType, data } or null on failure.
async function _imageToBase64(src, maxDim = 768){
  try {
    const img = await _loadImg(src);
    const w0 = img.naturalWidth || img.width;
    const h0 = img.naturalHeight || img.height;
    if (!w0 || !h0) return null;
    const scale = Math.min(1, maxDim / Math.max(w0, h0));
    const W = Math.max(1, Math.round(w0 * scale));
    const H = Math.max(1, Math.round(h0 * scale));
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, W, H);
    const url = c.toDataURL("image/jpeg", 0.82);
    const m = /^data:([^;]+);base64,(.+)$/.exec(url);
    if (!m) return null;
    return { mediaType: m[1], data: m[2] };
  } catch (e) {
    return null;
  }
}

// Real AI alt-text via the built-in Claude helper. Sends the IMAGE itself to
// Claude (vision) so the description reflects exactly what's in the frame.
// Falls back to a text-only prompt seeded with sampled colors, then the
// synthetic generator if both fail.
async function generateAltAI(fileOrShot){
  const file = fileOrShot && fileOrShot.shot ? fileOrShot : null;
  const shot = file ? file.shot : fileOrShot;
  const src = (file && file.previewUrl) || (shot && window.getShotPreviewUrl && window.getShotPreviewUrl(shot));

  const instructions = [
    "Look at the image and write one short alt-text caption.",
    "",
    "Describe ONLY what is literally visible. Cover, in order:",
    "1. Subject — if a person, say woman / man / child / group (use what the image shows).",
    "2. Main items / clothing / objects in the frame.",
    "3. Dominant colors actually present in the image.",
    "4. The overall structure: pose or placement (lying, standing, close-up), and what's in the background.",
    "",
    "Hard rules:",
    "- One sentence, 12–24 words.",
    "- Plain and factual. No mood words ('striking', 'evocative', 'cinematic', 'dreamy', 'haunting').",
    "- No interpretation of feelings. Just what's in the picture.",
    "- Do NOT start with 'A photo of', 'Image of', 'Photograph of', 'This image'. Start with the subject.",
    "- Do not mention file name, year, or aspect ratio.",
    "- No quotes, no markdown. Just the sentence.",
    "",
    "Examples of the right tone:",
    "'Woman lying on a red background wearing gold earrings and a black slip dress.'",
    "'Man in a brown wool coat standing in front of a grey brick wall, looking left.'",
    "'Pair of black leather boots placed on a white linen sheet, photographed from above.'",
  ].join("\n");

  // 1) Try vision: send the actual image.
  if (src) {
    try {
      const encoded = await _imageToBase64(src, 768);
      if (encoded && window.claude && window.claude.complete) {
        const text = await window.claude.complete({
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: encoded.mediaType, data: encoded.data } },
              { type: "text", text: instructions },
            ],
          }],
        });
        const clean = String(text || "").trim().replace(/^["']|["']$/g, "");
        if (clean) return clean;
      }
    } catch (e) { /* fall through to text path */ }
  }

  // 2) Text fallback: sample colors and describe in prose to Claude.
  let analysis = null;
  if (src) { try { analysis = await window.analyzeImage(src); } catch(e){} }
  const cat = window.CATEGORIES.find(c => c.id === (shot && shot.cat));
  const colorLine = analysis && analysis.colors && analysis.colors.length
    ? analysis.colors.map(c => `${c.name} (${Math.round(c.pct*100)}%)`).join(", ")
    : "unknown";
  const textPrompt = [
    instructions,
    "",
    "(You cannot see the image directly. Use these sampled facts as the only source of truth.)",
    `- Dominant colors: ${colorLine}`,
    `- Tone: ${analysis ? (analysis.monochrome ? "monochrome / black-and-white" : "color") : "unknown"}`,
    `- Brightness: ${analysis ? analysis.brightness : "unknown"}`,
    `- Subject position: ${analysis ? analysis.framing : "unknown"}`,
    `- Category hint (do not mention): ${cat ? cat.name : (shot && shot.cat) || "unknown"}`,
  ].join("\n");

  try {
    if (!window.claude || !window.claude.complete) throw new Error("no claude");
    const text = await window.claude.complete(textPrompt);
    const clean = String(text || "").trim().replace(/^["']|["']$/g, "");
    if (clean) return clean;
  } catch (e) {}

  // 3) Last resort: synthetic.
  return generateAlt(shot);
}

window.useMemo = React.useMemo;
Object.assign(window, { GallerySection, generateAlt, generateAltAI, Masonry, Lightbox });
