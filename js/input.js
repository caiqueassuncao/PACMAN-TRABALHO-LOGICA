/* Entrada: teclado, botões na tela e gestos de deslizar. */
(function (P) {
  function init(canvas, setDir) {
    const keys = { ArrowUp: 'u', w: 'u', ArrowDown: 'd', s: 'd', ArrowLeft: 'l', a: 'l', ArrowRight: 'r', d: 'r' };
    addEventListener('keydown', e => { const m = keys[e.key]; if (m) { setDir(m); e.preventDefault(); } });
    document.querySelectorAll('#pad button').forEach(b =>
      b.addEventListener('pointerdown', e => { e.preventDefault(); setDir(b.dataset.d); }));
    let tx, ty;
    canvas.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; });
    canvas.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
      setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u'));
    });
  }
  P.Input = { init };
})(window.PL);
