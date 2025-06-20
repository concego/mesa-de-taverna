# Mesa de Taverna

Bem-vindo à **Mesa de Taverna**, um projeto de jogos de tabuleiro digitais inspirado na Idade Média, com 5 jogos de dados e 5 jogos de cartas, desenvolvido pela equipe do canal **Euconcegojogar**, em parceria com **3xbgamesbrasil** e **audiogamesbrasil**. Desafie sua sorte em uma taverna medieval com jogos simples e envolventes, como *Rolar Dados*, *Vinte e Um*, e *Naipe Certo*. O projeto é compatível com GitHub Pages, suporta múltiplos idiomas (português, inglês, espanhol) com base no idioma do navegador, e inclui acessibilidade para leitores de tela.

## Jogos Incluídos

### Jogos de Dados
1. **Rolar Dados**: Jogue dois dados e veja a soma.
2. **Maior ou Menor**: Aposte se a soma de dois dados será maior ou menor que 7.
3. **Par ou Ímpar**: Aposte se a soma será par ou ímpar.
4. **Aposta na Soma Exata**: Tente prever a soma exata (2 a 12).
5. **Três ou Nada**: Aposte se a soma de três dados será divisível por 3.

### Jogos de Cartas
1. **Vinte e Um**: Chegue a 21 sem ultrapassar, contra o mestre da taverna.
2. **Maior Carta**: Compare sua carta com a do banco (Ás a Rei).
3. **Par Perfeito**: Aposte se duas cartas formarão um par.
4. **Soma 13**: Tente somar exatamente 13 com duas cartas.
5. **Naipe Certo**: Adivinhe o naipe de uma carta.

## Funcionalidades
- **Tema Medieval**: Estilo visual com fontes e texturas que remetem a tavernas medievais.
- **Suporte a Idiomas**: Textos em português (pt-BR), inglês (en) e espanhol (es), detectados automaticamente via `navigator.language`.
- **Acessibilidade**: Suporte a leitores de tela com ARIA (`aria-label`, `aria-live`, etc.).
- **Persistência**: Contadores de vitórias e derrotas salvos no `localStorage`.
- **Animações**: Efeitos visuais para rolagem de dados e virada de cartas.
- **Tutorial**: Página `tutorial.html` com instruções detalhadas para cada jogo.
- **Compatibilidade**: Hospedável no GitHub Pages, sem dependências externas além da fonte MedievalSharp.

## Como Jogar
1. Acesse o projeto no GitHub Pages ou localmente.
2. Escolha um jogo na página inicial (`index.html`).
3. Siga as instruções exibidas para cada jogo.
4. Consulte o tutorial (`tutorial.html`) para aprender as regras.
5. Os resultados (acertos/erros) são salvos automaticamente no navegador.

## Licença
Este projeto está licenciado sob a **Creative Commons Attribution 4.0 International (CC BY 4.0)**. Você é livre para compartilhar, adaptar e usar o material, desde que atribua crédito à equipe do canal **Euconcegojogar** e indique quaisquer alterações feitas. Veja o arquivo `LICENSE` para detalhes completos.

**Créditos**: Desenvolvido pela equipe do canal **Euconcegojogar**, em parceria com **3xbgamesbrasil** e **audiogamesbrasil**. Para mais informações, visite:
- [Euconcegojogar](https://youtube.com/@euconcegojogar?si=SX07WbvR0sDwzRzW)
- [3xbgamesbrasil](https://youtube.com/@3xbgamesbrasil?si=qomJ9ccKHmcBRx6V)
- [audiogamesbrasil](https://youtube.com/@audiogamesbrasil?si=Uk9OQFGHRzWDnI32)

## Como Contribuir
1. Faça um fork do repositório.
2. Crie uma branch para suas alterações (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`).
4. Envie para o repositório remoto (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

## Hospedagem
Para hospedar no GitHub Pages:
1. Faça upload dos arquivos para um repositório GitHub.
2. Ative o GitHub Pages nas configurações do repositório, apontando para a branch `main` ou `gh-pages`.
3. Acesse o projeto via `https://<seu-usuario>.github.io/dice-games/`.
