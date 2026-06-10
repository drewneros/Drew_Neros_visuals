// Admin flow — the owner-only "drop images, AI sorts them, you confirm, it publishes"
// experience. Five steps:
//   0 — Upload (drag/drop zone, files staged)
//   1 — Analyzing (animated "AI" inspection)
//   2 — Review (categories side-by-side, draggable to fix mistakes)
//   3 — Alt text (review/edit per image)
//   4 — Publish (success summary)
//
// No real upload — synthetic data. Categories pulled from window.CATEGORIES.

const { useState: _ais, useEffect: _aie, useRef: _air, useMemo: _aim } = React;

function AdminFlow({ onClose }) {
  const [step, setStep] = _ais(0);
  const [files, setFiles] = _ais(() => []); // clean start — user adds their own

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "var(--bg)", color: "var(--fg)",
      display: "flex", flexDirection: "column",
      animation: "adminIn .4s cubic-bezier(.2,.7,.2,1)"
    }}>
      <style>{`
        @keyframes adminIn{from{opacity:0; transform:translateY(20px)}to{opacity:1; transform:none}}
        @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
        @keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes drift{0%{transform:translate(0,0)}50%{transform:translate(8px,-6px)}100%{transform:translate(0,0)}}
      `}</style>

      <AdminHeader step={step} onClose={onClose} fileCount={files.length} />

      <div style={{ flex: 1, overflow: "auto" }}>
        {step === 0 && <StepUpload files={files} setFiles={setFiles} onNext={() => setStep(1)} />}
        {step === 1 && <StepAnalyzing files={files} setFiles={setFiles} onDone={() => setStep(2)} />}
        {step === 2 && <StepReview files={files} setFiles={setFiles} onNext={() => setStep(3)} />}
        {step === 3 && <StepAltText files={files} setFiles={setFiles} onNext={() => setStep(4)} />}
        {step === 4 && <StepPublish files={files} onClose={onClose} />}
      </div>
    </div>);

}

function seedFiles(n) {
  const types = ["fashion-editorial", "portraits", "models", "ecommerce", "lifestyle", "product"];
  const samples = window.ALL_SHOTS;
  const arr = [];
  for (let i = 0; i < n; i++) {
    const sample = samples[(i * 7 + 3) % samples.length];
    arr.push({
      id: `upload-${i + 1}`,
      name: `IMG_${String(3000 + i).padStart(4, "0")}.JPG`,
      sizeMB: (2 + i * 13 % 9 + i * 7 % 10 / 10).toFixed(1),
      shot: sample, // visual we'll render
      pendingCat: null, // before analysis
      cat: null, // assigned after analysis
      confidence: null,
      alt: null
    });
  }
  return arr;
}

function AdminHeader({ step, onClose, fileCount }) {
  const steps = ["Upload", "Analyze", "Review", "Alt text", "Publish"];
  return (
    <div style={{
      padding: "22px 32px",
      borderBottom: "1px solid var(--line)",
      display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span className="display" style={{ fontSize: 24, letterSpacing: "-0.02em", fontWeight: 600 }}>
          Drew<span style={{ opacity: .3 }}>_</span>Neros<span style={{ opacity: .5 }}>.</span>
        </span>
        <span className="meta" style={{ color: "var(--fg-faint)" }}>· Owner console</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {steps.map((s, i) =>
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: i <= step ? 1 : .35 }}>
              <span style={{
              width: 22, height: 22, borderRadius: 999,
              border: "1px solid var(--line-strong)",
              background: i < step ? "var(--fg)" : i === step ? "var(--film-ochre)" : "transparent",
              color: i <= step ? "var(--bg)" : "var(--fg-soft)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--mono)", fontSize: 10
            }}>{i < step ? "✓" : String(i + 1)}</span>
              <span className="meta" style={{ color: i === step ? "var(--fg)" : "var(--fg-soft)" }}>{s}</span>
            </div>
            {i < steps.length - 1 && <span style={{ width: 20, height: 1, background: "var(--line-strong)", opacity: .6 }} />}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 18 }}>
        <span className="meta" style={{ color: "var(--fg-soft)" }}>
          {fileCount} image{fileCount === 1 ? "" : "s"} staged
        </span>
        <button onClick={onClose} className="btn ghost" style={{ height: 38, padding: "0 16px", fontSize: 12 }}>
          ✕ Back to site
        </button>
      </div>
    </div>);

}

