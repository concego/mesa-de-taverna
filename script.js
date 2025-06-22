// == Utilitários ==
/**
 * Obtém elemento DOM com segurança, retornando null se não encontrado.
 * @param {string} id - ID do elemento.
 * @returns {HTMLElement|null} Elemento DOM ou null.
 */
function getElementSafe(id) {
    return document.getElementById(id);
}

/**
 * Remove classe de animação após um tempo.
 * @param {HTMLElement} element - Elemento DOM.
 * @param {string} animationClass - Classe de animação (ex.: 'dice-roll').
 */
function removeAnimation(element, animationClass) {
    if (element) {
        element.classList.add(animationClass);
        setTimeout(() => element.classList.remove(animationClass), 500);
    }
}

/**
 * Traduz chave de texto com fallback.
 * @param {string} key - Chave de tradução.
 * @returns {string} Texto traduzido ou chave original.
 */
function translate(key) {
    return window.translate?.(key) || key; // Fallback se languages.js não carregar
}

/**
 * Rola um dado com número de lados especificado.
 * @param {number} [sides=6] - Número de lados do dado.
 * @returns {number} Resultado do rolamento.
 */
function rollDie(sides = 6) {
    return Math.floor(Math.random() * sides) + 1;
}

// == Avisos da Taverna ==
const tavernNotices = [
    'Nossos pedreiros são trolls bêbados, então esperem algumas instabilidades. No mais, protejam-se e tenham uma boa estadia!',
    'A taverna está em obras! Goblins construtores deixaram martelos por aí, então cuidado com bugs e divirtam-se!',
    'Nossos anões pedreiros tomaram hidromel demais. A taverna pode tremer, mas a diversão está garantida!',
    'Reforma na taverna! Um dragão carpinteiro cuspiu fogo no telhado, então esperem surpresas. Boa sorte!',
    'Trolls reformando a taverna jogaram dados no cimento. Se algo quebrar, joguem e aproveitem!',
    'Aviso: a taverna está em construção! Orcs pedreiros confundiram o projeto, mas os jogos estão abertos!',
    'Nossos elfos arquitetos estão de ressaca. A taverna pode ter buracos, mas as moedas estão seguras!'
];

/**
 * Define um aviso aleatório no rodapé.
 */
function setRandomNotice() {
    const noticeIndex = Math.floor(Math.random() * tavernNotices.length);
    const noticeElement = getElementSafe('tavern-notice-text');
    if (noticeElement) {
        noticeElement.textContent = tavernNotices[noticeIndex];
        noticeElement.dataset.noticeIndex = noticeIndex;
    }
}

// == Gamificação ==
const state = {
    coins: parseInt(localStorage.getItem('tavern-coins')) || 0,
    reputation: parseInt(localStorage.getItem('tavern-reputation')) || 0,
    level: 1,
    unlockedAchievements: JSON.parse(localStorage.getItem('tavern-achievements')) || []
};

const titles = ['Forasteiro', 'Viajante', 'Mercenário', 'Aventureiro', 'Cavaleiro', 'Senhor', 'Mestre'];

const achievementsList = [
    {
        id: 'play-all',
        name: 'Aprendiz da Taverna',
        desc: 'Jogue todos os jogos pelo menos uma vez',
        condition: () => new Set(Object.keys(localStorage).filter(k => k.startsWith('game-result'))).size >= 10,
        reward: 50
    },
    {
        id: 'dice-lord',
        name: 'Senhor dos Dados',
        desc: 'Ganhe 20 vezes em jogos de dados',
        condition: () => ['0', '2', '3', '4', '5'].reduce((sum, id) => sum + (getGameResult(id)?.wins || 0), 0) >= 20,
        reward: 100
    },
    {
        id: 'blackjack-5',
        name: 'Rei do Vinte e Um',
        desc: 'Ganhe 5 vezes em Vinte e Um',
        condition: () => (getGameResult('6')?.wins || 0) >= 5,
        reward: 75
    },
    {
        id: 'coin-master',
        name: 'Mestre da Moeda',
        desc: 'Ganhe 10 vezes em Cara ou Coroa',
        condition: () => (getGameResult('0')?.wins || 0) >= 10,
        reward: 50
    },
    {
        id: 'higher-lower-5',
        name: 'Profeta dos Dados',
        desc: 'Ganhe 5 vezes em Maior ou Menor',
        condition: () => (getGameResult('2')?.wins || 0) >= 5,
        reward: 50
    },
    {
        id: 'perfect-pair-3',
        name: 'Mestre dos Pares',
        desc: 'Ganhe 3 vezes em Par Perfeito',
        condition: () => (getGameResult('8')?.wins || 0) >= 3,
        reward: 50
    }
];

