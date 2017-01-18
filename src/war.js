/**
 * Created by adamsro on 1/17/17.
 */
const NOT_STARTED = 0;
const READY = 1;
const CARDS_ON_TABLE = 2;
const FINISHED = 3;

const PLAYER_A = "A";
const PLAYER_B = "B";

// The deck is divided evenly among the players, giving each a down stack.
class PlayingCard {
  constructor(rank, suit, faceUp = false) {
    this.rank = rank;
    this.suit = suit;
    this.faceUp = faceUp;
  }
}

class CardStack {
  constructor() {
    this.cards = [];
  }

  drawCardFaceUp() {
    const card = this.cards.pop();
    if (card === 'undefined') {
      return false;
    }
    card.faceUp = true;
    return card;
  }

  drawCardFaceDown() {
    const card = this.cards.pop();
    if (card === 'undefined') {
      return false;
    }
    card.faceUp = false;
    return card;
  }

  drawCards(numCards) {
    return this.cards.splice(0, numCards);
  }

  addCard(card) {
    this.cards.push(card);
  }

  /** put all cards face down at bottom of deck. */
  addToBottom(cards1, cards2) {
    cards1.forEach((card) => { card.faceUp = false });
    cards2.forEach((card) => { card.faceUp = false });
    this.cards = cards1.concat(cards2, this.cards);
  }

  shuffle() {
    for (let i = this.cards.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [this.cards[i - 1], this.cards[j]] = [this.cards[j], this.cards[i - 1]];
    }
    return this;
  }
}

class CardDeck extends CardStack {
  constructor() {
    super();
    // No jokers
    const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      SUITS = ['s', 'c', 'd', 'h'];

    RANKS.forEach(function (rank) {
      SUITS.forEach(function (suit) {
        this.cards.push(new PlayingCard(rank, suit));
      }, this);
    }, this);
    return this;
  }
}

export default class WarCardGame {
  constructor() {
    this.state = NOT_STARTED;
  }

  startGame() {
    const deck = new CardDeck().shuffle().shuffle();
    this.state = READY;
    this.stackA = new CardStack(deck.drawCards(26));
    this.stackB = new CardStack(deck.drawCards(26));
    this.playedA = new CardStack();
    this.playedB = new CardStack();
  }

  nextMove() {
    if (this.state === READY) {
      this.playedA.addCard(this.stackA.drawCardFaceUp());
      this.playedB.addCard(this.stackB.drawCardFaceUp());
    } else if (this.state === CARDS_ON_TABLE) {
      // Compare cards last played.
      const result = this.compareCards(this.playedA[playedA.length - 1], this.playedB[playedB.length - 1]);
      if (result === 1) {
        // Player A takes the spoils.
        this.stackA.addToBottom(
          this.playedA.drawCards(this.playedA.length -1),
          this.playedB.drawCards(this.playedB.length -1)
        );
        if (!this.isAWinner()) {
          this.status = READY;
        }

      } else if (result === -1) {
        // Player A takes the spoils.
        this.stackB.addToBottom(
          this.playedA.drawCards(this.playedA.length -1),
          this.playedB.drawCards(this.playedB.length -1)
        );
        if (!this.isAWinner()) {
          this.status = READY;
        }

      } else if (!this.isWinnerWar()) {
          // WAR!
          this.playedA.addCard(this.stackA.drawCardFaceDown());
          this.playedB.addCard(this.stackB.drawCardFaceDown());

          this.playedA.addCard(this.stackA.drawCardFaceUp());
          this.playedB.addCard(this.stackB.drawCardFaceUp());

          this.status = CARDS_ON_TABLE;
      }
    }
  }

  private isAWinner() {
    if (this.stackA === 0) {
      this.winner = PLAYER_B;
      this.state = FINISHED;
      return true;
    }
    if (this.stackB === 0) {
      this.winner = PLAYER_A;
      this.state = FINISHED;
      return true;
    }
    return false;
  }

  private isWinnerWar() {
    if (this.stackA < 2) {
      // Player B doest have enough cards - Player A wins
      this.winner = PLAYER_B;
      this.state = FINISHED;
      return true;
    }
    if (this.stackB < 2) {
      // Player B doest have enough cards - Player A wins
      this.winner = PLAYER_A;
      this.state = FINISHED;
      return true;
    }
    return false;
  }
  static compareCards(card1, card2) {
    if (card1.rank > card2.rank) {
      return 1;
    } else if (card1.rank === card2.rank) {
      return 0;
    }
    return -1;
  }
}

