// Data + helpers shared by components.

const CATEGORIES = [
  {
    id: "fashion-editorial",
    name: "Fashion Editorial",
    short: "Editorial",
    blurb: "Story-driven shoots for magazines, lookbooks and stylists.",
    accent: "var(--film-red)",
    count: 14,
  },
  {
    id: "talent",
    name: "Talent",
    short: "Talent",
    blurb: "Portraits, digitals and agency tests. People as subjects.",
    accent: "var(--film-ochre)",
    count: 40,
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    short: "E-comm",
    blurb: "Clean, consistent, conversion-driven product on figure.",
    accent: "var(--film-teal)",
    count: 15,
  },
];

// Procedural "photographs": each is a placeholder with a code, a label, an
// aspect ratio and a tonal direction. They render as monospace cards.
function makeShots(catId, n, seedBase) {
  const aspects = [
    [4, 5], [3, 4], [2, 3], [5, 7], [1, 1], [4, 5], [3, 4], [5, 4], [3, 2],
  ];
  const tones = ["warm", "cool", "neutral", "high-contrast", "shadow", "muted"];
  const subjects = {
    "fashion-editorial": ["Look 01", "Look 02", "Backstage", "Cover try", "Beauty", "Movement", "Tailoring", "Mood", "Set piece"],
    talent: ["Portrait", "Digital — front", "Digital — side", "Studio sit", "Window light", "Profile", "Headshot", "Polaroid", "Comp card"],
    ecommerce: ["SKU 014", "SKU 022", "SKU 031", "Flat lay", "On figure", "Detail crop", "Hero shot", "Back view", "Pack shot"],
  };
  const items = [];
  for (let i = 0; i < n; i++) {
    const [aw, ah] = aspects[(seedBase + i) % aspects.length];
    items.push({
      id: `${catId}-${i + 1}`,
      cat: catId,
      label: subjects[catId][i % subjects[catId].length],
      code: `N_${String(seedBase + i + 1).padStart(3, "0")}`,
      aw, ah,
      tone: tones[(seedBase + i * 3) % tones.length],
      year: 2024 + ((i + seedBase) % 3) - 1,
      confidence: 0.7 + ((i * 13 + seedBase * 7) % 30) / 100,
    });
  }
  return items;
}

const _LS_KEY = "dn:published_shots";