/**
 * Obtém resultados de um jogo do localStorage com tratamento de erro.
 * @param {string} gameId - ID do jogo.
 * @returns {Object|null} Resultados do jogo ou null se inválido.
 */
function getGameResult(gameId) {
    try {
        return JSON.parse(localStorage.getItem(`game-result-${gameId}`)) || { wins: 0, losses: 0 };
    } catch {
        return null;
    }
}

/**
 * Salva resultado de um jogo.
 * @param {string} gameId - ID do jogo.
 * @param {boolean} won - Indica se o jogador venceu.
 */
function saveResult(gameId, won) {
    const key = `game-result-${gameId}`;
    const results = getGameResult(gameId) || { wins: 0, losses: 0 };
    if (won) results.wins++;
    else results.losses++;
    localStorage.setItem(key, JSON.stringify(results));
    awardCoins(won ? 10 : 2, won);
}

/**
 * Adiciona moedas e atualiza reputação.
 * @param {number} amount - Quantidade de moedas.
 * @param {boolean} isWin - Indica se é uma vitória.
 */
function awardCoins(amount, isWin) {
    state.coins += amount;
    localStorage.setItem('tavern-coins', state.coins);
    const coinsElement = getElementSafe('coins');
    if (coinsElement) coinsElement.textContent = state.coins;
    updateReputation(isWin ? 10 : 2);
}

/**
 * Atualiza reputação e nível.
 * @param {number} amount - Quantidade de reputação.
 */
function updateReputation(amount) {
    state.reputation += amount;
    state.level = Math.floor(state.reputation / 100) + 1;
    localStorage.setItem('tavern-reputation', state.reputation);
    const levelElement = getElementSafe('level');
    if (levelElement) {
        levelElement.textContent = `${translate(titles[Math.min(state.level - 1, titles.length - 1)])} (${state.reputation % 100}/100)`;
    }
    checkAchievements();
}

/**
 * Verifica e desbloqueia conquistas.
 */
function checkAchievements() {
    achievementsList.forEach(ach => {
        if (!state.unlockedAchievements.includes(ach.id) && ach.condition()) {
            state.unlockedAchievements.push(ach.id);
            localStorage.setItem('tavern-achievements', JSON.stringify(state.unlockedAchievements));
            awardCoins(ach.reward);
            alert(`Conquista desbloqueada: ${translate(ach.name)}! +${ach.reward} ${translate('moedas')}`);
        }
    });
    updateAchievementsList();
}

/**
 * Exibe modal de conquistas.
 */
function showAchievements() {
    const modal = getElementSafe('achievements-modal');
    if (modal) modal.style.display = 'flex';
    updateAchievementsList();
}

/**
 * Atualiza lista de conquistas no modal.
 */
function updateAchievementsList() {
    const list = getElementSafe('achievements-list');
    if (list) {
        list.innerHTML = achievementsList.map(ach => `
            <li ${state.unlockedAchievements.includes(ach.id) ? 'class="unlocked" aria-label="Conquista desbloqueada"' : ''}>
                ${translate(ach.name)}: ${translate(ach.desc)} (${ach.reward} ${translate('moedas')})
            </li>
        `).join('');
    }
}

/**
 * Fecha modal de conquistas.
 */
function closeAchievements() {
    const modal = getElementSafe('achievements-modal');
    if (modal) modal.style.display = 'none';
}

// == Interface ==
/**
 * Alterna entre abas de jogos.
 * @param {string} category - Categoria da aba (dados, cartas, passatempos).
 */
