let blackjackGame = {
  'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
  'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
  'cards': ['2', '3', '4', '5', '6','7','8','9','10','J','Q','K','A'],
  'signs': ['C','D', 'H', 'S'],
  'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A':[1, 11]},
  'wins': 0,
  'losses': 0,
  'draws': 0,
  'isStand': false,
  'turnsOver': false,
  'gameStarted': false,
  'betMade': false,
  'cardRemoved': false,
};

let wallet = {
  'balance': 1000,
  'bet': 0,
  'balanceSpan': '#balance-span',
  'betSpan': '#bet-span',
}
const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];


const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');
const flipSound = new Audio('sounds/flip.wav');
const chipSound = new Audio('sounds/chip.mp3');
const errorSound = new Audio('sounds/error.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blacjackHit);
document.querySelector('#blackjack-start-button').addEventListener('click', blackjackGameStart);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#bet-10').addEventListener('click', betControl.bind(this, 10));
document.querySelector('#bet-20').addEventListener('click', betControl.bind(this, 20));
document.querySelector('#bet-50').addEventListener('click', betControl.bind(this, 50));
document.querySelector('#bet-100').addEventListener('click', betControl.bind(this, 100));




function betControl(value) {
  if (blackjackGame['gameStarted'] === false || blackjackGame['turnsOver'] === true) {
    if (value <= wallet['balance']) {
      blackjackGame['betMade'] = true;
      wallet['balance'] -= value;
      wallet['bet'] += value;
      chipSound.play();
      updateWallet();
    } else {
      errorSound.play()
    }
  }
}

function updateWallet() {
  document.querySelector(wallet['balanceSpan']).textContent = wallet['balance'];
  document.querySelector(wallet['betSpan']).textContent = wallet['bet'];
}

function blackjackGameStart() {
  if (blackjackGame['betMade']) {
    blackjackGame['gameStarted'] = true;
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    showCard('back', DEALER);

    card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    showCard('back', YOU);
    document.getElementById("blackjack-start-button").disabled = true;
  }
}

function blacjackHit() {
  if (blackjackGame['isStand'] === false && blackjackGame['gameStarted'] === true && blackjackGame['betMade']) {
    if (blackjackGame['cardRemoved'] === false) {
      let yourImages = document.querySelector('#your-box').querySelectorAll('img');
      yourImages[1].remove();
    }
    let card = randomCard();
    console.log(card);
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    console.log(YOU['score']);
    blackjackGame['cardRemoved'] = true;
  }
}

function showCard(card, activePlayer) {
  if (activePlayer['score'] <= 21) {
    let cardImage = document.createElement('img');
    cardImage.src = `img/${card}.jpg`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    flipSound.play();
  }
}

function blackjackDeal() {
  if (blackjackGame['turnsOver'] === true && blackjackGame['betMade'] === true) {

    blackjackGame['isStand'] = false;
    blackjackGame['turnsOver'] = false;
    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    console.log(yourImages);
    for (var i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (var i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }
    YOU['score'] = 0;
    DEALER['score'] = 0;
    document.querySelector(YOU['scoreSpan']).textContent = 0;
    document.querySelector(DEALER['scoreSpan']).textContent = 0;
    document.querySelector(YOU['scoreSpan']).style.color = "white";
    document.querySelector(DEALER['scoreSpan']).style.color = "white";
    document.querySelector('#blackjack-result').textContent = "Let's play!";
    document.querySelector('#blackjack-result').style.color = "black";

    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    showCard('back', DEALER);

    card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    showCard('back', YOU);
    hitSound.play()
    document.getElementById("blackjack-stand-button").disabled = false;
    blackjackGame['cardRemoved'] = false;
  }
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  let randomSign = Math.floor(Math.random() * 4);
  return blackjackGame['cards'][randomIndex] + blackjackGame['signs'][randomSign];
}

function updateScore(card, activePlayer) {
  let cardNum = 0;
  if (card[0] === '1') {
    cardNum = '10';
  } else {
    cardNum = card[0];
  }

  if (cardNum === 'A') {
    if (activePlayer['score'] + blackjackGame['cardsMap'][cardNum][1] <= 21) {
      activePlayer['score'] += blackjackGame['cardsMap'][cardNum][1];
    } else {
      activePlayer['score'] += blackjackGame['cardsMap'][cardNum][0];
    }
  } else {
    activePlayer['score'] += blackjackGame['cardsMap'][cardNum];
  }
}

function showScore(activePlayer) {
  if (activePlayer['score'] > 21) {
    document.querySelector(activePlayer['scoreSpan']).textContent = "BUST!";
    document.querySelector(activePlayer['scoreSpan']).style.color = "red";
  } else {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
  if (blackjackGame['gameStarted'] === true) {
    document.getElementById("blackjack-stand-button").disabled = true;
    blackjackGame['isStand'] = true;
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    dealerImages[1].remove();

    while (blackjackGame['isStand'] === true && (DEALER['score'] < YOU['score'] || DEALER['score'] < 16 )) {
      if (YOU['score'] > 21) {
        await showCardToADealerAndUpdateScore();
        blackjackGame['turnsOver'] = true;
        let winner = computeWinner();
        showResult(winner);
        return;
      }
      await showCardToADealerAndUpdateScore();
    }

    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
  }

  async function showCardToADealerAndUpdateScore() {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }
}

function computeWinner() {
  let winner;
  if (YOU['score'] <= 21) {
    if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
      winner = YOU;
      blackjackGame['wins']++;
      wallet['balance'] += (2 * wallet['bet']);
      wallet['bet'] = 0;
      updateWallet();
      blackjackGame['betMade'] = false;
    } else if (YOU['score'] < DEALER['score']) {
      winner = DEALER;
      blackjackGame['losses']++;
      wallet['bet'] = 0;
      updateWallet();
      blackjackGame['betMade'] = false;
    } else if (YOU['score'] == DEALER['score']) {
      blackjackGame['draws']++;
      wallet['balance'] += wallet['bet'];
      wallet['bet'] = 0;
      updateWallet();
      blackjackGame['betMade'] = false;
    }
  } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
    winner = DEALER;
    blackjackGame['losses']++;
    wallet['bet'] = 0;
    updateWallet();
    blackjackGame['betMade'] = false;
  } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
    blackjackGame['draws']++;
    wallet['balance'] += wallet['bet'];
    wallet['bet'] = 0;
    updateWallet();
    blackjackGame['betMade'] = false;
  }

  console.log("Winner is ", winner);
  return winner;
}

function showResult(winner) {
  let message, messageColor;

  if (blackjackGame['turnsOver'] === true) {
    if (winner == YOU) {
      document.querySelector('#wins').textContent = blackjackGame['wins'];
      message = "You won!";
      messageColor = "green";
      winSound.play();
    }
    else if (winner == DEALER) {
      document.querySelector('#losses').textContent = blackjackGame['losses'];
      message = "You lost!";
      messageColor = "red";
      lossSound.play();
    } else {
      document.querySelector('#draws').textContent = blackjackGame['draws'];
      message = "You drew!";
      messageColor = "black";
    }

    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;

  }
}
