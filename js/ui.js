/* Interface HTML: HUD, overlay de mensagens e janelas de pergunta/feedback. */
(function (P) {
  const { Logic: L } = P, $ = id => document.getElementById(id);
  let ov, hp, sc, handler = null;
  const UI = {};

  UI.init = () => {
    ov = $('ov'); hp = $('hp'); sc = $('sc');
    ov.addEventListener('click', e => { const b = e.target.closest('button'); if (b && handler) handler(b.dataset.a); });
  };
  UI.hud = s => { hp.textContent = '❤️'.repeat(Math.max(0, s.hearts)) || '💔'; sc.textContent = '🍬 ' + s.eaten + '/' + s.total; };
  UI.hide = () => ov.classList.add('hide');
  UI.show = (html, h) => { ov.innerHTML = html; handler = h; ov.classList.remove('hide'); };
  UI.message = (title, cls, body, label, cb) =>
    UI.show('<h2 class="' + cls + '">' + title + '</h2>' + body + '<button data-a="go">' + label + '</button>', cb);

  function table(q) {
    const rs = L.rows(q.vs);
    return '<table><tr>' + q.vs.map(v => '<th>' + v + '</th>').join('') + '<th>' + q.f + '</th></tr>' +
      rs.map(e => '<tr>' + q.vs.map(v => '<td>' + (e[v] ? 'V' : 'F') + '</td>').join('') +
        '<td><b>' + (L.ev(q.ast, e) ? 'V' : 'F') + '</b></td></tr>').join('') + '</table>';
  }
  function feedback(q, ok) {
    let h = '<h2 class="' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✅ Correto!' : '❌ Errou!') + '</h2>';
    if (q.type === 'c') {
      const n = ['tautologia', 'contingência', 'contradição'][q.ans];
      const w = ['é sempre verdadeira', 'pode ser V ou F', 'é sempre falsa'][q.ans];
      h += '<p>É uma <b>' + n + '</b>: ' + w + '.</p>' + table(q);
    } else {
      h += '<p>A equivalente era <b>' + q.opts[q.ans] + '</b>.</p><p class="mut">Mesma coluna final (p,q = VV, VF, FV, FF):<br><b>' + L.VF(q.sig) + '</b></p>';
    }
    return h + '<button data-a="go">Continuar</button>';
  }

  // mode: 'eat' (docinho) ou 'revive'. done(ok) é chamado ao clicar em Continuar.
  UI.quiz = (q, mode, done) => {
    let h = '<h2>' + (mode === 'eat' ? '🍬 Docinho lógico!' : '💀 Última chance de reviver!') + '</h2>';
    h += mode === 'eat' ? '<p class="mut">Errar custa 1 ❤️</p>' : '<p class="mut">Acerte para voltar com 2 ❤️. Só tem uma chance!</p>';
    if (q.type === 'c') {
      h += '<p>Classifique a proposição:</p><div class="f">' + q.f + '</div>' +
        ['Tautologia', 'Contingência', 'Contradição'].map((t, i) => '<button data-a="' + i + '">' + t + '</button>').join('');
    } else {
      h += '<p>Qual é logicamente equivalente a:</p><div class="f">' + q.f + '</div>' +
        q.opts.map((t, i) => '<button data-a="' + i + '">' + t + '</button>').join('');
    }
    UI.show(h, a => { const ok = +a === q.ans; UI.show(feedback(q, ok), () => done(ok)); });
  };
  P.UI = UI;
})(window.PL);
