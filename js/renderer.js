/* Desenho no canvas: labirinto, docinhos, Pac-Man e fantasmas. */
(function (P) {
  const { CONFIG: K, Maze, Entity } = P, S = K.TILE;
  let ctx, cv;
  function init(canvas) { cv = canvas; ctx = cv.getContext('2d'); cv.width = K.COLS * S; cv.height = K.ROWS * S; }

  function walls() {
    for (let r = 0; r < K.ROWS; r++) for (let c = 0; c < K.COLS; c++) if (Maze.MAP[r][c] === '#') {
      ctx.fillStyle = '#2b3cff'; ctx.beginPath(); ctx.roundRect(c * S + 2, r * S + 2, S - 4, S - 4, 7); ctx.fill();
      ctx.fillStyle = '#0b0d3a'; ctx.beginPath(); ctx.roundRect(c * S + 6, r * S + 6, S - 12, S - 12, 4); ctx.fill();
    }
  }
  function candies(dots) {
    dots.forEach((col, k) => {
      const [r, c] = k.split(',').map(Number), x = (c + .5) * S, y = (r + .5) * S;
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(x - 2, y - 2, 2.2, 0, 7); ctx.fill();
    });
  }
  function pacman(p, inv, t) {
    if (inv > 0 && !(Math.floor(t / 120) % 2)) return;
    const a = Entity.pos(p), ang = Math.atan2(p.dr, p.dc), m = .05 + .3 * Math.abs(Math.sin(t / 110));
    ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(a.x, a.y);
    ctx.arc(a.x, a.y, S * .42, ang + m * Math.PI, ang + (2 - m) * Math.PI); ctx.fill();
  }
  function ghost(e) {
    const b = Entity.pos(e), r = S * .4;
    ctx.fillStyle = e.col; ctx.beginPath(); ctx.arc(b.x, b.y - 2, r, Math.PI, 0); ctx.lineTo(b.x + r, b.y + r - 2);
    for (let i = 0; i < 3; i++) { ctx.lineTo(b.x + r - (i + .5) * r * 2 / 3, b.y + r - 8); ctx.lineTo(b.x + r - (i + 1) * r * 2 / 3, b.y + r - 2); }
    ctx.fill();
    [-6, 6].forEach(o => {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(b.x + o, b.y - 4, 4.5, 0, 7); ctx.fill();
      ctx.fillStyle = '#102'; ctx.beginPath(); ctx.arc(b.x + o + e.dc * 2, b.y - 4 + e.dr * 2, 2, 0, 7); ctx.fill();
    });
  }
  function draw(s, t) {
    ctx.clearRect(0, 0, cv.width, cv.height); walls();
    if (!s) return;
    candies(s.dots); pacman(s.player, s.inv, t); s.ghosts.forEach(ghost);
  }
  P.Renderer = { init, draw };
})(window.PL);
