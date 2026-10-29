/* Regras e estado do jogo: movimento, colisões, perguntas, corações, reviver, vitória. */
(function (P) {
  const { CONFIG: K, Maze, Entity, UI, Questions, U } = P;
  const DIRS = { u: [-1, 0], d: [1, 0], l: [0, -1], r: [0, 1] };
  const G = { state: 'menu', s: null, want: { r: 0, c: 0 } };

  function resetPositions() {
    const s = G.s, ps = Maze.PLAYER_START;
    s.player = Entity.create(ps.r, ps.c, K.PLAYER_STEP);
    s.ghosts = Maze.GHOST_STARTS.map(g => Entity.create(g.r, g.c, K.GHOST_STEP, { col: g.col }));
    G.want = { r: 0, c: 0 }; s.inv = K.INVULN_MS;
  }
  G.setDirection = k => { G.want = { r: DIRS[k][0], c: DIRS[k][1] }; };

  G.start = () => {
    G.s = { hearts: K.HEARTS, revived: false, eaten: 0, total: K.TOTAL_DOTS, dots: Maze.randomDots(K.TOTAL_DOTS), inv: 0 };
    resetPositions(); G.s.inv = 1200; G.state = 'play'; UI.hud(G.s); UI.hide();
  };

  function stepPlayer() {
    const s = G.s, p = s.player, w = G.want;
    p.pr = p.r; p.pc = p.c;
    if ((w.r || w.c) && Maze.free(p.r + w.r, p.c + w.c)) { p.dr = w.r; p.dc = w.c; }
    if (Maze.free(p.r + p.dr, p.c + p.dc)) { p.r += p.dr; p.c += p.dc; }
    const k = p.r + ',' + p.c;
    if (s.dots.has(k)) { s.dots.delete(k); s.eaten++; UI.hud(s); ask('eat'); }
  }
  function stepGhost(e) {
    const p = G.s.player;
    const all = [[0, 1], [0, -1], [1, 0], [-1, 0]].filter(d => Maze.free(e.r + d[0], e.c + d[1]));
    let opts = all.filter(d => !(d[0] === -e.dr && d[1] === -e.dc)); if (!opts.length) opts = all;
    const d = Math.random() < K.GHOST_CHASE
      ? opts.map(x => [Math.abs(e.r + x[0] - p.r) + Math.abs(e.c + x[1] - p.c), x]).sort((a, b) => a[0] - b[0])[0][1]
      : U.pick(opts);
    e.dr = d[0]; e.dc = d[1]; e.pr = e.r; e.pc = e.c; e.r += d[0]; e.c += d[1];
  }

  G.update = dt => {
    if (G.state !== 'play') return;
    const s = G.s; s.inv = Math.max(0, s.inv - dt);
    s.player.acc += dt;
    while (s.player.acc >= s.player.step && G.state === 'play') { s.player.acc -= s.player.step; stepPlayer(); }
    if (G.state !== 'play') return;
    s.ghosts.forEach(e => { e.acc += dt; while (e.acc >= e.step) { e.acc -= e.step; stepGhost(e); } });
    if (s.inv > 0) return;
    const a = Entity.pos(s.player);
    for (const e of s.ghosts) {
      const b = Entity.pos(e);
      if (Math.hypot(a.x - b.x, a.y - b.y) < K.TILE * .6) {
        s.hearts--; UI.hud(s);
        if (s.hearts <= 0) lose(); else resetPositions();
        return;
      }
    }
  };

  function ask(mode) { G.state = 'quiz'; UI.quiz(Questions.random(), mode, ok => afterQuiz(mode, ok)); }
  function afterQuiz(mode, ok) {
    const s = G.s;
    if (mode === 'eat') {
      if (!ok) { s.hearts--; UI.hud(s); if (s.hearts <= 0) return lose(); }
    } else if (ok) {
      s.revived = true; s.hearts = K.REVIVE_HEARTS; UI.hud(s); resetPositions();
    } else return gameOver();
    if (s.eaten >= s.total) return win();
    G.state = 'play'; UI.hide();
  }
  function lose() { if (G.s.revived) gameOver(); else ask('revive'); }
  function gameOver() {
    G.state = 'over'; UI.hud(G.s);
    UI.message('Game over 💀', 'bad', '<p>Você comeu ' + G.s.eaten + ' de ' + G.s.total + ' docinhos.</p>', 'Jogar de novo', G.start);
  }
  function win() {
    G.state = 'over';
    UI.message('🏆 Você venceu!', 'ok', '<p>Todos os docinhos foram comidos' + (G.s.revived ? ' (e você até reviveu!)' : '') + '.</p>', 'Jogar de novo', G.start);
  }
  P.Game = G;
})(window.PL);
