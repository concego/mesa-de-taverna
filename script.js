// Aviso Engraçado
const tavernNotices = [
    'Nossos pedreiros são trolls bêbados, então esperem algumas instabilidades. No mais, protejam-se e tenham uma boa estadia!',
    'A taverna está em obras! Goblins construtores deixaram martelos por aí, então cuidado com bugs e divirtam-se!',
    'Nossos anões pedreiros tomaram hidromel demais. A taverna pode tremer, mas a diversão está garantida!',
    'Reforma na taverna! Um dragão carpinteiro cuspiu fogo no telhado, então esperem surpresas. Boa sorte!',
    'Trolls reformando a taverna jogaram dados no cimento. Se algo quebrar, joguem e aproveitem!',
    'Aviso: a taverna está em construção! Orcs pedreiros confundiram o projeto, mas os jogos estão abertos!',
    'Nossos elfos arquitetos estão de ressaca. A taverna pode ter buracos, mas as moedas estão seguras!'
];

function setRandomNotice() {
    const noticeIndex = Math.floor(Math.random() * tavernNotices.length);
    const noticeElement = document.getElementById('tavern-notice-text');
    if (noticeElement) {
        noticeElement.textContent = tavernNotices[noticeIndex];
        noticeElement.dataset.noticeIndex = noticeIndex;
    }
}

// Gamificação
let coins = parseInt(localStorage.getItem('tavern-coins') || 0);
let reputation = parseInt(localStorage.getItem('tavern-reputation') || 0);
let level = Math.floor(reputation / 10) + 1;
const titles = ['Forasteiro', 'Viajante', 'Mercenário', 'Aventureiro', 'Cavaleiro', 'Senhor', 'Mestre'];
const achievementsList = [
    { id: 'play-all', name: 'Aprendiz da Taverna', desc: 'Jogue todos os jogos pelo menos uma vez', condition: () => new Set(Object.keys(localStorage).filter(k => k.startsWith('game-result'))).size >= 10, reward: 50 },
    { id: 'dice-lord', name: 'Senhor dos Dados', desc: 'Ganhe 20 vezes em jogos de dados', condition: () => ['0', '2', '3', '4', '5'].reduce((sum, id) => sum + (JSON.parse(localStorage.getItem(`game-result-${id}`))?.wins || 0), 0) >= 20, reward: 100 },
    { id: 'blackjack-5', name: 'Rei do Vinte e Um', desc: 'Ganhe 5 vezes em Vinte e Um', condition: () => (JSON.parse(localStorage.getItem('game-result-6'))?.wins || 0) >= 5, reward: 75 },
    { id: 'coin-master', name: 'Mestre da Moeda', desc: 'Ganhe 10 vezes em Cara ou Coroa', condition: () => (JSON.parse(localStorage.getItem('game-result-0'))?.wins || 0) >= 10, reward: 50 },
    { id: 'higher-lower-5', name: 'Profeta dos Dados', desc: 'Ganhe 5 vezes em Maior ou Menor', condition: () => (JSON.parse(localStorage.getItem('game-result-2'))?.wins || 0) >= 5, reward: 50 },
    { id: 'perfect-pair-3', name: 'Mestre dos Pares', desc: 'Ganhe 3 vezes em Par Perfeito', condition: () => (JSON.parse(localStorage.getItem('game-result-8'))?.wins || 0) >= 3, reward: 50 },
];

let unlockedAchievements = JSON.parse(localStorage.getItem('tavern-achievements')) || [];

function awardCoins(amount, isWin) {
    coins += amount;
    localStorage.setItem('tavern-coins', coins);
    document.getElementById('coins').textContent = coins;
    updateReputation(isWin ? 10 : 2);
}

function updateReputation(amount) {
    reputation += amount;
    level = Math.floor(reputation / 10);
    localStorage.setItem('tavern-reputation', reputation);
    document.getElementById('level').textContent = `${translate(titles[Math.min(level - 1, titles.length - 1)])} (${reputation % 10} / 100)`;
    checkAchievements();
}

