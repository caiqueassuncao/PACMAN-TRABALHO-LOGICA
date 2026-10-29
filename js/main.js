/* Ponto de entrada: monta os módulos, mostra o menu e roda o loop. */
(function (P) {
  const cv = document.getElementById('cv');
  P.Renderer.init(cv); P.UI.init(); P.Input.init(cv, P.Game.setDirection);
  P.UI.message('🟡 Pac-Lógica', '',
    '<p>Coma os <b>' + P.CONFIG.TOTAL_DOTS + ' docinhos</b> 🍬 e fuja dos fantasmas 👻.</p>' +
    '<p class="mut">Cada docinho traz uma proposição: diga se é <b>tautologia, contingência ou contradição</b>, ou ache a <b>equivalente lógica</b>. Errar ou ser pego custa 1 ❤️. Ao zerar os corações, você tem <b>uma chance</b> de reviver respondendo outra pergunta.</p>' +
    '<p class="mut">Setas/WASD, botões ou deslize na tela.</p>', 'Jogar', P.Game.start);
  let last = 0;
  (function loop(t) {
    const dt = Math.min(50, t - last); last = t;
    P.Game.update(dt); P.Renderer.draw(P.Game.s, t);
    requestAnimationFrame(loop);
  })(0);
})(window.PL);
