/**
 * Aurora background. Three large blurred color orbs drift slowly behind all
 * content. Pure CSS animation, GPU-accelerated, respects prefers-reduced-motion
 * (handled in globals.css).
 *
 * Rendered once at the body level via the root layout.
 */
export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora__orb aurora__orb--1" />
      <div className="aurora__orb aurora__orb--2" />
      <div className="aurora__orb aurora__orb--3" />
    </div>
  );
}