const STATIC_SHOTS = [
  {id:"static_001",cat:"fashion-editorial",label:"Moevir Magazine Aug 2024",code:"N_001",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/1_moevir_magazine_august_issue_202416.jpg"},
  {id:"static_002",cat:"fashion-editorial",label:"Moevir Magazine Aug 2024",code:"N_002",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/1_moevir_magazine_august_issue_202420.jpg"},
  {id:"static_003",cat:"fashion-editorial",label:"Moevir Magazine Aug 2024",code:"N_003",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/1_moevir_magazine_august_issue_202425.jpg"},
  {id:"static_004",cat:"talent",label:"Portrait",code:"N_004",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/1v9a0216.jpg"},
  {id:"static_005",cat:"talent",label:"Portrait",code:"N_005",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/1v9a0692.jpg"},
  {id:"static_006",cat:"talent",label:"Portrait",code:"N_006",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/1v9a3693.jpg"},
  {id:"static_007",cat:"talent",label:"Portrait",code:"N_007",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/1v9a3751.jpg"},
  {id:"static_008",cat:"talent",label:"Portrait",code:"N_008",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/1v9a4155.jpg"},
  {id:"static_009",cat:"talent",label:"Portrait",code:"N_009",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/1v9a6709.jpg"},
  {id:"static_010",cat:"talent",label:"Portrait",code:"N_010",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/1v9a7515.jpg"},
  {id:"static_011",cat:"talent",label:"Portrait",code:"N_011",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/1v9a7849.jpg"},
  {id:"static_012",cat:"talent",label:"Portrait",code:"N_012",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/3.jpg"},
  {id:"static_013",cat:"talent",label:"Portrait",code:"N_013",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/4.jpg"},
  {id:"static_014",cat:"talent",label:"Arman",code:"N_014",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/arman_s0906.jpg"},
  {id:"static_015",cat:"talent",label:"Arman",code:"N_015",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/arman_s1404.jpg"},
  {id:"static_016",cat:"talent",label:"Arman",code:"N_016",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/arman_s1447.jpg"},
  {id:"static_017",cat:"talent",label:"Arman",code:"N_017",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/arman_s1737.jpg"},
  {id:"static_018",cat:"talent",label:"Portrait",code:"N_018",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/bsr8847.jpg"},
  {id:"static_019",cat:"talent",label:"Portrait",code:"N_019",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/c4188d16-e4df-4600-9ed4-8bd07b812e2f.jpg"},
  {id:"static_020",cat:"fashion-editorial",label:"Cover — Kavyar",code:"N_020",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/cover_from_kavyar.jpg"},
  {id:"static_021",cat:"talent",label:"Portrait",code:"N_021",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/dscf0321.jpg"},
  {id:"static_022",cat:"talent",label:"Portrait",code:"N_022",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/dscf0501.jpg"},
  {id:"static_023",cat:"talent",label:"Portrait",code:"N_023",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/dscf0814.jpg"},
  {id:"static_024",cat:"talent",label:"Portrait",code:"N_024",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/dscf4687.jpg"},
  {id:"static_025",cat:"talent",label:"Portrait",code:"N_025",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/dscf4734.jpg"},
  {id:"static_026",cat:"talent",label:"Portrait",code:"N_026",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/dscf9462.jpg"},
  {id:"static_027",cat:"talent",label:"Portrait",code:"N_027",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/dsc_0224.jpg"},
  {id:"static_028",cat:"talent",label:"Portrait",code:"N_028",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/dsc_0284.jpg"},
  {id:"static_029",cat:"talent",label:"Darina",code:"N_029",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/darina.jpeg"},
  {id:"static_030",cat:"talent",label:"Portrait",code:"N_030",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/img_0807.jpg"},
  {id:"static_031",cat:"talent",label:"Portrait",code:"N_031",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/img_0812.jpg"},
  {id:"static_032",cat:"talent",label:"Portrait",code:"N_032",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/img_1693.jpg"},
  {id:"static_033",cat:"talent",label:"Portrait",code:"N_033",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/img_1697.jpg"},
  {id:"static_034",cat:"talent",label:"Portrait",code:"N_034",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/img_1702.jpg"},
  {id:"static_035",cat:"talent",label:"Portrait",code:"N_035",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/img_6556-2.jpg"},
  {id:"static_036",cat:"talent",label:"Portrait",code:"N_036",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/img_7562.jpg"},
  {id:"static_037",cat:"talent",label:"Portrait",code:"N_037",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/img_7567.jpg"},
  {id:"static_038",cat:"talent",label:"Portrait",code:"N_038",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/img_7839.jpg"},
  {id:"static_039",cat:"talent",label:"Portrait",code:"N_039",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/img_7963.jpg"},
  {id:"static_040",cat:"fashion-editorial",label:"Interior Pages V60",code:"N_040",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/interior_pages_v60_3912.jpg"},
  {id:"static_041",cat:"fashion-editorial",label:"Interior Pages V60",code:"N_041",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/interior_pages_v60_3913.jpg"},
  {id:"static_042",cat:"fashion-editorial",label:"Interior Pages V60",code:"N_042",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/interior_pages_v60_3914.jpg"},
  {id:"static_043",cat:"fashion-editorial",label:"Looplite Vol 358",code:"N_043",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/looplite_vol_358_1.png"},
  {id:"static_044",cat:"fashion-editorial",label:"Looplite Vol 358",code:"N_044",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/looplite_vol_358.png"},
  {id:"static_045",cat:"fashion-editorial",label:"Malvie Magazine Noir Vol 69",code:"N_045",aw:3,ah:2,tone:"neutral",year:2022,previewUrl:"images/malvie_magazine_noir_special_edition_vol._69_june_2022.jpg"},
  {id:"static_046",cat:"fashion-editorial",label:"MOB Journal Vol 35",code:"N_046",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/mob_journal_vol-35-pages0232.jpg"},
  {id:"static_047",cat:"talent",label:"Namshi",code:"N_047",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/namshi.jpg"},
  {id:"static_048",cat:"talent",label:"Queens",code:"N_048",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/queens2873.jpeg"},
  {id:"static_049",cat:"talent",label:"Solea",code:"N_049",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/solea2310_copy.jpeg"},
  {id:"static_050",cat:"fashion-editorial",label:"Single Page",code:"N_050",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/single_page15.jpg"},
  {id:"static_051",cat:"fashion-editorial",label:"Single Page",code:"N_051",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/single_page16.jpg"},
  {id:"static_052",cat:"fashion-editorial",label:"Single Page",code:"N_052",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/single_page19.jpg"},
  {id:"static_053",cat:"fashion-editorial",label:"Single Page",code:"N_053",aw:3,ah:2,tone:"neutral",year:2024,previewUrl:"images/single_page22.jpg"},
  {id:"static_054",cat:"talent",label:"Snaps",code:"N_054",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/snaps4277_copy.jpg"},
  {id:"static_055",cat:"talent",label:"Portrait",code:"N_055",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_copy.jpg"},
  {id:"static_056",cat:"talent",label:"Portrait",code:"N_056",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-10.jpg"},
  {id:"static_057",cat:"talent",label:"Portrait",code:"N_057",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-14_2.jpg"},
  {id:"static_058",cat:"talent",label:"Portrait",code:"N_058",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-14.jpg"},
  {id:"static_059",cat:"talent",label:"Portrait",code:"N_059",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-15.jpg"},
  {id:"static_060",cat:"talent",label:"Portrait",code:"N_060",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-17.jpg"},
  {id:"static_061",cat:"talent",label:"Portrait",code:"N_061",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-2_4_10.39.51_am.jpg"},
  {id:"static_062",cat:"talent",label:"Portrait",code:"N_062",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-23_2.jpg"},
  {id:"static_063",cat:"talent",label:"Portrait",code:"N_063",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-24.jpg"},
  {id:"static_064",cat:"talent",label:"Portrait",code:"N_064",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-25.jpg"},
  {id:"static_065",cat:"talent",label:"Portrait",code:"N_065",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-28.jpg"},
  {id:"static_066",cat:"talent",label:"Portrait",code:"N_066",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-3_2.jpg"},
  {id:"static_067",cat:"talent",label:"Portrait",code:"N_067",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-3_3.jpg"},
  {id:"static_068",cat:"talent",label:"Portrait",code:"N_068",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-3_copy.jpg"},
  {id:"static_069",cat:"talent",label:"Portrait",code:"N_069",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-44.jpg"},
  {id:"static_070",cat:"talent",label:"Portrait",code:"N_070",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-49.jpg"},
  {id:"static_071",cat:"talent",label:"Portrait",code:"N_071",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-5_6.jpg"},
  {id:"static_072",cat:"talent",label:"Portrait",code:"N_072",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-5.jpg"},
  {id:"static_073",cat:"talent",label:"Portrait",code:"N_073",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-7_copy.jpg"},
  {id:"static_074",cat:"talent",label:"Portrait",code:"N_074",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-7.jpg"},
  {id:"static_075",cat:"talent",label:"Portrait",code:"N_075",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-8_2.jpg"},
  {id:"static_076",cat:"talent",label:"Portrait",code:"N_076",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-8_3.jpg"},
  {id:"static_077",cat:"talent",label:"Portrait",code:"N_077",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-8.jpg"},
  {id:"static_078",cat:"talent",label:"Portrait",code:"N_078",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-9.jpg"},
  {id:"static_079",cat:"talent",label:"Portrait",code:"N_079",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_-great_quality-6.jpg"},
  {id:"static_080",cat:"talent",label:"Portrait",code:"N_080",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_.jpg"},
  {id:"static_081",cat:"talent",label:"Model",code:"N_081",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_dsf8056_copy.jpg"},
  {id:"static_082",cat:"talent",label:"Model",code:"N_082",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_dsf8619_copy.jpg"},
  {id:"static_083",cat:"talent",label:"Model",code:"N_083",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/_dsf8633_copy.jpg"},
  {id:"static_084",cat:"talent",label:"Darina",code:"N_084",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/darina.webp.jpeg"},
  {id:"static_085",cat:"talent",label:"Darina",code:"N_085",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/darina1.webp.jpeg"},
  {id:"static_086",cat:"talent",label:"Portrait",code:"N_086",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/h-2.jpg"},
  {id:"static_087",cat:"talent",label:"Model",code:"N_087",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/k1-1-2.jpg"},
  {id:"static_088",cat:"talent",label:"Model",code:"N_088",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/k1-5-2.jpg"},
  {id:"static_089",cat:"talent",label:"Model",code:"N_089",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/k1-6.jpg"},
  {id:"static_090",cat:"talent",label:"Model",code:"N_090",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/kj-1.jpg"},
  {id:"static_091",cat:"talent",label:"Maria",code:"N_091",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/maria.webp.jpeg"},
  {id:"static_092",cat:"talent",label:"Maria",code:"N_092",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/maria1.webp.jpeg"},
  {id:"static_093",cat:"talent",label:"Maria",code:"N_093",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/maria2.webp.jpeg"},
  {id:"static_094",cat:"ecommerce",label:"Product",code:"N_094",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-111.jpg"},
  {id:"static_095",cat:"ecommerce",label:"Product",code:"N_095",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-13.jpg"},
  {id:"static_096",cat:"ecommerce",label:"Product",code:"N_096",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-16.jpg"},
  {id:"static_097",cat:"ecommerce",label:"Product",code:"N_097",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-19.jpg"},
  {id:"static_098",cat:"ecommerce",label:"Product",code:"N_098",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-2_2.jpg"},
  {id:"static_099",cat:"ecommerce",label:"Product",code:"N_099",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-2_3.jpg"},
  {id:"static_100",cat:"ecommerce",label:"Product",code:"N_100",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-22.jpg"},
  {id:"static_101",cat:"ecommerce",label:"Product",code:"N_101",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-31_2.jpg"},
  {id:"static_102",cat:"ecommerce",label:"Product",code:"N_102",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-31.jpg"},
  {id:"static_103",cat:"ecommerce",label:"Product",code:"N_103",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-41_2.jpg"},
  {id:"static_104",cat:"ecommerce",label:"Product",code:"N_104",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-5_3.jpg"},
  {id:"static_105",cat:"ecommerce",label:"Product",code:"N_105",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-5_5.jpg"},
  {id:"static_106",cat:"ecommerce",label:"Product",code:"N_106",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-511.jpg"},
  {id:"static_107",cat:"ecommerce",label:"Product",code:"N_107",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-53.jpg"},
  {id:"static_108",cat:"ecommerce",label:"Product",code:"N_108",aw:1,ah:1,tone:"neutral",year:2024,previewUrl:"images/products__-web-2.jpg"},
  {id:"static_109",cat:"talent",label:"Portrait",code:"N_109",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single_13.jpg"},
  {id:"static_110",cat:"talent",label:"Portrait",code:"N_110",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single_1v9a1295.jpg"},
  {id:"static_111",cat:"talent",label:"Portrait",code:"N_111",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single_7061.jpg"},
  {id:"static_112",cat:"talent",label:"Portrait",code:"N_112",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single_dscf5750.jpg"},
  {id:"static_113",cat:"talent",label:"Portrait",code:"N_113",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single_dscf7612.jpg"},
  {id:"static_114",cat:"talent",label:"Portrait",code:"N_114",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single_dscf8318_copy.jpg"},
  {id:"static_115",cat:"talent",label:"Portrait",code:"N_115",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single_img_1279.jpg"},
  {id:"static_116",cat:"talent",label:"Portrait",code:"N_116",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single_img_2709.jpg"},
  {id:"static_117",cat:"talent",label:"Portrait",code:"N_117",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single__1..jpg"},
  {id:"static_118",cat:"talent",label:"Portrait",code:"N_118",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single__2.jpg"},
  {id:"static_119",cat:"talent",label:"Portrait",code:"N_119",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single__-47.jpg"},
  {id:"static_120",cat:"talent",label:"Portrait",code:"N_120",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single__-5_2.jpg"},
  {id:"static_121",cat:"talent",label:"Portrait",code:"N_121",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single__-5_4.jpg"},
  {id:"static_122",cat:"talent",label:"Model",code:"N_122",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single__dsf5936_copy.jpg"},
  {id:"static_123",cat:"talent",label:"Model",code:"N_123",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single__dsf6892.jpeg"},
  {id:"static_124",cat:"talent",label:"Model",code:"N_124",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single_k1-3.jpg"},
  {id:"static_125",cat:"talent",label:"Water",code:"N_125",aw:4,ah:5,tone:"neutral",year:2024,previewUrl:"images/single_water.jpeg"},
  {id:"static_126",cat:"talent",label:"Screenshot",code:"N_126",aw:3,ah:2,tone:"neutral",year:2025,previewUrl:"images/screenshot_2025-01-10_at_11.27.04_am.png"},
];

// Static shots are the base gallery. localStorage additions (from local admin) layer on top.
const _CAT_MIGRATE = { portraits: "talent", models: "talent", lifestyle: "talent", product: "ecommerce" };
const _migrateCat = (s) => ({ ...s, cat: _CAT_MIGRATE[s.cat] || s.cat });
const _saved = (() => { try { const s = JSON.parse(localStorage.getItem(_LS_KEY) || "null"); return Array.isArray(s) && s.length ? s.map(_migrateCat) : null; } catch { return null; } })();
const ALL_SHOTS = _saved ? _saved : [...STATIC_SHOTS];

// Append uploaded files to ALL_SHOTS so the public galleries reflect what the
// owner has actually published. Files come from the admin flow and already
// carry shot metadata (label/code/year/aw/ah/tone) plus an optional previewUrl.
function publishFiles(files){
  const safe = (files || []).filter(f => f && f.cat);
  if (!safe.length) return;
  safe.forEach((f, i) => {
    const sh = f.shot || {};
    const fallbackLabel = (f.name || "").replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ") || sh.label || "Untitled";
    const aw = sh.aw || 4;
    const ah = sh.ah || 5;
    const id = `up-${Date.now()}-${i}`;
    ALL_SHOTS.push({
      id,
      cat: f.cat,
      label: fallbackLabel,
      code: `N_${String(ALL_SHOTS.length + 1).padStart(3, "0")}`,
      aw, ah,
      tone: sh.tone || "neutral",
      year: new Date().getFullYear(),
      confidence: f.confidence || 1,
      previewUrl: f.previewUrl || null,
      alt: f.alt || "",
    });
  });
  try { localStorage.setItem(_LS_KEY, JSON.stringify(ALL_SHOTS)); } catch {}
  window.dispatchEvent(new CustomEvent("dn:published"));
}

// "Press / Clients" line items for the About strip
const CLIENTS = [
  "Hindash Cosmetics", "Shein", "NAAR.HAUS", "MMG Models", "The Maine",
  "Black Island", "Moevir Magazine", "MOB Magazine", "L'Attirance Magazine", "Born Outside Italy",
  "Hindash Cosmetics", "Shein", "NAAR.HAUS", "MMG Models", "The Maine",
  "Black Island", "Moevir Magazine", "MOB Magazine", "L'Attirance Magazine", "Born Outside Italy",
];

const SERVICES = [
  { id: "editorial", name: "Editorial", line: "Concept → shoot → retouch" },
  { id: "campaign",  name: "Campaign",  line: "Multi-day production" },
  { id: "ecomm",     name: "E-commerce", line: "Studio days, clean delivery" },
  { id: "portrait",  name: "Portrait",  line: "Studio or location, half-day" },
  { id: "model-dev", name: "Model Development", line: "Studio or location shoots for emerging talent. Built for agency books and casting submissions." },
  { id: "digitals",  name: "Digitals / Polaroids", line: "Fast, clean agency digitals. Delivered same day." },
];

const FAQ = [
  { q: "Where are you based?", a: "Everywhere, honestly. I'm international — currently between Sydney, Europe and the Middle East. If the project is right, I travel for it. Reach out wherever you are." },
  { q: "Do you retouch in-house?", a: "Yes. Every frame I deliver is retouched by me. No outsourcing." },
  { q: "Turnaround?", a: "Selects within 24h. Final retouched gallery in 5–10 working days, dependent on scope." },
  { q: "Usage and licensing?", a: "Quoted per project. Commercial, editorial and exclusivity all handled in writing before shoot day." },
  { q: "Do you work with modeling agencies?", a: "Yes. I work directly with bookers on model development and digitals. Available for recurring agency work." },
  { q: "Are you available in Istanbul?", a: "Currently based in Istanbul for the next few months. Open to local agency bookings." },
];

// Random-ish helper to fake AI analysis times
const wait = (ms) => new Promise(r => setTimeout(r, ms));

function deleteShot(id) {
  const idx = ALL_SHOTS.findIndex(s => s.id === id);
  if (idx === -1) return;
  ALL_SHOTS.splice(idx, 1);
  try { localStorage.setItem(_LS_KEY, JSON.stringify(ALL_SHOTS)); } catch {}
  window.dispatchEvent(new CustomEvent("dn:published"));
}

function updateShot(id, changes) {
  const shot = ALL_SHOTS.find(s => s.id === id);
  if (!shot) return;
  Object.assign(shot, changes);
  try { localStorage.setItem(_LS_KEY, JSON.stringify(ALL_SHOTS)); } catch {}
  window.dispatchEvent(new CustomEvent("dn:published"));
}

Object.assign(window, { CATEGORIES, ALL_SHOTS, CLIENTS, SERVICES, FAQ, makeShots, wait, publishFiles, deleteShot, updateShot });
