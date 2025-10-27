/**
 * Before/After slider – drag only from hotspot
 * Requirements (classes on your Webflow elements):
 * .BeforeAfterWrapper (relative)
 *   .BeforeMask  (absolute left:0; width:50%; height:100%; overflow:hidden)
 *     .DragHotspot (absolute right:-24px; width:64-96px; height:100%; cursor:ew-resize)
 *     .SliderHandle (optional visual line; pointer-events:none)
 *   .AfterMask   (absolute right:0; width:50%; height:100%; overflow:hidden)
 * Images inside each mask: absolute; inset:0; object-fit:cover
 *
 * Optional: data-start="0.5" on .BeforeAfterWrapper to set initial split.
 */
(function () {
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  function init(wrapper) {
    const before = wrapper.querySelector('.BeforeMask');
    const after  = wrapper.querySelector('.AfterMask');
    const spot   = wrapper.querySelector('.DragHotspot');
    if (!before || !after || !spot) return;

    let dragging = false;

    // initial split
    const startAttr = parseFloat(wrapper.getAttribute('data-start'));
    setSplit(Number.isFinite(startAttr) ? startAttr : 0.5);

    const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

    function setSplit(t) {
      const pct = clamp(t, 0, 1);
      before.style.width = (pct * 100) + '%';
      after .style.width = ((1 - pct) * 100) + '%';
      // handle/hotspot positioned with right:-Xpx inside BeforeMask, so they follow automatically
    }

    function start(e) {
      dragging = true;
      e.preventDefault();
      move(e);
    }

    function move(e) {
      if (!dragging) return;
      const r = wrapper.getBoundingClientRect();
      const t = clamp((getX(e) - r.left) / r.width, 0, 1);
      setSplit(t);
    }

    function end() { dragging = false; }

    spot.addEventListener('mousedown', start);
    spot.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.BeforeAfterWrapper').forEach(init);
  });
})();
