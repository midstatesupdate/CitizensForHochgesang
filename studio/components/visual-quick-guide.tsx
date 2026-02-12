export function VisualQuickGuide() {
  return (
    <div style={{padding: '1.25rem 1.5rem', maxWidth: 860, lineHeight: 1.5}}>
      <h2 style={{margin: '0 0 0.75rem', fontSize: '1.25rem'}}>Visual Preset Quick Guide</h2>
      <p style={{margin: '0 0 1rem'}}>
        Keep visuals subtle and readable. These settings are safe defaults for student maintainers.
      </p>

      <h3 style={{margin: '1rem 0 0.5rem', fontSize: '1rem'}}>Per-page controls (`Page Visual Settings`)</h3>
      <ul>
        <li><strong>Background Texture</strong>: `stately-gradient`, `civic-fabric`, `diagonal-wash`, `signal-grid`, `topo-lines`.</li>
        <li><strong>Container Width</strong>: `narrow`, `standard`, `wide`.</li>
        <li><strong>Color Tone</strong>: `Civic Neutral`, `Policy Brief Blue`, `Community Action Green`, `Media Spotlight Magenta`, `Volunteer Gold`.</li>
        <li><strong>Interaction Motion Preset</strong>: `still`, `calm`, `balanced`, `lively`, `energetic`.</li>
        <li><strong>Text Link Animation</strong>: `none`, `subtle`, `sweep`, `glint`.</li>
        <li><strong>Page Background Animation</strong>: `none`, `drift`, `tracers`, `drift-tracers`, `pulse`.</li>
        <li><strong>Scroll Reveal Animation</strong>: `none`, `soft`, `dynamic`, `cascade`.</li>
      </ul>

      <h3 style={{margin: '1rem 0 0.5rem', fontSize: '1rem'}}>Recommended route presets</h3>
      <ul>
        <li><strong>Home</strong>: stately-gradient + standard + default</li>
        <li><strong>News / News Detail</strong>: topo-lines/civic-fabric + standard/narrow + news</li>
        <li><strong>Events</strong>: diagonal-wash + standard + events</li>
        <li><strong>FAQ</strong>: civic-fabric + standard + support</li>
        <li><strong>Media / Press</strong>: signal-grid + standard + media (tracers for tech feel)</li>
        <li><strong>Support</strong>: stately-gradient + standard + support</li>
      </ul>
    </div>
  )
}
