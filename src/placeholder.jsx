// Image placeholder component — used everywhere a real photograph would go.
// We have no real photos, so we render a clean monospace placeholder with a
// code, a label and an aspect ratio so the user can drop their real photos
// into these slots later.

const { useEffect, useRef, useState } = React;

function Placeholder({ shot, label, code, aw=4, ah=5, tone="neutral", className="", style={}, hoverable=true, year, accent, minimal=false, hideLabel=false, hideMark=false }){
  // Allow either shot={...} or explicit props
  const _label = label || (shot && shot.label) || "Untitled";
  const _code  = code  || (shot && shot.code)  || "N_000";
  const _aw    = (shot && shot.aw) || aw;
  const _ah    = (shot && shot.ah) || ah;
  const _tone  = (shot && shot.tone) || tone;
  const _year  = year || (shot && shot.year);

  // tones tweak the gradient slightly
  const gradients = {
    warm:   "linear-gradient(165deg,#d6cdba 0%,#a89c84 55%,#6b5f4a 100%)",
    cool:   "linear-gradient(165deg,#c4c8cc 0%,#8a8f95 55%,#4a4f55 100%)",
    neutral:"linear-gradient(165deg,#d8d3c7 0%,#a8a294 55%,#5a554c 100%)",
    "high-contrast": "linear-gradient(165deg,#e8e3d8 0%,#9a9286 40%,#1c1a17 100%)",
    shadow: "linear-gradient(165deg,#5a5448 0%,#322e26 50%,#15130f 100%)",
    muted:  "linear-gradient(165deg,#cdc8bd 0%,#a9a397 55%,#7a746a 100%)",
  };
  const darkGrads = {
    warm:   "linear-gradient(165deg,#3b352b 0%,#221f1a 55%,#0f0e0c 100%)",
    cool:   "linear-gradient(165deg,#2c3033 0%,#1b1e21 55%,#0c0d0f 100%)",
    neutral:"linear-gradient(165deg,#332f29 0%,#1d1b18 55%,#0d0c0b 100%)",
    "high-contrast": "linear-gradient(165deg,#4a443a 0%,#1a1815 60%,#000000 100%)",
    shadow: "linear-gradient(165deg,#1a1815 0%,#0b0a09 55%,#000 100%)",
    muted:  "linear-gradient(165deg,#2a2722 0%,#1a1815 55%,#100f0d 100%)",
  };

  const isDark = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark";
  const grad = (isDark ? darkGrads : gradients)[_tone] || gradients.neutral;

  return (
    <div
      className={`ph ${hoverable ? "cursor-look" : ""} ${className}`}
      style={{
        aspectRatio: `${_aw}/${_ah}`,
        background: grad,
        ...style,
      }}
    >
      {/* Diagonal scan lines */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"repeating-linear-gradient(135deg, rgba(0,0,0,.05) 0 1px, transparent 1px 9px)",
        pointerEvents:"none",
      }}/>
      {/* Crop marks */}
      {!minimal && <CropMarks/>}
      {!minimal && <div className="ph-frame"/>}
      {!minimal && !hideMark && <div className="ph-mark">{_code}</div>}
      {!minimal && !hideLabel && (
        <div className="ph-label">
          <span style={{maxWidth:"70%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{_label}</span>
          <span style={{opacity:.7}}>{_year || ""} · {_aw}:{_ah}</span>
        </div>
      )}
      {accent && (
        <span style={{
          position:"absolute", top:10, right:10,
          width:8, height:8, borderRadius:999, background:accent,
        }}/>
      )}
    </div>
  );
}

function CropMarks(){
  const stroke = "rgba(0,0,0,.25)";
  const L = 14;
  const Mark = ({style}) => (
    <svg width={L} height={L} style={{position:"absolute", ...style}}>
      <line x1="0" y1="0" x2={L} y2="0" stroke={stroke} strokeWidth="1"/>
      <line x1="0" y1="0" x2="0" y2={L} stroke={stroke} strokeWidth="1"/>
    </svg>
  );
  return (
    <>
      <Mark style={{top:0,left:0}}/>
      <Mark style={{top:0,right:0,transform:"scaleX(-1)"}}/>
      <Mark style={{bottom:0,left:0,transform:"scaleY(-1)"}}/>
      <Mark style={{bottom:0,right:0,transform:"scale(-1,-1)"}}/>
    </>
  );
}

// Generic intersection-observer hook: add `data-reveal` to any element and call
// useReveal once on the page to get the .in class added once visible.
function useReveal(){
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal], [data-reveal-slow]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px 400px 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ---------- Procedural shot previews ----------
// Generates a small, distinctive "photograph-like" data URL per shot so the
// admin flow / galleries actually have something to look at, even when no
// real photo file has been provided. Cached per shot.id.

const __shotPreviewCache = {};

function _seededRand(seed){
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function _hashStr(s){
  let h = 0;
  for(let i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i)) & 0x7fffffff;
  return h || 1;
}

function getShotPreviewUrl(shot){
  if(!shot) return null;
  const key = shot.id || `${shot.code}_${shot.label}`;
  if(__shotPreviewCache[key]) return __shotPreviewCache[key];

  const aw = shot.aw || 4, ah = shot.ah || 5;
  const W = 280;
  const H = Math.round(W * (ah / aw));
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const rnd = _seededRand(_hashStr(key));

  // Tone -> background palette
  const palettes = {
    warm:   ["#5a4a35","#3a2e22","#1a1410"],
    cool:   ["#3e4750","#252b32","#0e1116"],
    neutral:["#4d463c","#2d2823","#15120f"],
    "high-contrast":["#dad3c6","#5a544a","#0c0b09"],
    shadow: ["#262119","#13110d","#040403"],
    muted:  ["#46403a","#2a2622","#14110f"],
  };
  const pal = palettes[shot.tone] || palettes.neutral;

  // Background gradient: diagonal, jittered
  const ang = rnd() * Math.PI * 2;
  const g = ctx.createLinearGradient(
    W*0.5 + Math.cos(ang)*W*0.8, H*0.5 + Math.sin(ang)*H*0.8,
    W*0.5 - Math.cos(ang)*W*0.8, H*0.5 - Math.sin(ang)*H*0.8
  );
  g.addColorStop(0, pal[0]);
  g.addColorStop(0.55, pal[1]);
  g.addColorStop(1, pal[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  // Light source glow
  ctx.save();
  const lx = W * (0.2 + rnd()*0.6);
  const ly = H * (0.15 + rnd()*0.5);
  const lr = Math.max(W,H) * (0.4 + rnd()*0.3);
  const lg = ctx.createRadialGradient(lx,ly,0, lx,ly,lr);
  lg.addColorStop(0, "rgba(255,235,200,0.30)");
  lg.addColorStop(0.4, "rgba(255,220,180,0.10)");
  lg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = lg;
  ctx.fillRect(0,0,W,H);
  ctx.restore();

  // Subject silhouette varies by category
  const cat = shot.cat || "talent";
  ctx.fillStyle = "rgba(0,0,0,0.62)";

  if(cat === "talent" || cat === "fashion-editorial"){
    // head + shoulders + neck
    const cx = W * (0.38 + rnd()*0.24);
    const cy = H * (0.30 + rnd()*0.08);
    const hr = H * (0.12 + rnd()*0.035);
    // body/shoulders
    ctx.beginPath();
    ctx.moveTo(cx - hr*3.4, H + 4);
    ctx.bezierCurveTo(cx - hr*2.6, cy + hr*1.0, cx - hr*1.0, cy + hr*0.85, cx, cy + hr*0.95);
    ctx.bezierCurveTo(cx + hr*1.0, cy + hr*0.85, cx + hr*2.6, cy + hr*1.0, cx + hr*3.4, H + 4);
    ctx.lineTo(cx - hr*3.4, H + 4);
    ctx.closePath();
    ctx.fill();
    // neck
    ctx.fillRect(cx - hr*0.45, cy + hr*0.55, hr*0.9, hr*0.55);
    // head
    ctx.beginPath();
    ctx.ellipse(cx, cy, hr*0.85, hr*1.05, 0, 0, Math.PI*2);
    ctx.fill();
    // hair hint
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.ellipse(cx, cy - hr*0.3, hr*0.95, hr*0.65, 0, Math.PI, 0);
    ctx.fill();
  } else if(cat === "ecommerce"){
    // bottle / stack
    const cx = W*0.5;
    const top = H*(0.30 + rnd()*0.1);
    const bw = W * (0.16 + rnd()*0.04);
    ctx.beginPath();
    ctx.moveTo(cx - bw*0.5, top);
    ctx.lineTo(cx + bw*0.5, top);
    ctx.lineTo(cx + bw*0.5, H*0.92);
    ctx.lineTo(cx - bw*0.5, H*0.92);
    ctx.closePath(); ctx.fill();
    // bottle neck
    ctx.fillRect(cx - bw*0.18, top - H*0.08, bw*0.36, H*0.08);
    // tabletop
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, H*0.92, W, H);
  } else if(cat === "ecommerce"){
    // garment on figure — torso block
    const cx = W*0.5;
    ctx.beginPath();
    ctx.moveTo(cx - W*0.24, H*0.30);
    ctx.lineTo(cx + W*0.24, H*0.30);
    ctx.lineTo(cx + W*0.30, H*0.95);
    ctx.lineTo(cx - W*0.30, H*0.95);
    ctx.closePath(); ctx.fill();
    // sleeves
    ctx.fillRect(cx - W*0.34, H*0.32, W*0.10, H*0.45);
    ctx.fillRect(cx + W*0.24, H*0.32, W*0.10, H*0.45);
    // head
    ctx.beginPath(); ctx.arc(cx, H*0.22, H*0.07, 0, Math.PI*2); ctx.fill();
  } else { // lifestyle
    // horizon + figure
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, H*0.66, W, H);
    const fx = W*(0.2 + rnd()*0.6);
    const fy = H*0.66;
    ctx.beginPath();
    ctx.arc(fx, fy - H*0.06, H*0.045, 0, Math.PI*2); ctx.fill();
    ctx.fillRect(fx - W*0.025, fy - H*0.02, W*0.05, H*0.12);
  }

  // Vignette
  const vg = ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.2, W/2,H/2,Math.max(W,H)*0.75);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vg;
  ctx.fillRect(0,0,W,H);

  // Grain
  const img = ctx.getImageData(0,0,W,H);
  for(let i=0;i<img.data.length;i+=4){
    const n = (Math.random() - 0.5) * 28;
    img.data[i]   = Math.max(0, Math.min(255, img.data[i]   + n));
    img.data[i+1] = Math.max(0, Math.min(255, img.data[i+1] + n));
    img.data[i+2] = Math.max(0, Math.min(255, img.data[i+2] + n));
  }
  ctx.putImageData(img, 0, 0);

  const url = canvas.toDataURL('image/jpeg', 0.72);
  __shotPreviewCache[key] = url;
  return url;
}

