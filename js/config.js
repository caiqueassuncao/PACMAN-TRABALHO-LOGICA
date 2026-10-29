/* Configurações do jogo: ajuste aqui a dificuldade e as regras. */
window.PL = window.PL || {};
PL.CONFIG = {
  ROWS: 11, COLS: 15, TILE: 36,
  TOTAL_DOTS: 20,        // docinhos a comer para vencer
  HEARTS: 3,             // corações iniciais
  REVIVE_HEARTS: 2,      // corações ao reviver
  INVULN_MS: 2000,       // invulnerabilidade após ser pego
  PLAYER_STEP: 150,      // ms por casa (menor = mais rápido)
  GHOST_STEP: 260,
  GHOST_CHASE: 0.55,     // chance do fantasma perseguir (0 a 1)
  QUESTIONS: {
    variables: ['p', 'q'],      // variáveis usadas (acrescente 'r' para ficar mais difícil)
    classifyDepth: [1, 2, 2],   // profundidade das fórmulas de classificação
    equivDepth: [1, 2, 2],      // profundidade das fórmulas de equivalência
    maxLength: 12,              // tamanho máximo do texto da fórmula (menor = mais fácil)
    templateChance: 0.6         // chance de usar um "clássico" (p ∨ ¬p, p ∧ ¬p...) em taut./contradição
  }
};
