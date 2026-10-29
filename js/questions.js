/* Fábrica de perguntas: classificação (taut./conting./contrad.) e equivalência lógica. */
(function (P) {
  const { U, Logic: L, CONFIG: K } = P;
  const { V, N, B } = L;
  const Q = K.QUESTIONS;

  // Proposições "clássicas" fáceis de reconhecer.
  const TEMPLATES = {
    0: [(p, q) => B('∨', V(p), N(V(p))), (p, q) => B('→', V(p), V(p)),
        (p, q) => B('→', B('∧', V(p), V(q)), V(p)), (p, q) => B('→', V(p), B('∨', V(p), V(q))),
        (p, q) => N(B('∧', V(p), N(V(p)))), (p, q) => B('→', V(q), B('→', V(p), V(q)))],
    1: [(p, q) => B('→', V(p), V(q)), (p, q) => B('∧', V(p), V(q))],
    2: [(p, q) => B('∧', V(p), N(V(p))), (p, q) => N(B('∨', V(p), N(V(p)))),
        (p, q) => B('↔', V(p), N(V(p))), (p, q) => B('∧', B('∧', V(p), V(q)), N(V(p))),
        (p, q) => N(B('→', V(p), V(p)))]
  };

  function classQuestion(ast, target) {
    const vs = [...L.used(ast, new Set())].sort();
    return { type: 'c', f: L.str(ast, true), ast, vs, ans: target };
  }
  function fromTemplate(t) {
    let [p, q] = Q.variables.slice(0, 2); if (Math.random() < .5) [p, q] = [q, p];
    return classQuestion(U.pick(TEMPLATES[t])(p, q), t);
  }
  function classify() {
    const t = U.rnd(3);
    if (t !== 1 && Math.random() < Q.templateChance) return fromTemplate(t);
    for (let i = 0; i < 3000; i++) {
      const f = L.gen(U.pick(Q.classifyDepth), Q.variables, true);
      const vs = [...L.used(f, new Set())].sort();
      if (vs.length >= 2 && L.str(f, true).length <= Q.maxLength + 1 && L.classOf(L.sig(f, vs)) === t) return classQuestion(f, t);
    }
    return fromTemplate(t);
  }

  // Equivalência: agrupa fórmulas por tabela-verdade; a resposta é outra fórmula do mesmo grupo.
  function equiv() {
    const vs = ['p', 'q'], pool = new Map();
    for (let i = 0; i < 800; i++) {
      const f = L.gen(U.pick(Q.equivDepth), vs, true), s = L.sig(f, vs);
      if (s === '0000' || s === '1111' || L.used(f, new Set()).size < 2 || L.str(f, true).length > Q.maxLength) continue;
      if (!pool.has(s)) pool.set(s, new Set());
      pool.get(s).add(L.str(f, true));
    }
    const groups = [...pool.keys()].filter(k => pool.get(k).size > 1);
    if (!groups.length) return classify();
    const g = U.pick(groups), two = U.shuf([...pool.get(g)]), F = two[0], E = two[1];
    const wrong = [...pool.keys()].filter(k => k !== g)
      .map(k => [L.ham(k, g) + Math.random() * 1.5, k]).sort((a, b) => a[0] - b[0]).slice(0, 3)
      .map(x => U.pick([...pool.get(x[1])]));
    const opts = U.shuf([E, ...wrong]);
    return { type: 'e', f: F, opts, ans: opts.indexOf(E), sig: g };
  }

  P.Questions = { classify, equiv, random: () => Math.random() < .5 ? classify() : equiv() };
})(window.PL);