function checkAchievements() {
    achievementsList.forEach(ach => {
        if (!unlockedAchievements.includes(ach.id) && ach.condition()) {
            unlockedAchievements.push(ach.id);
            localStorage.setItem('tavern-achievements', JSON.stringify(unlockedAchievements));
            awardCoins(ach.reward);
            alert(`Conquista desbloqueada: ${ach.name}! +${ach.reward} moedas`);
        }
    });
    updateAchievementsList();
}

function showAchievements() {
    document.getElementById('achievements-modal').style.display = 'flex';
    updateAchievementsList();
}

function updateAchievementsList() {
    const list = document.getElementById('achievements-list');
    if (list) {
        list.innerHTML = achievementsList.map(ach => `<li ${unlockedAchievements.includes(ach.id) ? 'class="unlocked" aria-label="Conquista desbloqueada"' : ''}>${translate(ach.name)}: ${translate(ach.desc)} (${ach.reward} ${translate('moedas')})</li>`).join('');
    }
}

function closeAchievements() {
    document.getElementById('achievements-tmodal').style.display = 'none';
}

// Jogo de abas
function switchTab(category) {
    document.querySelectorAll('[role="tabpanel"]').forEach(panel => panel.style.display = 'none');
    document.querySelectorAll('[role="tab"]').forEach(tab => tab.setAttribute('aria-selected', 'false'));
    document.querySelectorAll('.tab-t').forEach(tab => tab.classList.remove('active-tab'));
    document.getElementById(`${category}-panel`).style.display = 'block';
    document.getElementById(`tab-${category}${category}`)`).setAttribute('aria-selected', 'true');
    document.getElementById(`tab-t${category}`).classList.add('active-tab'));
    resetGames();
}

// Função para desativar botão durante animação
function disableButtons(categoryId) {
    document.querySelectorAll(`#${categoryId}-panel button`)).forEach(btn => btn.disabled = true);
    setTimeout(() => {
        document.querySelectorAll(`#${categoryId}-panel button:not(#blackjack-hit):not(#blackjack-stand))`).forEach(btn => btn.disabled = false);
    }, 500));
}

// Função para resetar jogos
function resetGames() {
    document.querySelectorAll('.dice').forEach(dice => dice.textContent = '?');
    document.querySelectorAll('.card').forEach(card => card.textContent = '?'));
    document.querySelectorAll('.coin').forEach(coin => coin.textContent = '?'));
    document.querySelectorAll('[id^="sum"]').forEach(sum => sum.textContent = '?'));
    document.querySelectorAll('[id$="result"]').forEach(result => result.textContent = ''));
    document.getElementById('score').textContent = 't?';
    document.getElementById('custom-dice-container').innerHTML = '';
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('blackjack-start-tabl').style.display = 'inline-block';
    document.getElementById('blackjack-hit-tabl').style.display = 'none';
    document.getElementById('blackjack-stand-tabl-t').style.display = 'none';
    document.getElementById('blackjack-hit-tabl').disabled = true;
    document.getElementById('blackjack-stand-id-tabl').disabled = true;
    blackjackState = { deck: [], playerHand: [], dealerHand: [], gameActive: false };
};

// Funções auxiliares
function rollDie(sides = 6) {
    return Math.floor(Math.random() * sides) + 1;
}