function switchTab(category) {
    document.querySelectorAll('[role="tabpanel"]').forEach(panel => panel.style.display = 'none');
    document.querySelectorAll('[role="tab"]').forEach(tab => {
        tab.setAttribute('aria-selected', 'false');
        tab.classList.remove('active-tab');
    });
    const panel = getElementSafe(`${category}-panel`);
    if (panel) panel.style.display = 'block';
    const tab = getElementSafe(`tab-${category}`);
    if (tab) {
        tab.setAttribute('aria-selected', 'true');
        tab.classList.add('active-tab');
    }
    resetGames();
}

/**
 * Desativa botões durante animações e reativa após 500ms.
 * @param {string} categoryId - ID da categoria (dados, cartas, passatempos).
 */
function disableButtons(categoryId) {
    const panel = getElementSafe(`${categoryId}-panel`);
    if (panel) {
        panel.querySelectorAll('button').forEach(btn => btn.disabled = true);
        setTimeout(() => {
            panel.querySelectorAll('button:not(#blackjack-hit):not(#blackjack-stand)').forEach(btn => btn.disabled = false);
        }, 500);
    }
}

/**
 * Reseta estado visual dos jogos.
 */
function resetGames() {
    document.querySelectorAll('.dice').forEach(dice => {
        dice.textContent = '';
        dice.classList.remove('dice-roll');
    });
    document.querySelectorAll('.card').forEach(card => {
        card.textContent = '';
        card.classList.remove('card-flip');
    });
    document.querySelectorAll('.coin').forEach(coin => {
        coin.textContent = '';
        coin.classList.remove('coin-flip');
    });
    document.querySelectorAll('[id^="sum"]').forEach(sum => sum.textContent = '');
    document.querySelectorAll('[id$="result"]').forEach(result => result.textContent = '');
    const elements = {
        score: getElementSafe('score'),
        customDiceContainer: getElementSafe('custom-dice-container'),
        playerCards: getElementSafe('player-cards'),
        dealerCards: getElementSafe('dealer-cards'),
        blackjackStart: getElementSafe('blackjack-start'),
        blackjackHit: getElementSafe('blackjack-hit'),
        blackjackStand: getElementSafe('blackjack-stand')
    };
    if (elements.score) elements.score.textContent = '';
    if (elements.customDiceContainer) elements.customDiceContainer.innerHTML = '';
    if (elements.playerCards) elements.playerCards.innerHTML = '';
    if (elements.dealerCards) elements.dealerCards.innerHTML = '';
    if (elements.blackjackStart) elements.blackjackStart.style.display = 'inline-block';
    if (elements.blackjackHit) elements.blackjackHit.style.display = 'none';
    if (elements.blackjackStand) elements.blackjackStand.style.display = 'none';
    if (elements.blackjackHit) elements.blackjackHit.disabled = true;
    if (elements.blackjackStand) elements.blackjackStand.disabled = true;
    blackjackState.reset();
}

// == Jogos - Funções Auxiliares ==
/**
 * Cria um baralho completo.
 * @returns {Object[]} Array de cartas.
 */
function createDeck() {
    const suits = ['Copas', 'Ouros', 'Espadas', 'Paus'];
    const values = ['Ás', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Valete', 'Dama', 'Rei'];
    const deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({
                suit,
                value,
                numericValue: value === 'Ás' ? [1, 11] : ['Valete', 'Dama', 'Rei'].includes(value) ? 10 : parseInt(value)
            });
        }
    }
    return deck;
}

/**
 * Embaralha um baralho.
 * @param {Object[]} deck - Array de cartas.
 * @returns {Object[]} Baralho embaralhado.
 */
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

/**
 * Calcula o valor de uma mão de cartas.
 * @param {Object[]} hand - Array de cartas.
 * @returns {number} Valor total da mão.
 */
function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    for (const card of hand) {
        if (card.value === 'Ás') {
            aces++;
        } else {
            value += card.numericValue;
        }
    }
    for (let i = 0; i < aces; i++) {
        value += (value + 11 <= 21) ? 11 : 1;
    }
    return value;
}