// Renders a real <img> using either the file's uploaded URL, the shot's
// procedural preview, or — as a last resort — falls back to <Placeholder>.
function ShotImage({ file, shot, src, style={}, className="", minimal=false, hoverable=false, alt, accent, fit="cover" }){
  const _shot = (file && file.shot) || shot;
  const _src  = src || (file && file.previewUrl) || (_shot && getShotPreviewUrl(_shot));
  const aw = (_shot && _shot.aw) || 4;
  const ah = (_shot && _shot.ah) || 5;
  if(!_src){
    return <Placeholder shot={_shot} style={style} className={className} minimal={minimal} hoverable={hoverable}/>;
  }
  return (
    <div className={className} style={{
      position:"relative", overflow:"hidden",
      background:"#0c0a08",
      ...style,
    }}>
      <img src={_src} alt={alt || (_shot && _shot.label) || ""}
        style={{width:"100%", height:"auto", display:"block",
          filter:"contrast(1.04) saturate(0.92)"}}/>
      {accent && (
        <span style={{
          position:"absolute", top:10, right:10,
          width:8, height:8, borderRadius:999, background:accent,
        }}/>
      )}
    </div>
  );
}

Object.assign(window, { Placeholder, useReveal, CropMarks, ShotImage, getShotPreviewUrl });