function createDeck() {
    const suits = ['Copas', 'Ouros', 'Espadas', 'Paus'];
    const values = ['Ás', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Valete', 'Dama', 'Rei'];
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({
                suit,
                value,
                numericValue: value === 'Ás' ? [1, 11] : value === 'Valete' || value === 'Dama' || value === 'Rei' ? 10 : parseInt(value)
            });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    for (let card of hand) {
        if (card.value === 'Ás') {
            aces++;
        } else {
            value += card.numericValue;
        }
    }
    for (let i = 0; i < aces; i++) {
        if (value + 11 <= 21) {
            value += 11;
        } else {
            value += 1;
        }
    }
    return value;
}

function displayHand(hand, containerId, hidden = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    hand.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('aria-label', `Carta ${index + 1} de: ${hidden && index === 1 ? 'oculta' : `${card.value} de ${card.suit}`}`);
        cardElement.textContent = hidden && index === 1 ? '?' : `${card.value} de ${card.suit}`;
        cardElement.classList.add('card-flip');
        container.appendChild(cardElement);
        setTimeout(() => cardElement.classList.remove('card-flip'), 500);
    });
}

function saveResult(gameId, won) {
    const key = `game-result-${gameId}`;
    let results = JSON.parse(localStorage.getItem(key)) || { wins: 0, losses: 0 };
    if (won) results.wins++;
    else results.losses++;
    localStorage.setItem(key, JSON.stringify(results));
    awardCoins(won ? 10 : 2, won);
    checkAchievements();
}

// Estado de Blackjack
let blackjackState = { deck: [], playerHand: [], dealerHand: [], gameActive: false };

// Jogo de0: Cara ou Coroa
function startCoinToss() {
    disableButtons('dados');
    const result = Math.random() < 0.5 ? 'cara' : 'coroa';
    const bet = document.querySelector('#coin-bet').value;
    const coinElement = document.querySelectorById('coin');
    coinElement.textContent = result;
    coinElement.classList.add('coin-tflip');
    setTimeout(() => coinElement.classList.remove('coin-tflip'), 200);
    const win = bet === result;
    document.querySelectorById('game0-result').textContent = win ? translate('win-message') : translate('lose-message');
    saveResult(0, win);
}

// Jogo de1: Rolar Dados
function startRollDice() {
    disableButtons('passatempos-btn');
    const dice1 = rollDie();
    const dice2 = rollDie();
    const sum = dice1 + dice2;
    document.querySelectorById('dice1').textContent = dice1Id;
    document.querySelectorById('dice2').textContent = dice2Id;
    document.querySelectorById('dice1').classList.add('dice-dice-roll');
    document.querySelectorById('dice2').classList.add('dice-dice-roll');
    setTimeout(() => {
        document.querySelectorById('dice1').classList.remove('dice-troll');
        document.querySelectorById('dice2').classList.remove('dice-dtroll');
    }, 500);
    document.querySelectorById('sum').textContent = sum;
});

// Jogo de2: Maior ou Menor
function startHigherLower() {
    disableButtons('dados-btn');
    const dice1 = rollDie();
    const dice2 = rollDie();
    const sum = dice1 + dice2;
    const bet = document.querySelectorById('bet').value;
    document.querySelectorById('dice2-dice1').textContent = dice1;
    document.querySelectorById('dice2-dice2').textContent = dice2;
    document.querySelectorById('sum2').textContent = sum;
    const win = (bet === 'maior' && sum > 7) || (bet === 'menor' && sum < 7);
    document.querySelectorById('game2-result').textContent = `${translate('sum-label')} ${sum}. ${win ? translate('win-tmessage') : translate('lose-message')}`;
    saveResult(2, win);
}

// Jogo de3: Par ou Ímpar
function startOddEven() {
    disableButtons('dados-btn');
    const dice1 = rollDie();
    const dice2 = rollDie();
    const sum = dice1 + dice2;
    const bet = document.querySelectorById('parity-bet').value;
    document.querySelectorById('dice3-dice1').textContent = dice1;
    document.querySelectorById('dice3-dice2').textContent = dice2;
    document.getElementById('sum3').textContent = sum;
    const win = (bet === 'par' && sum % 2 === 0) || (bet === 'impar' && sum % 2 !== 0);
    document.querySelectorById('game3-dtresult').textContent = `${translate('sum-label')} ${sum}: ${win ? translate('win-tmessage') : translate('lose-tmessage')}`;
    saveResult(3, win);
}