/**
 * Exibe uma mão de cartas no contêiner especificado.
 * @param {Object[]} hand - Array de cartas.
 * @param {string} containerId - ID do contêiner.
 * @param {boolean} [hidden=false] - Oculta a segunda carta (para dealer).
 */
function displayHand(hand, containerId, hidden = false) {
    const container = getElementSafe(containerId);
    if (container) {
        container.innerHTML = '';
        hand.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.setAttribute('aria-label', `Carta ${index + 1}: ${hidden && index === 1 ? 'oculta' : `${card.value} de ${card.suit}`}`);
            cardElement.textContent = hidden && index === 1 ? '' : `${card.value} de ${card.suit}`;
            removeAnimation(cardElement, 'card-flip');
            container.appendChild(cardElement);
        });
    }
}

// == Jogos - Estado de Blackjack ==
const blackjackState = {
    deck: [],
    playerHand: [],
    dealerHand: [],
    gameActive: false,
    reset() {
        this.deck = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.gameActive = false;
    }
};

// == Jogos - Implementações ==
// Jogo 0: Cara ou Coroa
function startCoinToss() {
    disableButtons('dados');
    const result = Math.random() < 0.5 ? 'cara' : 'coroa';
    const bet = getElementSafe('coin-bet')?.value;
    const coinElement = getElementSafe('coin');
    const resultElement = getElementSafe('game0-result');
    if (coinElement) {
        coinElement.textContent = translate(result);
        removeAnimation(coinElement, 'coin-flip');
    }
    const win = bet === result;
    if (resultElement) {
        resultElement.textContent = win ? translate('win-message') : translate('lose-message');
    }
    saveResult(0, win);
}

// Jogo 1: Rolar Dados
function startRollDice() {
    disableButtons('passatempos');
    const dice1 = rollDie();
    const dice2 = rollDie();
    const sum = dice1 + dice2;
    const elements = {
        dice1: getElementSafe('dice1'),
        dice2: getElementSafe('dice2'),
        sum: getElementSafe('sum')
    };
    if (elements.dice1) {
        elements.dice1.textContent = dice1;
        removeAnimation(elements.dice1, 'dice-roll');
    }
    if (elements.dice2) {
        elements.dice2.textContent = dice2;
        removeAnimation(elements.dice2, 'dice-roll');
    }
    if (elements.sum) elements.sum.textContent = sum;
}

// Jogo 2: Maior ou Menor
function startHigherLower() {
    disableButtons('dados');
    const dice1 = rollDie();
    const dice2 = rollDie();
    const sum = dice1 + dice2;
    const bet = getElementSafe('bet')?.value;
    const elements = {
        dice1: getElementSafe('dice2-1'),
        dice2: getElementSafe('dice2-2'),
        sum: getElementSafe('sum2'),
        result: getElementSafe('game2-result')
    };
    if (elements.dice1) {
        elements.dice1.textContent = dice1;
        removeAnimation(elements.dice1, 'dice-roll');
    }
    if (elements.dice2) {
        elements.dice2.textContent = dice2;
        removeAnimation(elements.dice2, 'dice-roll');
    }
    if (elements.sum) elements.sum.textContent = sum;
    const win = (bet === 'maior' && sum > 7) || (bet === 'menor' && sum < 7);
    if (elements.result) {
        elements.result.textContent = `${translate('sum-label')} ${sum}. ${win ? translate('win-message') : translate('lose-message')}`;
    }
    saveResult(2, win);
}

// Jogo 3: Par ou Ímpar
function startOddEven() {
    disableButtons('dados');
    const dice1 = rollDie();
    const dice2 = rollDie();
    const sum = dice1 + dice2;
    const bet = getElementSafe('parity-bet')?.value;
    const elements = {
        dice1: getElementSafe('dice3-1'),
        dice2: getElementSafe('dice3-2'),
        sum: getElementSafe('sum3'),
        result: getElementSafe('game3-result')
    };
    if (elements.dice1) {
        elements.dice1.textContent = dice1;
        removeAnimation(elements.dice1, 'dice-roll');
    }
    if (elements.dice2) {
        elements.dice2.textContent = dice2;
        removeAnimation(elements.dice2, 'dice-roll');
    }
    if (elements.sum) elements.sum.textContent = sum;
    const win = (bet === 'par' && sum % 2 === 0) || (bet === 'impar' && sum % 2 !== 0);
    if (elements.result) {
        elements.result.textContent = `${translate('sum-label')} ${sum}: ${win ? translate('win-message') : translate('lose-message')}`;
    }
    saveResult(3, win);
}

