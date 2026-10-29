# 🟡 Pac-Lógica

Pac-Man em que cada docinho é uma pergunta de lógica proposicional.

## Como jogar
Abra `index.html` no navegador (não precisa instalar nada nem rodar servidor).

- Coma todos os docinhos 🍬 para vencer; fuja dos fantasmas 👻.
- Cada docinho traz uma pergunta: classificar como **tautologia / contingência / contradição**
  ou escolher a **equivalente lógica**.
- Errar ou ser pego custa 1 ❤️ (você começa com 3).
- Ao zerar os corações, há **uma única chance** de reviver respondendo outra pergunta.
- Controles: setas/WASD, botões na tela ou deslizar o dedo.

## Arquitetura
```
pac-logica/
├── index.html        # estrutura da página e ordem dos scripts
├── css/style.css     # visual
└── js/
    ├── config.js     # parâmetros (dificuldade, velocidades, nº de docinhos)
    ├── logic.js      # lógica proposicional: gerar, imprimir, avaliar, tabela-verdade
    ├── questions.js  # fábrica de perguntas (classificação e equivalência)
    ├── maze.js       # mapa, posições iniciais, sorteio dos docinhos
    ├── entities.js   # Pac-Man/fantasmas e interpolação de movimento
    ├── renderer.js   # desenho no canvas
    ├── ui.js         # HUD, overlay, janelas de pergunta e feedback
    ├── input.js      # teclado, botões e swipe
    ├── game.js       # regras e estado (colisões, corações, reviver, vitória)
    └── main.js       # inicialização e game loop
```
Tudo usa o namespace global `PL`, então funciona abrindo o arquivo direto (sem módulos ES).

## Ajustando a dificuldade
Em `js/config.js`, bloco `QUESTIONS`:
- `variables`: acrescente `'r'` para fórmulas com 3 variáveis.
- `classifyDepth` / `equivDepth`: troque por `[2, 3, 3]` para fórmulas maiores.
- `templateChance`: chance de aparecerem os "clássicos" fáceis (p ∨ ¬p, p ∧ ¬p...).
Também dá para mudar `GHOST_STEP`, `GHOST_CHASE`, `TOTAL_DOTS` e `HEARTS`.
