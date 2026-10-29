/* Labirinto, posições iniciais e sorteio dos docinhos. */
(function (P) {
  const { U, CONFIG: K } = P;
  const MAP = [
    "###############", "#......#......#", "#.##.#.#.#.##.#", "#.............#",
    "#.##.#####.##.#", "#....#...#....#", "#.##.#.#.#.##.#", "#.............#",
    "#.##.#.#.#.##.#", "#......#......#", "###############"];
  const PLAYER_START = { r: 7, c: 7 };
  const GHOST_STARTS = [{ r: 5, c: 6, col: '#ff4d6d' }, { r: 5, c: 7, col: '#4cc9f0' }, { r: 5, c: 8, col: '#ff9f1c' }];
  const free = (r, c) => !!MAP[r] && MAP[r][c] === '.';
  const COLORS = ['#ff7eb6', '#7afcff', '#feff9c', '#b28dff', '#7dffb3'];

  function randomDots(n) {
    const cells = [];
    for (let r = 0; r < K.ROWS; r++) for (let c = 0; c < K.COLS; c++)
      if (free(r, c) && !(r === PLAYER_START.r && c === PLAYER_START.c) && !(r === 5 && c >= 6 && c <= 8)) cells.push(r + ',' + c);
    return new Map(U.shuf(cells).slice(0, n).map(k => [k, U.pick(COLORS)]));
  }
  P.Maze = { MAP, PLAYER_START, GHOST_STARTS, free, randomDots };
})(window.PL);