// Jogo 4: Aposta na Soma Exata
function startExactSum() {
    disableButtons('dados');
    const dice1 = rollDie();
    const dice2 = rollDie();
    const sum = dice1 + dice2;
    const bet = parseInt(getElementSafe('number')?.value);
    const resultElement = getElementSafe('game4-result');
    if (isNaN(bet) || bet < 2 || bet > 12) {
        if (resultElement) resultElement.textContent = translate('invalid-bet-message');
        return;
    }
    const elements = {
        dice1: getElementSafe('dice4-1'),
        dice2: getElementSafe('dice4-2'), // Corrigido de 'dice4-d2'
        sum: getElementSafe('sum4')
    };
    if (elements.dice1) {
        elements.dice1.textContent = dice1;
        removeAnimation(elements.dice1, 'dice-roll');
    }
    if (elements.dice2) {
        elements.dice2.textContent = dice2;
        removeAnimation(elements.dice2, 'dice-roll');
    }
    if (elements.sum) elements.sum.textContent = sum;
    const win = bet === sum;
    if (resultElement) {
        resultElement.textContent = `${translate('sum-label')} ${sum}: ${win ? translate('win-message') : translate('lose-message')}`;
    }
    saveResult(4, win);
}

// Jogo 5: Três ou Nada
function startThreeOrNothing() {
    disableButtons('dados');
    const dice1 = rollDie();
    const dice2 = rollDie();
    const dice3 = rollDie();
    const sum = dice1 + dice2 + dice3;
    const elements = {
        dice1: getElementSafe('dice5-1'),
        dice2: getElementSafe('dice5-2'),
        dice3: getElementSafe('dice5-3'),
        sum: getElementSafe('sum5'),
        result: getElementSafe('game5-result')
    };
    if (elements.dice1) {
        elements.dice1.textContent = dice1;
        removeAnimation(elements.dice1, 'dice-roll');
    }
    if (elements.dice2) {
        elements.dice2.textContent = dice2;
        removeAnimation(elements.dice2, 'dice-roll');
    }
    if (elements.dice3) {
        elements.dice3.textContent = dice3;
        removeAnimation(elements.dice3, 'dice-roll');
    }
    if (elements.sum) elements.sum.textContent = sum;
    const win = sum % 3 === 0;
    if (elements.result) {
        elements.result.textContent = `${translate('sum-label')} ${sum}: ${win ? translate('win-message') : translate('lose-message')}`;
    }
    saveResult(5, win);
}

// Jogo 6: Vinte e Um
function startBlackjack() {
    disableButtons('cartas');
    blackjackState.deck = shuffleDeck(createDeck());
    blackjackState.playerHand = [blackjackState.deck.pop(), blackjackState.deck.pop()];
    blackjackState.dealerHand = [blackjackState.deck.pop(), blackjackState.deck.pop()];
    blackjackState.gameActive = true;

    displayHand(blackjackState.playerHand, 'player-cards');
    displayHand(blackjackState.dealerHand, 'dealer-cards', true);
    updateBlackjackScore();

    const elements = {
        start: getElementSafe('blackjack-start'),
        hit: getElementSafe('blackjack-hit'),
        stand: getElementSafe('blackjack-stand')
    };
    if (elements.start) elements.start.style.display = 'none';
    if (elements.hit) {
        elements.hit.style.display = 'inline-block';
        elements.hit.disabled = false;
    }
    if (elements.stand) {
        elements.stand.style.display = 'inline-block';
        elements.stand.disabled = false;
    }

    if (calculateHandValue(blackjackState.playerHand) === 21) {
        stand();
    }
}

