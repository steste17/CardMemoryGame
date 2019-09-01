let cardListArray = Array.from(document.querySelectorAll('.card'));
let shuffledCards = shuffle(cardListArray);
let stars = Array.from(document.querySelector('ul.stars').children);
let openCards = [];
let moves = 0;
let cardMatches = 0;
let totalSeconds = 0;

startGame();

// Starts the game
function startGame() {
	cleanDeck(shuffledCards);
	removeOld();
	createDeck(shuffledCards);
	eventListeners();
	gameTimer();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Makes sure li elements only have .card class
function cleanDeck(array) {
	for(let i = 0; i < cardListArray.length; i++){
		if (array[i].classList.contains('show') || array[i].classList.contains('match') || array[i].classList.contains('open')){
			array[i].classList.remove('show');
			array[i].classList.remove('match');
			array[i].classList.remove('open');
		}
	}
}

// Removes original HTML cards
function removeOld() {
	for (i=0; i < cardListArray.length; i++) {
	const oldCard = cardListArray[i];
	oldCard.remove();
	}
}

// Creates a new deck with shuffled cards
function createDeck(array) {
	const deckFragment = document.createDocumentFragment();
	for (let i = 0; i < shuffledCards.length; i++){
		const newCard = document.createElement('li');
		newCard.innerHTML = shuffledCards[i].innerHTML;
		newCard.className = shuffledCards[i].className;
		deckFragment.appendChild(newCard);
	}
	const newDeck = document.querySelector('.deck');
	newDeck.appendChild(deckFragment);
}

// Add event listeners to the deck
function eventListeners() {
	const deck = document.querySelector('.deck');
	const restart = document.querySelector('.restart');
	deck.addEventListener('click', flipCard);
	restart.addEventListener('click', restartGame);
}

// Pauses event listeners from firing when cards are being compared
function pauseListeners() {
	const deck = document.querySelector('.deck');
	deck.removeEventListener('click', flipCard);
}

// Gets a card to flip over, stores that value in an array, and increases moves by 1
function flipCard(c) {
	if (c.target.className === 'card') {
		c.target.classList.add('open', 'show');
		moves += 1;
		updateMoves();
		openCards.push(c.target);
		if (openCards.length === 2) {
			compareCards();
		}
	}
}

// Pauses listeners then compares cards
function compareCards() {
	pauseListeners();
	if (openCards[0].innerHTML === openCards[1].innerHTML) {
		setTimeout(cardsMatched, 1000);
	} else {
		setTimeout(noMatch, 1000);
	}
}

// If cards are a match, increase the match counter
// If match counter is at 8, you win!
function cardsMatched() {
	openCards[0].classList.add('match');
	openCards[1].classList.add('match');
	openCards[0].classList.remove('open', 'show');
	openCards[1].classList.remove('open', 'show');
	cardMatches += 1;
	if (cardMatches === 8) {
		setTimeout(winGame, 1000);
	}
	openCards = [];
	eventListeners();
}

// Cards didn't match so reset
function noMatch() {
	openCards[0].classList.remove('open', 'show');
	openCards[1].classList.remove('open', 'show');
	openCards = [];
	eventListeners();
}

// Shows congratulatory message to player for winning
function winGame() {
	const win = document.querySelector('div.win');
	const scoreDiv = document.createElement('div');
	const score = document.querySelector('section.score-panel');
	clearInterval(runTimer);
	scoreDiv.appendChild(score);
	scoreDiv.style.textAlign = "center";
	win.appendChild(scoreDiv);
	win.classList.remove('hidden');
}

// Starts timer
function gameTimer() {
	runTimer = setInterval(countSeconds, 1000);
}

// Updates timer as seconds pass
function countSeconds() {
	totalSeconds += 1;
	let strTotalSeconds = totalSeconds.toString();
	let update = document.createElement('span');
	const currentTime = document.querySelector('.timer');
	update.innerHTML = strTotalSeconds;
	currentTime.innerHTML = update.innerHTML;
}

// Updates number of moves taken by player
function updateMoves() {
	let strMoves = moves.toString();
	let update = document.createElement('span');
	const currentMoves = document.querySelector('.moves');
	update.innerHTML = strMoves;
	currentMoves.innerHTML = update.innerHTML;
	removeStar();
}

// Decreases number of stars in score panel
function removeStar() {
	if (moves > 18 && moves < 29) {
		const minusStar = stars[0];
		minusStar.remove();
	} else if (moves >= 30) {
		const minusStar = stars[1];
		minusStar.remove();
	}
}

// Resets the game
function restartGame() {
	location.reload();
// The following code will need to be revisited to more granularly learn to reset the game 	
// Resets cards
// 	shuffledCards = shuffle(cardListArray);
// 	cardListArray = Array.from(document.querySelectorAll('.card'));
// 	cleanDeck(shuffledCards);
// 	removeOld();
// 	createDeck(shuffledCards);
// 	eventListeners();
// 	// Resets open cards
// 	openCards = [];
// 	// Resets timer
// 	// Resets stars
// 	// Resets moves
// 	moves = 0;
// 	updateMoves();
}