/* -------------------- STEP 0: UPLOAD -------------------- */
function StepUpload({ files, setFiles, onNext }) {
  const [dragOver, setDragOver] = _ais(false);
  const fileInputRef = _air(null);

  const fakeAdd = (n) => {
    const next = seedFiles(files.length + n).slice(files.length);
    setFiles([...files, ...next]);
  };

  const handleBrowse = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handleFiles = (fileList) => {
    if (!fileList || !fileList.length) return;
    const samples = window.ALL_SHOTS;
    const arr = Array.from(fileList).filter((f) => f.type && f.type.startsWith("image/"));
    if (arr.length === 0) {
      // Selection wasn't real images (or browser hid types) — fall back to demo shots
      fakeAdd(fileList.length);
      return;
    }
    const stamp = Date.now();
    const nextFiles = arr.map((file, i) => {
      const idx = files.length + i;
      const sample = samples[(idx * 7 + 3) % samples.length];
      let previewUrl = null;
      try {previewUrl = URL.createObjectURL(file);} catch (e) {previewUrl = null;}
      return {
        id: `upload-${stamp}-${idx}`,
        name: file.name || `IMG_${String(3000 + idx).padStart(4, "0")}.JPG`,
        sizeMB: (file.size / (1024 * 1024)).toFixed(1),
        shot: sample,
        previewUrl, // <-- real uploaded preview
        cat: null,
        confidence: null,
        alt: null
      };
    });
    setFiles([...files, ...nextFiles]);
  };

  const clearAll = () => {
    if (files.length === 0) return;
    setFiles([]);
  };

  return (
    <div style={{ padding: "56px 64px", display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 64 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {handleFiles(e.target.files);e.target.value = "";}} />
      
      <div>
        <div className="meta" style={{ color: "var(--fg-soft)", marginBottom: 16 }}>Step 01 — Upload</div>
        <h2 className="display" style={{ margin: 0, fontSize: 88, letterSpacing: "-0.045em", lineHeight: .95, fontWeight: 600 }}>
          Drop a batch.<br /><span className="italic" style={{ opacity: .65, fontWeight: 400 }}>I'll sort it.</span>
        </h2>
        <p style={{ maxWidth: "42ch", fontSize: 16, color: "var(--fg-soft)", marginTop: 24, lineHeight: 1.6 }}>
          Drag in a folder of mixed photos — editorials, portraits, e-comm, whatever. The site reads
          each image, predicts which gallery it belongs in, and writes alt text for you. You confirm
          before anything goes live.
        </p>

        <div
          onDragEnter={(e) => {e.preventDefault();setDragOver(true);}}
          onDragOver={(e) => {e.preventDefault();setDragOver(true);}}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {e.preventDefault();setDragOver(false);handleFiles(e.dataTransfer.files);if (!e.dataTransfer.files.length) fakeAdd(6);}}
          style={{
            marginTop: 36, padding: 48,
            border: `1.5px dashed ${dragOver ? "var(--fg)" : "var(--line-strong)"}`,
            background: dragOver ? "color-mix(in oklch, var(--film-ochre) 14%, transparent)" : "transparent",
            transition: "all .25s ease",
            borderRadius: 4,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center"
          }}>
          
          <div style={{
            width: 56, height: 56, borderRadius: 999, border: "1px solid var(--line-strong)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            transform: dragOver ? "scale(1.1)" : "scale(1)", transition: "transform .25s"
          }}>↑</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>
            {dragOver ? "Drop to add" : "Drag images here"}
          </div>
          <div className="meta" style={{ color: "var(--fg-soft)" }}>or</div>
          <button onClick={handleBrowse} type="button" className="btn" style={{ height: 40, padding: "0 18px", fontSize: 13 }}>
            Browse files
          </button>
          <div className="meta" style={{ color: "var(--fg-faint)", marginTop: 8 }}>
            JPG, PNG, HEIC up to 50MB each
          </div>
        </div>

        <div style={{
          marginTop: 36, display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <span className="meta" style={{ color: "var(--fg-soft)" }}>
            {files.length} file{files.length === 1 ? "" : "s"} ready · {files.reduce((s, f) => s + parseFloat(f.sizeMB), 0).toFixed(1)} MB total
          </span>
          <button onClick={onNext} disabled={files.length === 0}
          className="btn" style={{
            opacity: files.length ? 1 : .4, pointerEvents: files.length ? "auto" : "none"
          }}>
            Continue — analyze {files.length} <span></span>
          </button>
        </div>
      </div>

      {/* Staged file list */}
      <div style={{
        borderLeft: "1px solid var(--line)", paddingLeft: 48,
        maxHeight: "calc(100vh - 200px)", overflow: "auto"
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18
        }}>
          <span className="meta" style={{ color: "var(--fg-soft)" }}>Staged ({files.length})</span>
          <button onClick={clearAll} disabled={files.length === 0}
          className="meta"
          style={{
            color: files.length ? "var(--fg)" : "var(--fg-faint)",
            padding: "4px 10px", borderRadius: 6,
            background: files.length ? "color-mix(in oklch, var(--film-red) 12%, transparent)" : "transparent",
            transition: "background .2s, color .2s",
            cursor: files.length ? "pointer" : "default"
          }}>
            
            Clear all
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {files.map((f) =>
          <div key={f.id} style={{
            display: "grid", gridTemplateColumns: "44px 1fr auto",
            gap: 12, alignItems: "center",
            padding: "6px 0"
          }}>
              <ShotImage file={f} minimal style={{ aspectRatio: "1/1", width: 44, height: 44 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                <div className="meta" style={{ color: "var(--fg-faint)", fontSize: 9 }}>{f.sizeMB} MB</div>
              </div>
              <button onClick={() => setFiles(files.filter((x) => x.id !== f.id))}
            className="meta" style={{ color: "var(--fg-faint)", fontSize: 9 }}>remove</button>
            </div>
          )}
          {files.length === 0 &&
          <div className="meta" style={{ color: "var(--fg-faint)", padding: "12px 0" }}>No files staged yet.</div>
          }
        </div>
      </div>
    </div>);

}

/* -------------------- STEP 1: ANALYZING -------------------- */
function StepAnalyzing({ files, setFiles, onDone }) {
  const [progress, setProgress] = _ais(0); // 0..files.length
  const [log, setLog] = _ais([]);
  const totalRef = _air(files.length);

  _aie(() => {
    let cancelled = false;
    (async () => {
      const updated = [...files];
      for (let i = 0; i < updated.length; i++) {
        if (cancelled) return;
        await window.wait(420 + Math.random() * 180);
        const guess = updated[i].shot.cat; // we cheat: the synthetic shot tells us its true category
        const conf = 0.78 + Math.random() * 0.20;
        updated[i] = { ...updated[i], cat: guess, confidence: conf };
        setFiles([...updated]);
        setProgress(i + 1);
        setLog((prev) => [
        { t: `${updated[i].name}`, m: `→ ${labelFor(guess)} · ${(conf * 100).toFixed(0)}%` },
        ...prev].
        slice(0, 14));
      }
      await window.wait(500);
      if (!cancelled) onDone();
    })();
    return () => {cancelled = true;};
  }, []);

  const pct = progress / totalRef.current * 100;

  // currently-being-analyzed image (next in line)
  const current = files[progress] || files[files.length - 1];

  return (
    <div style={{ padding: "56px 64px", display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 64 }}>
      <div>
        <div className="meta" style={{ color: "var(--fg-soft)", marginBottom: 16 }}>Step 02 — Analyzing</div>
        <h2 className="display" style={{ margin: 0, fontSize: 88, letterSpacing: "-0.02em", lineHeight: .95 }}>
          Reading<br /><span className="italic" style={{ opacity: .65 }}>your frames…</span>
        </h2>

        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="meta" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subject · light · styling · composition</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{progress} / {totalRef.current}</span>
          </div>
          <div style={{ height: 2, background: "var(--line)", position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", inset: 0, width: `${pct}%`,
              background: "var(--fg)", transition: "width .4s cubic-bezier(.2,.7,.2,1)"
            }} />
          </div>
        </div>

        {/* Live log */}
        <div style={{
          marginTop: 32, padding: 20, border: "1px solid var(--line)",
          height: 300, overflow: "hidden", position: "relative",
          background: "color-mix(in oklch, var(--fg) 3%, transparent)"
        }}>
          <div className="meta" style={{ color: "var(--fg-faint)", marginBottom: 10 }}>
            ai.classifier.log
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.7, color: "var(--fg-soft)" }}>
            {log.map((l, i) =>
            <div key={i} style={{ opacity: 1 - i * 0.07, display: "flex", gap: 10 }}>
                <span style={{ color: "var(--fg-faint)" }}>{String(progress - i).padStart(3, "0")}</span>
                <span style={{ color: "var(--fg)" }}>{l.t}</span>
                <span>{l.m}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Currently-inspecting frame */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="meta" style={{ color: "var(--fg-soft)" }}>Now inspecting</div>
        <div style={{ position: "relative" }}>
          <ShotImage file={current} style={{ aspectRatio: "4/5" }} />
          {/* scan line */}
          <div style={{
            position: "absolute", left: 0, right: 0, height: 64,
            background: "linear-gradient(to bottom, transparent, color-mix(in oklch, var(--film-ochre) 70%, transparent), transparent)",
            mixBlendMode: "screen",
            animation: "scan 1.8s linear infinite",
            pointerEvents: "none"
          }} />
          {/* corner brackets */}
          {[[8, 8], [8, "auto", 8], ["auto", 8, 8, "auto"], ["auto", "auto", 8, 8]].map((c, i) =>
          <div key={i} style={{
            position: "absolute",
            top: c[0] === "auto" ? "auto" : c[0], right: c[1] === "auto" ? "auto" : c[1],
            bottom: c[2] === "auto" ? "auto" : c[2], left: c[3] === "auto" ? "auto" : c[3],
            width: 22, height: 22,
            borderTop: c[0] !== "auto" ? "2px solid var(--film-ochre)" : "0",
            borderBottom: c[2] !== "auto" ? "2px solid var(--film-ochre)" : "0",
            borderLeft: c[3] !== "auto" ? "2px solid var(--film-ochre)" : "0",
            borderRight: c[1] !== "auto" ? "2px solid var(--film-ochre)" : "0",
            animation: "pulse 1.4s ease-in-out infinite"
          }} />
          )}
        </div>
        <div className="meta" style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-soft)" }}>
          <span>{current.name}</span>
          <span>{current.sizeMB} MB</span>
        </div>
        <div style={{
          padding: 14, border: "1px solid var(--line)",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12
        }}>
          <Reading label="Subjects" v="1 person · frontal" />
          <Reading label="Setting" v="exterior · low light" />
          <Reading label="Styling" v="casual knitwear" />
          <Reading label="Mood" v="quiet · cinematic" />
        </div>
      </div>
    </div>);

}

function Reading({ label, v }) {
  return (
    <div>
      <div className="meta" style={{ color: "var(--fg-faint)" }}>{label}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 12, marginTop: 4, color: "var(--fg)" }}>{v}</div>
    </div>);

}

function labelFor(catId) {
  const c = window.CATEGORIES.find((c) => c.id === catId);
  return c ? c.name : catId;
}

/* -------------------- STEP 2: REVIEW (drag/drop fix) -------------------- */
function StepReview({ files, setFiles, onNext }) {
  // Group by cat
  const groups = _aim(() => {
    const g = {};
    window.CATEGORIES.forEach((c) => g[c.id] = []);
    files.forEach((f) => {if (g[f.cat]) g[f.cat].push(f);});
    return g;
  }, [files]);

  const onDropTo = (catId, fileId) => {
    setFiles(files.map((f) => f.id === fileId ? { ...f, cat: catId, edited: true } : f));
  };

  const moved = files.filter((f) => f.edited).length;

  return (
    <div style={{ padding: "40px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <div className="meta" style={{ color: "var(--fg-soft)", marginBottom: 12 }}>Step 03 — Review groups</div>
          <h2 className="display" style={{ margin: 0, fontSize: 64, letterSpacing: "-0.02em", lineHeight: 1 }}>
            Here's how I sorted them. <span className="italic" style={{ opacity: .6 }}>Drag to fix anything off.</span>
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span className="meta" style={{ color: "var(--fg-soft)" }}>
            {moved > 0 ? `${moved} moved` : "No edits yet"}
          </span>
          <button onClick={onNext} className="btn" style={{ margin: "10px 0px", padding: "0px 18px 1px" }}>
            Continue <span>→</span>
          </button>
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16
      }}>
        {window.CATEGORIES.map((cat) =>
        <CategoryBucket key={cat.id} cat={cat}
        items={groups[cat.id] || []}
        onDropTo={onDropTo} />

        )}
      </div>
    </div>);

}

function CategoryBucket({ cat, items, onDropTo }) {
  const [over, setOver] = _ais(false);
  return (
    <div
      onDragEnter={(e) => {e.preventDefault();setOver(true);}}
      onDragOver={(e) => {e.preventDefault();setOver(true);}}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();setOver(false);
        const id = e.dataTransfer.getData("text/plain");
        if (id) onDropTo(cat.id, id);
      }}
      style={{
        background: over ? "color-mix(in oklch, var(--film-ochre) 14%, transparent)" : "color-mix(in oklch, var(--fg) 3%, transparent)",
        border: `1px solid ${over ? "var(--fg)" : "var(--line)"}`,
        padding: 16, minHeight: 280,
        transition: "all .2s ease",
        display: "flex", flexDirection: "column", gap: 14
      }}>
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: cat.accent }} />
          <h4 style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 22, letterSpacing: "-0.01em" }}>{cat.name}</h4>
        </div>
        <span className="meta" style={{ color: "var(--fg-soft)" }}>{items.length}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {items.map((f) =>
        <DraggableThumb key={f.id} file={f} />
        )}
        {Array.from({ length: Math.max(0, 6 - items.length) }).map((_, i) =>
        <div key={i} style={{
          aspectRatio: "1/1",
          background: "repeating-linear-gradient(135deg, var(--line) 0 1px, transparent 1px 6px)",
          opacity: .5
        }} />
        )}
      </div>
    </div>);

}

