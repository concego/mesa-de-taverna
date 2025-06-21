# Changelog - Mesa de Taverna

Todas as mudanças notáveis no projeto **Mesa de Taverna** serão documentadas neste arquivo. As versões seguem o formato de versionamento semântico (MAJOR.MINOR.PATCH).

## [1.1.0] - 2025-06-20

### Novas Funcionalidades
- Adicionado suporte multilíngue com traduções completas para português (pt-BR) e inglês (en-US) em `languages.js`.
- Implementada gamificação com sistema de moedas (10 por vitória, 2 por derrota), níveis (de "Forasteiro" a "Mestre") e conquistas (ex.: "Senhor dos Dados", "Rei do Vinte e Um").
- Adicionada persistência de dados via `localStorage` para moedas, reputação e conquistas desbloqueadas.
- Incluída página de tutorial (`tutorial.html`) com instruções detalhadas para todos os jogos.
- Adicionada seção de conquistas com modal para exibir conquistas desbloqueadas.

### Correções de Bugs
- Corrigido erro nas abas de "Cartas" e "Passatempos" que não alternavam corretamente devido a sintaxe incorreta em `switchTab` (`${category}${category}` para `tab-${category}`).
- Resolvido problema de jogos não iniciando, garantindo que funções como `startCoinToss`, `startBlackjack`, etc., sejam chamadas corretamente e botões sejam reativados após animações.
- Corrigido conteúdo inicial (dados, cartas, moedas) sendo exibido como "?" antes de clicar em "Iniciar", ajustando `resetGames` para definir `textContent = ''` e remover classes de animação.
- Adicionadas verificações de elementos DOM (`if (element)`) em todas as funções de jogos para evitar erros `null`.
- Corrigida lógica de **Maior ou Menor** para comparar a soma dos dados com 7 corretamente.
- Ajustada lógica de **Vinte e Um** para exibir carta oculta do dealer e finalizar o jogo adequadamente.

### Melhorias
- Melhorada acessibilidade com atributos ARIA (`aria-label`, `aria-live`, `role`) em dados, cartas e botões, e suporte a navegação por teclado.
- Adicionadas animações (`dice-roll`, `card-flip`, `coin-flip`) com reativação de botões após 500ms via `disableButtons`.
- Refatorada função `resetGames` para limpar todos os elementos (dados, cartas, moedas, somas, resultados) na inicialização e troca de abas.
- Estilo visual aprimorado com fonte `MedievalSharp`, fundo de taverna e avisos engraçados sobre "trolls pedreiros".
- Atualizada documentação em `README.md` com instruções claras, lista de jogos e créditos aos canais parceiros.

## [1.0.0] - 2025-05-15 (Versão Inicial)

### Novas Funcionalidades
- Implementada estrutura inicial com 12 jogos de dados e cartas, incluindo Cara ou Coroa, Vinte e Um, Maior ou Menor, Par Perfeito, entre outros.
- Criada interface com tema medieval, usando HTML5, CSS3 e JavaScript.
- Adicionada navegação por abas ("Dados", "Cartas", "Passatempos") com suporte a ARIA.
- Incluído sistema de avisos engraçados no rodapé da página principal.

### Notas
- Primeira versão funcional, com foco em jogabilidade básica e tema medieval.
- Licença Creative Commons Attribution 4.0 International (CC BY 4.0) aplicada.

---

**Créditos**: Desenvolvido pela equipe do canal [Euconcegojogar](https://youtube.com/@euconcegojogar), com apoio de [3xbgamesbrasil](https://youtube.com/@3xbgamesbrasil) e [audiogamesbrasil](https://youtube.com/@audiogamesbrasil).

**Como Acompanhar Atualizações**: Verifique este arquivo regularmente para novas versões, correções e funcionalidades. Sugestões podem ser enviadas via issues no repositório ou pelos canais do YouTube.
