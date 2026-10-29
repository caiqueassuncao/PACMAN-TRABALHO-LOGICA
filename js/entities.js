/* Entidades (Pac-Man e fantasmas) com movimento por casas e interpolação visual. */
(function (P) {
  const T = P.CONFIG.TILE;
  const create = (r, c, step, extra) => Object.assign({ r, c, pr: r, pc: c, acc: 0, step, dr: 0, dc: 0 }, extra);
  const pos = e => {
    const t = Math.min(1, e.acc / e.step);
    return { x: (e.pc + (e.c - e.pc) * t + .5) * T, y: (e.pr + (e.r - e.pr) * t + .5) * T };
  };
  P.Entity = { create, pos };
})(window.PL);
