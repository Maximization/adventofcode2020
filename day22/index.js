'use strict';

/* Setup */
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const decks = input.split('\n\n').map((deck) => {
  const [, ...cards] = deck.split('\n');
  return cards.map(Number);
})

function calculateWinningScore(winningDeck) {
  return winningDeck.reduce((acc, card, index, winningDeck) => {
    return acc + (card * (winningDeck.length - index));
  }, 0);
}

/* Part 1 */
(() => {
  let playerOne = [...decks[0]];
  let playerTwo = [...decks[1]];
  while (playerOne.length && playerTwo.length) {
    const cardOne = playerOne.shift();
    const cardTwo = playerTwo.shift();

    if (cardOne > cardTwo) {
      playerOne.push(cardOne);
      playerOne.push(cardTwo);
    } else {
      playerTwo.push(cardTwo);
      playerTwo.push(cardOne);
    }
  }

  const winningDeck = [playerOne, playerTwo].filter((deck) => deck.length).flat(1);
  console.log('Answer part 1:', calculateWinningScore(winningDeck));
})();

/* Part 2 */
(() => {
  let deckOne = [...decks[0]];
  let deckTwo = [...decks[1]];

  function playGame(deckOne, deckTwo) {
    let previousRoundsDeckOne = [];
    let previousRoundsDeckTwo = [];
    while (deckOne.length && deckTwo.length) {
      // Draw cards
      const cardOne = deckOne.shift();
      const cardTwo = deckTwo.shift();

      // If both player's decks are at least as long as their drawn cards,
      // we enter a subgame
      let winningPlayer;
      if (cardOne <= deckOne.length && cardTwo <= deckTwo.length) {
        const subgameDeckOne = deckOne.slice(0, cardOne);
        const subgameDeckTwo = deckTwo.slice(0, cardTwo);
        winningPlayer = playGame(subgameDeckOne, subgameDeckTwo);
      }

      if (winningPlayer && winningPlayer === 1 || !winningPlayer && cardOne > cardTwo) {
        // Player one won
        deckOne.push(cardOne);
        deckOne.push(cardTwo);
      } else {
        // Player two won
        deckTwo.push(cardTwo);
        deckTwo.push(cardOne);
      }

      const foundRepeatingRound = previousRoundsDeckOne.some((previousRoundDeckOne, index) => {
        const foundRepeatingDeckOne = previousRoundDeckOne
          .every((card, indexCard) => card === deckOne[indexCard]);
        const foundRepeatingDeckTwo = previousRoundsDeckTwo[index]
          .every((card, indexCard) => card === deckTwo[indexCard]);
        return foundRepeatingDeckOne && foundRepeatingDeckTwo;
      });

      // If we have a repeating set of decks for both players from a
      if (foundRepeatingRound) {
        return 1;
      }

      // Keep a log of previous rounds' decks
      previousRoundsDeckOne.push([...deckOne]);
      previousRoundsDeckTwo.push([...deckTwo]);
    }


    return deckOne.length ? 1 : 2;
  }

  const winningPlayer = playGame(deckOne, deckTwo);
  const winningDeck = winningPlayer === 1 ? deckOne : deckTwo;
  console.log('Answer part 2:', calculateWinningScore(winningDeck));
})();