function hit() {
    if (!blackjackState.gameActive) return;
    blackjackState.playerHand.push(blackjackState.deck.pop());
    displayHand(blackjackState.playerHand, 'player-cards');
    updateBlackjackScore();

    if (calculateHandValue(blackjackState.playerHand) > 21) {
        endBlackjackGame(false, translate('bust-message'));
    }
}

function stand() {
    if (!blackjackState.gameActive) return;
    blackjackState.gameActive = false;

    const elements = {
        hit: getElementSafe('blackjack-hit'),
        stand: getElementSafe('blackjack-stand')
    };
    if (elements.hit) elements.hit.disabled = true;
    if (elements.stand) elements.stand.disabled = true;

    let dealerValue = calculateHandValue(blackjackState.dealerHand);
    while (dealerValue < 17) {
        blackjackState.dealerHand.push(blackjackState.deck.pop());
        dealerValue = calculateHandValue(blackjackState.dealerHand);
    }

    displayHand(blackjackState.dealerHand, 'dealer-cards', false);
    updateBlackjackScore();

    const playerValue = calculateHandValue(blackjackState.playerHand);
    let win = false;
    let message = '';

    if (playerValue > 21) {
        message = translate('bust-message');
    } else if (dealerValue > 21) {
        win = true;
        message = translate('dealer-bust');
    } else if (playerValue > dealerValue) {
        win = true;
        message = translate('win-message');
    } else if (playerValue < dealerValue) {
        message = translate('lose-message');
    } else {
        message = translate('tie-message');
    }

    endBlackjackGame(win, message);
}

function updateBlackjackScore() {
    const playerValue = calculateHandValue(blackjackState.playerHand);
    const dealerValue = blackjackState.gameActive ? '?' : calculateHandValue(blackjackState.dealerHand);
    const scoreElement = getElementSafe('score');
    if (scoreElement) {
        scoreElement.textContent = `${translate('player-label')} ${playerValue}, ${translate('dealer-label')} ${dealerValue}`;
    }
}

function endBlackjackGame(win, message) {
    const elements = {
        result: getElementSafe('game6-result'),
        start: getElementSafe('blackjack-start'),
        hit: getElementSafe('blackjack-hit'),
        stand: getElementSafe('blackjack-stand')
    };
    if (elements.result) elements.result.textContent = message;
    saveResult(6, win);
    if (elements.start) elements.start.style.display = 'inline-block';
    if (elements.hit) elements.hit.style.display = 'none';
    if (elements.stand) elements.stand.style.display = 'none';
}

// Jogo 7: Maior Carta
function startHigherCard() {
    disableButtons('cartas');
    const deck = shuffleDeck(createDeck());
    const playerCard = deck.pop();
    const dealerCard = deck.pop();
    const elements = {
        player: getElementSafe('player-card'),
        dealer: getElementSafe('dealer-card2'),
        result: getElementSafe('game7-result')
    };
    if (elements.player) {
        elements.player.textContent = `${playerCard.value} de ${playerCard.suit}`;
        removeAnimation(elements.player, 'card-flip');
    }
    if (elements.dealer) {
        elements.dealer.textContent = `${dealerCard.value} de ${dealerCard.suit}`;
        removeAnimation(elements.dealer, 'card-flip');
    }
    const playerValue = playerCard.numericValue === [1, 11] ? 1 : playerCard.numericValue;
    const dealerValue = dealerCard.numericValue === [1, 11] ? 1 : dealerCard.numericValue;
    const win = playerValue > dealerValue;
    if (elements.result) {
        elements.result.textContent = win ? translate('win-message') : translate('lose-message');
    }
    saveResult(7, win);
}

