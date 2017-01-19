/**
 * Created by adamsro on 1/17/17.
 */

export class PlayingCard {
  constructor(rank, suit, faceUp = false) {
    this.rank = rank;
    this.suit = suit;
    this.faceUp = faceUp;
  }
}

export class CardStack {
  constructor(startingCards = []) {
    if (startingCards.length > 0) {
      this.cards = startingCards;
    } else {
      this.cards = [];
    }
  }

  drawCard() {
    const card = this.cards.pop();
    if (card === 'undefined') {
      return false;
    }
    return card;
  }

  drawCardFaceUp() {
    const card = this.cards.pop();
    if (card === 'undefined') {
      return false;
    }
    card.faceUp = true;
    return card;
  }

  drawCards(numCards) {
    return this.cards.splice(0, numCards);
  }

  addCard(card) {
    this.cards.push(card);
  }

  /** Put all cards face down at bottom of deck. */
  addToBottom(cards1, cards2) {
    cards1.forEach((card) => {
      card.faceUp = false
    });
    cards2.forEach((card) => {
      card.faceUp = false
    });
    this.cards = cards1.concat(cards2, this.cards);
  }

  shuffle() {
    for (let i = this.cards.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [this.cards[i - 1], this.cards[j]] = [this.cards[j], this.cards[i - 1]];
    }
    return this;
  }

  hasCards() {
    return this.cards.length !== 0;
  }

  peek() {
    return this.cards[this.cards.length - 1];
  }
}

export class CardDeck extends CardStack {
  /** A new deck will always have 52 cards in it. */
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

export class WarGame {
  constructor() {
    this.state = WarGame.NOT_STARTED;
    this.onChanges = [];
  }

  /**
   * Interface to add new change subscriber
   */
  subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  /**
   * Calls render() when the state changes.
   */
  inform() {
    this.onChanges.forEach(function (cb) {
      cb();
    });
  }

  startGame(stack) {
    this.state = WarGame.READY;
    this.stackA = new CardStack();
    this.stackB = new CardStack();
    this.playedA = new CardStack();
    this.playedB = new CardStack();
    this.winner = false;

    stack.shuffle().shuffle();
    let stackLength = stack.cards.length;
    for (let i = 0; i < stackLength; i++) {
      if (i % 2 === 0) {
        this.stackA.addCard(stack.drawCard());
      } else {
        this.stackB.addCard(stack.drawCard());
      }
    }
    this.inform();
  }

  /**
   * Public interface - advance the game
   */
  nextMove() {
    if (this.state === WarGame.READY) {
      this.stateReady();
    } else if (this.state === WarGame.CARDS_ON_TABLE) {
      this.stateCardsOnTable();
    } else if (this.state === WarGame.FINISHED) {
      this.startGame();
    }
    this.inform();
  }

  /**
   * Both players have cards and no cards are in play.
   */
  stateReady() {
    this.playedA.addCard(this.stackA.drawCardFaceUp());
    this.playedB.addCard(this.stackB.drawCardFaceUp());
    this.state = WarGame.CARDS_ON_TABLE;
  }

  /**
   * Cards are in play on the table and a comparison needs to be made.
   */
  stateCardsOnTable() {
    // Compare cards last played.
    const result = WarGame.compareCards(this.playedA.peek(), this.playedB.peek());
    if (result === 1) {
      // Player A takes the spoils.
      this.stackA.addToBottom(
        this.playedA.drawCards(this.playedA.cards.length),
        this.playedB.drawCards(this.playedB.cards.length)
      );

      if (!this.stackB.hasCards()) {
        // Player A takes the game.
        this.winner = WarGame.PLAYER_A;
        this.state = WarGame.FINISHED;
      } else {
        this.state = WarGame.READY;
      }

    } else if (result === -1) {
      // Player A takes the spoils.
      this.stackB.addToBottom(
        this.playedA.drawCards(this.playedA.cards.length),
        this.playedB.drawCards(this.playedB.cards.length)
      );
      if (!this.stackA.hasCards()) {
        // Player B takes the game.
        this.winner = WarGame.PLAYER_B;
        this.state = WarGame.FINISHED;
      } else {
        this.state = WarGame.READY;
      }

    } else if (!this.isWinnerWar()) {
      // WAR!
      this.playedA.addCard(this.stackA.drawCard());
      this.playedB.addCard(this.stackB.drawCard());

      this.playedA.addCard(this.stackA.drawCardFaceUp());
      this.playedB.addCard(this.stackB.drawCardFaceUp());

      this.state = WarGame.CARDS_ON_TABLE;
    }
  }

  /**
   * If either player doesn't have enough cards to play war, they lose.
   */
  isWinnerWar() {
    if (!this.stackA.hasCards()) {
      // Player B doest have enough cards - Player A wins
      this.winner = WarGame.PLAYER_B;
      this.state = WarGame.FINISHED;
      return true;
    }
    if (!this.stackB.hasCards()) {
      // Player B doest have enough cards - Player A wins
      this.winner = WarGame.PLAYER_A;
      this.state = WarGame.FINISHED;
      return true;
    }
    return false;
  }

  /**
   * @return int 1 - greater than, 0 - equal, -1 less than
   */
  static compareCards(card1, card2) {
    if (card1.rank > card2.rank) {
      return 1;
    } else if (card1.rank === card2.rank) {
      return 0;
    }
    return -1;
  }
}

WarGame.NOT_STARTED = 0;
WarGame.READY = 1;
WarGame.CARDS_ON_TABLE = 2;
WarGame.FINISHED = 3;

WarGame.PLAYER_A = "A";
WarGame.PLAYER_B = "B";