function DraggableThumb({ file }) {
  const [dragging, setDragging] = _ais(false);
  return (
    <div
      draggable
      onDragStart={(e) => {e.dataTransfer.setData("text/plain", file.id);setDragging(true);}}
      onDragEnd={() => setDragging(false)}
      title={`${file.name} · ${(file.confidence * 100).toFixed(0)}%`}
      style={{
        cursor: "grab",
        opacity: dragging ? .4 : 1,
        position: "relative",
        transition: "opacity .2s"
      }}>
      
      <ShotImage file={file} minimal style={{ aspectRatio: "1/1" }} />
      {file.confidence < 0.85 &&
      <div title="Low confidence" style={{
        position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: 999,
        background: "var(--film-red)", boxShadow: "0 0 0 2px var(--bg)"
      }} />
      }
      {file.edited &&
      <div className="meta" style={{
        position: "absolute", top: 4, left: 4,
        padding: "2px 6px", borderRadius: 999, background: "var(--fg)", color: "var(--bg)",
        fontSize: 9
      }}>moved</div>
      }
    </div>);

}

/* -------------------- STEP 3: ALT TEXT -------------------- */
function StepAltText({ files, setFiles, onNext }) {
  const [idx, setIdx] = _ais(0);
  const [regenerating, setRegenerating] = _ais(false);
  const inflightRef = _air(new Set());
  const f = files[idx];

  // Auto-generate real AI alt the first time each image is viewed.
  _aie(() => {
    if (!f) return;
    if (f.alt) return;
    if (inflightRef.current.has(f.id)) return;
    inflightRef.current.add(f.id);
    setRegenerating(true);
    (async () => {
      try {
        const text = await window.generateAltAI(f);
        setFiles(prev => prev.map(x => x.id === f.id ? { ...x, alt: text } : x));
      } finally {
        inflightRef.current.delete(f.id);
        setRegenerating(false);
      }
    })();
  }, [f && f.id]);

  if (!f) return null;
  const cat = window.CATEGORIES.find((c) => c.id === f.cat);

  const setAlt = (text) => setFiles(files.map((x, i) => i === idx ? { ...x, alt: text, edited: true } : x));

  const regenerate = async () => {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const text = await window.generateAltAI(f);
      setAlt(text);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div style={{ padding: "40px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
      <div>
        <ShotImage file={f} fit="contain" style={{ aspectRatio: `${f.shot.aw}/${f.shot.ah}`, maxHeight: "70vh", background: "color-mix(in oklch, var(--fg) 4%, transparent)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="meta" style={{ color: "var(--fg-soft)" }}>Step 04 — Alt text · {idx + 1} of {files.length}</div>
        <h2 className="display" style={{ margin: "12px 0 8px", fontSize: 56, letterSpacing: "-0.02em", lineHeight: 1 }}>
          {f.shot.label}.
        </h2>
        <div className="meta" style={{ color: "var(--fg-faint)", display: "flex", gap: 14 }}>
          <span>{f.name}</span><span>·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: cat.accent }} />
            {cat.name}
          </span>
        </div>

        <div style={{ marginTop: 32 }}>
          <div className="meta" style={{ color: "var(--fg-soft)", marginBottom: 10 }}>AI-suggested alt text — edit freely</div>
          <textarea
            value={f.alt || ""}
            onChange={(e) => setAlt(e.target.value)}
            rows={5}
            style={{
              width: "100%", border: "1px solid var(--line-strong)", padding: 16, borderRadius: 4,
              fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.5,
              background: "transparent", color: "var(--fg)", outline: "none", resize: "vertical"
            }} />
          
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span className="meta" style={{ color: "var(--fg-faint)" }}>
              {regenerating ? <>writing with AI<span className="blink">…</span></> : <>{(f.alt || "").length} chars · {(f.alt || "").split(/\s+/).filter(Boolean).length} words</>}
            </span>
            <button onClick={regenerate} disabled={regenerating} className="meta"
            style={{ color: regenerating ? "var(--fg-faint)" : "var(--fg-soft)", cursor: regenerating ? "default" : "pointer" }}>
              {regenerating ? "↻ Generating…" : "↻ Regenerate with AI"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 32 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn ghost" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
            style={{ height: 40, opacity: idx === 0 ? .4 : 1 }}>← Prev</button>
            <button className="btn ghost" onClick={() => setIdx(Math.min(files.length - 1, idx + 1))} disabled={idx === files.length - 1}
            style={{ height: 40, opacity: idx === files.length - 1 ? .4 : 1 }}>Next →</button>
          </div>
          <button onClick={onNext} className="btn">
            All good — publish all <span></span>
          </button>
        </div>

        <div style={{ marginTop: 24, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {files.map((_, i) =>
          <button key={i} onClick={() => setIdx(i)}
          style={{
            width: 18, height: 4, borderRadius: 2,
            background: i === idx ? "var(--fg)" : "var(--line-strong)"
          }} />
          )}
        </div>
      </div>
    </div>);

}

/* -------------------- STEP 4: PUBLISH -------------------- */
function StepPublish({ files, onClose }) {
  const [done, setDone] = _ais(false);
  _aie(() => {
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // count per category
  const counts = window.CATEGORIES.map((c) => ({ ...c, n: files.filter((f) => f.cat === c.id).length })).filter((c) => c.n > 0);

  return (
    <div style={{ padding: "80px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
      <div>
        <div className="meta" style={{ color: "var(--fg-soft)", marginBottom: 16 }}>Step 05 — Publish</div>
        <h2 className="display" style={{ margin: 0, fontSize: 96, letterSpacing: "-0.02em", lineHeight: .95 }}>
          {done ? <>Published.</> : <>Publishing<span className="blink">…</span></>}
        </h2>
        <p style={{ maxWidth: "42ch", fontSize: 16, color: "var(--fg-soft)", marginTop: 18, lineHeight: 1.6 }}>
          {done ?
          `${files.length} new images are now live across ${counts.length} galleries. Alt text and metadata applied.` :
          `Writing ${files.length} images, ${counts.length} galleries, alt text and metadata…`}
        </p>

        {done &&
        <button onClick={onClose} className="btn" style={{ marginTop: 36 }}>
            View live site <span></span>
          </button>
        }
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: "1px solid var(--line)" }}>
        {counts.map((c, i) =>
        <div key={c.id} style={{
          display: "grid", gridTemplateColumns: "24px 1fr auto",
          alignItems: "center", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--line)",
          opacity: done || i * 0.25 < 1 ? 1 : .4,
          transition: "opacity .4s ease",
          transitionDelay: `${i * 0.18}s`
        }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: c.accent }} />
            <span style={{ fontFamily: "var(--serif)", fontSize: 24 }}>{c.name}</span>
            <span className="meta" style={{ color: "var(--fg-soft)" }}>+{c.n}</span>
          </div>
        )}
      </div>
    </div>);

}

Object.assign(window, { AdminFlow });