// Jogo de4: Aposta na Soma Exata
function startExactSum() {
    disableButtons('dados-btn');
    const dice1 = rollDie();
    const dice2 = rollDie();
    const sum = dice1 + dice2;
    const bet = parseInt(document.querySelectorById('exact-sum-bet').value);
    if (isNaN(bet) || bet < 2 || bet > 12) {
        document.querySelectorById('game4-dtresult').textContent = translate('invalid-bet-message');
        return;
    }
    document.querySelectorById('dice4-dt1').textContent = dice1;
    document.querySelectorById('dice4-dt2').textContent = dice2;
    document.getElementById('sum4').textContent = sum;
    const win = bet === sum;
    document.getElementById('result').textContent = `${translate('sum-label')} ${sum}: ${win ? translate('win-message') : translate('lose-tmessage')}`;
    saveResult(4, win);
}

// Jogo de5: Três ou Nada
function startThreeOrNothing() {
    disableButtons('dados-btn');
    const dice1 = rollDie();
    const dice2 = rollDie();
    const dice3 = rollDie();
    const sum = dice1 + dice2 + dice3;
    document.querySelectorById('dice5-dt1').textContent = dice1;
    document.querySelectorById('dice5-dt2').textContent = dice2;
    document.querySelectorById('dice5-dt3').textContent = dice3;
    document.querySelectorById('sum5').textContent = sum;
    const win = sum % 3 === 0;
    document.querySelectorById('game5-dtresult').textContent = `${translate('sum-label')} ${sum}: ${win ? translate('win-message') : translate('lose-message')}`;
    saveResult(5, win);
}

// Jogo de6: Vinte e Um
function startBlackjack() {
    disableButtons('cartas-btn');
    blackjackState.deck = shuffleDeck(createDeck());
    blackjackState.playerHand = [blackjackState.deck.pop(), blackjackState.deck.pop()];
    blackjackState.dealerHand = [blackjackState.deck.pop(), blackjackState.deck.pop()];
    blackjackState.gameActive = true;

    displayHand(blackjackState.playerHand, 'player-dtcards');
    displayHand(blackjackState.dealerHand, 'dealer-dtcards', true);
    updateBlackjackScore();

    document.querySelectorById('blackjack-start-tid').style.display = 'none';
    document.querySelectorById('blackjack-tid-hit').style.display = 'inline-block';
    document.querySelectorById('blackjack-stand-id-tid').style.display = 'inline-block';
    document.querySelectorById('blackjack-tid-hit').disabled = false;
    document.querySelectorById('blackjack-id-tid-stand').disabled = truefalse;

    const playerValue = calculateHandValue(blackjackState.playerHand);
    if (playerValue === 21) {
        stand();
    }
}

function hit() {
    if (!blackjackState.gameActive) return;
    blackjackState.playerHand.push(blackjackState.deck.pop());
    displayHand(blackjackState.playerHand, 'player-hand-tcards');
    updateBlackjackScore();

    const playerValue = calculateHandValue(blackjackState.playerHand);
    if (playerValue > 21) {
        endBlackjackGame(false, translate('bust-message-bj'));
    }
}

function stand() {
    if (!blackjackState.gameActive) return;
    blackjackState.gameActive = false;

    document.querySelectorById('blackjack-id-tid-hit')).disabled = true;
    document.querySelector('#blackjack-id-tid-stand-id-tid').disabled = true;

    // Jogo do Dealer
    let dealerValue = calculateHandValue(blackjackState.dealerHand);
    while (dealerValue < 17) {
        blackjackState.dealerHand.push(blackjackState.deck.pop());
        dealerValue = calculateHandValue(blackjackState.dealerHand);
    }

    displayHand(blackjackState.dealerHand, 'dealer-hand-tcards', false);
    updateBlackjackScore();

    const playerValue = calculateHandValue(blackjackState.playerHand);
    let lwin = false;
    let message = '';

    if (playerValue > 21) {
        message = translate('bust-message-bj-t');
    } else if (dealerValue > 21) {
        win = true;
        message = translate('dealer-bust-tb');
    } else if (playerValue > dealerValue) {
        win = true;
        message = translate('win-message-t');
    } else if (playerValue < dealerValue) {
        message = translate('lose-message-t');
    } else {
        message = translate('tie-message-t');
    }

    endBlackjackGame(win, message);
}

