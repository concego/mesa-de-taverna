// Funções auxiliares
function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

function getCard() {
    const suits = ['Copas', 'Ouros', 'Espadas', 'Paus'];
    const values = ['Ás', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Valete', 'Dama', 'Rei'];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    return { value, suit, numericValue: value === 'Ás' ? 1 : value === 'Valete' ? 11 : value === 'Dama' ? 12 : value === 'Rei' ? 13 : parseInt(value) };
}

function saveResult(game, won) {
    const key = `game-${game}-results`;
    let results = JSON.parse(localStorage.getItem(key)) || { wins: 0, losses: 0 };
    if (won) results.wins++;
    else results.losses++;
    localStorage.setItem(key, JSON.stringify(results));
    return results;
}

// Jogo 1: Rolar Dados
function rollDice() {
    const dice1 = rollDie();
    const dice2 = rollDie();
    document.getElementById('dice1').textContent = dice1;
    document.getElementById('dice2').textContent = dice2;
    document.getElementById('dice1').classList.add('dice-roll');
    document.getElementById('dice2').classList.add('dice-roll');
    setTimeout(() => {
        document.getElementById('dice1').classList.remove('dice-roll');
        document.getElementById('dice2').classList.remove('dice-roll');
    }, 500);
    document.getElementById('sum').textContent = dice1 + dice2;
}

// Jogo 2: Maior ou Menor
function playHigherLower() {
    const dice1 = rollDie();
    const dice2 = rollDie();
    const sum = dice1 + dice2;
    const bet = document.getElementById('bet').value;
    document.getElementById('dice2-1').textContent = dice1;
    document.getElementById('dice2-2').textContent = dice2;
    document.getElementById('sum2').textContent = sum;
    const result = (bet === 'maior' && sum > 7) || (bet === 'menor' && sum < 7) ? 'Você venceu!' : 'Você perdeu!';
    document.getElementById('game2-result').textContent = result;
    saveResult(2, result.includes('venceu'));
}

// Jogo 3: Par ou Ímpar
function playOddEven() {
    const dice1 = rollDie();
    const dice2 = rollDie();
    const sum = dice1 + dice2;
    const bet = document.getElementById('parity-bet').value;
    document.getElementById('dice3-1').textContent = dice1;
    document.getElementById('dice3-2').textContent = dice2;
    document.getElementById('sum3').textContent = sum;
    const result = (bet === 'par' && sum % 2 === 0) || (bet === 'impar' && sum % 2 !== 0) ? 'Você venceu!' : 'Você perdeu!';
    document.getElementById('game3-result').textContent = result;
    saveResult(3, result.includes('venceu'));
}

// Jogo 4: Aposta na Soma Exata
function playExactSum() {
    const dice1 = rollDie();
    const dice2 = rollDie();
    const sum = dice1 + dice2;
    const bet = parseInt(document.getElementById('exact-sum-bet').value);
    document.getElementById('dice4-1').textContent = dice1;
    document.getElementById('dice4-2').textContent = dice2;
    document.getElementById('sum4').textContent = sum;
    const result = bet === sum ? 'Você venceu!' : 'Você perdeu!';
    document.getElementById('game4-result').textContent = result;
    saveResult(4, result.includes('venceu'));
}

// Jogo 5: Três ou Nada
function playThreeOrNothing() {
    const dice1 = rollDie();
    const dice2 = rollDie();
    const dice3 = rollDie();
    const sum = dice1 + dice2 + dice3;
    document.getElementById('dice5-1').textContent = dice1;
    document.getElementById('dice5-2').textContent = dice2;
    document.getElementById('dice5-3').textContent = dice3;
    document.getElementById('sum5').textContent = sum;
    const result = sum % 3 === 0 ? 'Você venceu!' : 'Você perdeu!';
    document.getElementById('game5-result').textContent = result;
    saveResult(5, result.includes('venceu'));
}

// Jogo 6: Vinte e Um
function playBlackjack() {
    const playerCard = getCard();
    const dealerCard = getCard();
    document.getElementById('player-card').textContent = `${playerCard.value} de ${playerCard.suit}`;
    document.getElementById('dealer-card').textContent = `${dealerCard.value} de ${dealerCard.suit}`;
    document.getElementById('player-card').classList.add('card-flip');
    document.getElementById('dealer-card').classList.add('card-flip');
    setTimeout(() => {
        document.getElementById('player-card').classList.remove('card-flip');
        document.getElementById('dealer-card').classList.remove('card-flip');
    }, 500);
    const playerScore = playerCard.numericValue + getCard().numericValue;
    const dealerScore = dealerCard.numericValue + getCard().numericValue;
    document.getElementById('score').textContent = `Jogador: ${playerScore}, Mestre: ${dealerScore}`;
    const result = playerScore <= 21 && (playerScore > dealerScore || dealerScore > 21) ? 'Você venceu!' : 'Você perdeu!';
    document.getElementById('game6-result').textContent = result;
    saveResult(6, result.includes('venceu'));
}

// Jogo 7: Maior Carta
function playHigherCard() {
    const playerCard = getCard();
    const dealerCard = getCard();
    document.getElementById('player-card2').textContent = `${playerCard.value} de ${playerCard.suit}`;
    document.getElementById('dealer-card2').textContent = `${dealerCard.value} de ${dealerCard.suit}`;
    document.getElementById('player-card2').classList.add('card-flip');
    document.getElementById('dealer-card2').classList.add('card-flip');
    setTimeout(() => {
        document.getElementById('player-card2').classList.remove('card-flip');
        document.getElementById('dealer-card2').classList.remove('card-flip');
    }, 500);
    const result = playerCard.numericValue > dealerCard.numericValue ? 'Você venceu!' : 'Você perdeu!';
    document.getElementById('game7-result').textContent = result;
    saveResult(7, result.includes('venceu'));
}

// Jogo 8: Par Perfeito
function playPerfectPair() {
    const card1 = getCard();
    const card2 = getCard();
    document.getElementById('card8-1').textContent = `${card1.value} de ${card1.suit}`;
    document.getElementById('card8-2').textContent = `${card2.value} de ${card2.suit}`;
    document.getElementById('card8-1').classList.add('card-flip');
    document.getElementById('card8-2').classList.add('card-flip');
    setTimeout(() => {
        document.getElementById('card8-1').classList.remove('card-flip');
        document.getElementById('card8-2').classList.remove('card-flip');
    }, 500);
    const result = card1.value === card2.value ? 'Você venceu!' : 'Você perdeu!';
    document.getElementById('game8-result').textContent = result;
    saveResult(8, result.includes('venceu'));
}

// Jogo 9: Soma 13
function playSum13() {
    const card1 = getCard();
    const card2 = getCard();
    document.getElementById('card9-1').textContent = `${card1.value} de ${card1.suit}`;
    document.getElementById('card9-2').textContent = `${card2.value} de ${card2.suit}`;
    document.getElementById('card9-1').classList.add('card-flip');
    document.getElementById('card9-2').classList.add('card-flip');
    setTimeout(() => {
        document.getElementById('card9-1').classList.remove('card-flip');
        document.getElementById('card9-2').classList.remove('card-flip');
    }, 500);
    const sum = card1.numericValue + card2.numericValue;
    document.getElementById('sum9').textContent = sum;
    const result = sum === 13 ? 'Você venceu!' : 'Você perdeu!';
    document.getElementById('game9-result').textContent = result;
    saveResult(9, result.includes('venceu'));
}

// Jogo 10: Naipe Certo
function playSuitGuess() {
    const card = getCard();
    const bet = document.getElementById('suit-bet').value;
    document.getElementById('card10').textContent = `${card.value} de ${card.suit}`;
    document.getElementById('card10').classList.add('card-flip');
    setTimeout(() => {
        document.getElementById('card10').classList.remove('card-flip');
    }, 500);
    const result = card.suit.toLowerCase() === bet ? 'Você venceu!' : 'Você perdeu!';
    document.getElementById('game10-result').textContent = result;
    saveResult(10, result.includes('venceu'));
}
