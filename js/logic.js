/* Núcleo de lógica proposicional: geração, impressão e avaliação de fórmulas. */
(function (P) {
  const U = {
    rnd: n => Math.floor(Math.random() * n),
    pick: a => a[Math.floor(Math.random() * a.length)],
    shuf: a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1])
  };
  const OPS = ['¬', '¬', '∧', '∨', '→', '↔', '∧', '∨', '→'];
  const V = v => ({ v }), N = a => ({ o: '¬', a }), B = (o, a, b) => ({ o, a, b });

  // Gera fórmula aleatória. No topo, só permite ¬ se houver profundidade para negar algo composto.
  function gen(d, vs, top) {
    if (d === 0 || (!top && Math.random() < .25)) return V(U.pick(vs));
    let o;
    do o = U.pick(OPS); while (top && o === '¬' && d < 2);
    if (o === '¬') return N(gen(d - 1, vs, top));
    let a, b, tries = 0;                       // evita sub-fórmulas repetidas como (q ∨ q)
    do { a = gen(d - 1, vs); b = gen(d - 1, vs); } while (str(a) === str(b) && ++tries < 20);
    return B(o, a, b);
  }
  function str(n, top) {
    if (n.v) return n.v;
    if (n.o === '¬') return '¬' + str(n.a);
    const t = str(n.a) + ' ' + n.o + ' ' + str(n.b);
    return top ? t : '(' + t + ')';
  }
  function ev(n, e) {
    if (n.v) return e[n.v];
    const a = ev(n.a, e);
    if (n.o === '¬') return !a;
    const b = ev(n.b, e);
    return n.o === '∧' ? a && b : n.o === '∨' ? a || b : n.o === '→' ? !a || b : a === b;
  }
  function used(n, s) { if (n.v) s.add(n.v); else { used(n.a, s); if (n.b) used(n.b, s); } return s; }
  function rows(vs) {
    const out = [];
    for (let i = 0; i < 1 << vs.length; i++) {
      const e = {}; vs.forEach((v, j) => e[v] = ((i >> (vs.length - 1 - j)) & 1) === 0); out.push(e);
    }
    return out;
  }
  const sig = (n, vs) => rows(vs).map(e => ev(n, e) ? '1' : '0').join('');
  const VF = s => [...s].map(x => x === '1' ? 'V' : 'F').join(' ');
  const ham = (a, b) => { let n = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) n++; return n; };
  // 0 = tautologia, 1 = contingência, 2 = contradição
  const classOf = s => !s.includes('0') ? 0 : !s.includes('1') ? 2 : 1;

  P.U = U;
  P.Logic = { V, N, B, gen, str, ev, used, rows, sig, VF, ham, classOf };
})(window.PL);