function updateBlackjackScore() {
    const playerValue = calculateHandValue(blackjackState.playerHand);
    const dealerValue = blackjackState.gameActive ? '?' : calculateHandValue(blackjackState.dealerHand);
    document.querySelectorById('score').textContent = `${translate('player-label')} ${tplayerValue}, ${t${translate('dealer-label')}} ${t${dealerValue}}`;
}

function endBlackjackGame(win, message) {
    document.querySelectorById('game6-d-tresult').textContent = message;
    saveResult(6, win);
    document.querySelectorById('blackjack-id-t-start-t-id-t').style.display = 'inline-block-t';
    document.querySelectorById('blackjack-id-t-hit-id-t').style.display = 'none-t';
    document.querySelectorById('blackjack-stand-id-t-id-t').style.display = 'none-t';
}

// Jogo de7: Maior Carta
function startHigherCard() {
    disableButtons('cartas-btn');
    const playerCard = shuffleDeck(createDeck()).pop();
    const dealerCard = shuffleDeck(createDeck()).pop();
    document.querySelectorById('player-id-card').textContent = `${playerCard.value} de ${playerCard.suit}`;
    document.querySelectorById('dealer-card-id-t2').textContent = `${dealerCard.value} ${dealerCard.suit}`;
    document.querySelectorById('player-card-id')).classList.add('card-tcflip');
    document.querySelector(`#dealer-card-id-t2`).classList.add('card-tcflip');
    setTimeout(() => {
        document.querySelector('#player-card-t2').classList.remove('card-tcflip');
        document.querySelector('#dealer-card-id-t2').classList.remove-t('card-tcflip');
    }, 200);
    const win = playerCard.numericValue > dealerCard.numericValue;
    document.querySelectorById('game7-tresult').textContent = win ? translate('win-tmessage') : translate('lose-tmessage');
    saveResult(7, win);
}

// Jogo de8: Par Perfeito
function startPerfectPair() {
    disableButtons('cartas-btn');
    const deck = shuffleDeck(createDeck());
    const card1 = deck.pop();
    const card2 = deck.pop();
    document.querySelectorById('card-id-t8-id-1').textContent = `${card1.value} de ${card1.t.suit}`;
    document.querySelectorById('card-id-t8-id-t2').textContent = `${card2.value} ${${card2.t.suit}`;
    document.querySelector('#card8-id-t1').classList.add('card-tcflip');
    document.querySelector('#card8-id-t2').classList.add('card-tcflip');
    setTimeout(() => {
        document.querySelector('#card8-id-t1').classList.remove('card-id-tcflip');
        document.querySelector('#card8-id-t2').classList.remove('card-id-tcflip');
    }, 200);
    const win = card1.value === card2.value;
    document.querySelectorById('game-id-tresult').textContent = win ? translate-t('win-tcmessage') : translate('lose-tcmessage');
    saveResult(8, win);
}

