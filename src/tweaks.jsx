// Tweaks panel — uses the starter helpers.

const { TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect, TweakToggle, TweakColor } = window;

function Tweaks({ tweaks, setTweak }){
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme"/>
      <TweakRadio label="Mode" value={tweaks.theme}
        options={[{value:"light", label:"Light"},{value:"dark", label:"Dark"}]}
        onChange={(v) => setTweak("theme", v)}/>
      <TweakRadio label="Accent" value={tweaks.accent}
        options={[
          {value:"ochre", label:"Ochre"},
          {value:"red", label:"Red"},
          {value:"teal", label:"Teal"},
        ]}
        onChange={(v) => setTweak("accent", v)}/>
      <TweakToggle label="Film grain" value={tweaks.grain} onChange={(v) => setTweak("grain", v)}/>

      <TweakSection label="Side menu"/>
      <TweakRadio label="Side" value={tweaks.menuSide}
        options={[{value:"left", label:"Left"},{value:"right", label:"Right"}]}
        onChange={(v) => setTweak("menuSide", v)}/>

      <TweakSection label="Clock"/>
      <TweakRadio label="Format" value={tweaks.clockFormat}
        options={[{value:"24h", label:"24h"},{value:"12h", label:"12h"}]}
        onChange={(v) => setTweak("clockFormat", v)}/>
      <TweakToggle label="Show seconds" value={tweaks.clockSeconds} onChange={(v) => setTweak("clockSeconds", v)}/>
      <TweakSelect label="City" value={tweaks.clockCity}
        options={[
          {value:"Sydney",    label:"Sydney · AU"},
          {value:"Melbourne", label:"Melbourne · AU"},
          {value:"Tokyo",     label:"Tokyo · JP"},
          {value:"Dubai",     label:"Dubai · AE"},
          {value:"Istanbul",  label:"Istanbul · TR"},
          {value:"Belgrade",  label:"Belgrade · RS"},
          {value:"Paris",     label:"Paris · FR"},
          {value:"Lisbon",    label:"Lisbon · PT"},
          {value:"London",    label:"London · UK"},
          {value:"NYC",       label:"New York · US"},
          {value:"LA",        label:"Los Angeles · US"},
          {value:"Bali",      label:"Bali · ID"},
        ]}
        onChange={(v) => setTweak("clockCity", v)}/>

      <TweakSection label="Gallery"/>
      <TweakRadio label="Density" value={tweaks.galleryDensity}
        options={[
          {value:"loose",    label:"Loose"},
          {value:"balanced", label:"Balanced"},
          {value:"compact",  label:"Compact"},
        ]}
        onChange={(v) => setTweak("galleryDensity", v)}/>
    </TweaksPanel>
  );
}

Object.assign(window, { Tweaks });