// Jogo 8: Par Perfeito
function startPerfectPair() {
    disableButtons('cartas');
    const deck = shuffleDeck(createDeck());
    const card1 = deck.pop();
    const card2 = deck.pop();
    const elements = {
        card1: getElementSafe('card8-1'),
        card2: getElementSafe('card8-2'),
        result: getElementSafe('game8-result')
    };
    if (elements.card1) {
        elements.card1.textContent = `${card1.value} de ${card1.suit}`;
        removeAnimation(elements.card1, 'card-flip');
    }
    if (elements.card2) {
        elements.card2.textContent = `${card2.value} de ${card2.suit}`;
        removeAnimation(elements.card2, 'card-flip');
    }
    const win = card1.value === card2.value;
    if (elements.result) {
        elements.result.textContent = win ? translate('win-message') : translate('lose-message');
    }
    saveResult(8, win);
}

// Jogo 9: Soma 13
function startSum13() {
    disableButtons('cartas');
    const deck = shuffleDeck(createDeck());
    const card1 = deck.pop();
    const card2 = deck.pop();
    const elements = {
        card1: getElementSafe('card9-1'),
        card2: getElementSafe('card9-2'),
        sum: getElementSafe('sum9'),
        result: getElementSafe('game9-result')
    };
    if (elements.card1) {
        elements.card1.textContent = `${card1.value} de ${card1.suit}`;
        removeAnimation(elements.card1, 'card-flip');
    }
    if (elements.card2) {
        elements.card2.textContent = `${card2.value} de ${card2.suit}`;
        removeAnimation(elements.card2, 'card-flip');
    }
    const value1 = card1.numericValue === [1, 11] ? 1 : card1.numericValue;
    const value2 = card2.numericValue === [1, 11] ? 1 : card2.numericValue;
    const sum = value1 + value2;
    if (elements.sum) elements.sum.textContent = sum;
    const win = sum === 13;
    if (elements.result) {
        elements.result.textContent = `${translate('sum-label')} ${sum}: ${win ? translate('win-message') : translate('lose-message')}`;
    }
    saveResult(9, win);
}

// Jogo 10: Naipe Certo
function startSuitGuess() {
    disableButtons('cartas');
    const deck = shuffleDeck(createDeck());
    const card = deck.pop();
    const bet = getElementSafe('suit-bet')?.value?.toLowerCase();
    const elements = {
        card: getElementSafe('card10'),
        result: getElementSafe('game10-result')
    };
    if (elements.card) {
        elements.card.textContent = `${card.value} de ${card.suit}`;
        removeAnimation(elements.card, 'card-flip');
    }
    const win = card.suit.toLowerCase() === bet;
    if (elements.result) {
        elements.result.textContent = win ? translate('win-message') : translate('lose-message');
    }
    saveResult(10, win);
}

// Jogo 11: Rolador de Dados
function startRollCustomDice() {
    disableButtons('passatempos');
    const diceType = getElementSafe('dice-type')?.value;
    const quantity = parseInt(getElementSafe('dice-quantity')?.value);
    const sumElement = getElementSafe('sum11');
    if (isNaN(quantity) || quantity < 1 || quantity > 5) {
        if (sumElement) sumElement.textContent = translate('invalid-quantity-message');
        return;
    }
    const sides = parseInt(diceType.replace('d', ''));
    const results = [];
    let sum = 0;
    for (let i = 0; i < quantity; i++) {
        const roll = rollDie(sides);
        results.push(roll);
        sum += roll;
    }
    const container = getElementSafe('custom-dice-container');
    if (container) {
        container.innerHTML = results.map((roll, i) => `
            <div class="dice${sides === 20 ? ' d20' : ''}" aria-label="Dado ${i + 1}">${roll}</div>
        `).join('');
        container.querySelectorAll('.dice').forEach(dice => removeAnimation(dice, 'dice-roll'));
    }
    if (sumElement) sumElement.textContent = sum;
}

// == Inicialização ==
document.addEventListener('DOMContentLoaded', () => {
    setRandomNotice();
    const elements = {
        coins: getElementSafe('coins'),
        level: getElementSafe('level')
    };
    if (elements.coins) elements.coins.textContent = state.coins;
    if (elements.level) {
        elements.level.textContent = `${translate(titles[Math.min(state.level - 1, titles.length - 1)])} (${state.reputation % 100}/100)`;
    }
    applyTranslations();
    resetGames();
    checkAchievements();
});