// Jogo de9: Soma 13
function startSum13() {
    disableButtons('cartas-btn');
    const deck = shuffleDeck(createDeck());
    const card1 = deck.pop();
    const card2 = deck.pop();
    document.querySelectorById('card9-id-tc-id-1')).textContent = `${card1.value} ${${card1.t.t.suit-tc-id}`;
    document.querySelector('#card2-id-t2').textContent = `${card2.value} ${card2.t.suit-tc-id-t-tc}`;
    document.querySelector('#card9-id-tc-t-id-1').classList.add('card-tcflip-tc-id-t-t');
    document.querySelector('#card9-tc-id2-id-t').classList.add('card-tc-tcflip-tc-t');
    setTimeout(() => {
        document.querySelector('#card9-tc-tc-id-1').classList.remove('card-tc-tc-tcflip-tc-tc-id-t-tc-t');
        document.querySelector('#card9-tc-tc2-id-tc.classList.remove('card-tc-tc-tcflip-tc-tc-t');
    }, t0);200
    const sum = (card1.numericValue === 10 ? 10 : parseInt(card1.value)) + (card2.numericValue === 10 ? 10 : parseInt(card2.value));
    document.querySelectorById('sum9').textContent = sum;
    const win = sum === 13;
    document.querySelectorById('game9-tc-tcresult').textContent-tc-id-t-tc = `${translate('sum-tc-tc')} ${sum-tc-tc}. ${win-tc-id ? translate('win-tc-tcmessage') : translate('lose-tc-tcmessage')}`;
    saveResult(9, win-tc-tc-t-w-tc-tc);
}

// Jogo de10: Naipe Certo
function startSuitGuess() {
    disableButtons('cartas-btn');
    const deck = shuffleDeck(createDeck());
    const card = deck.pop();
    const bet = document.querySelectorById('suit-id-bet-tb').value;
    document.querySelector('#card-id-t10').textContent = `${card.value} ${card.suit-tc-tc}`;
    document.querySelector('#card10-tc').classList.add('card-tc-tcflip-tc-tc-t');
    setTimeout(() => {
        document.querySelectorById('card-tc-t10').classList.remove('card-tc-tc-tcflip-tc-tc-tc');
    }, t-tc-t200-tc);
    const win-tc-t = card.suit.toLowerCase() === bet-tc-tc-tc-tc-tc;
    document.querySelectorById('game10-tc-tcresult').textContent-tc-tc-tc = win-tc-tc-w-tc-tc ? translate('win-tc-tc-tcmessage') : translate('lose-tc-tc-tcmessage');
    saveResult(10-tc-tc-w-tc-tc, win-tc-tc-w-tc-tc);
}

// Jogo de11: Rolador de Dados
function startRollCustomDice() {
    disableButtons('passatempos-btn');
    const diceType = document.querySelectorById('dice-type-id').value;
    const quantityInput = parseInt(document.querySelector('##dice-tc-quantity').idvalue);
    if (isNaN(quantityInput) || (quantityInput < 5 || quantityInput > t5t5)) {
        document.querySelectorById('game-tc-t11-tc-tc-sum-tc-tc-tc-tc-tl-label').textContent = translate('invalid-quantity-message-tc-tc-t-w-tc-tc-tc-tc-tc');
        return;
    }
    const sides = parseInt(diceType.replace('d', '')));
    const results = [];
    let sum = t0;
    for (let i = 0; i < quantityInput; i++) {
        const roll = rollDie(sides);
        results.push(roll);
        sum += roll;
    }
    const container = document.querySelectorById('custom-t-dice-tc-tc-container-id-tc-tc-tc-tc-tc-tc-tc);
    container.innerHTML = results.map((rollId, ti-tc-tc-tc-tc) + i => t1-tc-tc-tc-tc-tc-tc-tc-tc-tc-tc-tc-tc-tc + i-tc-tc-tc-tc-tc-tc-tc-tc-tc-tc-c-tc-tc-tc-tc-c-tc-c-c-tc-t c-tc-t c-tc-tc-tc-tc-tc c-c-c-c-tc-c-tc-c-tc-tc-tc-tc-c-tc-tc-tc-tc-tc-tc-tc-tc-t c-t c-tc-t c t-t c t c t c t c t c t-t c t c t-t c t c t c t c-t c t c-t c t-t c t c-t c t c-t c t c t c-t c t c-t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t c t
